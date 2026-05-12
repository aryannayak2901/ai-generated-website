'use client'

import { useCallback, useRef } from 'react'

const DEBOUNCE_MS = 600

/**
 * Returns a `triggerRefresh` function that, when called, debounces an
 * iframe reload by DEBOUNCE_MS milliseconds. Pass the ref of the preview
 * iframe element so it can call `contentWindow.location.reload()`.
 */
export function usePreviewRefresh(iframeRef: React.RefObject<HTMLIFrameElement | null>) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerRefresh = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      try {
        iframeRef.current?.contentWindow?.location.reload()
      } catch {
        // Cross-origin reload fallback: reset src to force reload
        const iframe = iframeRef.current
        if (iframe && iframe.src) {
          // eslint-disable-next-line no-self-assign
          iframe.src = iframe.src
        }
      }
    }, DEBOUNCE_MS)
  }, [iframeRef])

  return { triggerRefresh }
}
