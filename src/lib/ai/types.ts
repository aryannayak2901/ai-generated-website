// src/lib/ai/types.ts

export type AIProvider = 'gemini' | 'openai' | 'anthropic'

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
