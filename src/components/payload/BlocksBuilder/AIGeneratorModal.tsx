'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AIProvider, GenerationMode } from '@/lib/ai/types'

const AI_SETTINGS_KEY = 'chambers_ai_settings'

interface AISettings {
  provider: AIProvider
  model: string
  apiKey: string
}

// ─── Provider catalog ────────────────────────────────────────────────────────
interface ProviderMeta {
  label: string
  apiKeyPlaceholder: string
  models: { value: string; label: string }[]
}

const PROVIDERS: Record<AIProvider, ProviderMeta> = {
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

const DEFAULT_PROVIDER: AIProvider = 'gemini'

interface AIGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  onBlocksGenerated: (blocks: Array<{ blockType: string; defaultValues: Record<string, unknown> }>) => void
}

export function AIGeneratorModal({ isOpen, onClose, onBlocksGenerated }: AIGeneratorModalProps) {
  const [settings, setSettings] = useState<AISettings>({
    provider: DEFAULT_PROVIDER,
    model: PROVIDERS[DEFAULT_PROVIDER].models[0].value,
    apiKey: '',
  })
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState<GenerationMode>('block')
  const [status, setStatus] = useState<'idle' | 'generating' | 'writing' | 'done' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState('')
  
  // Dynamic models state for providers that support unauthenticated listing (OpenRouter)
  const [dynamicModels, setDynamicModels] = useState<Record<string, { value: string; label: string }[]>>({})
  const [isLoadingModels, setIsLoadingModels] = useState(false)

  // Fetch OpenRouter models dynamically
  useEffect(() => {
    async function fetchOpenRouterModels() {
      if (dynamicModels['openrouter']) return
      setIsLoadingModels(true)
      try {
        const res = await fetch('https://openrouter.ai/api/v1/models')
        if (res.ok) {
          const data = await res.json()
          const models = data.data
            .map((m: any) => ({
              value: m.id,
              label: m.name || m.id,
            }))
            .sort((a: any, b: any) => a.label.localeCompare(b.label))
          
          setDynamicModels(prev => ({ ...prev, openrouter: models }))
        }
      } catch (err) {
        console.error('Failed to fetch OpenRouter models:', err)
      } finally {
        setIsLoadingModels(false)
      }
    }

    if (settings.provider === 'openrouter' && isOpen) {
      fetchOpenRouterModels()
    }
  }, [settings.provider, isOpen, dynamicModels])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AI_SETTINGS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as AISettings
        if (parsed.provider && PROVIDERS[parsed.provider]) {
          setSettings(parsed)
        }
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(settings))
      } catch { /* ignore */ }
    }, 500)
    return () => clearTimeout(timeout)
  }, [settings])

  const handleProviderChange = (provider: AIProvider) => {
    const defaultModel = PROVIDERS[provider].models[0].value
    setSettings((prev) => ({
      ...prev,
      provider,
      model: defaultModel, // We temporarily set this, it can be updated once dynamic models load
    }))
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) { setError('Please enter a prompt.'); return }
    if (!settings.apiKey.trim()) { setError('Please enter your API key.'); return }

    setError('')
    setStatus('generating')
    setStatusMessage(`Calling ${PROVIDERS[settings.provider].label} API…`)

    try {
      const response = await fetch('/api/ai-generate-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          mode,
          provider: settings.provider,
          model: settings.model,
          apiKey: settings.apiKey,
        }),
      })

      setStatus('writing')
      setStatusMessage('Writing files to disk…')

      const data = await response.json() as { success: boolean; blocks?: Array<{ blockType: string; defaultValues: Record<string, unknown> }>; error?: string }

      if (!data.success) throw new Error(data.error ?? 'Generation failed')

      setStatus('done')
      setStatusMessage(`✅ ${data.blocks!.length} block${data.blocks!.length !== 1 ? 's' : ''} generated!`)

      setTimeout(() => {
        onBlocksGenerated(data.blocks!)
        onClose()
        setStatus('idle')
        setStatusMessage('')
        setPrompt('')
      }, 600)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setStatus('error')
      setError(message)
    }
  }

  const isLoading = status === 'generating' || status === 'writing'
  const currentProvider = PROVIDERS[settings.provider]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={isLoading ? undefined : onClose}
          className="bb-modal-overlay"
        >
          <motion.div
            initial={{ scale: 0.95, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 24, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bb-modal-card"
          >
            {/* Header */}
            <div className="bb-modal-header">
              <div className="bb-modal-header-left">
                <div className="bb-modal-icon-wrap">
                  ✨
                </div>
                <h2 className="bb-modal-title">
                  AI Block Generator
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                aria-label="Close modal"
                className="bb-modal-close"
              >
                ✕
              </button>
            </div>

            {/* Provider + Model row */}
            <div className="bb-modal-row">
              <div className="bb-modal-field">
                <label className="bb-modal-label">Provider</label>
                <select
                  value={settings.provider}
                  onChange={(e) => handleProviderChange(e.target.value as AIProvider)}
                  disabled={isLoading}
                  className="bb-modal-select"
                >
                  {(Object.keys(PROVIDERS) as AIProvider[]).map((p) => (
                    <option key={p} value={p}>
                      {PROVIDERS[p].label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bb-modal-field">
                <label className="bb-modal-label">Model</label>
                <select
                  value={settings.model}
                  onChange={(e) => setSettings((s) => ({ ...s, model: e.target.value }))}
                  disabled={isLoading || isLoadingModels}
                  className="bb-modal-select"
                >
                  {(dynamicModels[settings.provider] || currentProvider.models).map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                {isLoadingModels && <span style={{ fontSize: '10px', color: 'var(--bb-muted)' }}>Loading models...</span>}
              </div>
            </div>

            <div className="bb-modal-field">
              <label className="bb-modal-label">API Key (Stored Locally)</label>
              <input
                type="password"
                value={settings.apiKey}
                onChange={(e) => setSettings((s) => ({ ...s, apiKey: e.target.value }))}
                disabled={isLoading}
                placeholder={currentProvider.apiKeyPlaceholder}
                className="bb-modal-input"
              />
            </div>

            <hr className="bb-modal-divider" />

            {/* Mode & Prompt */}
            <div className="bb-modal-radio-group">
              <label className="bb-modal-radio-label">
                <input
                  type="radio"
                  name="ai_mode"
                  checked={mode === 'block'}
                  onChange={() => setMode('block')}
                  disabled={isLoading}
                  className="bb-modal-radio-input"
                />
                Single Block
              </label>
              <label className="bb-modal-radio-label">
                <input
                  type="radio"
                  name="ai_mode"
                  checked={mode === 'page'}
                  onChange={() => setMode('page')}
                  disabled={isLoading}
                  className="bb-modal-radio-input"
                />
                Full Page Layout
              </label>
            </div>

            <div className="bb-modal-field">
              <label className="bb-modal-label">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
                placeholder={mode === 'block' ? "Describe the UI component (e.g., 'A split-screen hero with a trust badge and gold CTA')..." : "Describe the page (e.g., 'A complete about us page with hero, team grid, and contact CTA')..."}
                className="bb-modal-textarea"
              />
            </div>

            {error && (
              <div className="bb-modal-error">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="bb-modal-footer">
              <div className={`bb-modal-status ${status === 'error' ? 'bb-modal-status-error' : ''}`}>
                {statusMessage}
              </div>
              
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim() || !settings.apiKey.trim()}
                className="bb-modal-btn"
              >
                {isLoading ? 'Generating…' : 'Generate ✨'}
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
