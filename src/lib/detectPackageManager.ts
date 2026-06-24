import fs from 'fs/promises'
import path from 'path'

export type PackageManager = 'npm' | 'yarn' | 'pnpm'

export async function detectPackageManager(): Promise<PackageManager> {
  try {
    const cwd = process.cwd()
    const files = await fs.readdir(cwd)
    
    if (files.includes('pnpm-lock.yaml')) return 'pnpm'
    if (files.includes('yarn.lock')) return 'yarn'
    if (files.includes('package-lock.json')) return 'npm'
    
    return 'npm' // fallback
  } catch (err) {
    return 'npm'
  }
}

export function getPackageManagerCommand(pm: PackageManager, command: 'install' | 'run'): string {
  if (command === 'install') {
    return pm === 'yarn' ? 'yarn install' : `${pm} install`
  }
  return pm === 'npm' ? 'npm run' : pm
}
