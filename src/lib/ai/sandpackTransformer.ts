// src/lib/ai/sandpackTransformer.ts
//
// Transforms AI-generated Next.js TypeScript component code into a
// Sandpack-compatible JAVASCRIPT version for live preview.
//
// The ORIGINAL code is NEVER mutated — preserved verbatim for the GitHub PR.
//
// Strategy:
//  1. Strip ALL TypeScript-specific syntax → plain JSX/JavaScript
//  2. Inline Next.js/project shims as local declarations (no module resolution)
//  3. Switch template to 'react' (no Babel TS mode → no parse errors)
//
// TypeScript removal order:
//  a. interface declarations
//  b. type alias declarations
//  c. 'as X' type assertions (the main parse error trigger)
//  d. Return type annotations ): Type {
//  e. Variable type annotations const x: Type =
//  f. Parameter type annotations (param: Type)
//  g. Optional markers ?:

export interface SandpackTransformResult {
  transformedCode: string
  stubs: Record<string, { code: string; hidden?: boolean }>
  dependencies: Record<string, string>
  externalResources: string[]
  /** Which Sandpack template to use — always 'react' (not 'react-ts') */
  template: 'react'
}

// ─── TypeScript stripper ──────────────────────────────────────────────────────

/**
 * Removes TypeScript-specific syntax from source code, producing valid
 * JavaScript + JSX that Babel can compile without a TypeScript preset.
 */
function stripTypeScript(code: string): string {
  let result = code

  // 1. Remove interface declarations (with brace-balanced matching)
  result = removeInterfaceBlocks(result)

  // 2. Remove type alias declarations (single and multi-line)
  //    type Foo = string | number;
  //    export type Bar<T> = { ... }
  result = result.replace(/^(?:export\s+)?type\s+\w+(?:<[^>]+>)?\s*=[^;{]+;?\s*\n?/gm, '')
  // Multi-line type aliases (ending at next non-indented line)
  result = result.replace(/^(?:export\s+)?type\s+\w+[^=\n]*=[\s\S]*?(?=\n[^\s]|\n{2,})/gm, '')

  // 3. Remove ALL 'as X' type assertions — most impactful fix
  //    Ordered from most-specific to least-specific to avoid partial matches
  result = result
    // as const
    .replace(/\s+as\s+const\b/g, '')
    // as keyof typeof X (the exact pattern that broke the preview)
    .replace(/\s+as\s+keyof\s+typeof\s+[\w.]+/g, '')
    // as readonly X[] or as readonly Array<X>
    .replace(/\s+as\s+readonly\s+[\w.<>, ]+(?:\[\])?/g, '')
    // as Record<K, V> / as Array<T> / as Map<K,V> — single nesting level
    .replace(/\s+as\s+\w+<[^<>]{0,80}>/g, '')
    // as X[] (simple array type)
    .replace(/\s+as\s+\w+\[\]/g, '')
    // as X | Y | Z (union type, up to 5 arms, no generics)
    .replace(/\s+as\s+(?:\w+\s*\|\s*){1,5}\w+/g, '')
    // as SomeType & OtherType (intersection)
    .replace(/\s+as\s+\w+(?:\s*&\s*\w+)+/g, '')
    // as PascalCaseType (named type / component type)
    .replace(/\s+as\s+[A-Z]\w*/g, '')
    // as primitive type
    .replace(/\s+as\s+(?:string|number|boolean|any|unknown|never|null|undefined|void|object)\b/g, '')
    // as lowercase simple identifier (last resort)
    .replace(/\s+as\s+[a-z]\w*(?!\s*[(<])/g, '')

  // 4. Remove function return type annotations
  //    ): ReturnType {  →  ) {
  //    ): Promise<X> => →  ) =>
  result = result.replace(
    /\)\s*:\s*(?:Promise<[^>]+>|ReactNode|ReactElement|JSX\.Element|void|never|string|number|boolean|\w+(?:<[^>]*>)?(?:\[\])?)(\s*(?:\{|=>))/g,
    ')$1'
  )

  // 5. Remove variable type annotations (safe patterns only)
  //    const x: string =  →  const x =
  //    let items: string[] =  →  let items =
  result = result.replace(
    /\b(const|let|var)(\s+\w+)\s*:\s*[\w<>[\]|&, ?'".]+?(?=\s*=)/g,
    '$1$2'
  )

  // 6. Remove TypeScript function parameter type annotations
  //    (param: string) → (param)
  //    (param: string, other: number) → (param, other)
  //    (param?: string) → (param)
  //    Only handles simple identifier types to avoid breaking complex expressions
  result = result.replace(/(\w+)\s*\??\s*:\s*\w+(?:\[\])?(?=\s*[,)])/g, '$1')

  // 7. Remove readonly modifier in parameter positions
  result = result.replace(/\breadonly\s+(?=\w)/g, '')

  // 8. Clean up any double spaces or blank lines created by removals
  result = result.replace(/\n{3,}/g, '\n\n')

  return result
}

/**
 * Removes TypeScript interface blocks using brace-depth counting.
 * Handles: interface Foo { }, export interface Foo<T> extends Bar { }
 */
function removeInterfaceBlocks(code: string): string {
  const startRe = /^(?:export\s+)?interface\s+\w+(?:<[^>]+>)?\s*(?:extends\s+[^{]+)?\s*\{/gm
  let result = code
  let safety = 0

  while (safety < 30) {
    safety++
    startRe.lastIndex = 0
    const match = startRe.exec(result)
    if (!match) break

    // Find the matching closing brace
    const openBrace = match.index + match[0].length - 1
    let depth = 0
    let closingIdx = openBrace

    for (let i = openBrace; i < result.length; i++) {
      if (result[i] === '{') depth++
      else if (result[i] === '}') {
        depth--
        if (depth === 0) {
          closingIdx = i
          break
        }
      }
    }

    const before = result.slice(0, match.index)
    const after = result.slice(closingIdx + 1).replace(/^[ \t]*\n/, '\n')
    result = before + after
  }

  return result
}

// ─── Inline shim builders ─────────────────────────────────────────────────────

function buildNextImageShim(varName: string): string {
  return `const ${varName} = ({ src, alt, width, height, fill, className, style, priority, sizes, placeholder, blurDataURL, ...rest }) => {
  const resolvedSrc = src && typeof src === 'object' ? src.src : src
  const computedStyle = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...(style || {}) }
    : style
  return <img src={resolvedSrc} alt={alt || ''} width={fill ? undefined : width} height={fill ? undefined : height} className={className} style={computedStyle} loading="lazy" />
}`
}

function buildNextLinkShim(varName: string): string {
  return `const ${varName} = ({ href, children, className, target, rel, style, onClick, prefetch, scroll, replace, ...rest }) => {
  const resolvedHref = href && typeof href === 'object' ? (href.href || href.pathname || '#') : (href || '#')
  const computedRel = rel || (target === '_blank' ? 'noopener noreferrer' : undefined)
  return <a href={resolvedHref} className={className} target={target} rel={computedRel} style={style} onClick={onClick}>{children}</a>
}`
}

function buildNextNavShim(name: string): string {
  switch (name.trim()) {
    case 'useRouter':
      return `const useRouter = () => ({ push: (h) => { window.location.href = h }, replace: (h) => { window.location.replace(h) }, back: () => window.history.back(), forward: () => window.history.forward(), refresh: () => window.location.reload(), prefetch: () => {}, pathname: '/', query: {}, asPath: '/' })`
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
      return `const ${name.trim()} = undefined`
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the char index immediately after the last import statement. */
function findLastImportEnd(code: string): number {
  // Match both single-line and multi-line (curly) imports
  const re = /^import\s[\s\S]*?from\s+['"][^'"]+['"]\s*;?\n/gm
  let lastEnd = 0
  let match: RegExpExecArray | null
  while ((match = re.exec(code)) !== null) {
    lastEnd = match.index + match[0].length
  }
  return lastEnd
}

// ─── Main transformer ─────────────────────────────────────────────────────────

export function transformForSandpack(componentCode: string): SandpackTransformResult {
  let code = componentCode
  const inlineShims: string[] = []

  // ── Step 1: Strip 'use client' directive ───────────────────────────────────
  code = code.replace(/^['"]use client['"]\s*;?\s*\n?/m, '')

  // ── Step 2: Rewrite Next.js imports → inline shims (remove import line) ────

  // next/image
  code = code.replace(
    /^import\s+(\w+)\s+from\s+['"]next\/image['"]\s*;?\n?/gm,
    (_, varName: string) => { inlineShims.push(buildNextImageShim(varName)); return '' }
  )

  // next/link
  code = code.replace(
    /^import\s+(\w+)\s+from\s+['"]next\/link['"]\s*;?\n?/gm,
    (_, varName: string) => { inlineShims.push(buildNextLinkShim(varName)); return '' }
  )

  // next/navigation named imports
  code = code.replace(
    /^import\s+\{([^}]+)\}\s+from\s+['"]next\/navigation['"]\s*;?\n?/gm,
    (_, importList: string) => {
      const names = importList.split(',').map((s: string) => s.trim()).filter(Boolean)
      inlineShims.push(...names.map(buildNextNavShim))
      return ''
    }
  )

  // ── Step 3: Remove server-only / unsupported Next.js imports ───────────────
  code = code.replace(/^import\s+[^\n]*from\s+['"]next\/font[^'"]*['"]\s*;?\n?/gm, '')
  code = code.replace(/^import\s+[^\n]*from\s+['"]next\/headers['"]\s*;?\n?/gm, '')
  code = code.replace(/^import\s+[^\n]*from\s+['"]next\/cookies['"]\s*;?\n?/gm, '')
  code = code.replace(/^import\s+[^\n]*from\s+['"]next\/server['"]\s*;?\n?/gm, '')

  // ── Step 4: Remove @/ path-alias imports (defensive guard) ─────────────────
  code = code.replace(/^import\s+[^\n]*from\s+['"]@\/[^'"]+['"]\s*;?\n?/gm, '')

  // ── Step 5: Strip TypeScript types → plain JavaScript ──────────────────────
  //    This prevents Babel parse errors (e.g. 'as keyof typeof X', interface blocks)
  code = stripTypeScript(code)

  // ── Step 6: Inject inline shims after imports block ────────────────────────
  if (inlineShims.length > 0) {
    const insertPos = findLastImportEnd(code)
    const shimBlock =
      '\n// ─── Sandpack preview shims ───────────────────────────────────────\n' +
      inlineShims.join('\n\n') +
      '\n// ────────────────────────────────────────────────────────────────────\n'
    code = code.slice(0, insertPos) + shimBlock + code.slice(insertPos)
  }

  // ── Step 7: Clean up and trim ──────────────────────────────────────────────
  code = code.replace(/^\n+/, '').replace(/\n{3,}/g, '\n\n')

  return {
    transformedCode: code,
    stubs: {},
    dependencies: {
      'lucide-react': 'latest',
      'framer-motion': 'latest',
      'clsx': 'latest',
      'tailwind-merge': 'latest',
      'class-variance-authority': 'latest',
    },
    externalResources: ['https://cdn.tailwindcss.com'],
    template: 'react',
  }
}
