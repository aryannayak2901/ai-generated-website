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
