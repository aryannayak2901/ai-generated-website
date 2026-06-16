import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const pat = process.env.GITHUB_PAT
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO

  if (!pat || !owner || !repo) {
    return NextResponse.json(
      { error: 'GitHub integration not configured. Set GITHUB_PAT, GITHUB_OWNER, and GITHUB_REPO env vars.' },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(request.url)
  const pathParam = searchParams.get('path') || ''
  const contentParam = searchParams.get('content') === 'true'

  const octokit = new Octokit({ auth: pat })

  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path: pathParam,
    })

    const data = response.data

    if (Array.isArray(data)) {
      // It's a directory
      const entries = data.map((item) => ({
        name: item.name,
        path: item.path,
        type: item.type === 'dir' ? 'dir' : 'file',
        size: item.size,
        sha: item.sha,
      }))
      return NextResponse.json({ type: 'dir', entries })
    } else {
      // It's a file
      if (contentParam && data.type === 'file' && 'content' in data && typeof data.content === 'string') {
        const decodedContent = Buffer.from(data.content, 'base64').toString('utf-8')
        return NextResponse.json({
          type: 'file',
          content: decodedContent,
          sha: data.sha,
        })
      }
      return NextResponse.json({
        type: 'file',
        sha: data.sha,
        size: data.size,
      })
    }
  } catch (error: any) {
    const message = error instanceof Error ? error.message : 'Unknown GitHub API error'
    if (error && error.status === 404) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('[github-files] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
