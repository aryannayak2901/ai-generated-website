# GitOps AI Block Generator — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the local `fs.writeFile()` path in the AI block generator with a GitOps flow: AI generates code → Sandpack preview in admin → user pushes to GitHub via Octokit → PR triggers Vercel rebuild.

**Architecture:** The generate API route returns raw code strings to the client in production instead of writing to disk. The client previews the code in Sandpack (editable), then calls a new `/api/ai-push-github` route that uses Octokit to commit 4 files to a feature branch and open a PR. Local dev keeps the existing `fileWriter.ts` path unchanged.

**Tech Stack:** `@octokit/rest`, `@codesandbox/sandpack-react`, Next.js App Router API Routes, TypeScript, Framer Motion (existing).

---

## File Map

| Status | File | What Changes |
|---|---|---|
| NEW | `src/lib/ai/githubPatcher.ts` | Pure string-patching functions (no fs I/O) |
| NEW | `src/app/api/ai-push-github/route.ts` | Octokit GitHub API route |
| NEW | `src/components/payload/BlocksBuilder/AIPreviewPanel.tsx` | Sandpack preview + push UI |
| MODIFY | `src/app/api/ai-generate-block/route.ts` | Skip fileWriter in production |
| MODIFY | `src/lib/ai/fileWriter.ts` | Import from githubPatcher instead of inline patch fns |
| MODIFY | `src/lib/ai/types.ts` | Add `GenerateResponseWithCode` type |
| MODIFY | `src/components/payload/BlocksBuilder/AIGeneratorModal.tsx` | Add Phase 2 state → show AIPreviewPanel |

---

## Task 1: Install Dependencies

**Files:** `package.json`, `yarn.lock`

- [ ] **Step 1: Install Octokit and Sandpack**

```bash
cd /Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt
yarn add @octokit/rest @codesandbox/sandpack-react @codesandbox/sandpack-client
```

Expected output: `success Saved 3 new dependencies`

- [ ] **Step 2: Verify types are available**

```bash
ls node_modules/@octokit/rest/dist-types/index.d.ts
ls node_modules/@codesandbox/sandpack-react/dist/index.d.ts
```

Expected: both files exist (no `No such file` error)

- [ ] **Step 3: Commit**

```bash
git add package.json yarn.lock
git commit -m "deps: add @octokit/rest and @codesandbox/sandpack-react"
```

---

## Task 2: Create `githubPatcher.ts` — Pure String Patchers

**Files:**
- Create: `src/lib/ai/githubPatcher.ts`

This module extracts the patching logic from `fileWriter.ts` into pure functions that operate on strings instead of the filesystem. They will be shared by both `fileWriter.ts` (local) and the new GitHub API route (production).

- [ ] **Step 1: Create the file**

```typescript
// src/lib/ai/githubPatcher.ts
// Pure string-based patchers — no filesystem I/O.
// Used by fileWriter.ts (local dev) and /api/ai-push-github (production).

export interface PatchableBlock {
  blockType: string
  componentName: string
}

/**
 * Patches RenderBlocks.tsx string content to add an import and blockComponents map entry.
 * Idempotent — skips if blockType already present.
 */
export function patchRenderBlocksString(content: string, block: PatchableBlock): string {
  // Idempotency check
  if (content.includes(`${block.blockType}:`)) return content

  // Add import after the last import line
  const importLine = `import { ${block.componentName} } from '@/components/blocks/${block.componentName}'\n`
  const lastImportIdx = content.lastIndexOf('import ')
  const afterLastImport = content.indexOf('\n', lastImportIdx) + 1
  let patched = content.slice(0, afterLastImport) + importLine + content.slice(afterLastImport)

  // Add to blockComponents map — find closing } of the map object
  const mapEntry = `  ${block.blockType}: ${block.componentName},`
  const blockComponentsIdx = patched.indexOf('blockComponents')
  if (blockComponentsIdx === -1) throw new Error('RenderBlocks.tsx: could not find blockComponents')
  const mapClosingMatch = patched.slice(blockComponentsIdx).match(/(\s*)\}/)
  if (!mapClosingMatch || mapClosingMatch.index === undefined) {
    throw new Error('RenderBlocks.tsx: could not find blockComponents closing brace')
  }
  const mapClosingIdx = blockComponentsIdx + mapClosingMatch.index
  patched = patched.slice(0, mapClosingIdx) + '\n' + mapEntry + patched.slice(mapClosingIdx)

  return patched
}

/**
 * Patches Pages.ts string content to add an import and blocks[] array entry.
 * Idempotent — skips if componentName import already present.
 */
export function patchPagesString(content: string, block: PatchableBlock): string {
  // Idempotency check
  if (content.includes(`{ ${block.componentName} }`)) return content

  // Add import after the last import line
  const importLine = `import { ${block.componentName} } from '../blocks/${block.componentName}'\n`
  const lastImportIdx = content.lastIndexOf('import ')
  let patched: string
  if (lastImportIdx === -1) {
    patched = importLine + '\n' + content
  } else {
    const afterLastImport = content.indexOf('\n', lastImportIdx) + 1
    patched = content.slice(0, afterLastImport) + importLine + content.slice(afterLastImport)
  }

  // Add to blocks array — find closing ] of the blocks array
  const blockEntry = `        ${block.componentName},`
  const blocksIdx = patched.indexOf('blocks: [')
  if (blocksIdx === -1) throw new Error('Pages.ts: could not find blocks array')
  const blocksArrayCloseMatch = patched.slice(blocksIdx).match(/(\s*)\]/)
  if (!blocksArrayCloseMatch || blocksArrayCloseMatch.index === undefined) {
    throw new Error('Pages.ts: could not find blocks array closing bracket')
  }
  const blocksArrayCloseIdx = blocksIdx + blocksArrayCloseMatch.index
  patched = patched.slice(0, blocksArrayCloseIdx) + '\n' + blockEntry + patched.slice(blocksArrayCloseIdx)

  return patched
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/ai/githubPatcher.ts
git commit -m "feat(ai): add pure string patchers in githubPatcher.ts"
```

---

## Task 3: Update `fileWriter.ts` to Use `githubPatcher.ts`

**Files:**
- Modify: `src/lib/ai/fileWriter.ts`

Replace the inline `patchRenderBlocks` and `patchPages` functions with calls to the shared `githubPatcher.ts` functions. Behavior stays identical for local dev.

- [ ] **Step 1: Replace the two patch functions**

Open `src/lib/ai/fileWriter.ts`. Replace the entire `patchRenderBlocks` function (lines 103–126) and the entire `patchPages` function (lines 128–155) with the following. Also add the import at the top:

Add this import after line 4 (`import { GeneratedBlock } from './types'`):
```typescript
import { patchRenderBlocksString, patchPagesString } from './githubPatcher'
```

Replace the `patchRenderBlocks` function body (lines 103–126) with:
```typescript
async function patchRenderBlocks(block: GeneratedBlock): Promise<void> {
  const filePath = safeResolvePath(SRC, 'components', 'RenderBlocks.tsx')
  const content = await fs.readFile(filePath, 'utf-8')
  const patched = patchRenderBlocksString(content, block)
  if (patched !== content) {
    await fs.writeFile(filePath, patched, 'utf-8')
  }
}
```

Replace the `patchPages` function body (lines 128–155) with:
```typescript
async function patchPages(block: GeneratedBlock): Promise<void> {
  const filePath = safeResolvePath(SRC, 'collections', 'Pages.ts')
  const content = await fs.readFile(filePath, 'utf-8')
  const patched = patchPagesString(content, block)
  if (patched !== content) {
    await fs.writeFile(filePath, patched, 'utf-8')
  }
}
```

- [ ] **Step 2: Verify build still works locally**

```bash
cd /Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt
yarn build 2>&1 | tail -20
```

Expected: build completes without TypeScript errors related to `fileWriter.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/ai/fileWriter.ts
git commit -m "refactor(ai): fileWriter uses shared githubPatcher string functions"
```

---

## Task 4: Update `types.ts` — Add Production Response Type

**Files:**
- Modify: `src/lib/ai/types.ts`

Add a new response type for the production path that returns full code strings to the client.

- [ ] **Step 1: Add the new type**

Append to `src/lib/ai/types.ts`:

```typescript
// Response type used in production (no filesystem write — code returned to client)
export interface GenerateResponseWithCode {
  success: true
  mode: 'code' // signals the client to show the preview panel
  blocks: Array<{
    blockType: string
    componentName: string
    label: string
    category: 'Hero' | 'Content' | 'CTA / Forms'
    icon: string
    badgeLabel: string
    componentCode: string
    payloadConfigCode: string
    defaultValues: Record<string, unknown>
  }>
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/ai/types.ts
git commit -m "feat(ai): add GenerateResponseWithCode type for production path"
```

---

## Task 5: Modify `ai-generate-block` Route — Skip `fileWriter` in Production

**Files:**
- Modify: `src/app/api/ai-generate-block/route.ts`

In production (`NODE_ENV === 'production'`), skip `writeGeneratedBlock()` and return the raw code strings. In local dev, keep the existing behavior.

- [ ] **Step 1: Update the route**

Replace the full contents of `src/app/api/ai-generate-block/route.ts` with:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { buildSystemPrompt } from '@/lib/ai/buildSystemPrompt'
import { callGemini } from '@/lib/ai/providers/gemini'
import { callOpenAI } from '@/lib/ai/providers/openai'
import { callAnthropic } from '@/lib/ai/providers/anthropic'
import { callOpenRouter } from '@/lib/ai/providers/openrouter'
import { callGroq } from '@/lib/ai/providers/groq'
import { callMistral } from '@/lib/ai/providers/mistral'
import { callTogether } from '@/lib/ai/providers/together'
import { writeGeneratedBlock } from '@/lib/ai/fileWriter'
import type {
  GenerateRequest,
  GenerateResponse,
  GenerateResponseWithCode,
  GenerateErrorResponse,
  AIProvider,
  GeneratedBlock,
} from '@/lib/ai/types'

export const runtime = 'nodejs'

export async function POST(
  request: NextRequest
): Promise<NextResponse<GenerateResponse | GenerateResponseWithCode | GenerateErrorResponse>> {
  try {
    let body: GenerateRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
    }
    const { prompt, mode, provider, model, apiKey } = body

    if (!prompt?.trim()) return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 })
    if (!provider) return NextResponse.json({ success: false, error: 'Provider is required' }, { status: 400 })
    if (!model?.trim()) return NextResponse.json({ success: false, error: 'Model is required' }, { status: 400 })
    if (!apiKey?.trim()) return NextResponse.json({ success: false, error: 'API key is required' }, { status: 400 })

    const validProviders: AIProvider[] = ['gemini', 'openai', 'anthropic', 'openrouter', 'groq', 'mistral', 'together']
    if (!validProviders.includes(provider)) {
      return NextResponse.json({ success: false, error: `Invalid provider: ${provider}` }, { status: 400 })
    }

    const promptPayload = await buildSystemPrompt(prompt, mode ?? 'block')

    let generatedBlocks: GeneratedBlock[]
    switch (provider) {
      case 'gemini':
        generatedBlocks = await callGemini(promptPayload, model, apiKey)
        break
      case 'openai':
        generatedBlocks = await callOpenAI(promptPayload, model, apiKey)
        break
      case 'anthropic':
        generatedBlocks = await callAnthropic(promptPayload, model, apiKey)
        break
      case 'openrouter':
        generatedBlocks = await callOpenRouter(promptPayload, model, apiKey)
        break
      case 'groq':
        generatedBlocks = await callGroq(promptPayload, model, apiKey)
        break
      case 'mistral':
        generatedBlocks = await callMistral(promptPayload, model, apiKey)
        break
      case 'together':
        generatedBlocks = await callTogether(promptPayload, model, apiKey)
        break
      default:
        return NextResponse.json({ success: false, error: `Unsupported provider: ${provider}` }, { status: 400 })
    }

    // PRODUCTION: Return raw code to client — no filesystem writes (Vercel is read-only)
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({
        success: true,
        mode: 'code',
        blocks: generatedBlocks.map((block) => ({
          blockType: block.blockType,
          componentName: block.componentName,
          label: block.label,
          category: block.category,
          icon: block.icon,
          badgeLabel: block.badgeLabel,
          componentCode: block.componentCode,
          payloadConfigCode: block.payloadConfigCode,
          defaultValues: block.defaultValues,
        })),
      } satisfies GenerateResponseWithCode)
    }

    // LOCAL DEV: Write files to disk as before
    const writtenBlocks = await Promise.all(
      generatedBlocks.map((block) => writeGeneratedBlock(block))
    )

    return NextResponse.json({ success: true, blocks: writtenBlocks })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('[AI Generate Block] Error:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/ai-generate-block/route.ts
git commit -m "feat(api): skip fileWriter in production, return code strings to client"
```

---

## Task 6: Create `/api/ai-push-github` Route

**Files:**
- Create: `src/app/api/ai-push-github/route.ts`

This is the core of the GitOps flow. Uses `@octokit/rest` to commit 4 files to a new feature branch and open a PR on GitHub.

- [ ] **Step 1: Create the route**

```typescript
// src/app/api/ai-push-github/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'
import fs from 'fs/promises'
import path from 'path'
import { patchRenderBlocksString, patchPagesString, PatchableBlock } from '@/lib/ai/githubPatcher'

export const runtime = 'nodejs'

interface PushRequest {
  blockType: string
  componentName: string
  componentCode: string
  payloadConfigCode: string
  prompt: string
  provider: string
  model: string
}

interface PushSuccess {
  success: true
  prUrl: string
  branchName: string
  prNumber: number
}

interface PushError {
  success: false
  error: string
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<PushSuccess | PushError>> {
  const pat = process.env.GITHUB_PAT
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO

  if (!pat || !owner || !repo) {
    return NextResponse.json(
      { success: false, error: 'GitHub integration not configured. Set GITHUB_PAT, GITHUB_OWNER, and GITHUB_REPO env vars.' },
      { status: 500 }
    )
  }

  let body: PushRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const { blockType, componentName, componentCode, payloadConfigCode, prompt, provider, model } = body

  if (!blockType || !componentName || !componentCode || !payloadConfigCode) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
  }

  // Validate names to prevent path traversal in blob paths
  if (!/^[A-Z][a-zA-Z0-9]+$/.test(componentName)) {
    return NextResponse.json({ success: false, error: 'Invalid componentName' }, { status: 400 })
  }
  if (!/^[a-z][a-zA-Z0-9]*$/.test(blockType)) {
    return NextResponse.json({ success: false, error: 'Invalid blockType' }, { status: 400 })
  }

  const octokit = new Octokit({ auth: pat })
  const timestamp = Math.floor(Date.now() / 1000)
  const branchName = `ai/block-${blockType}-${timestamp}`

  try {
    // 1. Read current RenderBlocks.tsx and Pages.ts from GitHub (not local disk — we're in production)
    const block: PatchableBlock = { blockType, componentName }

    const [renderBlocksFile, pagesFile] = await Promise.all([
      octokit.repos.getContent({ owner, repo, path: 'src/components/RenderBlocks.tsx' }),
      octokit.repos.getContent({ owner, repo, path: 'src/collections/Pages.ts' }),
    ])

    const renderBlocksContent = Buffer.from(
      (renderBlocksFile.data as { content: string }).content,
      'base64'
    ).toString('utf-8')

    const pagesContent = Buffer.from(
      (pagesFile.data as { content: string }).content,
      'base64'
    ).toString('utf-8')

    const patchedRenderBlocks = patchRenderBlocksString(renderBlocksContent, block)
    const patchedPages = patchPagesString(pagesContent, block)

    // 2. Get main branch HEAD SHA
    const mainRef = await octokit.git.getRef({ owner, repo, ref: 'heads/main' })
    const mainSha = mainRef.data.object.sha

    // 3. Get the tree SHA of the main commit
    const mainCommit = await octokit.git.getCommit({ owner, repo, commit_sha: mainSha })
    const baseTreeSha = mainCommit.data.tree.sha

    // 4. Create blobs for all 4 files
    const [componentBlob, schemaBlob, renderBlocksBlob, pagesBlob] = await Promise.all([
      octokit.git.createBlob({ owner, repo, content: componentCode, encoding: 'utf-8' }),
      octokit.git.createBlob({ owner, repo, content: payloadConfigCode, encoding: 'utf-8' }),
      octokit.git.createBlob({ owner, repo, content: patchedRenderBlocks, encoding: 'utf-8' }),
      octokit.git.createBlob({ owner, repo, content: patchedPages, encoding: 'utf-8' }),
    ])

    // 5. Create a new tree
    const newTree = await octokit.git.createTree({
      owner,
      repo,
      base_tree: baseTreeSha,
      tree: [
        {
          path: `src/components/blocks/${componentName}.tsx`,
          mode: '100644',
          type: 'blob',
          sha: componentBlob.data.sha,
        },
        {
          path: `src/blocks/${componentName}.ts`,
          mode: '100644',
          type: 'blob',
          sha: schemaBlob.data.sha,
        },
        {
          path: 'src/components/RenderBlocks.tsx',
          mode: '100644',
          type: 'blob',
          sha: renderBlocksBlob.data.sha,
        },
        {
          path: 'src/collections/Pages.ts',
          mode: '100644',
          type: 'blob',
          sha: pagesBlob.data.sha,
        },
      ],
    })

    // 6. Create commit
    const newCommit = await octokit.git.createCommit({
      owner,
      repo,
      message: `✨ AI Block: ${componentName}\n\nGenerated via AI Block Generator\nProvider: ${provider} / ${model}\nPrompt: "${prompt.slice(0, 200)}"`,
      tree: newTree.data.sha,
      parents: [mainSha],
    })

    // 7. Create feature branch
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: newCommit.data.sha,
    })

    // 8. Open Pull Request
    const pr = await octokit.pulls.create({
      owner,
      repo,
      title: `✨ AI Block: ${componentName}`,
      body: `## AI-Generated Block: \`${componentName}\`

**Block Type:** \`${blockType}\`
**Provider:** ${provider} / ${model}
**Generated:** ${new Date().toISOString()}

### Prompt
> ${prompt}

### Files Changed
- \`src/components/blocks/${componentName}.tsx\` — React component
- \`src/blocks/${componentName}.ts\` — Payload CMS block schema
- \`src/components/RenderBlocks.tsx\` — Registered in block renderer
- \`src/collections/Pages.ts\` — Registered in Pages collection

### Review Checklist
- [ ] Component renders correctly with default props
- [ ] Tailwind classes use design tokens (no hardcoded hex values)
- [ ] Payload schema fields match component props
- [ ] No disallowed imports (only: react, next/image, next/link, lucide-react, framer-motion)
      `,
      head: branchName,
      base: 'main',
    })

    return NextResponse.json({
      success: true,
      prUrl: pr.data.html_url,
      branchName,
      prNumber: pr.data.number,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown GitHub API error'
    console.error('[AI Push GitHub] Error:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/ai-push-github/route.ts
git commit -m "feat(api): add /api/ai-push-github route using Octokit"
```

---

## Task 7: Create `AIPreviewPanel.tsx` — Sandpack Preview + GitHub Push UI

**Files:**
- Create: `src/components/payload/BlocksBuilder/AIPreviewPanel.tsx`

This is the Phase 2 UI shown after generation succeeds in production mode. It renders Sandpack with the generated component code, allows editing, and has a "Open PR on GitHub" button.

- [ ] **Step 1: Create the component**

```tsx
// src/components/payload/BlocksBuilder/AIPreviewPanel.tsx
'use client'

import React, { useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from '@codesandbox/sandpack-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GenerateResponseWithCode } from '@/lib/ai/types'

type GeneratedBlockWithCode = GenerateResponseWithCode['blocks'][number]

interface AIPreviewPanelProps {
  blocks: GeneratedBlockWithCode[]
  prompt: string
  provider: string
  model: string
  onBack: () => void
  onClose: () => void
}

type PushStatus = 'idle' | 'pushing' | 'done' | 'error'

export function AIPreviewPanel({
  blocks,
  prompt,
  provider,
  model,
  onBack,
  onClose,
}: AIPreviewPanelProps) {
  const [activeBlockIdx, setActiveBlockIdx] = useState(0)
  const [activeTab, setActiveTab] = useState<'component' | 'schema'>('component')
  const [pushStatus, setPushStatus] = useState<PushStatus>('idle')
  const [pushError, setPushError] = useState('')
  const [prUrl, setPrUrl] = useState('')

  // Per-block editable code state — initialized from generated blocks
  const [editedCodes, setEditedCodes] = useState<Record<number, { componentCode: string; payloadConfigCode: string }>>(
    () => Object.fromEntries(blocks.map((b, i) => [i, { componentCode: b.componentCode, payloadConfigCode: b.payloadConfigCode }]))
  )

  const block = blocks[activeBlockIdx]
  const currentCode = editedCodes[activeBlockIdx]

  const handlePush = async () => {
    setPushStatus('pushing')
    setPushError('')

    try {
      const response = await fetch('/api/ai-push-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockType: block.blockType,
          componentName: block.componentName,
          componentCode: currentCode.componentCode,
          payloadConfigCode: currentCode.payloadConfigCode,
          prompt,
          provider,
          model,
        }),
      })

      const data = await response.json() as { success: boolean; prUrl?: string; error?: string }

      if (!data.success) throw new Error(data.error ?? 'Failed to create PR')

      setPrUrl(data.prUrl!)
      setPushStatus('done')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setPushError(message)
      setPushStatus('error')
    }
  }

  const sandpackFiles = {
    '/App.tsx': {
      code: currentCode.componentCode.replace(
        /^'use client'\n?/,
        ''
      ),
      active: true,
    },
    '/index.tsx': {
      code: `import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
`,
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
      className="bb-preview-panel"
    >
      {/* Header */}
      <div className="bb-modal-header">
        <div className="bb-modal-header-left">
          <button
            type="button"
            onClick={onBack}
            disabled={pushStatus === 'pushing'}
            className="bb-preview-back-btn"
            aria-label="Back to generate"
          >
            ← Back
          </button>
          <div className="bb-modal-icon-wrap">🔍</div>
          <h2 className="bb-modal-title">Preview &amp; Push</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={pushStatus === 'pushing'}
          aria-label="Close"
          className="bb-modal-close"
        >
          ✕
        </button>
      </div>

      {/* Block tabs (if multiple blocks generated in page mode) */}
      {blocks.length > 1 && (
        <div className="bb-preview-block-tabs">
          {blocks.map((b, i) => (
            <button
              key={b.blockType}
              type="button"
              onClick={() => setActiveBlockIdx(i)}
              className={`bb-preview-block-tab ${i === activeBlockIdx ? 'bb-preview-block-tab--active' : ''}`}
            >
              {b.icon} {b.label}
            </button>
          ))}
        </div>
      )}

      {/* Block meta row */}
      <div className="bb-preview-meta">
        <span className="bb-preview-meta-name">{block.icon} {block.componentName}</span>
        <span className="bb-preview-meta-badge">{block.category}</span>
        <span className="bb-preview-meta-badge bb-preview-meta-badge--muted">{block.badgeLabel}</span>
      </div>

      {/* Code tab switcher */}
      <div className="bb-preview-code-tabs">
        <button
          type="button"
          className={`bb-preview-code-tab ${activeTab === 'component' ? 'bb-preview-code-tab--active' : ''}`}
          onClick={() => setActiveTab('component')}
        >
          Component TSX
        </button>
        <button
          type="button"
          className={`bb-preview-code-tab ${activeTab === 'schema' ? 'bb-preview-code-tab--active' : ''}`}
          onClick={() => setActiveTab('schema')}
        >
          Block Schema
        </button>
      </div>

      {/* Sandpack editor + preview */}
      <div className="bb-preview-sandpack-wrap">
        <SandpackProvider
          key={`${activeBlockIdx}-${activeTab}`}
          template="react-ts"
          files={
            activeTab === 'component'
              ? sandpackFiles
              : {
                  '/App.tsx': {
                    code: `// Payload Block Schema (server-side config — preview not available)\n// This file is read-only in the preview.\n\n${currentCode.payloadConfigCode}`,
                    active: true,
                    readOnly: true,
                  },
                }
          }
          theme="dark"
          options={{ recompileDelay: 800 }}
        >
          <SandpackLayout>
            <SandpackCodeEditor
              showTabs={false}
              showLineNumbers
              showInlineErrors
              wrapContent
              style={{ height: 260 }}
              onChange={
                activeTab === 'component'
                  ? (code) =>
                      setEditedCodes((prev) => ({
                        ...prev,
                        [activeBlockIdx]: { ...prev[activeBlockIdx], componentCode: code },
                      }))
                  : undefined
              }
            />
            {activeTab === 'component' && (
              <SandpackPreview
                style={{ height: 260 }}
                showNavigator={false}
                showOpenInCodeSandbox={false}
              />
            )}
          </SandpackLayout>
        </SandpackProvider>
      </div>

      {/* PR info */}
      <div className="bb-preview-pr-info">
        <div className="bb-preview-pr-row">
          <span className="bb-preview-pr-label">Branch:</span>
          <code className="bb-preview-pr-value">
            ai/block-{block.blockType}-&lt;timestamp&gt;
          </code>
        </div>
        <div className="bb-preview-pr-row">
          <span className="bb-preview-pr-label">PR Title:</span>
          <span className="bb-preview-pr-value">✨ AI Block: {block.componentName}</span>
        </div>
        <div className="bb-preview-pr-row">
          <span className="bb-preview-pr-label">Commits:</span>
          <span className="bb-preview-pr-value">4 files (component + schema + RenderBlocks + Pages)</span>
        </div>
      </div>

      {/* Error */}
      {pushStatus === 'error' && (
        <div className="bb-modal-error">{pushError}</div>
      )}

      {/* Success */}
      <AnimatePresence>
        {pushStatus === 'done' && prUrl && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bb-preview-success"
          >
            <span>✅ Pull Request created!</span>
            <a
              href={prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bb-preview-pr-link"
            >
              View PR on GitHub →
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer actions */}
      <div className="bb-modal-footer">
        <div className="bb-modal-status">
          {pushStatus === 'pushing' && '⏳ Creating branch and opening PR…'}
          {pushStatus === 'done' && '✅ Done! Merge the PR to deploy.'}
        </div>

        {pushStatus !== 'done' && (
          <button
            type="button"
            onClick={handlePush}
            disabled={pushStatus === 'pushing'}
            className="bb-modal-btn"
          >
            {pushStatus === 'pushing' ? 'Opening PR…' : '🚀 Open Pull Request on GitHub'}
          </button>
        )}

        {pushStatus === 'done' && (
          <button
            type="button"
            onClick={onClose}
            className="bb-modal-btn"
          >
            Close
          </button>
        )}
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/payload/BlocksBuilder/AIPreviewPanel.tsx
git commit -m "feat(ui): add AIPreviewPanel with Sandpack preview and GitHub PR push"
```

---

## Task 8: Add Preview Panel CSS Classes to `styles.css`

**Files:**
- Modify: `src/components/payload/BlocksBuilder/styles.css`

Add the CSS classes used by `AIPreviewPanel.tsx`. Append these to the end of the existing `styles.css`.

- [ ] **Step 1: Append to styles.css**

Open `src/components/payload/BlocksBuilder/styles.css` and append at the very end:

```css
/* ─── AIPreviewPanel ─────────────────────────────────────────────────────── */
.bb-preview-panel {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.bb-preview-back-btn {
  background: transparent;
  border: none;
  color: var(--bb-muted);
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}
.bb-preview-back-btn:hover {
  color: var(--bb-text);
  background: var(--bb-surface-hover);
}

.bb-preview-block-tabs {
  display: flex;
  gap: 4px;
  padding: 0 20px 12px;
  flex-wrap: wrap;
}
.bb-preview-block-tab {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  border: 1px solid var(--bb-border);
  background: transparent;
  color: var(--bb-muted);
  cursor: pointer;
  transition: all 0.15s;
}
.bb-preview-block-tab--active {
  background: var(--bb-gold);
  border-color: var(--bb-gold);
  color: #0a0f1e;
  font-weight: 600;
}

.bb-preview-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px 12px;
}
.bb-preview-meta-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--bb-text);
}
.bb-preview-meta-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  background: var(--bb-gold-subtle);
  color: var(--bb-gold);
  font-weight: 600;
}
.bb-preview-meta-badge--muted {
  background: var(--bb-surface-hover);
  color: var(--bb-muted);
}

.bb-preview-code-tabs {
  display: flex;
  border-bottom: 1px solid var(--bb-border);
  padding: 0 20px;
  gap: 0;
}
.bb-preview-code-tab {
  padding: 8px 14px;
  font-size: 12px;
  border: none;
  background: transparent;
  color: var(--bb-muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all 0.15s;
}
.bb-preview-code-tab--active {
  color: var(--bb-gold);
  border-bottom-color: var(--bb-gold);
  font-weight: 600;
}

.bb-preview-sandpack-wrap {
  padding: 0;
  overflow: hidden;
}

.bb-preview-pr-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 20px;
  background: var(--bb-surface-hover);
  margin: 0;
  border-top: 1px solid var(--bb-border);
}
.bb-preview-pr-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}
.bb-preview-pr-label {
  color: var(--bb-muted);
  min-width: 60px;
}
.bb-preview-pr-value {
  color: var(--bb-text);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.bb-preview-success {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  background: rgba(34, 197, 94, 0.08);
  border-top: 1px solid rgba(34, 197, 94, 0.2);
  font-size: 13px;
  color: #4ade80;
}
.bb-preview-pr-link {
  color: var(--bb-gold);
  text-decoration: underline;
  font-size: 12px;
  margin-left: auto;
}
.bb-preview-pr-link:hover {
  opacity: 0.8;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/payload/BlocksBuilder/styles.css
git commit -m "feat(ui): add AIPreviewPanel CSS to BlocksBuilder styles"
```

---

## Task 9: Modify `AIGeneratorModal.tsx` — Add Phase 2 Transition

**Files:**
- Modify: `src/components/payload/BlocksBuilder/AIGeneratorModal.tsx`

Add Phase 2 state. When the generate API returns `mode: 'code'` (production), transition to showing `AIPreviewPanel` instead of calling `onBlocksGenerated()`.

- [ ] **Step 1: Add Phase 2 state and import**

At the top of `AIGeneratorModal.tsx`, add the import after the existing imports:

```typescript
import { AIPreviewPanel } from './AIPreviewPanel'
import type { GenerateResponseWithCode } from '@/lib/ai/types'
```

- [ ] **Step 2: Add preview state to the component**

Inside the `AIGeneratorModal` function, after the existing `useState` declarations, add:

```typescript
const [previewBlocks, setPreviewBlocks] = useState<GenerateResponseWithCode['blocks'] | null>(null)
```

- [ ] **Step 3: Update `handleGenerate` to handle `mode: 'code'` response**

Replace the existing `try` block inside `handleGenerate` (starting at `const response = await fetch('/api/ai-generate-block'...`) with:

```typescript
    try {
      const response = await fetch('/api/ai-generate-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          mode,
          provider: settings.provider,
          model: settings.model,
          apiKey: settings.apiKey,
        }),
      })

      const data = await response.json() as
        | { success: boolean; mode?: 'code'; blocks?: GenerateResponseWithCode['blocks'] & Array<{ blockType: string; defaultValues: Record<string, unknown> }>; error?: string }

      if (!data.success) throw new Error(data.error ?? 'Generation failed')

      // Production path: show Sandpack preview panel
      if (data.mode === 'code' && data.blocks) {
        setStatus('done')
        setStatusMessage(`✅ ${data.blocks.length} block${data.blocks.length !== 1 ? 's' : ''} generated!`)
        setTimeout(() => {
          setPreviewBlocks(data.blocks as GenerateResponseWithCode['blocks'])
          setStatus('idle')
          setStatusMessage('')
        }, 400)
        return
      }

      // Local dev path: blocks were written to disk
      setStatus('done')
      setStatusMessage(`✅ ${data.blocks!.length} block${data.blocks!.length !== 1 ? 's' : ''} generated!`)

      setTimeout(() => {
        onBlocksGenerated(data.blocks as Array<{ blockType: string; defaultValues: Record<string, unknown> }>)
        onClose()
        setStatus('idle')
        setStatusMessage('')
        setPrompt('')
      }, 600)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setStatus('error')
      setError(message)
    }
```

- [ ] **Step 4: Add Phase 2 rendering**

In the JSX, wrap the existing return inside `<AnimatePresence>` and add a conditional for `previewBlocks`. Replace the existing `return (` block's content with:

```tsx
  return (
    <AnimatePresence mode="wait">
      {isOpen && !previewBlocks && (
        <motion.div
          key="generate-phase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={isLoading ? undefined : onClose}
          className="bb-modal-overlay"
        >
          <motion.div
            initial={{ scale: 0.95, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 24, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bb-modal-card"
          >
            {/* === EXISTING MODAL CONTENT (unchanged) === */}
            {/* ... keep all existing header, provider, model, apiKey, mode, prompt, error, footer JSX ... */}
          </motion.div>
        </motion.div>
      )}

      {isOpen && previewBlocks && (
        <motion.div
          key="preview-phase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bb-modal-overlay"
        >
          <motion.div
            initial={{ scale: 0.95, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 24, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bb-modal-card bb-modal-card--wide"
          >
            <AIPreviewPanel
              blocks={previewBlocks}
              prompt={prompt}
              provider={settings.provider}
              model={settings.model}
              onBack={() => {
                setPreviewBlocks(null)
                setStatus('idle')
                setStatusMessage('')
              }}
              onClose={() => {
                setPreviewBlocks(null)
                setStatus('idle')
                setStatusMessage('')
                setPrompt('')
                onClose()
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
```

- [ ] **Step 5: Add wider modal variant to styles.css**

Append to `src/components/payload/BlocksBuilder/styles.css`:

```css
.bb-modal-card--wide {
  max-width: 900px;
  width: 95vw;
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/payload/BlocksBuilder/AIGeneratorModal.tsx src/components/payload/BlocksBuilder/styles.css
git commit -m "feat(ui): AIGeneratorModal transitions to AIPreviewPanel in production mode"
```

---

## Task 10: Configure Environment Variables

**Files:** Vercel Dashboard (no code file)

- [ ] **Step 1: Create a GitHub Personal Access Token**

Go to: https://github.com/settings/tokens/new
- Token name: `chambers-ai-block-generator`
- Expiration: 1 year
- Scopes: `repo` (full) — covers `contents` read/write and `pull_requests` write

Copy the token — it won't be shown again.

- [ ] **Step 2: Add to local `.env.local` for testing**

```bash
# Add to .env.local (never commit this)
GITHUB_PAT=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=aryannayak2901
GITHUB_REPO=chambers-of-jeetbhatt
```

- [ ] **Step 3: Add to Vercel Dashboard**

Go to: Vercel Project → Settings → Environment Variables
Add all three variables for `Production` and `Preview` environments:
- `GITHUB_PAT` = (your token)
- `GITHUB_OWNER` = `aryannayak2901`
- `GITHUB_REPO` = `chambers-of-jeetbhatt`

- [ ] **Step 4: Verify `.gitignore` covers `.env.local`**

```bash
grep ".env.local" .gitignore
```

Expected output: `.env.local` (already present — this project has it)

---

## Task 11: End-to-End Verification

- [ ] **Step 1: Test local dev path still works**

```bash
yarn dev
```

Open http://localhost:3000/admin → Pages → a page → BlocksBuilder → ✨ Generate.
Expected: blocks still get written to disk (fileWriter path), modal closes, block appears in library.

- [ ] **Step 2: Simulate production path locally**

In `src/app/api/ai-generate-block/route.ts`, temporarily change `process.env.NODE_ENV === 'production'` to `true`.
Generate a block. Expected: modal transitions to `AIPreviewPanel` with Sandpack rendering the component.

- [ ] **Step 3: Test GitHub PR creation locally**

With `.env.local` configured with a real `GITHUB_PAT`, click "Open Pull Request on GitHub" in the preview panel.
Expected: 
- Response in ~3–8 seconds
- PR URL shown in the panel
- PR appears on https://github.com/aryannayak2901/chambers-of-jeetbhatt/pulls
- PR contains 4 changed files

- [ ] **Step 4: Verify PR contents on GitHub**

Open the created PR. Check:
- `src/components/blocks/{ComponentName}.tsx` exists with valid TSX
- `src/blocks/{ComponentName}.ts` exists with a valid Payload block export
- `src/components/RenderBlocks.tsx` has new import + map entry
- `src/collections/Pages.ts` has new import + blocks[] entry

- [ ] **Step 5: Merge PR and verify Vercel build**

Merge the test PR. Wait for Vercel build (2–5 min).
Expected: Build succeeds. New block appears in the BlocksBuilder block library on the live site.

- [ ] **Step 6: Revert simulation change and push**

```bash
# Revert the temporary NODE_ENV change in the route
git add src/app/api/ai-generate-block/route.ts
git commit -m "chore: revert dev simulation, production check is back to NODE_ENV"
git push origin main
```

---

## Task 12: Final Commit & Push

- [ ] **Step 1: Ensure all files are committed**

```bash
git status
```

Expected: nothing to commit, working tree clean.

- [ ] **Step 2: Push to main**

```bash
git push origin main
```

Expected: Vercel auto-deploys. After build completes, the GitOps AI block generator is live in production.
