'use client'

import React from 'react'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CanvasBlock } from './CanvasBlock'
import type { BlockInstance, Viewport } from './hooks/useBlocksBuilder'

interface CanvasPanelProps {
  blocks: BlockInstance[]
  selectedBlockId: string | null
  viewport: Viewport
  onEdit: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onDelete: (id: string) => void
  onViewportChange: (viewport: Viewport) => void
}

/** Drop zone at the bottom of the canvas — accepts chips from the library */
function CanvasDropZone() {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-drop' })
  return (
    <div
      ref={setNodeRef}
      className={`bb-canvas__dropzone${isOver ? ' bb-canvas__dropzone--over' : ''}`}
      aria-label="Drop block here"
    >
      {isOver ? '✅ Release to add block' : '⊕  Drag a block here'}
    </div>
  )
}

export function CanvasPanel({
  blocks,
  selectedBlockId,
  viewport,
  onEdit,
  onMoveUp,
  onMoveDown,
  onDelete,
  onViewportChange,
}: CanvasPanelProps) {
  const blockIds = blocks.map((b) => b.id)

  return (
    <section className="bb-canvas" aria-label="Page canvas">
      {/* Toolbar */}
      <div className="bb-canvas__toolbar">
        <span className="bb-canvas__count">
          {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'}
        </span>
        <div className="bb-canvas__viewport-toggle" role="group" aria-label="Viewport">
          <button
            className={`bb-canvas__vp-btn${viewport === 'desktop' ? ' bb-canvas__vp-btn--active' : ''}`}
            onClick={() => onViewportChange('desktop')}
            aria-pressed={viewport === 'desktop'}
            title="Desktop view"
          >
            🖥 Desktop
          </button>
          <button
            className={`bb-canvas__vp-btn${viewport === 'mobile' ? ' bb-canvas__vp-btn--active' : ''}`}
            onClick={() => onViewportChange('mobile')}
            aria-pressed={viewport === 'mobile'}
            title="Mobile view"
          >
            📱 Mobile
          </button>
        </div>
      </div>

      {/* Sortable list */}
      <div className="bb-canvas__list">
        <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
          {blocks.length === 0 ? (
            <p className="bb-canvas__empty">
              No blocks yet — drag one from the library
            </p>
          ) : (
            blocks.map((block, index) => (
              <CanvasBlock
                key={block.id}
                block={block}
                isSelected={block.id === selectedBlockId}
                isFirst={index === 0}
                isLast={index === blocks.length - 1}
                onEdit={onEdit}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onDelete={onDelete}
              />
            ))
          )}
        </SortableContext>

        {/* Drop zone always visible at bottom */}
        <CanvasDropZone />
      </div>
    </section>
  )
}
