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
    try {
      localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(settings))
    } catch { /* ignore */ }
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
      }, 1200)
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
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(5, 10, 24, 0.88)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 99999, padding: '20px',
          }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 24, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '560px',
              backgroundColor: '#0d1b2e',
              border: '1px solid rgba(212, 175, 55, 0.22)',
              borderRadius: '16px', padding: '36px',
              boxShadow: '0 32px 64px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.04)',
              display: 'flex', flexDirection: 'column', gap: '24px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #d4af37 0%, #b8972d 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#050a18', fontWeight: 'bold', fontSize: '18px'
                }}>
                  ✨
                </div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#fff', fontFamily: 'Playfair Display, serif' }}>
                  AI Block Generator
                </h2>
              </div>
              <button
                onClick={onClose}
                disabled={isLoading}
                style={{
                  background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer',
                  padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: isLoading ? 0.5 : 1
                }}
              >
                ✕
              </button>
            </div>

            {/* Provider Settings */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Provider</label>
                <select
                  value={settings.provider}
                  onChange={(e) => handleProviderChange(e.target.value as AIProvider)}
                  disabled={isLoading}
                  style={{
                    backgroundColor: '#050a18', color: '#fff', border: '1px solid #1e293b',
                    borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none'
                  }}
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Model</label>
                <input
                  type="text"
                  value={settings.model}
                  onChange={(e) => setSettings(s => ({ ...s, model: e.target.value }))}
                  disabled={isLoading}
                  style={{
                    backgroundColor: '#050a18', color: '#fff', border: '1px solid #1e293b',
                    borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>API Key (Stored Locally)</label>
              <input
                type="password"
                value={settings.apiKey}
                onChange={(e) => setSettings(s => ({ ...s, apiKey: e.target.value }))}
                disabled={isLoading}
                placeholder={`Enter ${settings.provider} API key...`}
                style={{
                  backgroundColor: '#050a18', color: '#fff', border: '1px solid #1e293b',
                  borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none'
                }}
              />
            </div>

            <hr style={{ border: 0, borderTop: '1px solid rgba(255,255,255,0.06)', margin: '8px 0' }} />

            {/* Mode & Prompt */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <label style={{ fontSize: '14px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="ai_mode"
                  checked={mode === 'block'}
                  onChange={() => setMode('block')}
                  disabled={isLoading}
                />
                Single Block
              </label>
              <label style={{ fontSize: '14px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="ai_mode"
                  checked={mode === 'page'}
                  onChange={() => setMode('page')}
                  disabled={isLoading}
                />
                Full Page Layout
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
                placeholder={mode === 'block' ? "Describe the UI component (e.g., 'A split-screen hero with a trust badge and gold CTA')..." : "Describe the page (e.g., 'A complete about us page with hero, team grid, and contact CTA')..."}
                style={{
                  backgroundColor: '#050a18', color: '#fff', border: '1px solid #1e293b',
                  borderRadius: '8px', padding: '14px', fontSize: '15px', outline: 'none',
                  minHeight: '120px', resize: 'vertical', lineHeight: '1.5',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {error && (
              <div style={{ padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '14px' }}>
                {error}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              <div style={{ fontSize: '14px', color: status === 'error' ? '#ef4444' : '#d4af37' }}>
                {statusMessage}
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim() || !settings.apiKey.trim()}
                style={{
                  background: isLoading ? '#334155' : 'linear-gradient(135deg, #d4af37 0%, #b8972d 100%)',
                  color: isLoading ? '#94a3b8' : '#050a18',
                  border: 'none', borderRadius: '8px', padding: '12px 24px',
                  fontSize: '15px', fontWeight: '600', cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isLoading ? 'none' : '0 4px 14px rgba(212, 175, 55, 0.2)'
                }}
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
