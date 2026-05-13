'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { blockMeta } from './constants/blockMeta'
import type { BlockInstance } from './hooks/useBlocksBuilder'

interface CanvasBlockProps {
  block: BlockInstance
  isSelected: boolean
  isFirst: boolean
  isLast: boolean
  onEdit: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onDelete: (id: string) => void
}

export function CanvasBlock({
  block,
  isSelected,
  isFirst,
  isLast,
  onEdit,
  onMoveUp,
  onMoveDown,
  onDelete,
}: CanvasBlockProps) {
  const meta = blockMeta[block.blockType]
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
  }

  const label = (block.blockName as string) || meta?.label || block.blockType
  const badge = meta?.badgeLabel || block.blockType.slice(0, 4).toUpperCase()
  const categoryClass = meta
    ? `bb-canvas-block__badge--${meta.category.replace(/\s*\/\s*/g, '-').replace(/\s+/g, '-').toLowerCase()}`
    : ''

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bb-canvas-block${isSelected ? ' bb-canvas-block--selected' : ''}`}
      aria-label={`Block: ${label}`}
    >
      {/* Drag handle */}
      <button
        className="bb-canvas-block__handle"
        {...listeners}
        {...attributes}
        aria-label="Drag to reorder"
        title="Drag to reorder"
      >
        ⠿
      </button>

      {/* Badge */}
      <span className={`bb-canvas-block__badge ${categoryClass}`}>{badge}</span>

      {/* Label */}
      <span className="bb-canvas-block__label">{label}</span>

      {/* Block type hint */}
      <span className="bb-canvas-block__type">{block.blockType}</span>

      {/* Actions */}
      <div className="bb-canvas-block__actions">
        <button
          className="bb-canvas-block__action"
          onClick={() => onEdit(block.id)}
          title="Edit block"
          aria-label={`Edit ${label}`}
        >
          ✏
        </button>
        <button
          className="bb-canvas-block__action"
          onClick={() => onMoveUp(block.id)}
          disabled={isFirst}
          title="Move up"
          aria-label={`Move ${label} up`}
        >
          ↑
        </button>
        <button
          className="bb-canvas-block__action"
          onClick={() => onMoveDown(block.id)}
          disabled={isLast}
          title="Move down"
          aria-label={`Move ${label} down`}
        >
          ↓
        </button>
        <button
          className="bb-canvas-block__action bb-canvas-block__action--danger"
          onClick={() => onDelete(block.id)}
          title="Delete block"
          aria-label={`Delete ${label}`}
        >
          🗑
        </button>
      </div>
    </div>
  )
}
