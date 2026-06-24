# Firecracker microVM Code Execution Sandbox

## Overview

This document specifies the architecture for a secure, isolated, live-preview code execution system inspired by Vercel v0. The system allows AI-generated code to be executed in isolated Firecracker microVMs hosted on a dedicated Ubuntu Linux machine, with the resulting preview streamed back to the Next.js frontend as an `iframe`.

The system is composed of two independently deployable services:
1. **Sandbox API Server** — a Node.js/Express HTTP server running on the Ubuntu machine that manages Firecracker microVM lifecycles.
2. **Next.js Frontend Integration** — new API routes and UI components in the existing `chambers-of-jeetbhatt` Next.js application that interact with the Sandbox API.

---

## System Architecture

```
+-----------------------------------------------------------+
|                  User's Browser                           |
|  +---------------------+    +------------------------+   |
|  |  Code Editor (Monaco)|    |  Live Preview (iframe) |   |
|  +----------+----------+    +-----------+------------+   |
+-------------|---------------------------------|-----------+
              | POST /api/sandbox/run           |  GET previewUrl
              v                                |
+-----------------------------------------------------------+
|         Next.js App (Mac / Vercel)                        |
|         /api/sandbox/* (proxy routes)                     |
+---------------------------+-------------------------------+
                            | HTTP (local network / tunnel)
                            v
+-----------------------------------------------------------+
|         Sandbox API Server (Ubuntu Machine)               |
|         Express + Firecracker VMM Manager                 |
|                                                           |
|  +-----------------------------------------------------+  |
|  |           Warm VM Pool (pre-booted VMs)             |  |
|  |  [VM-1: idle] [VM-2: idle] [VM-3: assigned]        |  |
|  +-----------------------------------------------------+  |
|                                                           |
|  +---------------+  +--------------+  +-------------+    |
|  | Firecracker VM|  |Firecracker VM|  |    ...      |    |
|  |  Node.js +    |  |  Node.js +   |  |             |    |
|  |  Vite Dev Srv |  |  Vite Dev Srv|  |             |    |
|  |  Port: 3001   |  |  Port: 3002  |  |             |    |
|  +---------------+  +--------------+  +-------------+    |
+-----------------------------------------------------------+
```

---

## Component Breakdown

### 1. Firecracker MicroVM Base Image

Each VM is booted from a pre-built, read-only base rootfs image (an `ext4` disk image) that contains:
- A minimal Ubuntu 22.04 guest OS
- Node.js 20 LTS
- A pre-installed Vite + React + Tailwind CSS scaffold project at `/app`
- `pnpm` for fast package management

**Boot parameters:**
- Minimal Linux kernel compiled for fast boot (`vmlinux` binary)
- 128 MiB RAM per VM (tunable)
- 1 vCPU per VM

**VM lifecycle:**
1. On Sandbox API server startup, pre-boot a warm pool of N idle VMs (e.g., N=3).
2. When a sandbox request arrives, lease an idle VM from the pool.
3. The VM receives the code, writes it to `/app/src/App.tsx`, and starts a Vite dev server.
4. After a configurable TTL (e.g., 15 minutes of inactivity), the VM is destroyed and a new idle one is booted to replenish the pool.

This warm-pool pattern eliminates cold-boot latency (~125ms Firecracker boot vs seconds for Docker).

---

### 2. Sandbox API Server (`sandbox-api/`)

A new standalone Node.js service created alongside the existing Next.js project.

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| POST   | /sandbox | Creates or updates a sandbox. Accepts { sessionId, code }. Returns { sessionId, previewUrl }. |
| GET    | /sandbox/:sessionId | Returns the status and previewUrl of an existing sandbox. |
| DELETE | /sandbox/:sessionId | Destroys the sandbox and returns the VM to the pool. |
| GET    | /health | Returns API health and pool status. |

**Core Modules:**
- `vm-pool.ts` — Manages the lifecycle of pre-booted warm VMs.
- `firecracker.ts` — Wrapper around the Firecracker REST API (Unix socket).
- `network.ts` — Manages tap network devices.
- `proxy.ts` — HTTP proxy forwarding requests to the correct VM.

**Security:**
- Validates a SANDBOX_API_SECRET header on every request.
- Each VM is strictly isolated by Firecracker's jailer.

---

### 3. Next.js Frontend Integration

**API Routes (src/app/api/sandbox/):**
- `route.ts` — Thin proxy forwarding authenticated requests to the Ubuntu Sandbox API.

**UI Components (src/components/sandbox/):**
- `CodeEditor.tsx` — Monaco Editor instance configured for TypeScript/JSX.
- `PreviewPane.tsx` — iframe pointing to the previewUrl.
- `SandboxLayout.tsx` — Split-pane layout combining editor and preview.

---

## Network Topology (Ubuntu Host)

Each VM gets an isolated tap interface:

- tap0 → VM-1 guest IP: 172.20.0.2 → Port proxy: 9001
- tap1 → VM-2 guest IP: 172.20.0.3 → Port proxy: 9002
- tap2 → VM-3 guest IP: 172.20.0.4 → Port proxy: 9003

---

## File Structure

```
chambers-of-jeetbhatt/              (existing Next.js project)
├── src/
│   ├── app/api/sandbox/
│   │   └── route.ts                [NEW] Proxy route to Sandbox API
│   └── components/sandbox/
│       ├── CodeEditor.tsx          [NEW]
│       ├── PreviewPane.tsx         [NEW]
│       └── SandboxLayout.tsx       [NEW]

sandbox-api/                        [NEW] Standalone service on Ubuntu
├── src/
│   ├── server.ts
│   ├── vm-pool.ts
│   ├── firecracker.ts
│   ├── network.ts
│   └── proxy.ts
├── scripts/
│   ├── build-rootfs.sh
│   └── build-kernel.sh
└── images/
    ├── vmlinux                     (gitignored)
    └── rootfs.ext4                 (gitignored)
```

---

## Phased Implementation Plan

### Phase 1: Ubuntu Environment Setup
- Verify KVM access on the Ubuntu machine
- Download Firecracker v1.8.0 binary
- Boot a single test microVM manually to verify networking

### Phase 2: Base rootfs and Kernel
- Build the minimal kernel image
- Build base rootfs.ext4 with Node.js + Vite scaffold

### Phase 3: Sandbox API Server
- Scaffold Express server
- Implement firecracker.ts, network.ts, vm-pool.ts, proxy.ts

### Phase 4: Next.js Integration
- Add Monaco Editor component
- Add iframe preview pane
- Add /api/sandbox proxy route
- Wire up UI and test end-to-end

---

## Open Questions

1. NETWORK ACCESS: Is your Ubuntu machine on the same local network as your Mac, or do we need a tunnel (ngrok/tailscale)?
2. AUTHENTICATION: Should sandboxes require Payload CMS login, or open to any visitor?
3. JAILER: Use Firecracker jailer for security hardening from the start, or skip for initial development iteration?
