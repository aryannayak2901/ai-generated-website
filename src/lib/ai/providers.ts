import { AIProvider } from './types'

export const AI_SETTINGS_KEY = 'chambers_ai_settings'

export interface ProviderMeta {
  label: string
  apiKeyPlaceholder: string
  models: { value: string; label: string }[]
}

export const PROVIDERS: Record<AIProvider, ProviderMeta> = {
  gemini: {
    label: 'Google Gemini',
    apiKeyPlaceholder: 'Enter Gemini API key (AIza…)',
    models: [
      { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
      { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite' },
      { value: 'gemini-2.5-pro-preview-06-05', label: 'Gemini 2.5 Pro Preview' },
      { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
      { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    ],
  },
  openai: {
    label: 'OpenAI',
    apiKeyPlaceholder: 'Enter OpenAI API key (sk-…)',
    models: [
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
      { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
      { value: 'gpt-4', label: 'GPT-4' },
      { value: 'o3-mini', label: 'o3-mini' },
    ],
  },
  anthropic: {
    label: 'Anthropic',
    apiKeyPlaceholder: 'Enter Anthropic API key (sk-ant-…)',
    models: [
      { value: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5' },
      { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
      { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku' },
      { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
    ],
  },
  openrouter: {
    label: 'OpenRouter',
    apiKeyPlaceholder: 'Enter OpenRouter API key (sk-or-…)',
    models: [
      { value: 'anthropic/claude-sonnet-4-5', label: 'Claude Sonnet 4.5 (via OR)' },
      { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet (via OR)' },
      { value: 'openai/gpt-4o', label: 'GPT-4o (via OR)' },
      { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini (via OR)' },
      { value: 'google/gemini-2.0-flash-001', label: 'Gemini 2.0 Flash (via OR)' },
      { value: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B' },
      { value: 'deepseek/deepseek-chat', label: 'DeepSeek Chat' },
      { value: 'qwen/qwen-2.5-72b-instruct', label: 'Qwen 2.5 72B' },
    ],
  },
  groq: {
    label: 'Groq',
    apiKeyPlaceholder: 'Enter Groq API key (gsk_…)',
    models: [
      { value: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile' },
      { value: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant' },
      { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
      { value: 'gemma2-9b-it', label: 'Gemma 2 9B' },
    ],
  },
  mistral: {
    label: 'Mistral AI',
    apiKeyPlaceholder: 'Enter Mistral API key',
    models: [
      { value: 'mistral-large-latest', label: 'Mistral Large' },
      { value: 'mistral-medium-latest', label: 'Mistral Medium' },
      { value: 'mistral-small-latest', label: 'Mistral Small' },
      { value: 'codestral-latest', label: 'Codestral' },
    ],
  },
  together: {
    label: 'Together AI',
    apiKeyPlaceholder: 'Enter Together AI API key',
    models: [
      { value: 'meta-llama/Llama-3-70b-chat-hf', label: 'Llama 3 70B Chat' },
      { value: 'meta-llama/Llama-3-8b-chat-hf', label: 'Llama 3 8B Chat' },
      { value: 'mistralai/Mixtral-8x7B-Instruct-v0.1', label: 'Mixtral 8x7B Instruct' },
      { value: 'Qwen/Qwen2.5-72B-Instruct-Turbo', label: 'Qwen 2.5 72B Turbo' },
      { value: 'deepseek-ai/DeepSeek-V3', label: 'DeepSeek V3' },
    ],
  },
}

export const DEFAULT_PROVIDER: AIProvider = 'gemini'
