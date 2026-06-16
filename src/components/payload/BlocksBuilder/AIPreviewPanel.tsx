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
import type { GenerateResponseWithCode } from '@/lib/ai/types'
import { transformForSandpack } from '@/lib/ai/sandpackTransformer'
import { FileTreeSidebar } from './FileTreeSidebar'
import { EditorTabBar } from './EditorTabBar'
import { ResizeHandle } from './ResizeHandle'
import { PreviewToolbar } from './PreviewToolbar'

type GeneratedBlockWithCode = GenerateResponseWithCode['blocks'][number]

interface SandboxErrorWatcherProps {
  onError: (errors: string[]) => void
  onResolved: () => void
}

function SandboxErrorWatcher({ onError, onResolved }: SandboxErrorWatcherProps) {
  const { sandpack } = useSandpack()
  const prevHadErrorRef = useRef(false)

  useEffect(() => {
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

function CodeEditorSync({
  activeFile,
  projectFiles,
  setModifiedFiles,
  transformedCode,
}: {
  activeFile: string | null;
  projectFiles: Record<string, string>;
  setModifiedFiles: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  transformedCode: string;
}) {
  const { sandpack } = useSandpack();
  const { code } = useActiveCode();

  useEffect(() => {
    if (sandpack.files['/App.tsx']?.code !== transformedCode) {
      sandpack.updateFile('/App.tsx', transformedCode);
    }
  }, [transformedCode, sandpack]);

  useEffect(() => {
    if (activeFile) {
      const spPath = `/${activeFile}`;
      if (sandpack.activeFile !== spPath && spPath in sandpack.files) {
        sandpack.setActiveFile(spPath);
      }
    }
  }, [activeFile, sandpack]);

  useEffect(() => {
    if (activeFile && code !== undefined) {
      const spPath = `/${activeFile}`;
      if (sandpack.activeFile === spPath) {
        const orig = projectFiles[activeFile] ?? '';
        if (code !== orig) {
          setModifiedFiles((prev) => {
            if (prev[activeFile] === code) return prev;
            return { ...prev, [activeFile]: code };
          });
        } else {
          setModifiedFiles((prev) => {
            if (!(activeFile in prev)) return prev;
            const next = { ...prev };
            delete next[activeFile];
            return next;
          });
        }
      }
    }
  }, [code, activeFile, projectFiles, setModifiedFiles, sandpack.activeFile]);

  return null;
}

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
  const [pushStatus, setPushStatus] = useState<PushStatus>('idle')
  const [prUrl, setPrUrl] = useState('')
  const [sandboxErrors, setSandboxErrors] = useState<string[]>([])
  const [sandboxHasErrors, setSandboxHasErrors] = useState(false)

  // Initialization
  const initialProjectFiles = useMemo(() => {
    const files: Record<string, string> = {};
    blocks.forEach(b => {
      files[`src/components/blocks/${b.componentName}.tsx`] = b.componentCode;
      files[`src/blocks/${b.componentName}.ts`] = b.payloadConfigCode;
    });
    return files;
  }, [blocks]);

  const defaultActiveFile = `src/components/blocks/${blocks[0].componentName}.tsx`;
  const initialOpenFiles = useMemo(() => {
    return Object.keys(initialProjectFiles);
  }, [initialProjectFiles]);

  const [projectFiles, setProjectFiles] = useState<Record<string, string>>(initialProjectFiles);
  const [modifiedFiles, setModifiedFiles] = useState<Record<string, string>>({});
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [openFiles, setOpenFiles] = useState<string[]>(initialOpenFiles);
  const [activeFile, setActiveFile] = useState<string | null>(defaultActiveFile);

  const [editorPanelFraction, setEditorPanelFraction] = useState(0.45);
  const [viewport, setViewport] = useState<'desktop' | 'laptop' | 'tablet' | 'mobile'>('desktop');
  const [zoom, setZoom] = useState(100);
  const [refreshKey, setRefreshKey] = useState(0);

  const block = blocks[activeBlockIdx]
  const componentPath = `src/components/blocks/${block.componentName}.tsx`;
  const currentComponentCode = modifiedFiles[componentPath] ?? projectFiles[componentPath] ?? block.componentCode;

  const { transformedCode, dependencies, externalResources, template } = useMemo(
    () => transformForSandpack(currentComponentCode),
    [currentComponentCode]
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

    try {
      const allModified = Object.entries(modifiedFiles).map(([path, content]) => ({
        path,
        content,
        deleted: false,
      })).concat(deletedFiles.map(path => ({
        path,
        content: '',
        deleted: true,
      })));

      const response = await fetch('/api/ai-push-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockType: block.blockType,
          componentName: block.componentName,
          componentCode: modifiedFiles[componentPath] ?? projectFiles[componentPath],
          payloadConfigCode: modifiedFiles[`src/blocks/${block.componentName}.ts`] ?? projectFiles[`src/blocks/${block.componentName}.ts`],
          prompt,
          provider,
          model,
          modifiedFiles: allModified,
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
      console.error(err)
      setPushStatus('error')
    }
  }

  const handleFileSelect = async (path: string) => {
    if (!projectFiles[path] && !modifiedFiles[path]) {
      try {
        const res = await fetch(`/api/github-files?path=${encodeURIComponent(path)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.type === 'file') {
            const content = Buffer.from(data.content, 'base64').toString('utf-8');
            setProjectFiles(prev => ({ ...prev, [path]: content }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch file', err);
        return;
      }
    }

    setOpenFiles(prev => {
      if (!prev.includes(path)) return [...prev, path];
      return prev;
    });
    setActiveFile(path);
  };

  const handleNewFile = (path: string) => {
    setProjectFiles(prev => ({ ...prev, [path]: '' }));
    setModifiedFiles(prev => ({ ...prev, [path]: '' }));
    setOpenFiles(prev => [...prev, path]);
    setActiveFile(path);
  };

  const handleTabClose = (path: string) => {
    setOpenFiles(prev => {
      const next = prev.filter(p => p !== path);
      if (activeFile === path) {
        setActiveFile(next.length > 0 ? next[next.length - 1] : null);
      }
      return next;
    });
  };

  const handleDeleteFile = (path: string) => {
    setDeletedFiles(prev => [...prev, path]);
    if (openFiles.includes(path)) {
      handleTabClose(path);
    }
  };

  const sandpackFiles = useMemo(() => {
    const f: Record<string, any> = {
      '/index.tsx': {
        code: `import React from 'react'\nimport { createRoot } from 'react-dom/client'\nimport App from './App'\n\nconst root = createRoot(document.getElementById('root')!)\nroot.render(<App />)\n`,
        hidden: true,
      },
      '/App.tsx': {
        code: transformedCode,
        hidden: true,
      }
    };

    const allPaths = new Set([...Object.keys(projectFiles), ...Object.keys(modifiedFiles)]);
    for (const path of allPaths) {
      if (deletedFiles.includes(path)) continue;
      f[`/${path}`] = {
        code: modifiedFiles[path] ?? projectFiles[path],
        active: path === activeFile,
      };
    }
    return f;
  }, [projectFiles, modifiedFiles, deletedFiles, transformedCode, activeFile]);

  const viewportWidths = {
    desktop: '1440px',
    laptop: '1024px',
    tablet: '768px',
    mobile: '390px',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
      className="bb-modal-card bb-modal-card--wide"
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
          
          {blocks.length > 1 && (
            <div className="bb-preview-block-tabs" style={{ marginLeft: 16 }}>
              {blocks.map((b, i) => (
                <button
                  key={b.blockType}
                  type="button"
                  onClick={() => {
                    setActiveBlockIdx(i);
                    const cp = `src/components/blocks/${b.componentName}.tsx`;
                    if (!openFiles.includes(cp)) setOpenFiles(prev => [...prev, cp]);
                    setActiveFile(cp);
                    setSandboxErrors([]);
                    setSandboxHasErrors(false);
                  }}
                  className={`bb-preview-block-tab ${i === activeBlockIdx ? 'bb-preview-block-tab--active' : ''}`}
                >
                  {b.icon} {b.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="bb-modal-status">
            {pushStatus === 'pushing' && '⏳ Creating branch and opening PR…'}
            {pushStatus === 'done' && '✅ Done! Merge the PR to deploy.'}
            {sandboxHasErrors && pushStatus === 'idle' && (
              <span style={{ color: 'var(--bb-danger)', fontSize: 12 }}>
                Preview has errors — fix the code before pushing
              </span>
            )}
          </div>
          {pushStatus !== 'done' && (
            <button
              type="button"
              onClick={handlePush}
              disabled={pushStatus === 'pushing' || sandboxHasErrors}
              className="bb-modal-btn"
            >
              {pushStatus === 'pushing' ? 'Opening PR…' : '🚀 Open PR'}
            </button>
          )}
          {pushStatus === 'done' && (
            <button type="button" onClick={onClose} className="bb-modal-btn">Close</button>
          )}
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
      </div>

      {/* Main Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SandpackProvider
          key={refreshKey}
          template={template}
          files={sandpackFiles}
          theme="dark"
          customSetup={{ dependencies }}
          options={{ recompileDelay: 600, externalResources }}
        >
          <SandboxErrorWatcher onError={handleSandboxError} onResolved={handleSandboxResolved} />
          <CodeEditorSync
            activeFile={activeFile}
            projectFiles={projectFiles}
            setModifiedFiles={setModifiedFiles}
            transformedCode={transformedCode}
          />
          
          {/* Left Panel (Editor) */}
          <div style={{ flexBasis: `${editorPanelFraction * 100}%`, display: 'flex', minWidth: 0, overflow: 'hidden' }}>
            <FileTreeSidebar
              onFileSelect={handleFileSelect}
              modifiedFiles={modifiedFiles}
              deletedFiles={deletedFiles}
              onNewFile={handleNewFile}
              onDeleteFile={handleDeleteFile}
              activeFile={activeFile}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, borderRight: '1px solid var(--bb-border)' }}>
              <EditorTabBar
                openFiles={openFiles}
                activeFile={activeFile}
                modifiedFiles={modifiedFiles}
                onTabSelect={setActiveFile}
                onTabClose={handleTabClose}
              />
              <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {activeFile ? (
                  <>
                    <SandpackCodeEditor
                      showTabs={false}
                      showLineNumbers
                      showInlineErrors={false}
                      wrapContent
                      readOnly={false}
                      style={{ height: '100%', flex: 1 }}
                    />
                    <div className="bb-editor-status-bar">
                      <div className="bb-editor-status-bar__pos">Ln 1, Col 1</div>
                      <div className="bb-editor-status-bar__lang">
                        {activeFile.endsWith('.ts') ? 'TypeScript' : 
                         activeFile.endsWith('.tsx') ? 'TypeScript React' : 
                         activeFile.endsWith('.css') ? 'CSS' : 
                         activeFile.endsWith('.json') ? 'JSON' : 
                         activeFile.endsWith('.js') ? 'JavaScript' : 
                         activeFile.endsWith('.jsx') ? 'JavaScript React' : 
                         'Text'}
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bb-text-muted)' }}>
                    No file open
                  </div>
                )}
              </div>
            </div>
          </div>

          <ResizeHandle onResize={setEditorPanelFraction} />

          {/* Right Panel (Preview) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: 'var(--bb-bg-secondary)' }}>
            <PreviewToolbar
              viewport={viewport}
              setViewport={setViewport}
              zoom={zoom}
              setZoom={setZoom}
              onRefresh={() => setRefreshKey(k => k + 1)}
            />
            
            {sandboxHasErrors && (
              <div className="bb-sandbox-error-panel" style={{ margin: 16 }}>
                <div className="bb-sandbox-error-header">
                  <span className="bb-sandbox-error-icon">⚠</span>
                  <span className="bb-sandbox-error-title">Preview Error</span>
                </div>
                <ul className="bb-sandbox-error-list">
                  {sandboxErrors.slice(0, 3).map((err, i) => <li key={i}>{err}</li>)}
                </ul>
                <div className="bb-sandbox-error-actions">
                  <button type="button" className="bb-regenerate-btn" onClick={onRegenerate} disabled={pushStatus === 'pushing'}>
                    🔄 Regenerate AI Code
                  </button>
                </div>
              </div>
            )}
            
            <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
              <div 
                style={{
                  width: viewportWidths[viewport],
                  height: '100%',
                  minHeight: 500,
                  transition: 'width 0.3s ease',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  borderRadius: 8,
                  overflow: 'hidden',
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'center top',
                }}
              >
                <SandpackPreview
                  style={{ height: '100%', width: '100%' }}
                  showNavigator={false}
                  showOpenInCodeSandbox={false}
                />
              </div>
            </div>
          </div>
        </SandpackProvider>
      </div>
      
      {/* Success Notification */}
      <AnimatePresence>
        {pushStatus === 'done' && prUrl && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bb-preview-success"
            style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}
          >
            <span>✅ Pull Request created!</span>
            <a href={prUrl} target="_blank" rel="noopener noreferrer" className="bb-preview-pr-link">
              View PR on GitHub →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
