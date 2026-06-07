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

const DEFAULT_MODELS: Record<AIProvider, string> = {
  gemini: 'gemini-2.0-flash',
  openai: 'gpt-4o',
  anthropic: 'claude-3-5-sonnet-20241022',
}

interface AIGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  onBlocksGenerated: (blocks: Array<{ blockType: string; defaultValues: Record<string, unknown> }>) => void
}

export function AIGeneratorModal({ isOpen, onClose, onBlocksGenerated }: AIGeneratorModalProps) {
  const [settings, setSettings] = useState<AISettings>({
    provider: 'gemini',
    model: DEFAULT_MODELS.gemini,
    apiKey: '',
  })
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState<GenerationMode>('block')
  const [status, setStatus] = useState<'idle' | 'generating' | 'writing' | 'done' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AI_SETTINGS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as AISettings
        setSettings(parsed)
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
    setSettings((prev) => ({ ...prev, provider, model: DEFAULT_MODELS[provider] }))
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) { setError('Please enter a prompt.'); return }
    if (!settings.apiKey.trim()) { setError('Please enter your API key.'); return }

    setError('')
    setStatus('generating')
    setStatusMessage(`Calling ${settings.provider} API...`)

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
      setStatusMessage('Writing files to disk...')

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={isLoading ? undefined : onClose}
          className="fixed inset-0 bg-primary/90 backdrop-blur-md flex items-center justify-center z-[99999] p-5"
        >
          <motion.div
            initial={{ scale: 0.95, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 24, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[560px] bg-card border border-accent/20 rounded-2xl p-9 shadow-[0_32px_64px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.04)] flex flex-col gap-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center text-primary font-bold text-lg">
                  ✨
                </div>
                <h2 className="m-0 text-xl font-semibold text-card-foreground font-serif">
                  AI Block Generator
                </h2>
              </div>
              <button
                onClick={onClose}
                disabled={isLoading}
                aria-label="Close modal"
                className="bg-transparent border-none text-muted-foreground hover:text-foreground cursor-pointer p-1 flex items-center justify-center transition-colors disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            {/* Provider Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Provider</label>
                <select
                  value={settings.provider}
                  onChange={(e) => handleProviderChange(e.target.value as AIProvider)}
                  disabled={isLoading}
                  className="bg-background text-foreground border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Model</label>
                <input
                  type="text"
                  value={settings.model}
                  onChange={(e) => setSettings(s => ({ ...s, model: e.target.value }))}
                  disabled={isLoading}
                  className="bg-background text-foreground border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">API Key (Stored Locally)</label>
              <input
                type="password"
                value={settings.apiKey}
                onChange={(e) => setSettings(s => ({ ...s, apiKey: e.target.value }))}
                disabled={isLoading}
                placeholder={`Enter ${settings.provider} API key...`}
                className="bg-background text-foreground border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
              />
            </div>

            <hr className="border-0 border-t border-border/50 my-2" />

            {/* Mode & Prompt */}
            <div className="flex gap-4 items-center">
              <label className="text-sm text-foreground/80 flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
                <input
                  type="radio"
                  name="ai_mode"
                  checked={mode === 'block'}
                  onChange={() => setMode('block')}
                  disabled={isLoading}
                  className="text-accent focus:ring-accent"
                />
                Single Block
              </label>
              <label className="text-sm text-foreground/80 flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
                <input
                  type="radio"
                  name="ai_mode"
                  checked={mode === 'page'}
                  onChange={() => setMode('page')}
                  disabled={isLoading}
                  className="text-accent focus:ring-accent"
                />
                Full Page Layout
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
                placeholder={mode === 'block' ? "Describe the UI component (e.g., 'A split-screen hero with a trust badge and gold CTA')..." : "Describe the page (e.g., 'A complete about us page with hero, team grid, and contact CTA')..."}
                className="bg-background text-foreground border border-border rounded-lg p-3.5 text-[15px] outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all min-h-[120px] resize-y leading-relaxed font-inherit"
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-2">
              <div className={`text-sm ${status === 'error' ? 'text-destructive' : 'text-accent'}`}>
                {statusMessage}
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim() || !settings.apiKey.trim()}
                className={`border-none rounded-lg px-6 py-3 text-[15px] font-semibold transition-all duration-200 ${
                  isLoading 
                    ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                    : 'bg-gradient-to-br from-accent to-[#b8972d] text-primary cursor-pointer hover:shadow-[0_4px_14px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isLoading ? 'Generating...' : 'Generate ✨'}
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
