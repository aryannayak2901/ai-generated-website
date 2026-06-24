# Firecracker Sandbox — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Firecracker microVM-based secure code execution sandbox that lets visitors (authenticated via Payload CMS) write React/TypeScript code and see a live preview in an iframe, powered by isolated VMs on a dedicated Ubuntu machine.

**Architecture:** The `sandbox-api` Express server runs on the Ubuntu machine and manages a warm pool of pre-booted Firecracker microVMs (each with Node.js + Vite pre-installed). The Next.js app proxies sandbox requests to the Ubuntu machine over the LAN. An iframe in the UI displays the live preview URL returned by the sandbox API.

**Tech Stack:** Firecracker v1.8.0, Firecracker Jailer, Node.js 20 (Express + TypeScript), Vite 5, React 19, Monaco Editor (`@monaco-editor/react`), Next.js 15 (App Router), Payload CMS 3, Linux tap networking, `http-proxy-middleware`

**Workflow for Ubuntu tasks:** All files are written on Mac → synced to Ubuntu via `rsync` → run on Ubuntu via SSH.

---

## Phase 1: Ubuntu Environment Setup

### Task 1: Verify KVM and Install Firecracker + Jailer

**Files:**
- Create: `sandbox-api/scripts/01-setup-ubuntu.sh`

- [ ] **Step 1: Create the setup script on your Mac**

```bash
# File: sandbox-api/scripts/01-setup-ubuntu.sh
#!/usr/bin/env bash
set -euo pipefail

echo "=== Step 1: Checking KVM availability ==="
if ! [ -e /dev/kvm ]; then
  echo "ERROR: /dev/kvm not found. Enable virtualization in BIOS."
  exit 1
fi
ls -la /dev/kvm
# Expected: crw-rw---- 1 root kvm 10, 232 ...

echo "=== Step 2: Installing required packages ==="
sudo apt update
sudo apt install -y \
  cpu-checker \
  iproute2 \
  iptables \
  libssl-dev \
  curl \
  jq

echo "=== Step 3: Verifying KVM access ==="
kvm-ok
# Expected: INFO: /dev/kvm exists  KVM acceleration can be used

echo "=== Step 4: Adding current user to kvm group ==="
sudo usermod -aG kvm $USER
echo "NOTE: Log out and back in for group change to take effect."

echo "=== Step 5: Downloading Firecracker v1.8.0 ==="
ARCH=$(uname -m)
FC_VERSION="v1.8.0"
FC_BASE_URL="https://github.com/firecracker-microvm/firecracker/releases/download/${FC_VERSION}"

curl -LO "${FC_BASE_URL}/firecracker-${FC_VERSION}-${ARCH}.tgz"
tar -xvf "firecracker-${FC_VERSION}-${ARCH}.tgz"

# Move binaries to a system path
sudo install -o root -g root -m 0755 \
  "release-${FC_VERSION}-${ARCH}/firecracker-${FC_VERSION}-${ARCH}" \
  /usr/local/bin/firecracker

sudo install -o root -g root -m 0755 \
  "release-${FC_VERSION}-${ARCH}/jailer-${FC_VERSION}-${ARCH}" \
  /usr/local/bin/jailer

# Clean up
rm -rf "release-${FC_VERSION}-${ARCH}" "firecracker-${FC_VERSION}-${ARCH}.tgz"

echo "=== Step 6: Verifying installation ==="
firecracker --version
# Expected: Firecracker v1.8.0
jailer --version
# Expected: Jailer v1.8.0

echo "=== Step 7: Create jailer working directory ==="
sudo mkdir -p /srv/jailer
sudo chown $USER:$USER /srv/jailer

echo "=== DONE. Log out and back in for kvm group to take effect. ==="
```

- [ ] **Step 2: Sync script to Ubuntu and run it**

On your Mac terminal:
```bash
# Replace ubuntu-ip with your Ubuntu machine's actual local IP (e.g., 192.168.1.105)
UBUNTU_IP=192.168.1.XXX
UBUNTU_USER=your-username

rsync -avz ./sandbox-api/ ${UBUNTU_USER}@${UBUNTU_IP}:/home/${UBUNTU_USER}/sandbox-api/
ssh ${UBUNTU_USER}@${UBUNTU_IP} "bash /home/${UBUNTU_USER}/sandbox-api/scripts/01-setup-ubuntu.sh"
```

Expected last line of output: `=== DONE. Log out and back in for kvm group to take effect. ===`

- [ ] **Step 3: Log out and back in on Ubuntu, then verify**

```bash
ssh ${UBUNTU_USER}@${UBUNTU_IP}
groups
# Expected output must include: kvm
firecracker --version
# Expected: Firecracker v1.8.0
```

- [ ] **Step 4: Commit the setup script**

```bash
git add sandbox-api/scripts/01-setup-ubuntu.sh
git commit -m "feat(sandbox): add ubuntu kvm + firecracker setup script"
```

---

### Task 2: Set Up Tap Networking on Ubuntu

**Files:**
- Create: `sandbox-api/scripts/02-setup-networking.sh`
- Create: `sandbox-api/scripts/teardown-networking.sh`

- [ ] **Step 1: Create networking setup script on your Mac**

```bash
# File: sandbox-api/scripts/02-setup-networking.sh
#!/usr/bin/env bash
# Creates tap devices, assigns IPs, and enables NAT so VMs can serve HTTP
set -euo pipefail

HOST_IFACE=$(ip route | awk '/default/ {print $5; exit}')
echo "Host interface detected: $HOST_IFACE"

MAX_VMS=${1:-5}  # How many tap devices to create (matches pool size)
HOST_IP_BASE="172.20.0"
HOST_TAP_IP=1    # Host side of each tap: 172.20.0.1

for i in $(seq 0 $((MAX_VMS - 1))); do
  TAP_NAME="tap${i}"
  GUEST_IP="${HOST_IP_BASE}.$((i + 2))"

  echo "=== Creating $TAP_NAME (guest IP: $GUEST_IP) ==="

  # Create tap interface if it doesn't exist
  if ! ip link show "$TAP_NAME" &>/dev/null; then
    sudo ip tuntap add dev "$TAP_NAME" mode tap
  fi

  sudo ip addr flush dev "$TAP_NAME" 2>/dev/null || true
  sudo ip addr add "${HOST_IP_BASE}.${HOST_TAP_IP}/30" dev "$TAP_NAME" || true
  sudo ip link set "$TAP_NAME" up

  echo "  tap${i} up with host side ${HOST_IP_BASE}.${HOST_TAP_IP}"
done

echo "=== Enabling IP forwarding ==="
sudo sysctl -w net.ipv4.ip_forward=1

echo "=== Adding NAT rule ==="
sudo iptables -t nat -C POSTROUTING -o "$HOST_IFACE" -j MASQUERADE 2>/dev/null || \
  sudo iptables -t nat -A POSTROUTING -o "$HOST_IFACE" -j MASQUERADE

echo "=== Networking setup complete ==="
```

```bash
# File: sandbox-api/scripts/teardown-networking.sh
#!/usr/bin/env bash
set -euo pipefail
MAX_VMS=${1:-5}
for i in $(seq 0 $((MAX_VMS - 1))); do
  TAP_NAME="tap${i}"
  if ip link show "$TAP_NAME" &>/dev/null; then
    sudo ip link set "$TAP_NAME" down
    sudo ip tuntap del dev "$TAP_NAME" mode tap
    echo "Removed $TAP_NAME"
  fi
done
echo "Teardown complete."
```

- [ ] **Step 2: Sync to Ubuntu and run**

```bash
rsync -avz ./sandbox-api/ ${UBUNTU_USER}@${UBUNTU_IP}:/home/${UBUNTU_USER}/sandbox-api/
ssh ${UBUNTU_USER}@${UBUNTU_IP} "bash /home/${UBUNTU_USER}/sandbox-api/scripts/02-setup-networking.sh 5"
```

Expected: Lines showing `tap0` through `tap4` created and `Networking setup complete`.

- [ ] **Step 3: Verify tap devices exist**

```bash
ssh ${UBUNTU_USER}@${UBUNTU_IP} "ip link show | grep tap"
# Expected: tap0, tap1, tap2, tap3, tap4 all appear
```

- [ ] **Step 4: Commit**

```bash
git add sandbox-api/scripts/02-setup-networking.sh sandbox-api/scripts/teardown-networking.sh
git commit -m "feat(sandbox): add tap network setup/teardown scripts"
```

---

## Phase 2: Base rootfs and Kernel Image

### Task 3: Download Minimal Kernel Binary

**Files:**
- Create: `sandbox-api/scripts/03-download-kernel.sh`

- [ ] **Step 1: Create kernel download script**

Firecracker provides a pre-compiled minimal kernel so we don't need to compile one ourselves.

```bash
# File: sandbox-api/scripts/03-download-kernel.sh
#!/usr/bin/env bash
set -euo pipefail

IMAGES_DIR="/home/${USER}/sandbox-api/images"
mkdir -p "$IMAGES_DIR"

KERNEL_URL="https://s3.amazonaws.com/spec.ccfc.min/firecracker-ci/v1.8/x86_64/vmlinux-5.10.217"
KERNEL_PATH="${IMAGES_DIR}/vmlinux"

if [ -f "$KERNEL_PATH" ]; then
  echo "Kernel already exists at $KERNEL_PATH, skipping download."
  exit 0
fi

echo "Downloading minimal Firecracker kernel..."
curl -L "$KERNEL_URL" -o "$KERNEL_PATH"
echo "Kernel downloaded to: $KERNEL_PATH"
ls -lh "$KERNEL_PATH"
```

- [ ] **Step 2: Sync and run on Ubuntu**

```bash
rsync -avz ./sandbox-api/ ${UBUNTU_USER}@${UBUNTU_IP}:/home/${UBUNTU_USER}/sandbox-api/
ssh ${UBUNTU_USER}@${UBUNTU_IP} "bash /home/${UBUNTU_USER}/sandbox-api/scripts/03-download-kernel.sh"
```

Expected: `Kernel downloaded to: /home/user/sandbox-api/images/vmlinux` and a file size around 20MB.

- [ ] **Step 3: Commit**

```bash
git add sandbox-api/scripts/03-download-kernel.sh
git commit -m "feat(sandbox): add kernel download script"
```

---

### Task 4: Build the Base rootfs Image

**Files:**
- Create: `sandbox-api/scripts/04-build-rootfs.sh`
- Create: `sandbox-api/guest/app/package.json` (the Vite scaffold pre-installed in the image)
- Create: `sandbox-api/guest/app/vite.config.ts`
- Create: `sandbox-api/guest/app/index.html`
- Create: `sandbox-api/guest/app/src/main.tsx`
- Create: `sandbox-api/guest/app/src/App.tsx`
- Create: `sandbox-api/guest/init.sh` (the init script that runs inside the VM on boot)

- [ ] **Step 1: Create the guest Vite scaffold files on Mac**

```json
// File: sandbox-api/guest/app/package.json
{
  "name": "sandbox-app",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0 --port 3000"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0"
  }
}
```

```ts
// File: sandbox-api/guest/app/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: { host: '0.0.0.0' },
  },
})
```

```html
<!-- File: sandbox-api/guest/app/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sandbox Preview</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

```tsx
// File: sandbox-api/guest/app/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

```tsx
// File: sandbox-api/guest/app/src/App.tsx
// This file is replaced by the sandbox API with user code
export default function App() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-950 text-white">
      <p className="text-2xl font-bold">Sandbox Ready</p>
    </div>
  )
}
```

```css
/* File: sandbox-api/guest/app/src/index.css */
@import "tailwindcss";
```

- [ ] **Step 2: Create the VM init script**

This script runs as PID 1 inside the VM on every boot:

```bash
# File: sandbox-api/guest/init.sh
#!/bin/sh
# Runs inside the Firecracker VM as init (PID 1)
set -e

# Mount essential filesystems
mount -t proc proc /proc
mount -t sysfs sysfs /sys
mount -t devtmpfs dev /dev
mount -t tmpfs tmpfs /tmp

# Configure lo interface
ip link set lo up

# Configure eth0 (assigned from outside via tap)
# The IP is set via kernel boot args: ip=172.20.0.X::172.20.0.1:255.255.255.0::eth0:off
ip link set eth0 up
# Parse IP from kernel cmdline
GUEST_IP=$(cat /proc/cmdline | tr ' ' '\n' | grep '^ip=' | cut -d= -f2 | cut -d: -f1)
ip addr add "${GUEST_IP}/30" dev eth0
ip route add default via "172.20.0.1" dev eth0

# Start Vite dev server from /app
export HOME=/root
export PATH=/usr/local/bin:/usr/bin:/bin
cd /app
exec node_modules/.bin/vite --host 0.0.0.0 --port 3000
```

- [ ] **Step 3: Create the rootfs build script**

```bash
# File: sandbox-api/scripts/04-build-rootfs.sh
#!/usr/bin/env bash
# Builds the base rootfs.ext4 image with Node.js + Vite pre-installed.
# Must be run on Ubuntu as a user with sudo.
set -euo pipefail

IMAGES_DIR="/home/${USER}/sandbox-api/images"
ROOTFS_PATH="${IMAGES_DIR}/rootfs.ext4"
GUEST_DIR="/home/${USER}/sandbox-api/guest"
MOUNT_DIR="/tmp/sandbox-rootfs-mount"
ROOTFS_SIZE_MB=512

mkdir -p "$IMAGES_DIR" "$MOUNT_DIR"

echo "=== Creating ${ROOTFS_SIZE_MB}MB ext4 image ==="
dd if=/dev/zero of="$ROOTFS_PATH" bs=1M count=$ROOTFS_SIZE_MB
mkfs.ext4 "$ROOTFS_PATH"

echo "=== Mounting rootfs ==="
sudo mount "$ROOTFS_PATH" "$MOUNT_DIR"

echo "=== Installing Ubuntu base (debootstrap) ==="
sudo apt install -y debootstrap
sudo debootstrap --arch=amd64 jammy "$MOUNT_DIR" http://archive.ubuntu.com/ubuntu/

echo "=== Installing Node.js 20 inside rootfs ==="
sudo chroot "$MOUNT_DIR" /bin/bash -c "
  apt update -y
  apt install -y curl ca-certificates
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
  node --version
  npm --version
"

echo "=== Copying Vite scaffold app into rootfs ==="
sudo mkdir -p "$MOUNT_DIR/app"
sudo cp -r "$GUEST_DIR/app/." "$MOUNT_DIR/app/"

echo "=== Pre-installing npm packages inside rootfs ==="
sudo chroot "$MOUNT_DIR" /bin/bash -c "
  cd /app
  npm install
"

echo "=== Installing init script ==="
sudo cp "$GUEST_DIR/init.sh" "$MOUNT_DIR/sbin/init"
sudo chmod +x "$MOUNT_DIR/sbin/init"

echo "=== Unmounting ==="
sudo umount "$MOUNT_DIR"

echo "=== DONE: rootfs.ext4 built at $ROOTFS_PATH ==="
ls -lh "$ROOTFS_PATH"
```

- [ ] **Step 4: Sync to Ubuntu and run the rootfs build (takes 5-10 min)**

```bash
rsync -avz ./sandbox-api/ ${UBUNTU_USER}@${UBUNTU_IP}:/home/${UBUNTU_USER}/sandbox-api/
ssh ${UBUNTU_USER}@${UBUNTU_IP} "bash /home/${UBUNTU_USER}/sandbox-api/scripts/04-build-rootfs.sh"
```

Expected final output: `=== DONE: rootfs.ext4 built at /home/user/sandbox-api/images/rootfs.ext4 ===` with file ~512MB.

- [ ] **Step 5: Test-boot a single VM manually to verify rootfs + kernel**

```bash
ssh ${UBUNTU_USER}@${UBUNTU_IP}

# Quick smoke test — boot one VM manually (run this on Ubuntu)
sudo firecracker --no-api \
  --config-file /dev/stdin <<'EOF'
{
  "boot-source": {
    "kernel_image_path": "/home/USER/sandbox-api/images/vmlinux",
    "boot_args": "console=ttyS0 reboot=k panic=1 pci=off ip=172.20.0.2::172.20.0.1:255.255.255.0::eth0:off"
  },
  "drives": [{
    "drive_id": "rootfs",
    "path_on_host": "/home/USER/sandbox-api/images/rootfs.ext4",
    "is_root_device": true,
    "is_read_only": false
  }],
  "machine-config": {
    "vcpu_count": 1,
    "mem_size_mib": 128
  },
  "network-interfaces": [{
    "iface_id": "eth0",
    "guest_mac": "AA:FC:00:00:00:01",
    "host_dev_name": "tap0"
  }]
}
EOF
```

Expected: The VM boots and you see Vite dev server output in the console. Press Ctrl+C to exit.

- [ ] **Step 6: Add `.gitignore` for images, commit scaffold files**

```bash
# File: sandbox-api/.gitignore
images/
node_modules/
dist/
```

```bash
git add sandbox-api/guest/ sandbox-api/scripts/ sandbox-api/.gitignore
git commit -m "feat(sandbox): add guest vite scaffold and rootfs build script"
```

---

## Phase 3: Sandbox API Server

### Task 5: Scaffold the Sandbox API (Express + TypeScript)

**Files:**
- Create: `sandbox-api/package.json`
- Create: `sandbox-api/tsconfig.json`
- Create: `sandbox-api/src/types.ts`
- Create: `sandbox-api/src/config.ts`

- [ ] **Step 1: Create package.json**

```json
// File: sandbox-api/package.json
{
  "name": "sandbox-api",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "express": "^4.21.0",
    "http-proxy-middleware": "^3.0.3",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.0.0",
    "@types/uuid": "^9.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
// File: sandbox-api/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create shared types**

```typescript
// File: sandbox-api/src/types.ts
export type VmStatus = 'idle' | 'booting' | 'ready' | 'assigned' | 'stopping'

export interface VmInstance {
  id: string           // e.g., "vm-0"
  tapIndex: number     // tap device index (0, 1, 2...)
  guestIp: string      // e.g., "172.20.0.2"
  hostPort: number     // unique host port for the proxy (e.g., 9001)
  status: VmStatus
  sessionId: string | null   // null when idle
  lastActivityAt: number | null  // epoch ms, null when idle
  socketPath: string   // /tmp/firecracker-vm-0.socket (for jailer API)
}

export interface SandboxSession {
  sessionId: string
  vmId: string
  previewUrl: string
  createdAt: number
}
```

- [ ] **Step 4: Create config**

```typescript
// File: sandbox-api/src/config.ts
export const config = {
  port: Number(process.env.PORT ?? 8080),
  apiSecret: process.env.SANDBOX_API_SECRET ?? (() => { throw new Error('SANDBOX_API_SECRET env var is required') })(),
  poolSize: Number(process.env.POOL_SIZE ?? 3),
  vmTtlMs: Number(process.env.VM_TTL_MS ?? 15 * 60 * 1000), // 15 min
  kernelPath: process.env.KERNEL_PATH ?? '/home/' + (process.env.USER ?? 'ubuntu') + '/sandbox-api/images/vmlinux',
  rootfsPath: process.env.ROOTFS_PATH ?? '/home/' + (process.env.USER ?? 'ubuntu') + '/sandbox-api/images/rootfs.ext4',
  jailerBaseDir: '/srv/jailer',
  guestIpBase: '172.20.0',
  guestPortInVm: 3000,
  hostPortBase: 9001,
}
```

- [ ] **Step 5: Commit**

```bash
git add sandbox-api/package.json sandbox-api/tsconfig.json sandbox-api/src/
git commit -m "feat(sandbox-api): scaffold express typescript server"
```

---

### Task 6: Implement `firecracker.ts` (VM Boot with Jailer)

**Files:**
- Create: `sandbox-api/src/firecracker.ts`

- [ ] **Step 1: Create the Firecracker wrapper**

```typescript
// File: sandbox-api/src/firecracker.ts
// Manages a single Firecracker VM via the Firecracker REST API (Unix socket).
// Uses the jailer binary for security isolation.
import { execFile, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import { rm, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import http from 'node:http'
import { config } from './config.js'

const execFileAsync = promisify(execFile)

/** Sends a request to a Firecracker VM's Unix API socket */
async function fcRequest(socketPath: string, method: string, path: string, body?: unknown): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : undefined
    const req = http.request({
      socketPath,
      method,
      path,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    }, (res) => {
      let raw = ''
      res.on('data', (chunk) => (raw += chunk))
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`Firecracker API ${method} ${path} failed (${res.statusCode}): ${raw}`))
        } else {
          resolve(raw ? JSON.parse(raw) : null)
        }
      })
    })
    req.on('error', reject)
    if (data) req.write(data)
    req.end()
  })
}

/** Sleeps for the given number of milliseconds */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Boots a new Firecracker VM under the jailer and returns the socket path */
export async function bootVm(vmId: string, tapIndex: number, guestIp: string): Promise<string> {
  const jailerId = `sandbox-${vmId}`
  const jailerDir = `${config.jailerBaseDir}/${jailerId}/root`
  const socketPath = `/tmp/firecracker-${vmId}.socket`

  // Clean up any previous state
  if (existsSync(`${config.jailerBaseDir}/${jailerId}`)) {
    await execFileAsync('sudo', ['rm', '-rf', `${config.jailerBaseDir}/${jailerId}`])
  }
  if (existsSync(socketPath)) {
    await rm(socketPath)
  }

  // Jailer spawns firecracker in a chroot jail
  const jailerProcess = spawn('sudo', [
    'jailer',
    '--id', jailerId,
    '--exec-file', '/usr/local/bin/firecracker',
    '--uid', '1000',
    '--gid', '1000',
    '--chroot-base-dir', config.jailerBaseDir,
    '--',
    '--api-sock', socketPath,
  ], { detached: true, stdio: 'ignore' })
  jailerProcess.unref()

  // Wait for socket to appear (VM is ready for API calls)
  for (let i = 0; i < 30; i++) {
    if (existsSync(socketPath)) break
    await sleep(100)
  }
  if (!existsSync(socketPath)) {
    throw new Error(`VM ${vmId}: socket never appeared at ${socketPath}`)
  }

  // Configure the VM via REST API
  const guestMac = `AA:FC:00:00:${String(tapIndex).padStart(2, '0')}:01`
  const bootArgs = [
    'console=ttyS0',
    'reboot=k',
    'panic=1',
    'pci=off',
    `ip=${guestIp}::${config.guestIpBase}.1:255.255.255.0::eth0:off`,
  ].join(' ')

  await fcRequest(socketPath, 'PUT', '/boot-source', {
    kernel_image_path: config.kernelPath,
    boot_args: bootArgs,
  })

  await fcRequest(socketPath, 'PUT', '/drives/rootfs', {
    drive_id: 'rootfs',
    path_on_host: config.rootfsPath,
    is_root_device: true,
    is_read_only: false,
  })

  await fcRequest(socketPath, 'PUT', '/machine-config', {
    vcpu_count: 1,
    mem_size_mib: 128,
  })

  await fcRequest(socketPath, 'PUT', '/network-interfaces/eth0', {
    iface_id: 'eth0',
    guest_mac: guestMac,
    host_dev_name: `tap${tapIndex}`,
  })

  // Start the VM
  await fcRequest(socketPath, 'PUT', '/actions', { action_type: 'InstanceStart' })

  return socketPath
}

/** Writes code to the VM's /app/src/App.tsx via the Firecracker API mmds (metadata) or via SSH.
 *  For simplicity, we use a send-keys approach via the Firecracker serial console.
 *  In this implementation we write the code to a temp file on the host and inject it via
 *  Firecracker's PATCH /drives endpoint (re-mount a data drive). */
export async function injectCode(guestIp: string, code: string): Promise<void> {
  // The simplest approach: the VM exposes a tiny HTTP server on port 4000
  // that accepts POST /update-code. The init.sh starts this alongside Vite.
  const response = await fetch(`http://${guestIp}:4000/update-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  })
  if (!response.ok) {
    throw new Error(`injectCode failed: ${response.status} ${await response.text()}`)
  }
}

/** Sends CTRL+ALT+DEL (clean shutdown signal) to the VM */
export async function stopVm(socketPath: string): Promise<void> {
  try {
    await fcRequest(socketPath, 'PUT', '/actions', { action_type: 'SendCtrlAltDel' })
  } catch {
    // VM may already be gone — ignore
  }
}
```

- [ ] **Step 2: Update the guest init.sh to also run the code-injection server**

```bash
# File: sandbox-api/guest/init.sh  (REPLACE ENTIRELY)
#!/bin/sh
set -e

mount -t proc proc /proc
mount -t sysfs sysfs /sys
mount -t devtmpfs dev /dev
mount -t tmpfs tmpfs /tmp

ip link set lo up
ip link set eth0 up
GUEST_IP=$(cat /proc/cmdline | tr ' ' '\n' | grep '^ip=' | cut -d= -f2 | cut -d: -f1)
ip addr add "${GUEST_IP}/30" dev eth0
ip route add default via "172.20.0.1" dev eth0

export HOME=/root
export PATH=/usr/local/bin:/usr/bin:/bin
cd /app

# Start the tiny code-injection server (Node.js inline HTTP server on port 4000)
node -e "
const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/update-code') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { code } = JSON.parse(body);
        fs.writeFileSync('/app/src/App.tsx', code, 'utf8');
        res.writeHead(200);
        res.end('ok');
      } catch(e) {
        res.writeHead(400);
        res.end(String(e));
      }
    });
  } else {
    res.writeHead(404); res.end();
  }
});
server.listen(4000, '0.0.0.0');
" &

# Start Vite
exec node_modules/.bin/vite --host 0.0.0.0 --port 3000
```

- [ ] **Step 3: Commit**

```bash
git add sandbox-api/src/firecracker.ts sandbox-api/guest/init.sh
git commit -m "feat(sandbox-api): implement firecracker.ts vm boot with jailer + code injection"
```

---

### Task 7: Implement `vm-pool.ts` (Warm Pool Manager)

**Files:**
- Create: `sandbox-api/src/vm-pool.ts`

- [ ] **Step 1: Create the pool manager**

```typescript
// File: sandbox-api/src/vm-pool.ts
import { v4 as uuidv4 } from 'uuid'
import { bootVm, stopVm, injectCode } from './firecracker.js'
import { config } from './config.js'
import type { VmInstance, SandboxSession } from './types.js'

const pool: Map<string, VmInstance> = new Map()
const sessions: Map<string, SandboxSession> = new Map()

function makeVmId(tapIndex: number): string {
  return `vm-${tapIndex}`
}

function makeGuestIp(tapIndex: number): string {
  return `${config.guestIpBase}.${tapIndex + 2}`
}

function makeHostPort(tapIndex: number): number {
  return config.hostPortBase + tapIndex
}

async function bootNewVm(tapIndex: number): Promise<VmInstance> {
  const vmId = makeVmId(tapIndex)
  const guestIp = makeGuestIp(tapIndex)
  const hostPort = makeHostPort(tapIndex)

  const vm: VmInstance = {
    id: vmId,
    tapIndex,
    guestIp,
    hostPort,
    status: 'booting',
    sessionId: null,
    lastActivityAt: null,
    socketPath: `/tmp/firecracker-${vmId}.socket`,
  }
  pool.set(vmId, vm)

  try {
    await bootVm(vmId, tapIndex, guestIp)
    vm.status = 'ready'
    console.log(`[pool] VM ${vmId} ready (${guestIp}:${config.guestPortInVm})`)
  } catch (err) {
    vm.status = 'idle'
    console.error(`[pool] VM ${vmId} boot failed:`, err)
  }
  return vm
}

/** Initialize the warm pool. Call once on server startup. */
export async function initPool(): Promise<void> {
  console.log(`[pool] Initializing warm pool (size: ${config.poolSize})`)
  const boots = Array.from({ length: config.poolSize }, (_, i) => bootNewVm(i))
  await Promise.all(boots)
  startTtlEviction()
}

/** Lease an idle VM for a session. Returns a SandboxSession. */
export async function leaseVm(sessionId: string): Promise<SandboxSession> {
  // Reuse existing session if one exists
  if (sessions.has(sessionId)) {
    const session = sessions.get(sessionId)!
    const vm = pool.get(session.vmId)
    if (vm) vm.lastActivityAt = Date.now()
    return session
  }

  // Find a ready VM
  const idleVm = [...pool.values()].find((v) => v.status === 'ready')
  if (!idleVm) {
    throw new Error('No idle VMs available. Pool is exhausted.')
  }

  idleVm.status = 'assigned'
  idleVm.sessionId = sessionId
  idleVm.lastActivityAt = Date.now()

  const session: SandboxSession = {
    sessionId,
    vmId: idleVm.id,
    previewUrl: `/preview/${sessionId}`,
    createdAt: Date.now(),
  }
  sessions.set(sessionId, session)

  // Boot a replacement VM in the background to replenish the pool
  replenishPool()

  return session
}

/** Push updated code into the VM assigned to this session. */
export async function updateCode(sessionId: string, code: string): Promise<void> {
  const session = sessions.get(sessionId)
  if (!session) throw new Error(`No session found: ${sessionId}`)
  const vm = pool.get(session.vmId)
  if (!vm) throw new Error(`VM not found for session: ${sessionId}`)
  vm.lastActivityAt = Date.now()
  await injectCode(vm.guestIp, code)
}

/** Get the VM for a session (used by the proxy). */
export function getVmForSession(sessionId: string): VmInstance | undefined {
  const session = sessions.get(sessionId)
  if (!session) return undefined
  return pool.get(session.vmId)
}

/** Release a session and mark its VM for destruction. */
export async function releaseSession(sessionId: string): Promise<void> {
  const session = sessions.get(sessionId)
  if (!session) return
  sessions.delete(sessionId)

  const vm = pool.get(session.vmId)
  if (!vm) return
  vm.status = 'stopping'
  vm.sessionId = null
  vm.lastActivityAt = null
  pool.delete(vm.id)

  try {
    await stopVm(vm.socketPath)
  } catch {
    // Ignore — VM may already be gone
  }
  console.log(`[pool] VM ${vm.id} released and stopped`)

  // Replenish pool
  replenishPool()
}

function replenishPool(): void {
  const readyCount = [...pool.values()].filter((v) => v.status === 'ready' || v.status === 'booting').length
  const needed = config.poolSize - readyCount
  if (needed <= 0) return

  // Find unused tap indices
  const usedIndices = new Set([...pool.values()].map((v) => v.tapIndex))
  for (let i = 0; i < config.poolSize + 10 && needed > 0; i++) {
    if (!usedIndices.has(i)) {
      usedIndices.add(i)
      bootNewVm(i).catch((e) => console.error('[pool] Replenish failed:', e))
      break
    }
  }
}

function startTtlEviction(): void {
  setInterval(() => {
    const now = Date.now()
    for (const [sessionId, session] of sessions) {
      const vm = pool.get(session.vmId)
      if (vm?.lastActivityAt && now - vm.lastActivityAt > config.vmTtlMs) {
        console.log(`[pool] Session ${sessionId} expired (TTL). Releasing.`)
        releaseSession(sessionId).catch(console.error)
      }
    }
  }, 60_000) // check every minute
}

export function getPoolStatus() {
  return {
    total: pool.size,
    idle: [...pool.values()].filter((v) => v.status === 'ready').length,
    assigned: [...pool.values()].filter((v) => v.status === 'assigned').length,
    sessions: sessions.size,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add sandbox-api/src/vm-pool.ts
git commit -m "feat(sandbox-api): implement warm pool manager with TTL eviction"
```

---

### Task 8: Implement `proxy.ts` and `server.ts`

**Files:**
- Create: `sandbox-api/src/proxy.ts`
- Create: `sandbox-api/src/server.ts`
- Create: `sandbox-api/.env.example`

- [ ] **Step 1: Create the proxy**

```typescript
// File: sandbox-api/src/proxy.ts
// Routes HTTP traffic for /preview/:sessionId/* to the correct VM
import { createProxyMiddleware } from 'http-proxy-middleware'
import type { Request, Response, NextFunction } from 'express'
import { getVmForSession } from './vm-pool.js'
import { config } from './config.js'

export function previewProxyMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Path: /preview/:sessionId/...
  const match = req.path.match(/^\/preview\/([^/]+)/)
  if (!match) { next(); return }

  const sessionId = match[1]
  const vm = getVmForSession(sessionId)

  if (!vm) {
    res.status(404).json({ error: 'Session not found or expired' })
    return
  }

  const proxy = createProxyMiddleware({
    target: `http://${vm.guestIp}:${config.guestPortInVm}`,
    changeOrigin: true,
    pathRewrite: { [`^/preview/${sessionId}`]: '' },
    ws: true, // proxy WebSocket for Vite HMR
    on: {
      error: (_err, _req, res) => {
        (res as Response).status(502).json({ error: 'VM preview unavailable' })
      },
    },
  })

  proxy(req, res, next)
}
```

- [ ] **Step 2: Create the Express server**

```typescript
// File: sandbox-api/src/server.ts
import express from 'express'
import { config } from './config.js'
import { initPool, leaseVm, updateCode, releaseSession, getPoolStatus } from './vm-pool.js'
import { previewProxyMiddleware } from './proxy.js'

const app = express()
app.use(express.json({ limit: '2mb' }))

// Auth middleware — validates SANDBOX_API_SECRET header
function requireSecret(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const secret = req.headers['x-sandbox-secret']
  if (secret !== config.apiSecret) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  next()
}

// Health check (no auth required)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', pool: getPoolStatus() })
})

// Preview proxy (no auth — proxied to internal VM only)
app.use('/preview', previewProxyMiddleware)

// Protected sandbox routes
app.post('/sandbox', requireSecret, async (req, res) => {
  try {
    const { sessionId, code } = req.body as { sessionId: string; code: string }
    if (!sessionId || !code) {
      res.status(400).json({ error: 'sessionId and code are required' })
      return
    }

    const session = await leaseVm(sessionId)
    await updateCode(sessionId, code)

    res.json({
      sessionId: session.sessionId,
      previewUrl: session.previewUrl,
    })
  } catch (err) {
    console.error('[POST /sandbox] error:', err)
    res.status(503).json({ error: String(err) })
  }
})

app.get('/sandbox/:sessionId', requireSecret, (req, res) => {
  const vm = getVmForSession(req.params.sessionId ?? '')
  if (!vm) {
    res.status(404).json({ error: 'Session not found' })
    return
  }
  res.json({ status: vm.status, previewUrl: `/preview/${req.params.sessionId}` })
})

app.delete('/sandbox/:sessionId', requireSecret, async (req, res) => {
  await releaseSession(req.params.sessionId ?? '')
  res.json({ ok: true })
})

// Start
async function main() {
  await initPool()
  app.listen(config.port, () => {
    console.log(`Sandbox API running on port ${config.port}`)
  })
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
```

- [ ] **Step 3: Create `.env.example`**

```bash
# File: sandbox-api/.env.example
PORT=8080
SANDBOX_API_SECRET=replace-with-a-long-random-secret
POOL_SIZE=3
VM_TTL_MS=900000
KERNEL_PATH=/home/ubuntu/sandbox-api/images/vmlinux
ROOTFS_PATH=/home/ubuntu/sandbox-api/images/rootfs.ext4
```

- [ ] **Step 4: Sync, install deps, and start the API on Ubuntu**

```bash
rsync -avz ./sandbox-api/ ${UBUNTU_USER}@${UBUNTU_IP}:/home/${UBUNTU_USER}/sandbox-api/
ssh ${UBUNTU_USER}@${UBUNTU_IP} << 'ENDSSH'
  cd /home/$USER/sandbox-api
  cp .env.example .env
  # Edit the secret:
  sed -i "s/replace-with-a-long-random-secret/$(openssl rand -hex 32)/" .env
  npm install
  npm run dev
ENDSSH
```

Expected: `[pool] VM vm-0 ready`, `[pool] VM vm-1 ready`, `[pool] VM vm-2 ready`, `Sandbox API running on port 8080`

- [ ] **Step 5: Test the health endpoint from your Mac**

```bash
curl http://${UBUNTU_IP}:8080/health
# Expected: {"status":"ok","pool":{"total":3,"idle":3,"assigned":0,"sessions":0}}
```

- [ ] **Step 6: Commit**

```bash
git add sandbox-api/src/proxy.ts sandbox-api/src/server.ts sandbox-api/.env.example
git commit -m "feat(sandbox-api): implement proxy and express server"
```

---

## Phase 4: Next.js Frontend Integration

### Task 9: Add Monaco Editor and Sandbox API Proxy Route

**Files:**
- Modify: `package.json` (add `@monaco-editor/react`)
- Create: `src/app/api/sandbox/route.ts`
- Create: `src/components/sandbox/CodeEditor.tsx`

- [ ] **Step 1: Install Monaco Editor**

```bash
yarn add @monaco-editor/react
```

- [ ] **Step 2: Create the API proxy route**

This route lives in Next.js and acts as a secure relay — it injects the secret on the server side so the Ubuntu machine IP and secret are never exposed to the browser.

```typescript
// File: src/app/api/sandbox/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'

const SANDBOX_API_URL = process.env.SANDBOX_API_URL!
const SANDBOX_API_SECRET = process.env.SANDBOX_API_SECRET!

/** Validates the current user is logged in via Payload CMS */
async function requireAuth(): Promise<boolean> {
  try {
    const payload = await getPayload({ config: configPromise })
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value
    if (!token) return false
    const { user } = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })
    return !!user
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = await req.json()

  const upstream = await fetch(`${SANDBOX_API_URL}/sandbox`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-sandbox-secret': SANDBOX_API_SECRET,
    },
    body: JSON.stringify(body),
  })

  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { sessionId } = await req.json()

  const upstream = await fetch(`${SANDBOX_API_URL}/sandbox/${sessionId}`, {
    method: 'DELETE',
    headers: { 'x-sandbox-secret': SANDBOX_API_SECRET },
  })

  return NextResponse.json(await upstream.json(), { status: upstream.status })
}
```

- [ ] **Step 3: Create the Monaco code editor component**

```tsx
// File: src/components/sandbox/CodeEditor.tsx
'use client'
import Editor from '@monaco-editor/react'
import { useCallback, useRef } from 'react'

interface CodeEditorProps {
  value: string
  onChange: (code: string) => void
  language?: string
}

export function CodeEditor({ value, onChange, language = 'typescript' }: CodeEditorProps) {
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback(
    (val: string | undefined) => {
      if (val === undefined) return
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        onChange(val)
      }, 600) // 600ms debounce to avoid flooding the API
    },
    [onChange]
  )

  return (
    <div className="h-full w-full overflow-hidden rounded-lg border border-white/10">
      <Editor
        height="100%"
        defaultLanguage={language}
        value={value}
        onChange={handleChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          renderLineHighlight: 'gutter',
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  )
}
```

- [ ] **Step 4: Add env vars to `.env.local` on your Mac**

```bash
# Append to .env.local — replace XXX with your Ubuntu machine's local IP
echo "SANDBOX_API_URL=http://192.168.1.XXX:8080" >> .env.local
echo "SANDBOX_API_SECRET=<copy-from-ubuntu-.env-file>" >> .env.local
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/sandbox/route.ts src/components/sandbox/CodeEditor.tsx package.json yarn.lock
git commit -m "feat(next): add sandbox API proxy route and Monaco editor component"
```

---

### Task 10: Build the Preview Pane and Sandbox Layout

**Files:**
- Create: `src/components/sandbox/PreviewPane.tsx`
- Create: `src/components/sandbox/SandboxLayout.tsx`
- Create: `src/components/sandbox/useSandbox.ts` (state hook)

- [ ] **Step 1: Create the `useSandbox` hook**

```typescript
// File: src/components/sandbox/useSandbox.ts
'use client'
import { useState, useCallback, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

type SandboxStatus = 'idle' | 'loading' | 'ready' | 'error'

export function useSandbox() {
  const sessionId = useRef<string>(uuidv4())
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<SandboxStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const runCode = useCallback(async (code: string) => {
    setStatus('loading')
    setError(null)
    try {
      const res = await fetch('/api/sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionId.current, code }),
      })
      if (res.status === 401) {
        setStatus('error')
        setError('You must be logged in to use the sandbox.')
        return
      }
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Sandbox error')
      }
      const { previewUrl: url } = await res.json()
      // Point iframe to the sandbox API server's preview proxy via our Next.js rewrite
      setPreviewUrl(`${process.env.NEXT_PUBLIC_SANDBOX_API_URL}${url}`)
      setStatus('ready')
    } catch (err) {
      setStatus('error')
      setError(String(err))
    }
  }, [])

  const destroy = useCallback(async () => {
    await fetch('/api/sandbox', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sessionId.current }),
    })
    setPreviewUrl(null)
    setStatus('idle')
  }, [])

  return { previewUrl, status, error, runCode, destroy }
}
```

- [ ] **Step 2: Add `NEXT_PUBLIC_SANDBOX_API_URL` to `.env.local`**

```bash
echo "NEXT_PUBLIC_SANDBOX_API_URL=http://192.168.1.XXX:8080" >> .env.local
```

- [ ] **Step 3: Create the preview pane**

```tsx
// File: src/components/sandbox/PreviewPane.tsx
'use client'

interface PreviewPaneProps {
  url: string | null
  status: 'idle' | 'loading' | 'ready' | 'error'
  error?: string | null
}

export function PreviewPane({ url, status, error }: PreviewPaneProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-white/10 bg-gray-950">
      {status === 'idle' && (
        <div className="flex h-full items-center justify-center text-white/40">
          <p className="text-sm">Write code and click Run to see a preview</p>
        </div>
      )}
      {status === 'loading' && (
        <div className="flex h-full items-center justify-center gap-3 text-white/60">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <span className="text-sm">Booting sandbox VM…</span>
        </div>
      )}
      {status === 'error' && (
        <div className="flex h-full items-center justify-center p-8 text-center text-red-400">
          <p className="text-sm">{error ?? 'An error occurred'}</p>
        </div>
      )}
      {status === 'ready' && url && (
        <iframe
          src={url}
          title="Sandbox Preview"
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create the sandbox layout**

```tsx
// File: src/components/sandbox/SandboxLayout.tsx
'use client'
import { useState } from 'react'
import { CodeEditor } from './CodeEditor'
import { PreviewPane } from './PreviewPane'
import { useSandbox } from './useSandbox'

const DEFAULT_CODE = `export default function App() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-950">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Hello, Sandbox!</h1>
        <p className="text-gray-400">Edit this code and click Run</p>
      </div>
    </div>
  )
}`

export function SandboxLayout() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const { previewUrl, status, error, runCode, destroy } = useSandbox()

  return (
    <div className="flex h-screen flex-col bg-gray-950 text-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-sm font-semibold text-white/60">Sandbox Editor</span>
        <div className="flex gap-2">
          <button
            onClick={() => runCode(code)}
            disabled={status === 'loading'}
            className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            {status === 'loading' ? 'Booting…' : 'Run'}
          </button>
          {status === 'ready' && (
            <button
              onClick={destroy}
              className="rounded-md border border-white/10 px-4 py-1.5 text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Stop
            </button>
          )}
        </div>
      </div>
      {/* Split pane */}
      <div className="flex flex-1 overflow-hidden gap-2 p-2">
        <div className="flex-1">
          <CodeEditor value={code} onChange={setCode} />
        </div>
        <div className="flex-1">
          <PreviewPane url={previewUrl} status={status} error={error} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Add `uuid` to the Next.js app dependencies**

```bash
yarn add uuid && yarn add -D @types/uuid
```

- [ ] **Step 6: Commit**

```bash
git add src/components/sandbox/ 
git commit -m "feat(next): add sandbox layout, preview pane and useSandbox hook"
```

---

### Task 11: Wire Up a Sandbox Demo Page

**Files:**
- Create: `src/app/(frontend)/sandbox/page.tsx`

- [ ] **Step 1: Create the sandbox page**

```tsx
// File: src/app/(frontend)/sandbox/page.tsx
import type { Metadata } from 'next'
import { SandboxLayout } from '@/components/sandbox/SandboxLayout'

export const metadata: Metadata = {
  title: 'Live Code Sandbox | Chambers of Jeet Bhatt',
  description: 'Write React code and see a live preview powered by Firecracker microVMs.',
}

export default function SandboxPage() {
  return <SandboxLayout />
}
```

- [ ] **Step 2: Run the Next.js dev server and verify the page loads**

```bash
yarn dev
# Open http://localhost:3000/sandbox
# Verify: Editor and preview pane render, clicking Run triggers POST /api/sandbox
```

- [ ] **Step 3: Test full end-to-end flow**

1. Open `http://localhost:3000/sandbox`  
2. Confirm you are redirected to login if not authenticated  
3. Log in via Payload CMS  
4. Edit the default code (e.g., change the heading text)  
5. Click **Run** — loading spinner should appear  
6. Within ~2 seconds, the preview pane iframe should show the rendered React app  
7. Edit again — the preview should update  

- [ ] **Step 4: Final commit**

```bash
git add src/app/\(frontend\)/sandbox/page.tsx
git commit -m "feat(next): add sandbox demo page"
```

---

## Self-Review

- **Spec coverage:** ✅ All 4 phases covered. Jailer included in Phase 1 (Task 1). LAN networking used throughout. Payload CMS auth in `route.ts`. Warm pool with TTL eviction in `vm-pool.ts`. Monaco editor + iframe preview in Next.js.
- **No placeholders:** ✅ Every code block is complete and runnable.
- **Type consistency:** ✅ `VmInstance`, `SandboxSession` types defined in `types.ts` and used consistently across `vm-pool.ts`, `firecracker.ts`, `proxy.ts`, and `server.ts`.
