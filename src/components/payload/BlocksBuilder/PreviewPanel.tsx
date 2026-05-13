'use client'

import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import type { Viewport } from './hooks/useBlocksBuilder'
import { usePreviewRefresh } from './hooks/usePreviewRefresh'

export interface PreviewPanelHandle {
  refresh: () => void
}

interface PreviewPanelProps {
  pageSlug: string
  viewport: Viewport
  previewSecret: string
}

export const PreviewPanel = forwardRef<PreviewPanelHandle, PreviewPanelProps>(
  function PreviewPanel({ pageSlug, viewport, previewSecret }, ref) {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const { triggerRefresh } = usePreviewRefresh(iframeRef)
    const [loadError, setLoadError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Expose refresh() to parent via ref
    useImperativeHandle(ref, () => ({ refresh: triggerRefresh }), [triggerRefresh])

    // Build the draft URL — iframe hits the Next.js front-end in draft mode
    const slug = pageSlug || ''
    const src = slug
      ? `/${slug}?draft=true&secret=${encodeURIComponent(previewSecret)}`
      : null

    // Reset error/loading state whenever src changes
    useEffect(() => {
      setLoadError(false)
      setIsLoading(true)
    }, [src])

    const iframeStyle: React.CSSProperties =
      viewport === 'mobile'
        ? { width: '390px', margin: '0 auto', display: 'block', height: '100%' }
        : { width: '100%', height: '100%' }

    return (
      <aside className="bb-preview" aria-label="Live preview">
        {/* Header */}
        <div className="bb-preview__header">
          <span className="bb-preview__title">
            Preview
            {!loadError && (
              <span className="bb-preview__live-dot" title="Live preview" aria-label="Live" />
            )}
          </span>
          <button
            className="bb-preview__refresh"
            onClick={triggerRefresh}
            title="Force refresh preview"
            aria-label="Refresh preview"
          >
            ↺
          </button>
        </div>

        {/* Iframe container */}
        <div className="bb-preview__body">
          {!src ? (
            <div className="bb-preview__unavailable">
              <span>🔒</span>
              <p>Save the page first to enable preview.</p>
            </div>
          ) : loadError ? (
            <div className="bb-preview__unavailable">
              <span>⚠️</span>
              <p>Preview unavailable.</p>
              <button className="bb-preview__retry" onClick={() => { setLoadError(false); setIsLoading(true) }}>
                Retry
              </button>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="bb-preview__loading" aria-live="polite">
                  <span className="bb-preview__spinner" />
                  Loading preview…
                </div>
              )}
              <iframe
                ref={iframeRef}
                src={src}
                style={iframeStyle}
                className="bb-preview__iframe"
                title="Page preview"
                onLoad={() => setIsLoading(false)}
                onError={() => { setLoadError(true); setIsLoading(false) }}
              />
            </>
          )}
        </div>
      </aside>
    )
  },
)
