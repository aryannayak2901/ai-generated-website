// src/app/api/ai-push-github/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'
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
  modifiedFiles?: Array<{
    path: string
    content: string
    sha?: string
    deleted?: boolean
  }>
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

  const { blockType, componentName, componentCode, payloadConfigCode, prompt, provider, model, modifiedFiles } = body

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

    let renderBlocksContent = ''
    let pagesContent = ''

    const modifiedRenderBlocks = modifiedFiles?.find(f => f.path === 'src/components/RenderBlocks.tsx')
    if (modifiedRenderBlocks && !modifiedRenderBlocks.deleted) {
      renderBlocksContent = modifiedRenderBlocks.content
    } else {
      const renderBlocksFile = await octokit.repos.getContent({ owner, repo, path: 'src/components/RenderBlocks.tsx' })
      renderBlocksContent = Buffer.from((renderBlocksFile.data as { content: string }).content, 'base64').toString('utf-8')
    }

    const modifiedPages = modifiedFiles?.find(f => f.path === 'src/collections/Pages.ts')
    if (modifiedPages && !modifiedPages.deleted) {
      pagesContent = modifiedPages.content
    } else {
      const pagesFile = await octokit.repos.getContent({ owner, repo, path: 'src/collections/Pages.ts' })
      pagesContent = Buffer.from((pagesFile.data as { content: string }).content, 'base64').toString('utf-8')
    }

    const patchedRenderBlocks = patchRenderBlocksString(renderBlocksContent, block)
    const patchedPages = patchPagesString(pagesContent, block)

    // 2. Get main branch HEAD SHA
    const mainRef = await octokit.git.getRef({ owner, repo, ref: 'heads/main' })
    const mainSha = mainRef.data.object.sha

    // 3. Get the tree SHA of the main commit
    const mainCommit = await octokit.git.getCommit({ owner, repo, commit_sha: mainSha })
    const baseTreeSha = mainCommit.data.tree.sha

    // 4. Create blobs for all 4 files + any modified files
    const treeItems: any[] = []

    if (modifiedFiles && modifiedFiles.length > 0) {
      const blobPromises = modifiedFiles.map(async (file) => {
        if (file.deleted) {
          return {
            path: file.path,
            mode: '100644',
            type: 'blob',
            sha: null,
          }
        }
        const blob = await octokit.git.createBlob({ owner, repo, content: file.content, encoding: 'utf-8' })
        return {
          path: file.path,
          mode: '100644',
          type: 'blob',
          sha: blob.data.sha,
        }
      })
      const manualTreeItems = await Promise.all(blobPromises)
      treeItems.push(...manualTreeItems)
    }

    const [componentBlob, schemaBlob, renderBlocksBlob, pagesBlob] = await Promise.all([
      octokit.git.createBlob({ owner, repo, content: componentCode, encoding: 'utf-8' }),
      octokit.git.createBlob({ owner, repo, content: payloadConfigCode, encoding: 'utf-8' }),
      octokit.git.createBlob({ owner, repo, content: patchedRenderBlocks, encoding: 'utf-8' }),
      octokit.git.createBlob({ owner, repo, content: patchedPages, encoding: 'utf-8' }),
    ])

    // Replace or add AI block files in the tree
    const aiPaths = [
      `src/components/blocks/${componentName}.tsx`,
      `src/blocks/${componentName}.ts`,
      'src/components/RenderBlocks.tsx',
      'src/collections/Pages.ts',
    ]

    // Remove any manual files that overlap with AI block files
    const filteredTreeItems = treeItems.filter(item => !aiPaths.includes(item.path))

    filteredTreeItems.push(
      {
        path: aiPaths[0],
        mode: '100644',
        type: 'blob',
        sha: componentBlob.data.sha,
      },
      {
        path: aiPaths[1],
        mode: '100644',
        type: 'blob',
        sha: schemaBlob.data.sha,
      },
      {
        path: aiPaths[2],
        mode: '100644',
        type: 'blob',
        sha: renderBlocksBlob.data.sha,
      },
      {
        path: aiPaths[3],
        mode: '100644',
        type: 'blob',
        sha: pagesBlob.data.sha,
      }
    )

    // 5. Create a new tree
    const newTree = await octokit.git.createTree({
      owner,
      repo,
      base_tree: baseTreeSha,
      tree: filteredTreeItems,
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
    let prBody = `## AI-Generated Block: \`${componentName}\`\n\n**Block Type:** \`${blockType}\`\n**Provider:** ${provider} / ${model}\n**Generated:** ${new Date().toISOString()}\n\n### Prompt\n> ${prompt}\n\n### Files Changed\n- \`src/components/blocks/${componentName}.tsx\` — React component\n- \`src/blocks/${componentName}.ts\` — Payload CMS block schema\n- \`src/components/RenderBlocks.tsx\` — Registered in block renderer\n- \`src/collections/Pages.ts\` — Registered in Pages collection\n`

    if (modifiedFiles && modifiedFiles.length > 0) {
      const manualFilesList = modifiedFiles
        .filter(f => !aiPaths.includes(f.path))
        .map(f => `- \`${f.path}\` ${f.deleted ? '(deleted)' : '(modified)'}`)
        .join('\n')
      
      if (manualFilesList) {
        prBody += `\n### Additional Manual Changes\n${manualFilesList}\n`
      }
    }

    prBody += `\n### Review Checklist\n- [ ] Component renders correctly with default props\n- [ ] Tailwind classes use design tokens (no hardcoded hex values)\n- [ ] Payload schema fields match component props\n- [ ] No disallowed imports (only: react, next/image, next/link, lucide-react, framer-motion)\n      `

    const pr = await octokit.pulls.create({
      owner,
      repo,
      title: `✨ AI Block: ${componentName}`,
      body: prBody,
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
