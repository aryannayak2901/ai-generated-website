'use client'

import React, { useMemo } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { blockMeta, BLOCK_CATEGORIES, BlockCategory } from './constants/blockMeta'

// ─── Draggable Library Chip ────────────────────────────────────────────────────

interface LibraryChipProps {
  blockType: string
}

function LibraryChip({ blockType }: LibraryChipProps) {
  const meta = blockMeta[blockType]
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `library::${blockType}`,
    data: { blockType, source: 'library' },
  })

  const style: React.CSSProperties = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.4 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bb-chip"
      title={`Drag "${meta.label}" onto the canvas`}
    >
      <span className="bb-chip__icon">{meta.icon}</span>
      <span className="bb-chip__label">{meta.label}</span>
      <span className="bb-chip__handle">⠿</span>
    </div>
  )
}

// ─── Block Library Panel ───────────────────────────────────────────────────────

interface BlockLibraryPanelProps {
  search: string
  onSearchChange: (val: string) => void
}

export function BlockLibraryPanel({ search, onSearchChange }: BlockLibraryPanelProps) {
  const filteredByCategory = useMemo(() => {
    const q = search.toLowerCase().trim()
    const result: Record<BlockCategory, string[]> = {
      'Hero': [],
      'Content': [],
      'CTA / Forms': [],
    }

    for (const [blockType, meta] of Object.entries(blockMeta)) {
      if (!q || meta.label.toLowerCase().includes(q) || blockType.toLowerCase().includes(q)) {
        result[meta.category].push(blockType)
      }
    }
    return result
  }, [search])

  const hasResults = BLOCK_CATEGORIES.some((cat) => filteredByCategory[cat].length > 0)

  return (
    <aside className="bb-library">
      {/* Header */}
      <div className="bb-library__header">
        <span className="bb-library__title">Blocks</span>
      </div>

      {/* Search */}
      <div className="bb-library__search-wrap">
        <span className="bb-library__search-icon">🔍</span>
        <input
          className="bb-library__search"
          type="text"
          placeholder="Search…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search blocks"
        />
        {search && (
          <button
            className="bb-library__clear"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Block groups */}
      <div className="bb-library__list">
        {hasResults ? (
          BLOCK_CATEGORIES.map((cat) => {
            const items = filteredByCategory[cat]
            if (items.length === 0) return null
            return (
              <div key={cat} className="bb-library__group">
                <span className="bb-library__group-label">{cat}</span>
                {items.map((blockType) => (
                  <LibraryChip key={blockType} blockType={blockType} />
                ))}
              </div>
            )
          })
        ) : (
          <p className="bb-library__empty">No blocks match "{search}"</p>
        )}
      </div>
    </aside>
  )
}
