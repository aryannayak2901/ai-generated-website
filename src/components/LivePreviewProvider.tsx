'use client'

import React, { useEffect, useState } from 'react'
import { RenderBlocks } from './RenderBlocks'

interface LivePreviewProviderProps {
  initialBlocks: any[]
}

export function LivePreviewProvider({ initialBlocks }: LivePreviewProviderProps) {
  const [blocks, setBlocks] = useState(initialBlocks)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security check: only accept messages from the same origin
      if (event.origin !== window.location.origin) return

      if (event.data?.type === 'PAYLOAD_LIVE_PREVIEW' && Array.isArray(event.data?.blocks)) {
        console.log('Live Preview updated blocks:', event.data.blocks)
        setBlocks(event.data.blocks)
      }
    }

    window.addEventListener('message', handleMessage)
    
    // Also handle initial load if message was sent before listener was ready
    // (though unlikely in this flow)
    
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return <RenderBlocks blocks={blocks} />
}
