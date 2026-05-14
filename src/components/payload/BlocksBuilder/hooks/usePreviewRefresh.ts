'use client';

import { useCallback, useRef } from 'react';

export function usePreviewRefresh(debounceMs: number = 600) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const refresh = useCallback((data?: any) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (iframeRef.current?.contentWindow) {
        // If data is provided, try to send it via postMessage for instant update
        if (data) {
          iframeRef.current.contentWindow.postMessage(
            { 
              type: 'PAYLOAD_LIVE_PREVIEW', 
              blocks: data 
            }, 
            window.location.origin
          );
        } else {
          // Fallback to full reload if no data or initial refresh
          iframeRef.current.contentWindow.location.reload();
        }
      }
    }, data ? 100 : debounceMs); // Faster debounce for postMessage
  }, [debounceMs]);

  const setIframeRef = useCallback((iframe: HTMLIFrameElement | null) => {
    iframeRef.current = iframe;
  }, []);

  return {
    refresh,
    setIframeRef,
    iframeRef,
  };
}