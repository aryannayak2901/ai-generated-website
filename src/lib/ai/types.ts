// src/lib/ai/types.ts

export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'openrouter' | 'groq' | 'mistral' | 'together'

export type GenerationMode = 'block' | 'page'

export interface GenerateRequest {
  prompt: string
  mode: GenerationMode
  provider: AIProvider
  model: string
  apiKey: string
}

export interface BlockMetaEntryRaw {
  label: string
  category: 'Hero' | 'Content' | 'CTA / Forms'
  icon: string
  badgeLabel: string
  defaultValues: Record<string, unknown>
  fields?: unknown[]
}

export interface GeneratedBlock {
  blockType: string
  componentName: string
  label: string
  category: 'Hero' | 'Content' | 'CTA / Forms'
  icon: string
  badgeLabel: string
  componentCode: string
  payloadConfigCode: string
  blockMetaEntry: BlockMetaEntryRaw
  defaultValues: Record<string, unknown>
}

export interface GenerateResponse {
  success: true
  blocks: Array<{
    blockType: string
    defaultValues: Record<string, unknown>
    componentPath: string
    configPath: string
  }>
}

export interface GenerateErrorResponse {
  success: false
  error: string
}

// Response type used in production (no filesystem write — code returned to client)
export interface GenerateResponseWithCode {
  success: true
  mode: 'code' // signals the client to show the preview panel
  blocks: Array<{
    blockType: string
    componentName: string
    label: string
    category: 'Hero' | 'Content' | 'CTA / Forms'
    icon: string
    badgeLabel: string
    componentCode: string
    payloadConfigCode: string
    defaultValues: Record<string, unknown>
  }>
}
