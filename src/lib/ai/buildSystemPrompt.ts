import fs from 'fs/promises'
import path from 'path'

export async function buildSystemPrompt(userPrompt: string, mode: 'block' | 'page'): Promise<{ system: string, user: string }> {
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

  const renderBlocksTsx = await fs.readFile(
    path.join(projectRoot, 'src/components/RenderBlocks.tsx'),
    'utf-8'
  ).catch(() => '// (RenderBlocks not available)')

  const pagesTs = await fs.readFile(
    path.join(projectRoot, 'src/collections/Pages.ts'),
    'utf-8'
  ).catch(() => '// (Pages.ts not available)')

  const blockMetaTs = await fs.readFile(
    path.join(projectRoot, 'src/components/payload/BlocksBuilder/constants/blockMeta.ts'),
    'utf-8'
  ).catch(() => '// (blockMeta.ts not available)')

  const globalsCss = await fs.readFile(
    path.join(projectRoot, 'src/app/globals.css'),
    'utf-8'
  ).catch(() => '// (globals.css not available)')

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

  const existingBlocksDir = path.join(projectRoot, 'src/components/blocks')
  let existingBlocksList = ''
  try {
    const files = await fs.readdir(existingBlocksDir)
    existingBlocksList = files.filter(f => f.endsWith('.tsx')).map(f => f.replace('.tsx', '')).join(', ')
  } catch {
    existingBlocksList = 'None found'
  }

  const modeInstruction = mode === 'page'
    ? 'Generate MULTIPLE blocks that together form a complete page layout. Return an array in the "blocks" field.'
    : 'Generate a SINGLE block component. Return a single object in the "blocks" field (array of one).'

  const systemPrompt = `You are an expert Next.js 15 + TypeScript developer generating production-quality UI components for a premium legal firm website called "Chambers of Jeet Bhatt".

## Existing Blocks
DO NOT duplicate the following existing block component names. Create uniquely named blocks that complement them:
${existingBlocksList}

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

## RenderBlocks.tsx Map
\`\`\`tsx
${renderBlocksTsx}
\`\`\`

## Pages.ts Collection Config
\`\`\`ts
${pagesTs}
\`\`\`

## blockMeta.ts Definitions
\`\`\`ts
${blockMetaTs}
\`\`\`

## Global CSS / Tailwind Config
\`\`\`css
${globalsCss}
\`\`\`

## BlockMeta Interface
\`\`\`ts
${blockMetaInterface}
\`\`\`

## Instructions
${modeInstruction}

**CRITICAL RULES — READ EVERY RULE CAREFULLY:**

### Code Quality Rules
1. componentCode MUST be syntactically valid TypeScript TSX with NO compilation errors.
2. Use \`'use client'\` at the top ONLY when the component uses React hooks (useState, useEffect, etc.). Omit it for pure presentational components.
3. blockType MUST be camelCase (e.g. \`imageGalleryBlock\`).
4. componentName MUST be PascalCase matching blockType (e.g. \`ImageGalleryBlock\`).
5. payloadConfigCode MUST export a named const following the reference pattern exactly.
6. defaultValues MUST include blockType as the first key with its camelCase value.
7. Component props interface MUST exactly match all keys in defaultValues.
8. Return ONLY valid JSON with NO markdown fences, NO explanation text, NO trailing commas.

### Import Rules (STRICTLY ENFORCED)
9. ONLY import from these exact packages — no exceptions, no project-internal paths:
   - \`react\` — use default import \`import React from 'react'\` OR named hook imports \`import { useState, useEffect } from 'react'\`. NEVER use \`import * as React from 'react'\` (namespace import — not supported).
   - \`next/image\` — for images (import as default: \`import Image from 'next/image'\`)
   - \`next/link\` — for links (import as default: \`import Link from 'next/link'\`)
   - \`lucide-react\` — for icons (named imports only: \`import { ChevronRight } from 'lucide-react'\`)
   - \`framer-motion\` — for animations (named imports: \`import { motion } from 'framer-motion'\`)
   - FORBIDDEN: \`import * as X from 'pkg'\` namespace imports, \`next/navigation\`, \`next/font\`, \`next/headers\`, \`@/\` path aliases, \`../\` relative paths, any other package


### Tailwind CSS Rules
10. Use ONLY Tailwind CSS v4 utility classes — NO inline styles, NO CSS modules, NO hardcoded hex values.
11. Use the project design tokens from DESIGN.md for colors (e.g., \`text-gold-accent\`, \`bg-navy-primary\`). For standard colors use Tailwind's palette.

### TypeScript Rules
12. NO \`any\` types. Define explicit interfaces for all props.
13. All prop types must be primitives, arrays of primitives, or inline object shapes — NOT imported types from \`@/payload-types\` or any other project file.
14. Images passed as props should be typed as \`string\` (URL), not as a Payload \`Media\` type.

### Component Architecture Rules
15. Export the component as a NAMED export: \`export function ComponentName({ ...props }: Props) { ... }\`
16. Do NOT use default exports in componentCode.
17. The component MUST render valid HTML with no missing required attributes (e.g., img tags need alt, buttons need type).
18. Wrap any array .map() calls with unique \`key\` props using item index or id.

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
      "defaultValues": { "blockType": "camelCaseBlockName" },
      "blockMetaPatch": {
        "entryKey": "camelCaseBlockName",
        "entryValue": "{\\n  label: 'Human Readable Label',\\n  category: 'Content',\\n  icon: '...',\\n  badgeLabel: '...',\\n  defaultValues: { blockType: 'camelCaseBlockName' },\\n  fields: []\\n}"
      },
      "renderBlocksPatch": {
        "importLine": "import { PascalCaseBlockName } from '@/components/blocks/PascalCaseBlockName'",
        "mapEntry": "camelCaseBlockName: PascalCaseBlockName"
      },
      "pagesBlocksPatch": {
        "importLine": "import { PascalCaseBlockName } from '../blocks/PascalCaseBlockName'",
        "blockEntry": "PascalCaseBlockName"
      }
    }
  ]
}
`

  return { system: systemPrompt, user: userPrompt }
}
