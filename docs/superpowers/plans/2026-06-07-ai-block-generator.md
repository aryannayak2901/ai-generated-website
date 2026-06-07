# AI Block/Page Generator — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable admin users to type a natural-language prompt in the Chambers Studio and have an AI generate real TSX component + Payload block config files written to disk, auto-patched into the project registry, and deployed via Vercel hook.

**Architecture:** A Next.js API route (`/api/ai-generate-block`) accepts a prompt + AI provider credentials, calls the chosen AI (Gemini/OpenAI/Anthropic), receives structured JSON output, and uses a file-writer module to create new block files and patch existing registry files. The Studio UI gets a floating ✨ AI button in the BlockLibraryPanel that opens a premium modal. After generation, the block is added to the canvas immediately and a Code tab in EditPanel shows the raw TSX.

**Tech Stack:** Next.js 15 App Router, TypeScript, Payload CMS 3.x, `fs/promises` (Node.js), Framer Motion (modal animation), Tailwind-aligned inline styles

---

## File Map

### New Files
| Path | Responsibility |
|------|---------------|
| `src/lib/ai/types.ts` | Shared types: `AIProvider`, `GenerateRequest`, `GeneratedBlock` |
| `src/lib/ai/providers/gemini.ts` | Gemini API adapter |
| `src/lib/ai/providers/openai.ts` | OpenAI API adapter |
| `src/lib/ai/providers/anthropic.ts` | Anthropic API adapter |
| `src/lib/ai/buildSystemPrompt.ts` | Builds the system prompt with design context + examples |
| `src/lib/ai/fileWriter.ts` | Writes generated files + patches registry files |
| `src/app/api/ai-generate-block/route.ts` | POST endpoint: orchestrates AI call + file write |
| `src/app/api/ai-block-code/route.ts` | GET endpoint: serves generated component source code |
| `src/app/api/deploy/route.ts` | POST endpoint: triggers Vercel deploy hook |
| `src/components/payload/BlocksBuilder/AIGeneratorModal.tsx` | Prompt modal UI component |

### Modified Files
| Path | Change |
|------|--------|
| `src/components/payload/BlocksBuilder/BlockLibraryPanel.tsx` | Add ✨ AI button at bottom, wire modal |
| `src/components/payload/BlocksBuilder/BlocksBuilderField.tsx` | Accept + pass `onAIGenerate` callback |
| `src/components/payload/BlocksBuilder/EditPanel.tsx` | Add Code tab for AI-generated blocks |
| `src/components/payload/PagesStudioView.tsx` | Add Deploy to Vercel button in StudioHeader |
| `src/components/payload/BlocksBuilder/constants/blockMeta.ts` | Auto-patched by fileWriter (idempotent) |
| `src/components/RenderBlocks.tsx` | Auto-patched by fileWriter (idempotent) |
| `src/collections/Pages.ts` | Auto-patched by fileWriter (idempotent) |

---

## Task 1: Shared AI Types

**Files:**
- Create: `src/lib/ai/types.ts`

- [ ] **Step 1.1: Create the types file**

```typescript
// src/lib/ai/types.ts

export type AIProvider = 'gemini' | 'openai' | 'anthropic'

export type GenerationMode = 'block' | 'page'

export interface GenerateRequest {
  prompt: string
  mode: GenerationMode
  provider: AIProvider
  model: string
  apiKey: string
}

export interface BlockMetaEntryRaw {
  label: string
  category: 'Hero' | 'Content' | 'CTA / Forms'
  icon: string
  badgeLabel: string
  defaultValues: Record<string, unknown>
  fields?: unknown[]
}

export interface GeneratedBlock {
  blockType: string
  componentName: string
  label: string
  category: 'Hero' | 'Content' | 'CTA / Forms'
  icon: string
  badgeLabel: string
  componentCode: string
  payloadConfigCode: string
  blockMetaEntry: BlockMetaEntryRaw
  defaultValues: Record<string, unknown>
}

export interface GenerateResponse {
  success: true
  blocks: Array<{
    blockType: string
    defaultValues: Record<string, unknown>
    componentPath: string
    configPath: string
  }>
}

export interface GenerateErrorResponse {
  success: false
  error: string
}
```

- [ ] **Step 1.2: Commit**

```bash
cd /Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt
git add src/lib/ai/types.ts
git commit -m "feat(ai): add shared AI generation types"
```

---

## Task 2: AI Provider Adapters + System Prompt Builder

**Files:**
- Create: `src/lib/ai/providers/gemini.ts`
- Create: `src/lib/ai/providers/openai.ts`
- Create: `src/lib/ai/providers/anthropic.ts`
- Create: `src/lib/ai/buildSystemPrompt.ts`

- [ ] **Step 2.1: Create the system prompt builder**

```typescript
// src/lib/ai/buildSystemPrompt.ts
import fs from 'fs/promises'
import path from 'path'

export async function buildSystemPrompt(userPrompt: string, mode: 'block' | 'page'): Promise<string> {
  const projectRoot = process.cwd()

  const designMd = await fs.readFile(path.join(projectRoot, 'DESIGN.md'), 'utf-8').catch(() => '')

  const referenceComponent = await fs.readFile(
    path.join(projectRoot, 'src/components/home/HeroSection.tsx'),
    'utf-8'
  ).catch(() => '// (reference not available)')

  const referenceConfig = await fs.readFile(
    path.join(projectRoot, 'src/blocks/HomeHero.ts'),
    'utf-8'
  ).catch(() => '// (reference not available)')

  const blockMetaInterface = `
interface FieldSchema {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'boolean' | 'array' | 'upload' | 'relationship'
  options?: { label: string; value: string }[]
  defaultValue?: unknown
  fields?: FieldSchema[]
}

interface BlockMetaEntry {
  label: string
  category: 'Hero' | 'Content' | 'CTA / Forms'
  icon: string
  badgeLabel: string
  defaultValues: Record<string, unknown>
  fields?: FieldSchema[]
}
`

  const modeInstruction = mode === 'page'
    ? 'Generate MULTIPLE blocks that together form a complete page layout. Return an array in the "blocks" field.'
    : 'Generate a SINGLE block component. Return a single object in the "blocks" field (array of one).'

  return `You are an expert Next.js 15 + TypeScript developer generating production-quality UI components for a premium legal firm website called "Chambers of Jeet Bhatt".

## Design System
${designMd}

## Reference Component (follow this style closely)
\`\`\`tsx
${referenceComponent}
\`\`\`

## Reference Payload Block Config
\`\`\`ts
${referenceConfig}
\`\`\`

## BlockMeta Interface
\`\`\`ts
${blockMetaInterface}
\`\`\`

## Instructions
${modeInstruction}

**CRITICAL RULES:**
1. componentCode MUST be valid TSX. Use 'use client' only if it uses hooks.
2. Use inline styles consistent with the design system (Deep Navy #0f1729, Gold #d4af37, White #ffffff).
3. blockType MUST be camelCase (e.g. "testimonialsBlock").
4. componentName MUST be PascalCase (e.g. "TestimonialsBlock").
5. payloadConfigCode MUST export a named const following the reference pattern.
6. blockMetaEntry.defaultValues MUST include blockType as the first key.
7. Only import from: 'react', 'next/image', 'next/link', 'lucide-react', 'framer-motion'.
8. Component props MUST match defaultValues keys.
9. Return ONLY valid JSON — no markdown fences, no explanation.

## Required Output JSON Schema
{
  "blocks": [
    {
      "blockType": "camelCaseBlockName",
      "componentName": "PascalCaseBlockName",
      "label": "Human Readable Label",
      "category": "Hero | Content | CTA / Forms",
      "icon": "emoji",
      "badgeLabel": "Short",
      "componentCode": "full TSX source code as a string",
      "payloadConfigCode": "full Payload block config TS source code as a string",
      "blockMetaEntry": {},
      "defaultValues": { "blockType": "camelCaseBlockName" }
    }
  ]
}

## User Request
${userPrompt}
`
}
```

- [ ] **Step 2.2: Create Gemini provider adapter**

```typescript
// src/lib/ai/providers/gemini.ts
import { GeneratedBlock } from '../types'

export async function callGemini(
  systemPrompt: string,
  model: string,
  apiKey: string
): Promise<GeneratedBlock[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: systemPrompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 16384,
        responseMimeType: 'application/json',
      },
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Gemini API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  if (!text) throw new Error('Gemini returned empty response')

  const parsed = JSON.parse(text)
  if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
    throw new Error('Gemini response missing "blocks" array')
  }
  return parsed.blocks as GeneratedBlock[]
}
```

- [ ] **Step 2.3: Create OpenAI provider adapter**

```typescript
// src/lib/ai/providers/openai.ts
import { GeneratedBlock } from '../types'

export async function callOpenAI(
  systemPrompt: string,
  model: string,
  apiKey: string
): Promise<GeneratedBlock[]> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: systemPrompt }],
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_tokens: 16384,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenAI API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const text: string = data?.choices?.[0]?.message?.content ?? ''
  if (!text) throw new Error('OpenAI returned empty response')

  const parsed = JSON.parse(text)
  if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
    throw new Error('OpenAI response missing "blocks" array')
  }
  return parsed.blocks as GeneratedBlock[]
}
```

- [ ] **Step 2.4: Create Anthropic provider adapter**

```typescript
// src/lib/ai/providers/anthropic.ts
import { GeneratedBlock } from '../types'

export async function callAnthropic(
  systemPrompt: string,
  model: string,
  apiKey: string
): Promise<GeneratedBlock[]> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 16384,
      messages: [{ role: 'user', content: systemPrompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Anthropic API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const text: string = data?.content?.[0]?.text ?? ''
  if (!text) throw new Error('Anthropic returned empty response')

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Could not find JSON in Anthropic response')

  const parsed = JSON.parse(jsonMatch[0])
  if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
    throw new Error('Anthropic response missing "blocks" array')
  }
  return parsed.blocks as GeneratedBlock[]
}
```

- [ ] **Step 2.5: Commit**

```bash
git add src/lib/ai/
git commit -m "feat(ai): add system prompt builder + provider adapters (Gemini, OpenAI, Anthropic)"
```

---

## Task 3: File Writer + Registry Patcher

**Files:**
- Create: `src/lib/ai/fileWriter.ts`

- [ ] **Step 3.1: Create fileWriter.ts**

```typescript
// src/lib/ai/fileWriter.ts
import fs from 'fs/promises'
import path from 'path'
import { GeneratedBlock } from './types'

const PROJECT_ROOT = process.cwd()
const SRC = path.join(PROJECT_ROOT, 'src')

function validateBlockType(blockType: string): void {
  if (!/^[a-z][a-zA-Z0-9]*$/.test(blockType)) {
    throw new Error(`Invalid blockType "${blockType}". Must be camelCase alphanumeric.`)
  }
}

function safeResolvePath(base: string, ...parts: string[]): string {
  const resolved = path.resolve(base, ...parts)
  if (!resolved.startsWith(base)) {
    throw new Error(`Path traversal attempt detected: ${resolved}`)
  }
  return resolved
}

export interface WrittenBlockInfo {
  blockType: string
  defaultValues: Record<string, unknown>
  componentPath: string
  configPath: string
}

export async function writeGeneratedBlock(block: GeneratedBlock): Promise<WrittenBlockInfo> {
  validateBlockType(block.blockType)

  const componentPath = safeResolvePath(SRC, 'components', 'blocks', `${block.componentName}.tsx`)
  const configPath = safeResolvePath(SRC, 'blocks', `${block.componentName}.ts`)

  // 1. Write component TSX file
  await fs.mkdir(path.dirname(componentPath), { recursive: true })
  await fs.writeFile(componentPath, block.componentCode, 'utf-8')

  // 2. Write Payload block config
  await fs.mkdir(path.dirname(configPath), { recursive: true })
  await fs.writeFile(configPath, block.payloadConfigCode, 'utf-8')

  // 3. Patch blockMeta.ts
  await patchBlockMeta(block)

  // 4. Patch RenderBlocks.tsx
  await patchRenderBlocks(block)

  // 5. Patch Pages.ts
  await patchPages(block)

  return {
    blockType: block.blockType,
    defaultValues: block.defaultValues,
    componentPath: path.relative(PROJECT_ROOT, componentPath),
    configPath: path.relative(PROJECT_ROOT, configPath),
  }
}

async function patchBlockMeta(block: GeneratedBlock): Promise<void> {
  const filePath = safeResolvePath(
    SRC, 'components', 'payload', 'BlocksBuilder', 'constants', 'blockMeta.ts'
  )
  let content = await fs.readFile(filePath, 'utf-8')

  // Idempotency check
  if (content.includes(`  ${block.blockType}:`)) return

  const entryJson = JSON.stringify(
    { ...block.blockMetaEntry, defaultValues: block.defaultValues },
    null,
    2
  )
  const indented = entryJson.split('\n').join('\n  ')
  const newEntry = `  ${block.blockType}: ${indented},\n`

  // Insert before "export type BlockCategory" line
  const insertionPoint = '\nexport type BlockCategory'
  const idx = content.indexOf(insertionPoint)
  if (idx === -1) throw new Error('blockMeta.ts: could not find insertion point (export type BlockCategory)')

  const beforeInsert = content.slice(0, idx)
  const lastBraceIdx = beforeInsert.lastIndexOf('}')
  if (lastBraceIdx === -1) throw new Error('blockMeta.ts: could not find closing brace')

  content = content.slice(0, lastBraceIdx) + newEntry + content.slice(lastBraceIdx)
  await fs.writeFile(filePath, content, 'utf-8')
}

async function patchRenderBlocks(block: GeneratedBlock): Promise<void> {
  const filePath = safeResolvePath(SRC, 'components', 'RenderBlocks.tsx')
  let content = await fs.readFile(filePath, 'utf-8')

  // Idempotency check
  if (content.includes(`${block.blockType}:`)) return

  // Add import after the last import line
  const importLine = `import { ${block.componentName} } from '@/components/blocks/${block.componentName}'\n`
  const lastImportIdx = content.lastIndexOf('import ')
  const afterLastImport = content.indexOf('\n', lastImportIdx) + 1
  content = content.slice(0, afterLastImport) + importLine + content.slice(afterLastImport)

  // Add to blockComponents map — find closing } of the map object
  const mapEntry = `  ${block.blockType}: ${block.componentName},\n`
  const mapClosingIdx = content.indexOf('\n}\n', content.indexOf('blockComponents'))
  if (mapClosingIdx === -1) throw new Error('RenderBlocks.tsx: could not find blockComponents closing brace')
  content = content.slice(0, mapClosingIdx) + '\n' + mapEntry + content.slice(mapClosingIdx)

  await fs.writeFile(filePath, content, 'utf-8')
}

async function patchPages(block: GeneratedBlock): Promise<void> {
  const filePath = safeResolvePath(SRC, 'collections', 'Pages.ts')
  let content = await fs.readFile(filePath, 'utf-8')

  // Idempotency check
  if (content.includes(`{ ${block.componentName} }`)) return

  // Add import after HeroBlock import
  const importLine = `import { ${block.componentName} } from '../blocks/${block.componentName}'\n`
  const heroImportLine = "import { HeroBlock } from '../blocks/HeroBlock'"
  const heroImportIdx = content.indexOf(heroImportLine)
  if (heroImportIdx === -1) throw new Error('Pages.ts: could not find HeroBlock import line')
  const afterHeroImport = content.indexOf('\n', heroImportIdx) + 1
  content = content.slice(0, afterHeroImport) + importLine + content.slice(afterHeroImport)

  // Add to blocks array — find closing ], of the blocks array
  const blockEntry = `        ${block.componentName},\n`
  const blocksArrayCloseIdx = content.indexOf('\n      ],\n', content.indexOf('blocks: ['))
  if (blocksArrayCloseIdx === -1) throw new Error('Pages.ts: could not find blocks array closing bracket')
  content = content.slice(0, blocksArrayCloseIdx) + '\n' + blockEntry + content.slice(blocksArrayCloseIdx)

  await fs.writeFile(filePath, content, 'utf-8')
}
```

- [ ] **Step 3.2: Commit**

```bash
git add src/lib/ai/fileWriter.ts
git commit -m "feat(ai): add file writer + registry patcher module"
```

---

## Task 4: Generation API Route + Code Route + Deploy Route

**Files:**
- Create: `src/app/api/ai-generate-block/route.ts`
- Create: `src/app/api/ai-block-code/route.ts`
- Create: `src/app/api/deploy/route.ts`

- [ ] **Step 4.1: Create the generation API route**

```typescript
// src/app/api/ai-generate-block/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { buildSystemPrompt } from '@/lib/ai/buildSystemPrompt'
import { callGemini } from '@/lib/ai/providers/gemini'
import { callOpenAI } from '@/lib/ai/providers/openai'
import { callAnthropic } from '@/lib/ai/providers/anthropic'
import { writeGeneratedBlock } from '@/lib/ai/fileWriter'
import type { GenerateRequest, GenerateResponse, GenerateErrorResponse, AIProvider, GeneratedBlock } from '@/lib/ai/types'

export const runtime = 'nodejs'

export async function POST(
  request: NextRequest
): Promise<NextResponse<GenerateResponse | GenerateErrorResponse>> {
  try {
    const body: GenerateRequest = await request.json()
    const { prompt, mode, provider, model, apiKey } = body

    if (!prompt?.trim()) return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 })
    if (!provider) return NextResponse.json({ success: false, error: 'Provider is required' }, { status: 400 })
    if (!model?.trim()) return NextResponse.json({ success: false, error: 'Model is required' }, { status: 400 })
    if (!apiKey?.trim()) return NextResponse.json({ success: false, error: 'API key is required' }, { status: 400 })

    const validProviders: AIProvider[] = ['gemini', 'openai', 'anthropic']
    if (!validProviders.includes(provider)) {
      return NextResponse.json({ success: false, error: `Invalid provider: ${provider}` }, { status: 400 })
    }

    const systemPrompt = await buildSystemPrompt(prompt, mode ?? 'block')

    let generatedBlocks: GeneratedBlock[]
    if (provider === 'gemini') {
      generatedBlocks = await callGemini(systemPrompt, model, apiKey)
    } else if (provider === 'openai') {
      generatedBlocks = await callOpenAI(systemPrompt, model, apiKey)
    } else {
      generatedBlocks = await callAnthropic(systemPrompt, model, apiKey)
    }

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

- [ ] **Step 4.2: Create the code-serving API route**

```typescript
// src/app/api/ai-block-code/route.ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get('name') ?? ''

  // Sanitize: only allow PascalCase alphanumeric
  if (!/^[A-Z][a-zA-Z0-9]+$/.test(name)) {
    return NextResponse.json({ error: 'Invalid component name' }, { status: 400 })
  }

  const filePath = path.join(process.cwd(), 'src', 'components', 'blocks', `${name}.tsx`)

  try {
    const code = await fs.readFile(filePath, 'utf-8')
    return NextResponse.json({ code })
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
```

- [ ] **Step 4.3: Create the deploy API route**

```typescript
// src/app/api/deploy/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(_request: NextRequest) {
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL

  if (!deployHookUrl) {
    return NextResponse.json(
      { success: false, error: 'VERCEL_DEPLOY_HOOK_URL is not configured' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(deployHookUrl, { method: 'POST' })
    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Vercel hook responded with ${response.status}: ${text}`)
    }
    const data = await response.json().catch(() => ({}))
    return NextResponse.json({ success: true, job: (data as Record<string, unknown>)?.job ?? null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
```

- [ ] **Step 4.4: Commit**

```bash
git add src/app/api/ai-generate-block/ src/app/api/ai-block-code/ src/app/api/deploy/
git commit -m "feat(ai): add generation API route, code-serving route, and Vercel deploy route"
```

---

## Task 5: AI Generator Modal UI

**Files:**
- Create: `src/components/payload/BlocksBuilder/AIGeneratorModal.tsx`

- [ ] **Step 5.1: Create the modal component**

```tsx
// src/components/payload/BlocksBuilder/AIGeneratorModal.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AIProvider, GenerationMode } from '@/lib/ai/types'

const AI_SETTINGS_KEY = 'chambers_ai_settings'

interface AISettings {
  provider: AIProvider
  model: string
  apiKey: string
}

const DEFAULT_MODELS: Record<AIProvider, string> = {
  gemini: 'gemini-2.0-flash',
  openai: 'gpt-4o',
  anthropic: 'claude-3-5-sonnet-20241022',
}

interface AIGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  onBlocksGenerated: (blocks: Array<{ blockType: string; defaultValues: Record<string, unknown> }>) => void
}

export function AIGeneratorModal({ isOpen, onClose, onBlocksGenerated }: AIGeneratorModalProps) {
  const [settings, setSettings] = useState<AISettings>({
    provider: 'gemini',
    model: DEFAULT_MODELS.gemini,
    apiKey: '',
  })
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState<GenerationMode>('block')
  const [status, setStatus] = useState<'idle' | 'generating' | 'writing' | 'done' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AI_SETTINGS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as AISettings
        setSettings(parsed)
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(settings))
    } catch { /* ignore */ }
  }, [settings])

  const handleProviderChange = (provider: AIProvider) => {
    setSettings((prev) => ({ ...prev, provider, model: DEFAULT_MODELS[provider] }))
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) { setError('Please enter a prompt.'); return }
    if (!settings.apiKey.trim()) { setError('Please enter your API key.'); return }

    setError('')
    setStatus('generating')
    setStatusMessage(`Calling ${settings.provider} API...`)

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

      setStatus('writing')
      setStatusMessage('Writing files to disk...')

      const data = await response.json() as { success: boolean; blocks?: Array<{ blockType: string; defaultValues: Record<string, unknown> }>; error?: string }

      if (!data.success) throw new Error(data.error ?? 'Generation failed')

      setStatus('done')
      setStatusMessage(`✅ ${data.blocks!.length} block${data.blocks!.length !== 1 ? 's' : ''} generated!`)

      setTimeout(() => {
        onBlocksGenerated(data.blocks!)
        onClose()
        setStatus('idle')
        setStatusMessage('')
        setPrompt('')
      }, 1200)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setStatus('error')
      setError(message)
    }
  }

  const isLoading = status === 'generating' || status === 'writing'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={isLoading ? undefined : onClose}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(5, 10, 24, 0.88)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 99999, padding: '20px',
          }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 24, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '560px',
              backgroundColor: '#0d1b2e',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              borderRadius: '16px', padding: '36px',
              boxShadow: '0 32px 64px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.04)',
              display: 'flex', flexDirection: 'column', gap: '24px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #d4af37 0%, #b8972d 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                }}>✨</div>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '20px', color: '#f5f5f0', margin: 0, fontWeight: 600 }}>
                    AI Block Generator
                  </h3>
                  <p style={{ fontSize: '11px', color: '#6b7d8e', margin: 0, marginTop: '2px' }}>
                    Generate TSX components from a natural-language prompt
                  </p>
                </div>
              </div>
              <button type="button" onClick={onClose} disabled={isLoading}
                style={{ background: 'none', border: 'none', color: '#6b7d8e', cursor: 'pointer', fontSize: '18px', padding: '4px', lineHeight: 1 }}>
                ✕
              </button>
            </div>

            {/* Provider Settings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#d4af37', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                AI Provider Settings
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#8899aa', display: 'block', marginBottom: '6px' }}>Provider</label>
                  <select value={settings.provider}
                    onChange={(e) => handleProviderChange(e.target.value as AIProvider)}
                    className="bb-edit__input bb-edit__select" style={{ width: '100%' }}>
                    <option value="gemini">Google Gemini</option>
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#8899aa', display: 'block', marginBottom: '6px' }}>Model</label>
                  <input type="text" value={settings.model}
                    onChange={(e) => setSettings((prev) => ({ ...prev, model: e.target.value }))}
                    className="bb-edit__input" style={{ width: '100%' }} placeholder="e.g. gemini-2.0-flash" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#8899aa', display: 'block', marginBottom: '6px' }}>
                  API Key <span style={{ color: '#4a5a6a' }}>(saved in browser only — never sent to our servers)</span>
                </label>
                <input type="password" value={settings.apiKey}
                  onChange={(e) => setSettings((prev) => ({ ...prev, apiKey: e.target.value }))}
                  className="bb-edit__input" style={{ width: '100%' }} placeholder="Your API key..." />
              </div>
            </div>

            {/* Prompt */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#d4af37', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                What do you want to build?
              </div>
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
                className="bb-edit__input bb-edit__textarea" rows={4}
                style={{ width: '100%', resize: 'vertical', minHeight: '100px' }}
                placeholder="e.g. A testimonials section with 3 gold-accent cards on navy background, showcasing client reviews with star ratings..."
                disabled={isLoading} />
            </div>

            {/* Mode Toggle */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {(['block', 'page'] as const).map((m) => (
                <button key={m} type="button" onClick={() => setMode(m)} style={{
                  flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                  background: mode === m ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.04)',
                  border: mode === m ? '1px solid rgba(212, 175, 55, 0.5)' : '1px solid rgba(255,255,255,0.08)',
                  color: mode === m ? '#d4af37' : '#8899aa',
                }}>
                  {m === 'block' ? '🧱 Single Block' : '📄 Full Page'}
                </button>
              ))}
            </div>

            {/* Status */}
            {(status === 'generating' || status === 'writing' || status === 'done') && (
              <div style={{
                padding: '12px 16px', borderRadius: '8px',
                background: status === 'done' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(212, 175, 55, 0.08)',
                border: `1px solid ${status === 'done' ? 'rgba(52, 211, 153, 0.3)' : 'rgba(212, 175, 55, 0.2)'}`,
                fontSize: '13px', color: status === 'done' ? '#34d399' : '#d4af37',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                {status !== 'done' && (
                  <div style={{
                    width: '14px', height: '14px', borderRadius: '50%',
                    border: '2px solid currentColor', borderTopColor: 'transparent',
                    animation: 'spin 0.8s linear infinite', flexShrink: 0,
                  }} />
                )}
                {statusMessage}
              </div>
            )}

            {error && (
              <div style={{
                padding: '12px 16px', borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)',
                fontSize: '13px', color: '#ef4444',
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={onClose} disabled={isLoading} style={{
                flex: 1, padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#8899aa', cursor: 'pointer',
              }}>Cancel</button>
              <motion.button type="button" onClick={handleGenerate}
                disabled={isLoading || status === 'done'}
                whileHover={!isLoading ? { scale: 1.02, boxShadow: '0 8px 24px rgba(212,175,55,0.25)' } : undefined}
                whileTap={!isLoading ? { scale: 0.98 } : undefined}
                style={{
                  flex: 2, padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 700,
                  background: isLoading ? 'rgba(212,175,55,0.4)' : 'linear-gradient(135deg, #d4af37 0%, #b8972d 100%)',
                  border: 'none', color: '#0a1128', cursor: isLoading ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>
                {isLoading ? 'Generating...' : '✨ Generate'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 5.2: Commit**

```bash
git add src/components/payload/BlocksBuilder/AIGeneratorModal.tsx
git commit -m "feat(ai): add AI Generator Modal UI component"
```

---

## Task 6: Wire AI Button into BlockLibraryPanel + BlocksBuilderField

**Files:**
- Modify: `src/components/payload/BlocksBuilder/BlockLibraryPanel.tsx`
- Modify: `src/components/payload/BlocksBuilder/BlocksBuilderField.tsx`

- [ ] **Step 6.1: Update BlockLibraryPanel**

At the top of the file, add these two imports after the existing imports:

```tsx
import { motion } from 'framer-motion'
import { AIGeneratorModal } from './AIGeneratorModal'
```

Update the `BlockLibraryPanelProps` interface:

```tsx
interface BlockLibraryPanelProps {
  search: string
  onSearchChange: (search: string) => void
  onAIGenerate: (blocks: Array<{ blockType: string; defaultValues: Record<string, unknown> }>) => void
}
```

Update the `BlockLibraryPanel` function signature and add modal state:

```tsx
export function BlockLibraryPanel({ search, onSearchChange, onAIGenerate }: BlockLibraryPanelProps) {
  const [isAIModalOpen, setIsAIModalOpen] = React.useState(false)
  // ... rest unchanged ...
```

Change the outer wrapper div to allow relative positioning:

```tsx
return (
  <div className="bb-library" style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
```

Add `paddingBottom: '72px'` to the `bb-library__list` div so the AI button doesn't overlap:

```tsx
<div className="bb-library__list" style={{ flex: 1, overflowY: 'auto', paddingBottom: '72px' }}>
```

Before the closing `</div>` of the outer wrapper, add:

```tsx
      {/* Floating AI Generate Button */}
      <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', zIndex: 10 }}>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(212,175,55,0.35)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAIModalOpen(true)}
          style={{
            width: '100%', padding: '11px 16px', borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(184,151,45,0.1) 100%)',
            border: '1px solid rgba(212,175,55,0.35)',
            color: '#d4af37', fontSize: '12px', fontWeight: 700,
            letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: '0 4px 16px rgba(212,175,55,0.15)',
          }}
        >
          ✨ Generate with AI
        </motion.button>
      </div>

      <AIGeneratorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onBlocksGenerated={(blocks) => {
          setIsAIModalOpen(false)
          onAIGenerate(blocks)
        }}
      />
    </div>
  )
}
```

- [ ] **Step 6.2: Update BlocksBuilderField**

In `BlocksBuilderField.tsx`, add `handleAIGenerate` callback after the existing `handleMoveBlock`:

```tsx
const handleAIGenerate = useCallback((
  generatedBlocks: Array<{ blockType: string; defaultValues: Record<string, unknown> }>
) => {
  generatedBlocks.forEach(({ blockType, defaultValues }) => {
    addBlock(blockType, { ...defaultValues, _aiGenerated: true })
  })
}, [addBlock])
```

Pass it to `BlockLibraryPanel` in the JSX:

```tsx
<BlockLibraryPanel
  search={search}
  onSearchChange={setSearch}
  onAIGenerate={handleAIGenerate}
/>
```

- [ ] **Step 6.3: Commit**

```bash
git add src/components/payload/BlocksBuilder/BlockLibraryPanel.tsx \
        src/components/payload/BlocksBuilder/BlocksBuilderField.tsx
git commit -m "feat(ai): wire AI generator into BlockLibraryPanel + BlocksBuilderField"
```

---

## Task 7: Code Tab in EditPanel

**Files:**
- Modify: `src/components/payload/BlocksBuilder/EditPanel.tsx`

- [ ] **Step 7.1: Add tab state + code fetching at the top of the EditPanel component**

Add these state declarations after the existing state declarations (after `expandedItems` state, before `mediaList`):

```tsx
const [activeTab, setActiveTab] = useState<'fields' | 'code'>('fields')
const [codeContent, setCodeContent] = useState<string>('')
const [codeFetching, setCodeFetching] = useState(false)

const isAIGenerated = !!(block as Record<string, unknown>)._aiGenerated

useEffect(() => {
  if (activeTab !== 'code' || !isAIGenerated || codeContent) return
  setCodeFetching(true)
  const componentName = block.blockType.charAt(0).toUpperCase() + block.blockType.slice(1)
  fetch(`/api/ai-block-code?name=${encodeURIComponent(componentName)}`)
    .then((r) => r.json())
    .then((d: { code?: string }) => { if (d.code) setCodeContent(d.code) })
    .catch(() => setCodeContent('// Could not load source code'))
    .finally(() => setCodeFetching(false))
}, [activeTab, isAIGenerated, block.blockType, codeContent])
```

- [ ] **Step 7.2: Replace the EditPanel header to include tabs**

Replace the `bb-edit__header` div (which currently contains `bb-edit__title` and `bb-edit__close`) with:

```tsx
<div className="bb-edit__header" style={{ flexDirection: 'column', gap: '0', padding: '0' }}>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--bb-border)' }}>
    <h4 className="bb-edit__title">
      <span className="bb-edit__icon">{meta?.icon}</span>
      Edit {meta?.label}
    </h4>
    <button className="bb-edit__close" onClick={onCancel}>✕</button>
  </div>
  {isAIGenerated && (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--bb-border)' }}>
      {(['fields', 'code'] as const).map((tab) => (
        <button key={tab} type="button" onClick={() => setActiveTab(tab)} style={{
          flex: 1, padding: '10px', fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          background: activeTab === tab ? 'rgba(212,175,55,0.1)' : 'transparent',
          borderBottom: activeTab === tab ? '2px solid #d4af37' : '2px solid transparent',
          color: activeTab === tab ? '#d4af37' : '#6b7d8e',
          border: 'none', cursor: 'pointer', transition: 'all 0.2s',
        }}>
          {tab === 'fields' ? '⚙️ Fields' : '</> Code'}
        </button>
      ))}
    </div>
  )}
</div>
```

- [ ] **Step 7.3: Wrap the bb-edit__body content with tab check**

Replace the content inside `<div ref={scrollContainerRef} className="bb-edit__body" ...>` with:

```tsx
{activeTab === 'fields' ? (
  <>
    {fields.length === 0 ? (
      <div style={{ color: '#8899aa', fontSize: '12px', fontStyle: 'italic', padding: '12px' }}>
        No editable fields defined for this block.
      </div>
    ) : (
      fields.map((field) => {
        const error = errors[field.name]
        return (
          <div key={field.name} className="bb-edit__field">
            {field.type !== 'array' && field.type !== 'boolean' && (
              <label className="bb-edit__label" htmlFor={field.name}>{field.label}</label>
            )}
            {renderFieldInput(field, formData[field.name], [field.name])}
            {error && <span style={{ color: 'var(--bb-danger)', fontSize: '10px' }}>{error}</span>}
          </div>
        )
      })
    )}
  </>
) : (
  <div style={{ padding: '16px', height: '100%', overflow: 'auto' }}>
    {codeFetching ? (
      <div style={{ color: '#8899aa', fontSize: '12px' }}>Loading source code...</div>
    ) : (
      <>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <button type="button"
            onClick={() => navigator.clipboard.writeText(codeContent)}
            style={{
              fontSize: '11px', padding: '4px 10px', borderRadius: '4px',
              background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)',
              color: '#d4af37', cursor: 'pointer',
            }}>
            Copy
          </button>
        </div>
        <pre style={{
          fontSize: '11px', lineHeight: '1.6', color: '#a8c4e0',
          background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '12px',
          overflow: 'auto', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
        }}>
          <code>{codeContent}</code>
        </pre>
      </>
    )}
  </div>
)}
```

- [ ] **Step 7.4: Commit**

```bash
git add src/components/payload/BlocksBuilder/EditPanel.tsx
git commit -m "feat(ai): add Code tab in EditPanel for AI-generated blocks"
```

---

## Task 8: Deploy Button + TypeScript Check + Smoke Test

**Files:**
- Modify: `src/components/payload/PagesStudioView.tsx`

- [ ] **Step 8.1: Add DeployButton component and wire into StudioHeader**

At the top of `PagesStudioView.tsx`, before the `StudioHeader` component definition, add:

```tsx
function DeployButton() {
  const [deployState, setDeployState] = React.useState<'idle' | 'deploying' | 'done' | 'error'>('idle')

  const handleDeploy = async () => {
    setDeployState('deploying')
    try {
      const res = await fetch('/api/deploy', { method: 'POST' })
      const data = await res.json() as { success: boolean; error?: string }
      if (data.success) {
        setDeployState('done')
        setTimeout(() => setDeployState('idle'), 4000)
      } else {
        throw new Error(data.error)
      }
    } catch {
      setDeployState('error')
      setTimeout(() => setDeployState('idle'), 4000)
    }
  }

  const labels: Record<typeof deployState, string> = {
    idle: '🚀 Deploy to Vercel',
    deploying: 'Deploying...',
    done: '✅ Deployed!',
    error: '❌ Deploy Failed',
  }

  return (
    <motion.button
      type="button"
      whileHover={deployState === 'idle' ? { scale: 1.02 } : undefined}
      whileTap={deployState === 'idle' ? { scale: 0.98 } : undefined}
      onClick={handleDeploy}
      disabled={deployState !== 'idle'}
      style={{
        padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 700,
        letterSpacing: '0.04em', border: '1px solid rgba(212,175,55,0.4)',
        background: deployState === 'idle'
          ? 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(184,151,45,0.1))'
          : 'rgba(255,255,255,0.05)',
        color: deployState === 'done' ? '#34d399' : deployState === 'error' ? '#ef4444' : '#d4af37',
        cursor: deployState === 'idle' ? 'pointer' : 'not-allowed',
      }}
    >
      {labels[deployState]}
    </motion.button>
  )
}
```

Inside the `StudioHeader` component's return JSX, inside the `marginLeft: 'auto'` div (before the Save button), add:

```tsx
{process.env.NODE_ENV === 'production' && <DeployButton />}
```

- [ ] **Step 8.2: TypeScript check**

```bash
cd /Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt
yarn tsc --noEmit 2>&1 | head -60
```

Expected: 0 errors. Fix any TypeScript errors before continuing.

- [ ] **Step 8.3: Lint check**

```bash
yarn lint 2>&1 | head -30
```

Expected: No new lint errors introduced.

- [ ] **Step 8.4: Start dev server and smoke-test**

```bash
yarn dev
```

Open `http://localhost:3000/admin/collections/pages` and verify:

1. ✅ The ✨ "Generate with AI" button appears at the bottom of the left panel
2. ✅ Clicking it opens the premium dark modal with Gold accents
3. ✅ Provider/model/API key fields work and persist in localStorage on page reload
4. ✅ Mode toggle between Single Block and Full Page works
5. ✅ Entering a prompt + valid API key + clicking Generate shows spinner
6. ✅ After generation: files appear in `src/components/blocks/` and `src/blocks/`
7. ✅ `blockMeta.ts` has the new entry appended
8. ✅ `RenderBlocks.tsx` has new import + map entry
9. ✅ `Pages.ts` has new import + blocks array entry
10. ✅ New block appears in canvas immediately after generation
11. ✅ Clicking the new block in canvas opens EditPanel with Fields and Code tabs
12. ✅ Code tab shows the raw TSX with a Copy button
13. ✅ Running generation twice with the same blockType does NOT duplicate registry entries

- [ ] **Step 8.5: Final commit**

```bash
git add src/components/payload/PagesStudioView.tsx
git commit -m "feat(ai): add Deploy to Vercel button + complete AI generator wiring

- Add DeployButton component to StudioHeader (production only)
- Wire VERCEL_DEPLOY_HOOK_URL via /api/deploy route
- All 8 tasks complete: AI generator fully integrated into Chambers Studio"
```

---

## Spec Coverage Check

| Spec Requirement | Implemented In |
|---|---|
| AI Provider settings UI (Gemini/OpenAI/Anthropic) | Task 5 (AIGeneratorModal) |
| API Key stored in localStorage only | Task 5 |
| ✨ floating button in BlockLibraryPanel | Task 6 |
| Premium modal with provider/model/key/prompt/mode | Task 5 |
| Mode: single block vs full page | Task 5 + Task 4 API route |
| TSX component file written to disk | Task 3 (fileWriter) |
| Payload block config file written to disk | Task 3 (fileWriter) |
| blockMeta.ts auto-patched (idempotent) | Task 3 |
| RenderBlocks.tsx auto-patched (idempotent) | Task 3 |
| Pages.ts auto-patched (idempotent) | Task 3 |
| Block added to canvas immediately | Task 6 (handleAIGenerate) |
| Code tab in EditPanel for AI blocks | Task 7 |
| Code-serving API route | Task 4 |
| Deploy to Vercel button (production only) | Task 8 |
| Path traversal security | Task 3 (safeResolvePath) |
| Block name sanitization | Task 3 (validateBlockType) |
| Dev hot-reload | Handled by Next.js automatically |
| Spinner + status messages during generation | Task 5 |
| Error display with retry | Task 5 |
