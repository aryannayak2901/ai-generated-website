'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AIProvider, GenerationMode } from '@/lib/ai/types'
import { AIPreviewPanel } from './AIPreviewPanel'
import type { GenerateResponseWithCode } from '@/lib/ai/types'
import { PROVIDERS } from '@/lib/ai/providers'
import { useAISettings } from '@/lib/ai/useAISettings'

interface AIGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  onBlocksGenerated: (blocks: Array<{ blockType: string; defaultValues: Record<string, unknown> }>) => void
}

export function AIGeneratorModal({ isOpen, onClose, onBlocksGenerated }: AIGeneratorModalProps) {
  const { settings, updateSettings, activeModels, isLoadingModels } = useAISettings()
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState<GenerationMode>('block')
  const [status, setStatus] = useState<'idle' | 'generating' | 'writing' | 'done' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState('')
  const [previewBlocks, setPreviewBlocks] = useState<GenerateResponseWithCode['blocks'] | null>(null)

  const handleProviderChange = (provider: AIProvider) => {
    updateSettings({ provider })
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

      const data = await response.json() as
        | { success: boolean; mode?: 'code'; blocks?: GenerateResponseWithCode['blocks'] & Array<{ blockType: string; defaultValues: Record<string, unknown> }>; error?: string }

      if (!data.success) throw new Error(data.error ?? 'Generation failed')

      // Production path: show Sandpack preview panel
      if (data.mode === 'code' && data.blocks) {
        setStatus('done')
        setStatusMessage(`✅ ${data.blocks.length} block${data.blocks.length !== 1 ? 's' : ''} generated!`)
        setTimeout(() => {
          setPreviewBlocks(data.blocks as GenerateResponseWithCode['blocks'])
          setStatus('idle')
          setStatusMessage('')
        }, 400)
        return
      }

      // Local dev path: blocks were written to disk
      setStatus('done')
      setStatusMessage(`✅ ${data.blocks!.length} block${data.blocks!.length !== 1 ? 's' : ''} generated!`)

      setTimeout(() => {
        onBlocksGenerated(data.blocks as Array<{ blockType: string; defaultValues: Record<string, unknown> }>)
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
    <AnimatePresence mode="wait">
      {isOpen && !previewBlocks && (
        <motion.div
          key="generate-phase"
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
                  onChange={(e) => updateSettings({ model: e.target.value })}
                  disabled={isLoading || isLoadingModels}
                  className="bb-modal-select"
                >
                  {activeModels.map((m) => (
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
                onChange={(e) => updateSettings({ apiKey: e.target.value })}
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
      {isOpen && previewBlocks && (
        <motion.div
          key="preview-phase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bb-modal-overlay"
        >
          <motion.div
            initial={{ scale: 0.95, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 24, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bb-modal-card bb-modal-card--wide"
          >
            <AIPreviewPanel
              blocks={previewBlocks}
              prompt={prompt}
              provider={settings.provider}
              model={settings.model}
              onBack={() => {
                setPreviewBlocks(null)
                setStatus('idle')
                setStatusMessage('')
              }}
              onClose={() => {
                setPreviewBlocks(null)
                setStatus('idle')
                setStatusMessage('')
                setPrompt('')
                onClose()
              }}
              onRegenerate={() => {
                // Return user to generator form with prompt pre-filled — ready to re-generate
                setPreviewBlocks(null)
                setStatus('idle')
                setStatusMessage('')
                setError('')
                // prompt is intentionally kept so user can regenerate immediately
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
