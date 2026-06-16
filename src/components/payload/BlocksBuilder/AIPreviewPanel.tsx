// src/components/payload/BlocksBuilder/AIPreviewPanel.tsx
'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from '@codesandbox/sandpack-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GenerateResponseWithCode } from '@/lib/ai/types'
import { transformForSandpack } from '@/lib/ai/sandpackTransformer'

type GeneratedBlockWithCode = GenerateResponseWithCode['blocks'][number]

// ─── Inner: read-only code display in the editor pane ───────────────────────
// NOTE: The editor shows the ORIGINAL (untransformed) code so the user can
// review/read exactly what will be pushed to GitHub. The preview pane runs
// the TRANSFORMED code (with shims). We do NOT sync transformed code back
// to prevent sandbox-only shim code from leaking into the PR.

function CodeDisplayEditor() {
  return (
    <SandpackCodeEditor
      showTabs={false}
      showLineNumbers
      showInlineErrors={false}
      wrapContent
      readOnly
      style={{ height: 260 }}
    />
  )
}

// ─── Inner: sandbox error watcher ─────────────────────────────────────────────
// Must live inside <SandpackProvider> to access useSandpack()

interface SandboxErrorWatcherProps {
  onError: (errors: string[]) => void
  onResolved: () => void
}

function SandboxErrorWatcher({ onError, onResolved }: SandboxErrorWatcherProps) {
  const { sandpack } = useSandpack()
  const prevHadErrorRef = useRef(false)

  useEffect(() => {
    // Sandpack exposes a single `error` object (not an array)
    const err = sandpack.error as null | { message: string; column?: number; line?: number; path?: string } | undefined
    const hasError = !!err

    if (hasError && !prevHadErrorRef.current) {
      prevHadErrorRef.current = true
      const message = err?.message ?? 'Sandbox preview error'
      onError([message])
    } else if (!hasError && prevHadErrorRef.current) {
      prevHadErrorRef.current = false
      onResolved()
    }
  }, [sandpack.error, onError, onResolved])

  return null
}

// ─── Main component ───────────────────────────────────────────────────────────

interface AIPreviewPanelProps {
  blocks: GeneratedBlockWithCode[]
  prompt: string
  provider: string
  model: string
  onBack: () => void
  onClose: () => void
  /** Called when user requests regeneration because of sandbox errors */
  onRegenerate: () => void
}

type PushStatus = 'idle' | 'pushing' | 'done' | 'error'

export function AIPreviewPanel({
  blocks,
  prompt,
  provider,
  model,
  onBack,
  onClose,
  onRegenerate,
}: AIPreviewPanelProps) {
  const [activeBlockIdx, setActiveBlockIdx] = useState(0)
  const [activeTab, setActiveTab] = useState<'component' | 'schema'>('component')
  const [pushStatus, setPushStatus] = useState<PushStatus>('idle')
  const [pushError, setPushError] = useState('')
  const [prUrl, setPrUrl] = useState('')

  // Sandbox error state
  const [sandboxErrors, setSandboxErrors] = useState<string[]>([])
  const [sandboxHasErrors, setSandboxHasErrors] = useState(false)

  // Per-block editable code state — initialized from original generated blocks
  const [editedCodes, setEditedCodes] = useState<
    Record<number, { componentCode: string; payloadConfigCode: string }>
  >(() =>
    Object.fromEntries(
      blocks.map((b, i) => [i, { componentCode: b.componentCode, payloadConfigCode: b.payloadConfigCode }])
    )
  )

  const block = blocks[activeBlockIdx]
  const currentCode = editedCodes[activeBlockIdx]

  // Transform current component code for sandbox preview
  // The ORIGINAL code in editedCodes is preserved verbatim for PR push
  const { transformedCode, dependencies, externalResources } = React.useMemo(
    () => transformForSandpack(currentCode.componentCode),
    [currentCode.componentCode]
  )


  const handleSandboxError = useCallback((errors: string[]) => {
    setSandboxErrors(errors)
    setSandboxHasErrors(true)
  }, [])

  const handleSandboxResolved = useCallback(() => {
    setSandboxErrors([])
    setSandboxHasErrors(false)
  }, [])

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
          // Always push the ORIGINAL (untransformed) code to GitHub
          componentCode: currentCode.componentCode,
          payloadConfigCode: currentCode.payloadConfigCode,
          prompt,
          provider,
          model,
        }),
      })

      const data = (await response.json()) as {
        success: boolean
        prUrl?: string
        error?: string
      }

      if (!data.success) throw new Error(data.error ?? 'Failed to create PR')

      setPrUrl(data.prUrl!)
      setPushStatus('done')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setPushError(message)
      setPushStatus('error')
    }
  }

  // ── Sandpack virtual file system ──────────────────────────────────────────
  // App.tsx  → TRANSFORMED code (shims inlined, ts-nocheck at top)
  // previewDisplayFiles → ORIGINAL code shown in editor tab for user review
  const sandpackPreviewFiles = {
    '/App.tsx': {
      code: transformedCode,
      active: true,
      hidden: true,   // hide from editor — we show original below
    },
    '/OriginalCode.tsx': {
      // This file is shown in the editor tab so the user sees the real code
      code: currentCode.componentCode,
      active: true,
    },
    '/index.tsx': {
      code: `import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
`,
      hidden: true,
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
              onClick={() => {
                setActiveBlockIdx(i)
                setSandboxErrors([])
                setSandboxHasErrors(false)
              }}
              className={`bb-preview-block-tab ${i === activeBlockIdx ? 'bb-preview-block-tab--active' : ''}`}
            >
              {b.icon} {b.label}
            </button>
          ))}
        </div>
      )}

      {/* Block meta row */}
      <div className="bb-preview-meta">
        <span className="bb-preview-meta-name">
          {block.icon} {block.componentName}
        </span>
        <span className="bb-preview-meta-badge">{block.category}</span>
        <span className="bb-preview-meta-badge bb-preview-meta-badge--muted">{block.badgeLabel}</span>

        {/* Sandbox error indicator badge */}
        {sandboxHasErrors && activeTab === 'component' && (
          <span className="bb-preview-meta-badge bb-preview-meta-badge--error">
            ⚠ Sandbox Error
          </span>
        )}
        {!sandboxHasErrors && activeTab === 'component' && (
          <span className="bb-preview-meta-badge bb-preview-meta-badge--ok">
            ✓ Preview OK
          </span>
        )}
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
        {activeTab === 'component' ? (
          <SandpackProvider
            key={`${activeBlockIdx}-component`}
            template="react-ts"
            files={sandpackPreviewFiles}
            theme="dark"
            customSetup={{
              dependencies,
            }}
            options={{
              recompileDelay: 600,
              externalResources,
            }}
          >
            {/* Error watcher — must be inside SandpackProvider */}
            <SandboxErrorWatcher
              onError={handleSandboxError}
              onResolved={handleSandboxResolved}
            />
            <SandpackLayout>
              <CodeDisplayEditor />
              <SandpackPreview
                style={{ height: 260 }}
                showNavigator={false}
                showOpenInCodeSandbox={false}
              />
            </SandpackLayout>
          </SandpackProvider>
        ) : (
          // Schema tab — read-only plain editor, no live preview needed
          <SandpackProvider
            key={`${activeBlockIdx}-schema`}
            template="react-ts"
            files={{
              '/App.tsx': {
                code: `// Payload Block Schema (server-side config — preview not available)\n// This file is read-only.\n\n${currentCode.payloadConfigCode}`,
                active: true,
                readOnly: true,
              },
            }}
            theme="dark"
          >
            <SandpackLayout>
              <SandpackCodeEditor
                showTabs={false}
                showLineNumbers
                wrapContent
                style={{ height: 520, width: '100%' }}
              />
            </SandpackLayout>
          </SandpackProvider>
        )}
      </div>

      {/* Sandbox error panel with Regenerate button */}
      <AnimatePresence>
        {sandboxHasErrors && activeTab === 'component' && (
          <motion.div
            key="sandbox-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bb-sandbox-error-panel"
          >
            <div className="bb-sandbox-error-header">
              <span className="bb-sandbox-error-icon">⚠</span>
              <span className="bb-sandbox-error-title">
                Something went wrong in the preview
              </span>
            </div>
            <ul className="bb-sandbox-error-list">
              {sandboxErrors.slice(0, 3).map((err, i) => (
                <li key={i} className="bb-sandbox-error-item">
                  {err}
                </li>
              ))}
              {sandboxErrors.length > 3 && (
                <li className="bb-sandbox-error-item bb-sandbox-error-item--more">
                  +{sandboxErrors.length - 3} more error{sandboxErrors.length - 3 > 1 ? 's' : ''}
                </li>
              )}
            </ul>
            <div className="bb-sandbox-error-actions">
              <span className="bb-sandbox-error-hint">
                The AI may have generated code with incompatible imports or syntax. Try regenerating.
              </span>
              <button
                type="button"
                className="bb-regenerate-btn"
                onClick={onRegenerate}
                disabled={pushStatus === 'pushing'}
              >
                🔄 Regenerate
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Push error */}
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
          {sandboxHasErrors && pushStatus === 'idle' && (
            <span style={{ color: 'var(--bb-danger)', fontSize: 12 }}>
              Preview has errors — fix the code or regenerate before pushing
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {sandboxHasErrors && pushStatus !== 'done' && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={pushStatus === 'pushing'}
              className="bb-modal-btn bb-modal-btn--secondary"
            >
              🔄 Regenerate
            </button>
          )}

          {pushStatus !== 'done' && (
            <button
              type="button"
              onClick={handlePush}
              disabled={pushStatus === 'pushing' || sandboxHasErrors}
              className="bb-modal-btn"
              title={sandboxHasErrors ? 'Fix preview errors before pushing to GitHub' : undefined}
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
      </div>
    </motion.div>
  )
}
