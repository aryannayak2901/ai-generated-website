import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import { GeneratedBlock } from './types'
import { Octokit } from '@octokit/rest'
import { detectPackageManager, getPackageManagerCommand } from '../detectPackageManager'

const execAsync = promisify(exec)

const RENDER_BLOCKS_PATH = path.join(process.cwd(), 'src/components/RenderBlocks.tsx')
const PAGES_PATH = path.join(process.cwd(), 'src/collections/Pages.ts')
const BLOCK_META_PATH = path.join(process.cwd(), 'src/components/payload/BlocksBuilder/constants/blockMeta.ts')

export interface PatchableBlock {
  blockType: string
  componentName: string
  blockMetaPatch?: { entryKey: string; entryValue: string }
  renderBlocksPatch?: { importLine: string; mapEntry: string }
  pagesBlocksPatch?: { importLine: string; blockEntry: string }
  defaultValues?: Record<string, unknown>
  blockMetaEntry?: unknown
}

export function patchRenderBlocksString(content: string, block: PatchableBlock): string {
  if (content.includes(`${block.blockType}:`)) return content

  const importLine = block.renderBlocksPatch?.importLine 
    ? block.renderBlocksPatch.importLine + '\n'
    : `import { ${block.componentName} } from '@/components/blocks/${block.componentName}'\n`
    
  const lastImportIdx = content.lastIndexOf('import ')
  const afterLastImport = content.indexOf('\n', lastImportIdx) + 1
  let patched = content.slice(0, afterLastImport) + importLine + content.slice(afterLastImport)

  const mapEntry = block.renderBlocksPatch?.mapEntry
    ? `  ${block.renderBlocksPatch.mapEntry},`
    : `  ${block.blockType}: ${block.componentName},`
    
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

export function patchPagesString(content: string, block: PatchableBlock): string {
  if (content.includes(`{ ${block.componentName} }`)) return content

  const importLine = block.pagesBlocksPatch?.importLine
    ? block.pagesBlocksPatch.importLine + '\n'
    : `import { ${block.componentName} } from '../blocks/${block.componentName}'\n`
    
  const lastImportIdx = content.lastIndexOf('import ')
  let patched: string
  if (lastImportIdx === -1) {
    patched = importLine + '\n' + content
  } else {
    const afterLastImport = content.indexOf('\n', lastImportIdx) + 1
    patched = content.slice(0, afterLastImport) + importLine + content.slice(afterLastImport)
  }

  const blockEntry = block.pagesBlocksPatch?.blockEntry
    ? `        ${block.pagesBlocksPatch.blockEntry},`
    : `        ${block.componentName},`
    
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

export function patchBlockMetaString(content: string, block: PatchableBlock): string {
  if (content.includes(`  ${block.blockType}:`)) return content

  let entryJson = ''
  if (block.blockMetaPatch?.entryValue) {
    entryJson = block.blockMetaPatch.entryValue
  } else if (block.blockMetaEntry && block.defaultValues) {
    entryJson = JSON.stringify({ ...(block.blockMetaEntry as object), defaultValues: block.defaultValues }, null, 2)
  } else {
    entryJson = JSON.stringify({ defaultValues: { blockType: block.blockType } }, null, 2)
  }
  
  const indented = entryJson.split('\n').join('\n  ')
  const newEntry = `  ${block.blockType}: ${indented}`

  const match = content.match(/\n\s*};\s*export type BlockCategory/)
  if (!match || match.index === undefined) throw new Error('blockMeta.ts: could not find end of blockMeta object')
  
  const idx = match.index
  const before = content.slice(0, idx)
  const after = content.slice(idx)
  
  const needsComma = !before.trim().endsWith(',')
  
  return before + (needsComma ? ',\n' : '\n') + newEntry + '\n' + after.trimStart()
}

export async function createBatchedPR(blocks: GeneratedBlock[], title: string, body: string) {
  const pat = process.env.GITHUB_PAT
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO

  if (!pat || !owner || !repo) {
    throw new Error('GitHub integration not configured.')
  }

  const octokit = new Octokit({ auth: pat })
  const timestamp = Math.floor(Date.now() / 1000)
  const branchName = `ai/batch-blocks-${timestamp}`

  const mainRef = await octokit.git.getRef({ owner, repo, ref: 'heads/main' })
  const mainSha = mainRef.data.object.sha
  const mainCommit = await octokit.git.getCommit({ owner, repo, commit_sha: mainSha })
  const baseTreeSha = mainCommit.data.tree.sha

  // Update strings
  let renderBlocksContent = await fs.readFile(RENDER_BLOCKS_PATH, 'utf-8')
  let pagesContent = await fs.readFile(PAGES_PATH, 'utf-8')
  let blockMetaContent = await fs.readFile(BLOCK_META_PATH, 'utf-8')

  const originalRenderBlocks = renderBlocksContent
  const originalPages = pagesContent
  const originalBlockMeta = blockMetaContent

  const writtenComponentPaths: string[] = []
  const writtenConfigPaths: string[] = []

  try {
    for (const block of blocks) {
      renderBlocksContent = patchRenderBlocksString(renderBlocksContent, block)
      pagesContent = patchPagesString(pagesContent, block)
      blockMetaContent = patchBlockMetaString(blockMetaContent, block)

      const componentPath = path.join(process.cwd(), `src/components/blocks/${block.componentName}.tsx`)
      const configPath = path.join(process.cwd(), `src/blocks/${block.componentName}.ts`)
      
      await fs.mkdir(path.dirname(componentPath), { recursive: true })
      await fs.writeFile(componentPath, block.componentCode, 'utf-8')
      writtenComponentPaths.push(componentPath)

      await fs.mkdir(path.dirname(configPath), { recursive: true })
      await fs.writeFile(configPath, block.payloadConfigCode, 'utf-8')
      writtenConfigPaths.push(configPath)
    }

    await fs.writeFile(RENDER_BLOCKS_PATH, renderBlocksContent, 'utf-8')
    await fs.writeFile(PAGES_PATH, pagesContent, 'utf-8')
    await fs.writeFile(BLOCK_META_PATH, blockMetaContent, 'utf-8')

    const pm = await detectPackageManager()
    const runCmd = getPackageManagerCommand(pm, 'run')
    const installCmd = getPackageManagerCommand(pm, 'install')

    console.log(`Running validation steps using ${pm}...`)
    await execAsync(installCmd)
    await execAsync(`${runCmd} payload generate:importmap`)
    await execAsync(`${runCmd} payload generate:types`)
    await execAsync(`${runCmd} build`)
    console.log('Validation successful.')
  } catch (error) {
    throw new Error(`Validation failed: ${error}`)
  } finally {
    // Cleanup local workspace
    await fs.writeFile(RENDER_BLOCKS_PATH, originalRenderBlocks, 'utf-8')
    await fs.writeFile(PAGES_PATH, originalPages, 'utf-8')
    await fs.writeFile(BLOCK_META_PATH, originalBlockMeta, 'utf-8')
    
    for (const p of writtenComponentPaths) {
      await fs.unlink(p).catch(() => {})
    }
    for (const p of writtenConfigPaths) {
      await fs.unlink(p).catch(() => {})
    }
  }

  const treeItems: any[] = []

  for (const block of blocks) {
    const componentBlob = await octokit.git.createBlob({ owner, repo, content: block.componentCode, encoding: 'utf-8' })
    const configBlob = await octokit.git.createBlob({ owner, repo, content: block.payloadConfigCode, encoding: 'utf-8' })

    treeItems.push({
      path: `src/components/blocks/${block.componentName}.tsx`,
      mode: '100644',
      type: 'blob',
      sha: componentBlob.data.sha,
    })
    treeItems.push({
      path: `src/blocks/${block.componentName}.ts`,
      mode: '100644',
      type: 'blob',
      sha: configBlob.data.sha,
    })
  }



  const [rbBlob, pBlob, bmBlob] = await Promise.all([
    octokit.git.createBlob({ owner, repo, content: renderBlocksContent, encoding: 'utf-8' }),
    octokit.git.createBlob({ owner, repo, content: pagesContent, encoding: 'utf-8' }),
    octokit.git.createBlob({ owner, repo, content: blockMetaContent, encoding: 'utf-8' })
  ])

  treeItems.push({ path: 'src/components/RenderBlocks.tsx', mode: '100644', type: 'blob', sha: rbBlob.data.sha })
  treeItems.push({ path: 'src/collections/Pages.ts', mode: '100644', type: 'blob', sha: pBlob.data.sha })
  treeItems.push({ path: 'src/components/payload/BlocksBuilder/constants/blockMeta.ts', mode: '100644', type: 'blob', sha: bmBlob.data.sha })

  const newTree = await octokit.git.createTree({ owner, repo, base_tree: baseTreeSha, tree: treeItems })
  const newCommit = await octokit.git.createCommit({ owner, repo, message: title, tree: newTree.data.sha, parents: [mainSha] })

  await octokit.git.createRef({ owner, repo, ref: `refs/heads/${branchName}`, sha: newCommit.data.sha })

  const pr = await octokit.pulls.create({ owner, repo, title, body, head: branchName, base: 'main' })

  return { prUrl: pr.data.html_url, branchName, prNumber: pr.data.number }
}
