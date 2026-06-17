'use client'

import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
  useActiveCode,
} from '@codesandbox/sandpack-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  X,
  GitPullRequest,
  Eye,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Code2,
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  Minus,
  Plus,
} from 'lucide-react'
import type { GenerateResponseWithCode } from '@/lib/ai/types'
import { transformForSandpack } from '@/lib/ai/sandpackTransformer'
import { FileTreeSidebar } from './FileTreeSidebar'
import { EditorTabBar } from './EditorTabBar'
import { ResizeHandle } from './ResizeHandle'

type GeneratedBlockWithCode = GenerateResponseWithCode['blocks'][number]

/* ── Sandpack helpers ─────────────────────────────────────────────────────── */
interface SandboxErrorWatcherProps {
  onError: (errors: string[]) => void
  onResolved: () => void
}

function SandboxErrorWatcher({ onError, onResolved }: SandboxErrorWatcherProps) {
  const { sandpack } = useSandpack()
  const prevHadErrorRef = useRef(false)

  useEffect(() => {
    const err = sandpack.error as null | { message: string } | undefined
    const hasError = !!err
    if (hasError && !prevHadErrorRef.current) {
      prevHadErrorRef.current = true
      onError([err?.message ?? 'Sandbox preview error'])
    } else if (!hasError && prevHadErrorRef.current) {
      prevHadErrorRef.current = false
      onResolved()
    }
  }, [sandpack.error, onError, onResolved])

  return null
}

function CodeEditorSync({
  activeFile,
  projectFiles,
  setModifiedFiles,
  transformedCode,
}: {
  activeFile: string | null
  projectFiles: Record<string, string>
  setModifiedFiles: React.Dispatch<React.SetStateAction<Record<string, string>>>
  transformedCode: string
}) {
  const { sandpack } = useSandpack()
  const { code } = useActiveCode()

  useEffect(() => {
    if (sandpack.files['/App.tsx']?.code !== transformedCode) {
      sandpack.updateFile('/App.tsx', transformedCode)
    }
  }, [transformedCode, sandpack])

  useEffect(() => {
    if (activeFile) {
      const spPath = `/${activeFile}`
      if (sandpack.activeFile !== spPath && spPath in sandpack.files) {
        sandpack.setActiveFile(spPath)
      }
    }
  }, [activeFile, sandpack])

  useEffect(() => {
    if (activeFile && code !== undefined) {
      const spPath = `/${activeFile}`
      if (sandpack.activeFile === spPath) {
        const orig = projectFiles[activeFile] ?? ''
        if (code !== orig) {
          setModifiedFiles(prev => prev[activeFile] === code ? prev : { ...prev, [activeFile]: code })
        } else {
          setModifiedFiles(prev => {
            if (!(activeFile in prev)) return prev
            const next = { ...prev }
            delete next[activeFile]
            return next
          })
        }
      }
    }
  }, [code, activeFile, projectFiles, setModifiedFiles, sandpack.activeFile])

  return null
}

/* ── Props ────────────────────────────────────────────────────────────────── */
interface AIPreviewPanelProps {
  blocks: GeneratedBlockWithCode[]
  prompt: string
  provider: string
  model: string
  onBack: () => void
  onClose: () => void
  onRegenerate: () => void
}

type PushStatus = 'idle' | 'pushing' | 'done' | 'error'
type Viewport = 'desktop' | 'laptop' | 'tablet' | 'mobile'

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  desktop: '100%',
  laptop: '1024px',
  tablet: '768px',
  mobile: '390px',
}

/* ── Component ────────────────────────────────────────────────────────────── */
export function AIPreviewPanel({ blocks, prompt, provider, model, onBack, onClose, onRegenerate }: AIPreviewPanelProps) {
  const [activeBlockIdx, setActiveBlockIdx] = useState(0)
  const [pushStatus, setPushStatus] = useState<PushStatus>('idle')
  const [prUrl, setPrUrl] = useState('')
  const [sandboxErrors, setSandboxErrors] = useState<string[]>([])
  const [sandboxHasErrors, setSandboxHasErrors] = useState(false)

  /* files */
  const initialProjectFiles = useMemo(() => {
    const files: Record<string, string> = {}
    blocks.forEach(b => {
      files[`src/components/blocks/${b.componentName}.tsx`] = b.componentCode
      files[`src/blocks/${b.componentName}.ts`] = b.payloadConfigCode
    })
    return files
  }, [blocks])

  const defaultActiveFile = `src/components/blocks/${blocks[0].componentName}.tsx`
  const initialOpenFiles = useMemo(() => Object.keys(initialProjectFiles), [initialProjectFiles])

  const [projectFiles, setProjectFiles] = useState<Record<string, string>>(initialProjectFiles)
  const [modifiedFiles, setModifiedFiles] = useState<Record<string, string>>({})
  const [deletedFiles, setDeletedFiles] = useState<string[]>([])
  const [openFiles, setOpenFiles] = useState<string[]>(initialOpenFiles)
  const [activeFile, setActiveFile] = useState<string | null>(defaultActiveFile)

  /* layout */
  const [editorWidth, setEditorWidth] = useState(0.47)
  const [viewport, setViewport] = useState<Viewport>('desktop')
  const [zoom, setZoom] = useState(75)
  const [refreshKey, setRefreshKey] = useState(0)

  /* derived */
  const block = blocks[activeBlockIdx]
  const componentPath = `src/components/blocks/${block.componentName}.tsx`
  const currentCode = modifiedFiles[componentPath] ?? projectFiles[componentPath] ?? block.componentCode

  const { transformedCode, dependencies, externalResources, template } = useMemo(
    () => transformForSandpack(currentCode),
    [currentCode]
  )

  const handleSandboxError = useCallback((errors: string[]) => {
    setSandboxErrors(errors); setSandboxHasErrors(true)
  }, [])
  const handleSandboxResolved = useCallback(() => {
    setSandboxErrors([]); setSandboxHasErrors(false)
  }, [])

  const handlePush = async () => {
    setPushStatus('pushing')
    try {
      const allModified = [
        ...Object.entries(modifiedFiles).map(([path, content]) => ({ path, content, deleted: false })),
        ...deletedFiles.map(path => ({ path, content: '', deleted: true })),
      ]
      const res = await fetch('/api/ai-push-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockType: block.blockType,
          componentName: block.componentName,
          componentCode: modifiedFiles[componentPath] ?? projectFiles[componentPath],
          payloadConfigCode: modifiedFiles[`src/blocks/${block.componentName}.ts`] ?? projectFiles[`src/blocks/${block.componentName}.ts`],
          prompt, provider, model, modifiedFiles: allModified,
        }),
      })
      const data = await res.json() as { success: boolean; prUrl?: string; error?: string }
      if (!data.success) throw new Error(data.error ?? 'Failed to create PR')
      setPrUrl(data.prUrl!); setPushStatus('done')
    } catch (err) {
      console.error(err); setPushStatus('error')
    }
  }

  const handleFileSelect = async (path: string) => {
    if (!projectFiles[path] && !modifiedFiles[path]) {
      try {
        const res = await fetch(`/api/github-files?path=${encodeURIComponent(path)}`)
        if (res.ok) {
          const data = await res.json()
          if (data.type === 'file') {
            const content = Buffer.from(data.content, 'base64').toString('utf-8')
            setProjectFiles(prev => ({ ...prev, [path]: content }))
          }
        }
      } catch (err) { console.error('Failed to fetch file', err); return }
    }
    setOpenFiles(prev => prev.includes(path) ? prev : [...prev, path])
    setActiveFile(path)
  }

  const handleNewFile = (path: string) => {
    setProjectFiles(prev => ({ ...prev, [path]: '' }))
    setModifiedFiles(prev => ({ ...prev, [path]: '' }))
    setOpenFiles(prev => [...prev, path])
    setActiveFile(path)
  }

  const handleTabClose = (path: string) => {
    setOpenFiles(prev => {
      const next = prev.filter(p => p !== path)
      if (activeFile === path) setActiveFile(next.length > 0 ? next[next.length - 1] : null)
      return next
    })
  }

  const handleDeleteFile = (path: string) => {
    setDeletedFiles(prev => [...prev, path])
    if (openFiles.includes(path)) handleTabClose(path)
  }

  const sandpackFiles = useMemo(() => {
    const f: Record<string, any> = {
      '/index.tsx': {
        code: `import React from 'react'\nimport { createRoot } from 'react-dom/client'\nimport App from './App'\nconst root = createRoot(document.getElementById('root')!)\nroot.render(<App />)\n`,
        hidden: true,
      },
      '/App.tsx': { code: transformedCode, hidden: true },
    }
    for (const path of new Set([...Object.keys(projectFiles), ...Object.keys(modifiedFiles)])) {
      if (deletedFiles.includes(path)) continue
      f[`/${path}`] = { code: modifiedFiles[path] ?? projectFiles[path], active: path === activeFile }
    }
    return f
  }, [projectFiles, modifiedFiles, deletedFiles, transformedCode, activeFile])

  const getLang = (p: string) =>
    p.endsWith('.tsx') ? 'TSX' : p.endsWith('.ts') ? 'TS' : p.endsWith('.css') ? 'CSS' :
    p.endsWith('.json') ? 'JSON' : p.endsWith('.jsx') ? 'JSX' : p.endsWith('.js') ? 'JS' : 'TEXT'

  const modifiedCount = Object.keys(modifiedFiles).length

  /* ─ render ─ */
  return (
    <div className="aip-root">
      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <div className="aip-header">
        <div className="aip-header-left">
          {/* Back */}
          <button type="button" onClick={onBack} disabled={pushStatus === 'pushing'} className="aip-btn aip-btn--ghost aip-back-btn">
            <ArrowLeft size={13} strokeWidth={2.5} />
            <span>Back</span>
          </button>

          <span className="aip-header-sep" />

          {/* Icon + Title */}
          <span className="aip-header-icon"><Code2 size={13} /></span>
          <span className="aip-header-title">Preview &amp; Push</span>
          {modifiedCount > 0 && <span className="aip-badge aip-badge--amber">{modifiedCount} modified</span>}

          {/* Block tabs */}
          {blocks.length > 1 && (
            <div className="aip-block-tabs">
              {blocks.map((b, i) => (
                <button
                  key={b.blockType}
                  type="button"
                  onClick={() => {
                    setActiveBlockIdx(i)
                    const cp = `src/components/blocks/${b.componentName}.tsx`
                    if (!openFiles.includes(cp)) setOpenFiles(p => [...p, cp])
                    setActiveFile(cp)
                    setSandboxErrors([]); setSandboxHasErrors(false)
                  }}
                  className={`aip-block-tab${i === activeBlockIdx ? ' aip-block-tab--active' : ''}`}
                >
                  {b.icon && <span>{b.icon}</span>}{b.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="aip-header-right">
          {/* Status pills */}
          {pushStatus === 'pushing' && (
            <span className="aip-badge aip-badge--info"><span className="aip-spinner" /> Creating PR…</span>
          )}
          {pushStatus === 'done' && (
            <span className="aip-badge aip-badge--green"><CheckCircle size={11} /> PR Created!</span>
          )}
          {sandboxHasErrors && pushStatus === 'idle' && (
            <span className="aip-badge aip-badge--red"><AlertTriangle size={11} /> Preview has errors</span>
          )}

          {/* Primary action */}
          {pushStatus !== 'done' ? (
            <button type="button" onClick={handlePush} disabled={pushStatus === 'pushing' || sandboxHasErrors} className="aip-btn aip-btn--gold">
              <GitPullRequest size={13} strokeWidth={2} />
              {pushStatus === 'pushing' ? 'Opening…' : 'Open PR'}
            </button>
          ) : (
            <button type="button" onClick={onClose} className="aip-btn aip-btn--gold">Close</button>
          )}

          {/* Close */}
          <button type="button" onClick={onClose} disabled={pushStatus === 'pushing'} className="aip-btn aip-btn--icon" aria-label="Close">
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* ══ IDE BODY ════════════════════════════════════════════════════════ */}
      {/* This wrapper gives SandpackProvider (which renders as a plain div)  */}
      {/* explicit flex:1 so the IDE body fills all remaining height.         */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <SandpackProvider
          key={refreshKey}
          template={template}
          files={sandpackFiles}
          theme="dark"
          customSetup={{ dependencies }}
          options={{ recompileDelay: 600, externalResources }}
          style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' } as React.CSSProperties}
        >
          <SandboxErrorWatcher onError={handleSandboxError} onResolved={handleSandboxResolved} />
          <CodeEditorSync activeFile={activeFile} projectFiles={projectFiles} setModifiedFiles={setModifiedFiles} transformedCode={transformedCode} />

          <div className="aip-body">
          {/* ── LEFT: Explorer + Editor ── */}
          <div className="aip-editor-pane" style={{ flexBasis: `${editorWidth * 100}%`, flexShrink: 0 }}>
            <FileTreeSidebar
              onFileSelect={handleFileSelect}
              modifiedFiles={modifiedFiles}
              deletedFiles={deletedFiles}
              onNewFile={handleNewFile}
              onDeleteFile={handleDeleteFile}
              activeFile={activeFile}
            />
            <div className="aip-code-area">
              <EditorTabBar
                openFiles={openFiles}
                activeFile={activeFile}
                modifiedFiles={modifiedFiles}
                onTabSelect={setActiveFile}
                onTabClose={handleTabClose}
              />
              <div className="aip-editor-wrap">
                {activeFile ? (
                  <>
                    <SandpackCodeEditor
                      showTabs={false}
                      showLineNumbers
                      showInlineErrors={false}
                      wrapContent={false}
                      style={{ flex: 1, overflow: 'hidden' }}
                    />
                    <div className="aip-status-bar">
                      <span className="aip-status-bar__pos">Ln 1, Col 1</span>
                      <span className="aip-status-bar__lang">{getLang(activeFile)}</span>
                    </div>
                  </>
                ) : (
                  <div className="aip-empty-state">
                    <Code2 size={28} strokeWidth={1.2} />
                    <span>Select a file to edit</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RESIZE HANDLE ── */}
          <ResizeHandle onResize={setEditorWidth} />

          {/* ── RIGHT: Preview ── */}
          <div className="aip-preview-pane">
            {/* Preview toolbar */}
            <div className="aip-preview-toolbar">
              <div className="aip-viewport-group">
                {(['desktop', 'laptop', 'tablet', 'mobile'] as Viewport[]).map((vp) => {
                  const Icon = { desktop: Monitor, laptop: Laptop, tablet: Tablet, mobile: Smartphone }[vp]
                  return (
                    <button
                      key={vp}
                      type="button"
                      title={vp.charAt(0).toUpperCase() + vp.slice(1)}
                      onClick={() => setViewport(vp)}
                      className={`aip-vp-btn${viewport === vp ? ' aip-vp-btn--active' : ''}`}
                    >
                      <Icon size={14} strokeWidth={1.8} />
                    </button>
                  )
                })}
              </div>

              <div className="aip-zoom-group">
                <button type="button" onClick={() => setZoom(z => Math.max(25, z - 25))} disabled={zoom <= 25} className="aip-zoom-btn">
                  <Minus size={13} />
                </button>
                <span className="aip-zoom-label">{zoom}%</span>
                <button type="button" onClick={() => setZoom(z => Math.min(200, z + 25))} disabled={zoom >= 200} className="aip-zoom-btn">
                  <Plus size={13} />
                </button>
              </div>

              <button type="button" onClick={() => setRefreshKey(k => k + 1)} className="aip-vp-btn" title="Refresh">
                <RefreshCw size={14} strokeWidth={1.8} />
              </button>
            </div>

            {/* Error banner */}
            {sandboxHasErrors && (
              <div className="aip-error-banner">
                <div className="aip-error-banner__hd">
                  <AlertTriangle size={13} /> Preview Error
                </div>
                <ul className="aip-error-list">
                  {sandboxErrors.slice(0, 3).map((e, i) => <li key={i}>{e}</li>)}
                </ul>
                <button type="button" className="aip-regen-btn" onClick={onRegenerate} disabled={pushStatus === 'pushing'}>
                  <RefreshCw size={11} /> Regenerate
                </button>
              </div>
            )}

            {/* ── PREVIEW CANVAS ── */}
            <div className="aip-canvas">
              <div
                className="aip-canvas__frame"
                style={{
                  width: VIEWPORT_WIDTHS[viewport],
                  transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
                  transformOrigin: 'top center',
                }}
              >
                <SandpackPreview
                  showNavigator={false}
                  showOpenInCodeSandbox={false}
                />
              </div>
            </div>
          </div>
        </div>
      </SandpackProvider>
      </div>

      {/* ══ SUCCESS TOAST ═══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {pushStatus === 'done' && prUrl && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="aip-toast"
          >
            <CheckCircle size={15} style={{ color: 'var(--bb-success)' }} />
            <span>Pull Request created!</span>
            <a href={prUrl} target="_blank" rel="noopener noreferrer" className="aip-toast__link">
              View on GitHub →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
