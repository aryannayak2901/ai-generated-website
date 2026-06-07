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
