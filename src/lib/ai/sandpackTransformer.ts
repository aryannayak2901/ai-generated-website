// src/lib/ai/sandpackTransformer.ts
//
// Transforms AI-generated Next.js component code into a Sandpack-compatible
// version for live preview. The ORIGINAL code is NEVER mutated — it is
// preserved verbatim for the GitHub PR push.
//
// Strategy: INLINE all shims directly into App.tsx as local declarations.
// This avoids Sandpack's module resolution entirely (no separate stub files).
//
// What this transformer does:
//  1. Strips `'use client'` directive
//  2. Rewrites `import X from 'next/image'`  → inline JSX shim const X
//  3. Rewrites `import X from 'next/link'`   → inline <a> shim const X
//  4. Rewrites named `next/navigation` hooks → inline no-op stubs
//  5. Removes  `next/font`, `next/headers`, `next/cookies` imports
//  6. Removes  any `@/` path-alias imports   (forbidden by system prompt)
//  7. Prepends `// @ts-nocheck` to suppress TS preview noise
//  8. Injects all shim declarations after the imports block

export interface SandpackTransformResult {
  /** The transformed code ready for Sandpack /App.tsx */
  transformedCode: string
  /** Extra virtual files (empty — inline strategy needs none) */
  stubs: Record<string, { code: string; hidden?: boolean }>
  /** NPM packages to add to Sandpack customSetup.dependencies */
  dependencies: Record<string, string>
  /** External script/style URLs (e.g. Tailwind CDN) */
  externalResources: string[]
}

// ─── Inline shim builders ─────────────────────────────────────────────────────

function buildNextImageShim(varName: string): string {
  // Renders as a plain <img>. Supports fill, width/height, className, style.
  return `const ${varName} = ({ src, alt, width, height, fill, className, style, priority, sizes, placeholder, blurDataURL, ...rest }) => {
  const resolvedSrc = src && typeof src === 'object' ? src.src : src
  const computedStyle = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...(style || {}) }
    : style
  return <img src={resolvedSrc} alt={alt || ''} width={fill ? undefined : width} height={fill ? undefined : height} className={className} style={computedStyle} loading="lazy" />
}`
}

function buildNextLinkShim(varName: string): string {
  // Renders as a plain <a>. Handles href as string or object.
  return `const ${varName} = ({ href, children, className, target, rel, style, onClick, prefetch, scroll, shallow, replace, ...rest }) => {
  const resolvedHref = href && typeof href === 'object' ? (href.href || href.pathname || '#') : (href || '#')
  const computedRel = rel || (target === '_blank' ? 'noopener noreferrer' : undefined)
  return <a href={resolvedHref} className={className} target={target} rel={computedRel} style={style} onClick={onClick}>{children}</a>
}`
}

function buildNextNavShim(name: string): string {
  switch (name.trim()) {
    case 'useRouter':
      return `const useRouter = () => ({
  push: (h) => { window.location.href = h },
  replace: (h) => { window.location.replace(h) },
  back: () => window.history.back(),
  forward: () => window.history.forward(),
  refresh: () => window.location.reload(),
  prefetch: () => {},
  pathname: '/',
  query: {},
  asPath: '/',
})`
    case 'usePathname':
      return `const usePathname = () => '/'`
    case 'useSearchParams':
      return `const useSearchParams = () => new URLSearchParams()`
    case 'useParams':
      return `const useParams = () => ({})`
    case 'redirect':
      return `const redirect = (url) => { window.location.href = url }`
    case 'notFound':
      return `const notFound = () => { throw new Error('notFound') }`
    default:
      // Safe fallback for unknown navigation exports
      return `const ${name.trim()} = undefined`
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns the character index immediately after the last import statement
 * in the code. Used to inject shims right after the imports block.
 */
function findLastImportEnd(code: string): number {
  // Match both single-line and multi-line imports
  const singleLineRe = /^import\s+[^\n]+\n/gm
  const multiLineRe = /^import\s+[\s\S]+?from\s+['"][^'"]+['"]\s*;?\n/gm

  let lastEnd = 0
  let match: RegExpExecArray | null

  while ((match = singleLineRe.exec(code)) !== null) {
    const end = match.index + match[0].length
    if (end > lastEnd) lastEnd = end
  }
  while ((match = multiLineRe.exec(code)) !== null) {
    const end = match.index + match[0].length
    if (end > lastEnd) lastEnd = end
  }

  return lastEnd
}

// ─── Main transformer ─────────────────────────────────────────────────────────

export function transformForSandpack(componentCode: string): SandpackTransformResult {
  let code = componentCode
  const inlineShims: string[] = []

  // ── 1. Strip 'use client' / "use client" directive ─────────────────────────
  code = code.replace(/^['"]use client['"]\s*;?\s*\n?/m, '')

  // ── 2. next/image → inline shim ────────────────────────────────────────────
  code = code.replace(
    /^import\s+(\w+)\s+from\s+['"]next\/image['"]\s*;?\n?/gm,
    (_, varName: string) => {
      inlineShims.push(buildNextImageShim(varName))
      return ''
    }
  )

  // ── 3. next/link → inline shim ─────────────────────────────────────────────
  code = code.replace(
    /^import\s+(\w+)\s+from\s+['"]next\/link['"]\s*;?\n?/gm,
    (_, varName: string) => {
      inlineShims.push(buildNextLinkShim(varName))
      return ''
    }
  )

  // ── 4. next/navigation named imports → inline stubs ────────────────────────
  code = code.replace(
    /^import\s+\{([^}]+)\}\s+from\s+['"]next\/navigation['"]\s*;?\n?/gm,
    (_, importList: string) => {
      const names = importList.split(',').map((s: string) => s.trim()).filter(Boolean)
      inlineShims.push(...names.map(buildNextNavShim))
      return ''
    }
  )

  // ── 5. Remove server-only / unsupported Next.js imports entirely ────────────
  // next/font (both /google and /local)
  code = code.replace(/^import\s+[^\n]*from\s+['"]next\/font[^'"]*['"]\s*;?\n?/gm, '')
  // next/headers
  code = code.replace(/^import\s+[^\n]*from\s+['"]next\/headers['"]\s*;?\n?/gm, '')
  // next/cookies
  code = code.replace(/^import\s+[^\n]*from\s+['"]next\/cookies['"]\s*;?\n?/gm, '')
  // next/server
  code = code.replace(/^import\s+[^\n]*from\s+['"]next\/server['"]\s*;?\n?/gm, '')

  // ── 6. Remove @/ path-alias imports (forbidden by system prompt, but defensive) ──
  code = code.replace(/^import\s+[^\n]*from\s+['"]@\/[^'"]+['"]\s*;?\n?/gm, '')

  // ── 7. Remove relative project-internal imports (../../) ───────────────────
  code = code.replace(/^import\s+[^\n]*from\s+['"][./]{2,}[^'"]+['"]\s*;?\n?/gm, (match) => {
    // Keep single relative imports like './foo' if they're simple names (not paths)
    // Only remove if they look like project-internal paths (multiple segments)
    if (/\.\.\//.test(match) || /\.\/[^'"]+\//.test(match)) return ''
    return match
  })

  // ── 8. Inject inline shims after the imports block ─────────────────────────
  if (inlineShims.length > 0) {
    const insertPos = findLastImportEnd(code)
    const shimBlock = '\n// ─── Sandpack preview shims (not included in PR) ───\n' +
      inlineShims.join('\n\n') + '\n// ───────────────────────────────────────────────────\n'

    code = code.slice(0, insertPos) + shimBlock + code.slice(insertPos)
  }

  // ── 9. Prepend // @ts-nocheck to suppress TypeScript noise in preview ──────
  //    (the real TSC check happens during next build, not in Sandpack)
  code = '// @ts-nocheck\n' + code.replace(/^\n+/, '')

  return {
    transformedCode: code,
    // No separate stub files needed — all shims are inlined
    stubs: {},
    dependencies: {
      'lucide-react': 'latest',
      'framer-motion': 'latest',
      'clsx': 'latest',
      'tailwind-merge': 'latest',
      'class-variance-authority': 'latest',
    },
    externalResources: ['https://cdn.tailwindcss.com'],
  }
}
