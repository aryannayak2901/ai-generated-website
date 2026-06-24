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

  // We need to ensure a comma exists before the new entry
  // TODO: This brace-matching logic is brittle and assumes the previous block ends with '}'.
  // If a block ends with an array or primitive, this will find the wrong block and cause predictable errors.
  const secondLastBraceIdx = beforeInsert.lastIndexOf('}', lastBraceIdx - 1)
  if (secondLastBraceIdx !== -1) {
    const afterBrace = beforeInsert.slice(secondLastBraceIdx + 1, lastBraceIdx)
    const needsComma = !afterBrace.trim().startsWith(',')
    content = content.slice(0, secondLastBraceIdx + 1) + (needsComma ? ',' : '') + content.slice(secondLastBraceIdx + 1, lastBraceIdx) + newEntry + content.slice(lastBraceIdx)
  } else {
    // Fallback if there's only one brace (unlikely)
    content = content.slice(0, lastBraceIdx) + newEntry + content.slice(lastBraceIdx)
  }

  await fs.writeFile(filePath, content, 'utf-8')
}


