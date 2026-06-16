import { NextRequest, NextResponse } from 'next/server'
import { buildSystemPrompt } from '@/lib/ai/buildSystemPrompt'
import { callGemini } from '@/lib/ai/providers/gemini'
import { callOpenAI } from '@/lib/ai/providers/openai'
import { callAnthropic } from '@/lib/ai/providers/anthropic'
import { callOpenRouter } from '@/lib/ai/providers/openrouter'
import { callGroq } from '@/lib/ai/providers/groq'
import { callMistral } from '@/lib/ai/providers/mistral'
import { callTogether } from '@/lib/ai/providers/together'
import type {
  GenerateRequest,
  GenerateResponse,
  GenerateResponseWithCode,
  GenerateErrorResponse,
  AIProvider,
  GeneratedBlock,
} from '@/lib/ai/types'

export const runtime = 'nodejs'

export async function POST(
  request: NextRequest
): Promise<NextResponse<GenerateResponse | GenerateResponseWithCode | GenerateErrorResponse>> {
  try {
    let body: GenerateRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
    }
    const { prompt, mode, provider, model, apiKey } = body

    if (!prompt?.trim()) return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 })
    if (!provider) return NextResponse.json({ success: false, error: 'Provider is required' }, { status: 400 })
    if (!model?.trim()) return NextResponse.json({ success: false, error: 'Model is required' }, { status: 400 })
    if (!apiKey?.trim()) return NextResponse.json({ success: false, error: 'API key is required' }, { status: 400 })

    const validProviders: AIProvider[] = ['gemini', 'openai', 'anthropic', 'openrouter', 'groq', 'mistral', 'together']
    if (!validProviders.includes(provider)) {
      return NextResponse.json({ success: false, error: `Invalid provider: ${provider}` }, { status: 400 })
    }

    const promptPayload = await buildSystemPrompt(prompt, mode ?? 'block')

    let generatedBlocks: GeneratedBlock[]
    switch (provider) {
      case 'gemini':
        generatedBlocks = await callGemini(promptPayload, model, apiKey)
        break
      case 'openai':
        generatedBlocks = await callOpenAI(promptPayload, model, apiKey)
        break
      case 'anthropic':
        generatedBlocks = await callAnthropic(promptPayload, model, apiKey)
        break
      case 'openrouter':
        generatedBlocks = await callOpenRouter(promptPayload, model, apiKey)
        break
      case 'groq':
        generatedBlocks = await callGroq(promptPayload, model, apiKey)
        break
      case 'mistral':
        generatedBlocks = await callMistral(promptPayload, model, apiKey)
        break
      case 'together':
        generatedBlocks = await callTogether(promptPayload, model, apiKey)
        break
      default:
        return NextResponse.json({ success: false, error: `Unsupported provider: ${provider}` }, { status: 400 })
    }

    // ALWAYS return raw code to client — GitOps flow only (no local filesystem writes)
    return NextResponse.json({
      success: true,
      mode: 'code',
      blocks: generatedBlocks.map((block) => ({
        blockType: block.blockType,
        componentName: block.componentName,
        label: block.label,
        category: block.category,
        icon: block.icon,
        badgeLabel: block.badgeLabel,
        componentCode: block.componentCode,
        payloadConfigCode: block.payloadConfigCode,
        defaultValues: block.defaultValues,
      })),
    } satisfies GenerateResponseWithCode)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('[AI Generate Block] Error:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
