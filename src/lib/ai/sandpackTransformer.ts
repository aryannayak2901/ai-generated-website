// src/lib/ai/sandpackTransformer.ts
//
// Transforms AI-generated Next.js component code into a Sandpack-compatible
// version for live preview. The ORIGINAL code is NEVER mutated — it is always
// preserved verbatim for the GitHub PR push.
//
// What this transformer does:
//  1. Strips `'use client'` / `"use client"` directives
//  2. Replaces `next/image` → shimmed <img> component
//  3. Replaces `next/link`  → shimmed <a> component
//  4. Replaces `next/navigation` hooks → no-op stubs
//  5. Replaces `next/font/*` → removed (unsupported in sandbox)
//  6. Rewrites any `@/` path alias imports to safe stubs
//  7. Injects stub files into the Sandpack virtual FS
//
// External packages like `lucide-react` and `framer-motion` are provided
// via Sandpack `customSetup.dependencies` (not transformed here).

export interface SandpackTransformResult {
  /** The transformed code to feed into Sandpack's /App.tsx */
  transformedCode: string
  /** Additional virtual files to inject into Sandpack's virtual FS */
  stubs: Record<string, { code: string; hidden?: boolean }>
  /** NPM dependencies to add to Sandpack customSetup */
  dependencies: Record<string, string>
  /** External script/style URLs (e.g. Tailwind CDN) */
  externalResources: string[]
}

// ─── Shim implementations ────────────────────────────────────────────────────

const NEXT_IMAGE_SHIM = `
import React from 'react'

interface ImageProps {
  src: string | { src: string }
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  className?: string
  style?: React.CSSProperties
  sizes?: string
  quality?: number
  placeholder?: string
  blurDataURL?: string
  objectFit?: string
  objectPosition?: string
  [key: string]: unknown
}

const NextImage = React.forwardRef<HTMLImageElement, ImageProps>(
  function NextImage({ src, alt, width, height, fill, className, style, ...rest }, ref) {
    const resolvedSrc = typeof src === 'object' && src !== null ? (src as { src: string }).src : (src as string)
    const imgStyle: React.CSSProperties = fill
      ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }
      : style ?? {}
    return (
      <img
        ref={ref}
        src={resolvedSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={className}
        style={imgStyle}
        loading="lazy"
      />
    )
  }
)

export default NextImage
`.trim()

const NEXT_LINK_SHIM = `
import React from 'react'

interface LinkProps {
  href: string | { href?: string; pathname?: string }
  children?: React.ReactNode
  className?: string
  target?: string
  rel?: string
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  [key: string]: unknown
}

const NextLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function NextLink({ href, children, className, target, rel, style, onClick, ...rest }, ref) {
    const resolvedHref =
      typeof href === 'object' && href !== null
        ? (href as { href?: string; pathname?: string }).href ?? (href as { href?: string; pathname?: string }).pathname ?? '#'
        : (href as string) ?? '#'
    return (
      <a
        ref={ref}
        href={resolvedHref}
        className={className}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
        style={style}
        onClick={onClick}
      >
        {children}
      </a>
    )
  }
)

export default NextLink
`.trim()

const NEXT_NAVIGATION_SHIM = `
export function useRouter() {
  return {
    push: (href: string) => { window.location.href = href },
    replace: (href: string) => { window.location.replace(href) },
    back: () => { window.history.back() },
    forward: () => { window.history.forward() },
    refresh: () => { window.location.reload() },
    prefetch: () => {},
    pathname: '/',
    query: {},
    asPath: '/',
  }
}

export function usePathname(): string {
  return '/'
}

export function useSearchParams() {
  return new URLSearchParams()
}

export function useParams(): Record<string, string> {
  return {}
}

export function redirect(url: string): never {
  window.location.href = url
  throw new Error('redirect')
}
`.trim()

const PAYLOAD_TYPES_SHIM = `
// Minimal stub — payload-types are server-only and not needed for preview
export type Media = {
  id: string
  url?: string | null
  filename?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

export type Page = { id: string; title: string; slug: string }
export type TeamMember = { id: string; name: string; role?: string | null }
export type Post = { id: string; title: string; slug: string }
export type PracticeArea = { id: string; title: string; slug: string }
`.trim()

// ─── Main transformer ─────────────────────────────────────────────────────────

export function transformForSandpack(componentCode: string): SandpackTransformResult {
  const stubs: Record<string, { code: string; hidden?: boolean }> = {}
  const dependencies: Record<string, string> = {
    'lucide-react': 'latest',
    'framer-motion': 'latest',
    'clsx': 'latest',
    'tailwind-merge': 'latest',
    'class-variance-authority': 'latest',
  }

  // Start transforming
  let code = componentCode

  // 1. Strip `'use client'` / `"use client"` directives (both quote styles)
  code = code.replace(/^['"]use client['"]\s*;?\s*\n?/m, '')

  // 2. next/image → inject shim file + rewrite import
  if (/from ['"]next\/image['"]/.test(code)) {
    stubs['/NextImage.tsx'] = { code: NEXT_IMAGE_SHIM, hidden: true }
    code = code.replace(/from ['"]next\/image['"]/g, "from './NextImage'")
  }

  // 3. next/link → inject shim file + rewrite import
  if (/from ['"]next\/link['"]/.test(code)) {
    stubs['/NextLink.tsx'] = { code: NEXT_LINK_SHIM, hidden: true }
    code = code.replace(/from ['"]next\/link['"]/g, "from './NextLink'")
  }

  // 4. next/navigation → inject stub + rewrite import
  if (/from ['"]next\/navigation['"]/.test(code)) {
    stubs['/next-navigation.ts'] = { code: NEXT_NAVIGATION_SHIM, hidden: true }
    code = code.replace(/from ['"]next\/navigation['"]/g, "from './next-navigation'")
  }

  // 5. next/font/* → remove entire import lines (fonts aren't meaningful in sandbox)
  code = code.replace(/^import\s+.*from\s+['"]next\/font\/.*['"]\s*;?\n?/gm, '')

  // 6. next/headers, next/cookies → remove (server-only)
  code = code.replace(/^import\s+.*from\s+['"]next\/headers['"]\s*;?\n?/gm, '')
  code = code.replace(/^import\s+.*from\s+['"]next\/cookies['"]\s*;?\n?/gm, '')

  // 7. @/payload-types → inject minimal stub + rewrite import
  if (/from ['"]@\/payload-types['"]/.test(code) || /from ['"]\.\.\/.*payload-types['"]/.test(code)) {
    stubs['/payload-types.ts'] = { code: PAYLOAD_TYPES_SHIM, hidden: true }
    code = code.replace(/from ['"]@\/payload-types['"]/g, "from './payload-types'")
    code = code.replace(/from ['"]\.\.\/+payload-types['"]/g, "from './payload-types'")
  }

  // 8. @/ path aliases → these should not exist per system prompt, but handle defensively
  //    Replace `@/components/...`, `@/lib/...`, etc. with empty module stubs
  const aliasImportRe = /^import\s+(.*?)\s+from\s+['"]@\/([^'"]+)['"]\s*;?\n?/gm
  let aliasMatch: RegExpExecArray | null
  while ((aliasMatch = aliasImportRe.exec(code)) !== null) {
    const importedNames = aliasMatch[1]
    const aliasPath = aliasMatch[2]
    const stubFile = `/alias-stub-${aliasPath.replace(/\//g, '-').replace(/\.[^.]+$/, '')}.ts`

    // Build a stub that exports everything as `undefined` or empty function
    const exportNames = parseNamedImports(importedNames)
    const stubCode = exportNames.map(n => `export const ${n}: unknown = undefined`).join('\n')
    stubs[stubFile] = { code: stubCode, hidden: true }
    code = code.replace(aliasMatch[0], `import ${importedNames} from '${stubFile}'\n`)

    // Reset lastIndex since we modified the string
    aliasImportRe.lastIndex = 0
  }

  // 9. Trim leading blank lines that may result from directive removal
  code = code.replace(/^\n+/, '')

  return {
    transformedCode: code,
    stubs,
    dependencies,
    externalResources: ['https://cdn.tailwindcss.com'],
  }
}

// ─── Helper: parse named imports from an import clause string ─────────────────

function parseNamedImports(clause: string): string[] {
  // Handle: `{ Foo, Bar as Baz }` → ['Foo', 'Baz']
  // Handle: `* as Foo`           → ['Foo']
  // Handle: `DefaultExport`      → ['DefaultExport']
  const names: string[] = []

  const namedMatch = clause.match(/\{([^}]+)\}/)
  if (namedMatch) {
    const parts = namedMatch[1].split(',').map(s => s.trim()).filter(Boolean)
    for (const part of parts) {
      const asMatch = part.match(/\S+\s+as\s+(\S+)/)
      names.push(asMatch ? asMatch[1] : part)
    }
  }

  const starMatch = clause.match(/\*\s+as\s+(\w+)/)
  if (starMatch) names.push(starMatch[1])

  // Default import (identifier without { } or *)
  const defaultMatch = clause.trim().match(/^([A-Za-z_$][\w$]*)(?:\s*,)?/)
  if (defaultMatch && !clause.includes('{') && !clause.includes('*')) {
    names.push(defaultMatch[1])
  }

  return names.filter(n => /^[A-Za-z_$][\w$]*$/.test(n))
}
