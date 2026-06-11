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
