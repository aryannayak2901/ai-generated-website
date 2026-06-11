// src/components/payload/BlocksBuilder/AIPreviewPanel.tsx
'use client'

import React, { useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from '@codesandbox/sandpack-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GenerateResponseWithCode } from '@/lib/ai/types'

type GeneratedBlockWithCode = GenerateResponseWithCode['blocks'][number]

interface AIPreviewPanelProps {
  blocks: GeneratedBlockWithCode[]
  prompt: string
  provider: string
  model: string
  onBack: () => void
  onClose: () => void
}

type PushStatus = 'idle' | 'pushing' | 'done' | 'error'

export function AIPreviewPanel({
  blocks,
  prompt,
  provider,
  model,
  onBack,
  onClose,
}: AIPreviewPanelProps) {
  const [activeBlockIdx, setActiveBlockIdx] = useState(0)
  const [activeTab, setActiveTab] = useState<'component' | 'schema'>('component')
  const [pushStatus, setPushStatus] = useState<PushStatus>('idle')
  const [pushError, setPushError] = useState('')
  const [prUrl, setPrUrl] = useState('')

  // Per-block editable code state — initialized from generated blocks
  const [editedCodes, setEditedCodes] = useState<Record<number, { componentCode: string; payloadConfigCode: string }>>(
    () => Object.fromEntries(blocks.map((b, i) => [i, { componentCode: b.componentCode, payloadConfigCode: b.payloadConfigCode }]))
  )

  const block = blocks[activeBlockIdx]
  const currentCode = editedCodes[activeBlockIdx]

  const handlePush = async () => {
    setPushStatus('pushing')
    setPushError('')

    try {
      const response = await fetch('/api/ai-push-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockType: block.blockType,
          componentName: block.componentName,
          componentCode: currentCode.componentCode,
          payloadConfigCode: currentCode.payloadConfigCode,
          prompt,
          provider,
          model,
        }),
      })

      const data = await response.json() as { success: boolean; prUrl?: string; error?: string }

      if (!data.success) throw new Error(data.error ?? 'Failed to create PR')

      setPrUrl(data.prUrl!)
      setPushStatus('done')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setPushError(message)
      setPushStatus('error')
    }
  }

  const sandpackFiles = {
    '/App.tsx': {
      code: currentCode.componentCode.replace(
        /^'use client'\n?/,
        ''
      ),
      active: true,
    },
    '/index.tsx': {
      code: `import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
`,
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
      className="bb-preview-panel"
    >
      {/* Header */}
      <div className="bb-modal-header">
        <div className="bb-modal-header-left">
          <button
            type="button"
            onClick={onBack}
            disabled={pushStatus === 'pushing'}
            className="bb-preview-back-btn"
            aria-label="Back to generate"
          >
            ← Back
          </button>
          <div className="bb-modal-icon-wrap">🔍</div>
          <h2 className="bb-modal-title">Preview &amp; Push</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={pushStatus === 'pushing'}
          aria-label="Close"
          className="bb-modal-close"
        >
          ✕
        </button>
      </div>

      {/* Block tabs (if multiple blocks generated in page mode) */}
      {blocks.length > 1 && (
        <div className="bb-preview-block-tabs">
          {blocks.map((b, i) => (
            <button
              key={b.blockType}
              type="button"
              onClick={() => setActiveBlockIdx(i)}
              className={`bb-preview-block-tab ${i === activeBlockIdx ? 'bb-preview-block-tab--active' : ''}`}
            >
              {b.icon} {b.label}
            </button>
          ))}
        </div>
      )}

      {/* Block meta row */}
      <div className="bb-preview-meta">
        <span className="bb-preview-meta-name">{block.icon} {block.componentName}</span>
        <span className="bb-preview-meta-badge">{block.category}</span>
        <span className="bb-preview-meta-badge bb-preview-meta-badge--muted">{block.badgeLabel}</span>
      </div>

      {/* Code tab switcher */}
      <div className="bb-preview-code-tabs">
        <button
          type="button"
          className={`bb-preview-code-tab ${activeTab === 'component' ? 'bb-preview-code-tab--active' : ''}`}
          onClick={() => setActiveTab('component')}
        >
          Component TSX
        </button>
        <button
          type="button"
          className={`bb-preview-code-tab ${activeTab === 'schema' ? 'bb-preview-code-tab--active' : ''}`}
          onClick={() => setActiveTab('schema')}
        >
          Block Schema
        </button>
      </div>

      {/* Sandpack editor + preview */}
      <div className="bb-preview-sandpack-wrap">
        <SandpackProvider
          key={`${activeBlockIdx}-${activeTab}`}
          template="react-ts"
          files={
            activeTab === 'component'
              ? sandpackFiles
              : {
                  '/App.tsx': {
                    code: `// Payload Block Schema (server-side config — preview not available)\n// This file is read-only in the preview.\n\n${currentCode.payloadConfigCode}`,
                    active: true,
                    readOnly: true,
                  },
                }
          }
          theme="dark"
          options={{ recompileDelay: 800 }}
        >
          <SandpackLayout>
            <SandpackCodeEditor
              showTabs={false}
              showLineNumbers
              showInlineErrors
              wrapContent
              style={{ height: 260 }}
              onChange={
                activeTab === 'component'
                  ? (code) =>
                      setEditedCodes((prev) => ({
                        ...prev,
                        [activeBlockIdx]: { ...prev[activeBlockIdx], componentCode: code },
                      }))
                  : undefined
              }
            />
            {activeTab === 'component' && (
              <SandpackPreview
                style={{ height: 260 }}
                showNavigator={false}
                showOpenInCodeSandbox={false}
              />
            )}
          </SandpackLayout>
        </SandpackProvider>
      </div>

      {/* PR info */}
      <div className="bb-preview-pr-info">
        <div className="bb-preview-pr-row">
          <span className="bb-preview-pr-label">Branch:</span>
          <code className="bb-preview-pr-value">
            ai/block-{block.blockType}-&lt;timestamp&gt;
          </code>
        </div>
        <div className="bb-preview-pr-row">
          <span className="bb-preview-pr-label">PR Title:</span>
          <span className="bb-preview-pr-value">✨ AI Block: {block.componentName}</span>
        </div>
        <div className="bb-preview-pr-row">
          <span className="bb-preview-pr-label">Commits:</span>
          <span className="bb-preview-pr-value">4 files (component + schema + RenderBlocks + Pages)</span>
        </div>
      </div>

      {/* Error */}
      {pushStatus === 'error' && (
        <div className="bb-modal-error">{pushError}</div>
      )}

      {/* Success */}
      <AnimatePresence>
        {pushStatus === 'done' && prUrl && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bb-preview-success"
          >
            <span>✅ Pull Request created!</span>
            <a
              href={prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bb-preview-pr-link"
            >
              View PR on GitHub →
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer actions */}
      <div className="bb-modal-footer">
        <div className="bb-modal-status">
          {pushStatus === 'pushing' && '⏳ Creating branch and opening PR…'}
          {pushStatus === 'done' && '✅ Done! Merge the PR to deploy.'}
        </div>

        {pushStatus !== 'done' && (
          <button
            type="button"
            onClick={handlePush}
            disabled={pushStatus === 'pushing'}
            className="bb-modal-btn"
          >
            {pushStatus === 'pushing' ? 'Opening PR…' : '🚀 Open Pull Request on GitHub'}
          </button>
        )}

        {pushStatus === 'done' && (
          <button
            type="button"
            onClick={onClose}
            className="bb-modal-btn"
          >
            Close
          </button>
        )}
      </div>
    </motion.div>
  )
}
