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
    let body: GenerateRequest
    try {
      body = await request.json()
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
    }
    const { prompt, mode, provider, model, apiKey } = body

    if (!prompt?.trim()) return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 })
    if (!provider) return NextResponse.json({ success: false, error: 'Provider is required' }, { status: 400 })
    if (!model?.trim()) return NextResponse.json({ success: false, error: 'Model is required' }, { status: 400 })
    if (!apiKey?.trim()) return NextResponse.json({ success: false, error: 'API key is required' }, { status: 400 })

    const validProviders: AIProvider[] = ['gemini', 'openai', 'anthropic']
    if (!validProviders.includes(provider)) {
      return NextResponse.json({ success: false, error: `Invalid provider: ${provider}` }, { status: 400 })
    }

    const promptPayload = await buildSystemPrompt(prompt, mode ?? 'block') // Returns { system: string, user: string }

    let generatedBlocks: GeneratedBlock[]
    if (provider === 'gemini') {
      generatedBlocks = await callGemini(promptPayload, model, apiKey)
    } else if (provider === 'openai') {
      generatedBlocks = await callOpenAI(promptPayload, model, apiKey)
    } else {
      generatedBlocks = await callAnthropic(promptPayload, model, apiKey)
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
