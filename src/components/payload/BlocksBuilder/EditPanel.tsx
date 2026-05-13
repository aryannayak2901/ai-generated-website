'use client'

import React, { useEffect, useRef, useState } from 'react'
import { blockMeta } from './constants/blockMeta'
import type { BlockInstance } from './hooks/useBlocksBuilder'

interface EditPanelProps {
  block: BlockInstance | null
  isOpen: boolean
  onClose: () => void
  onSave: (id: string, data: Partial<BlockInstance>) => void
}

/**
 * Renders a simple key-value form for the selected block's string/number/boolean
 * fields. Non-primitive fields (arrays, objects) are surfaced as JSON textarea
 * so editors can always inspect and modify them.
 *
 * Note: Payload's native `RenderFields` / `useFormFields` API requires deep form
 * context that is hard to replicate outside the main document form. We therefore
 * use a controlled local form that mirrors the block's current data and writes
 * back via `onSave` → `updateBlock` → `setValue`.
 */
export function EditPanel({ block, isOpen, onClose, onSave }: EditPanelProps) {
  const [localData, setLocalData] = useState<Record<string, unknown>>({})
  const panelRef = useRef<HTMLDivElement>(null)

  // Seed local form whenever the selected block changes
  useEffect(() => {
    if (block) {
      // Exclude internal Payload / DnD fields
      const { id: _id, blockType: _bt, ...rest } = block
      setLocalData(rest as Record<string, unknown>)
    }
  }, [block?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!block) return null

  const meta = blockMeta[block.blockType]
  const title = meta?.label ?? block.blockType

  function handleFieldChange(key: string, value: unknown) {
    setLocalData((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    onSave(block!.id, localData as Partial<BlockInstance>)
    onClose()
  }

  /** Render a typed input per field value */
  function renderField(key: string, value: unknown) {
    if (typeof value === 'boolean') {
      return (
        <label key={key} className="bb-edit__field bb-edit__field--checkbox">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => handleFieldChange(key, e.target.checked)}
          />
          <span>{humanLabel(key)}</span>
        </label>
      )
    }

    if (typeof value === 'number') {
      return (
        <div key={key} className="bb-edit__field">
          <label className="bb-edit__label">{humanLabel(key)}</label>
          <input
            type="number"
            className="bb-edit__input"
            value={value}
            onChange={(e) => handleFieldChange(key, Number(e.target.value))}
          />
        </div>
      )
    }

    if (typeof value === 'string') {
      const isLong = value.length > 80 || key.toLowerCase().includes('body')
      return (
        <div key={key} className="bb-edit__field">
          <label className="bb-edit__label">{humanLabel(key)}</label>
          {isLong ? (
            <textarea
              className="bb-edit__textarea"
              value={value}
              rows={4}
              onChange={(e) => handleFieldChange(key, e.target.value)}
            />
          ) : (
            <input
              type="text"
              className="bb-edit__input"
              value={value}
              onChange={(e) => handleFieldChange(key, e.target.value)}
            />
          )}
        </div>
      )
    }

    // Arrays / objects — JSON editor fallback
    const jsonStr = JSON.stringify(value, null, 2)
    return (
      <div key={key} className="bb-edit__field">
        <label className="bb-edit__label">
          {humanLabel(key)} <span className="bb-edit__json-badge">JSON</span>
        </label>
        <textarea
          className="bb-edit__textarea bb-edit__textarea--json"
          defaultValue={jsonStr}
          rows={5}
          onBlur={(e) => {
            try {
              handleFieldChange(key, JSON.parse(e.target.value))
            } catch {
              // keep previous value on parse error
            }
          }}
        />
      </div>
    )
  }

  return (
    <div
      ref={panelRef}
      className={`bb-edit${isOpen ? ' bb-edit--open' : ''}`}
      role="dialog"
      aria-label={`Edit: ${title}`}
      aria-modal="true"
    >
      {/* Header */}
      <div className="bb-edit__header">
        <h3 className="bb-edit__title">
          <span className="bb-edit__icon">{meta?.icon ?? '📦'}</span>
          Edit: {title}
        </h3>
        <button className="bb-edit__close" onClick={onClose} aria-label="Close edit panel">
          ✕
        </button>
      </div>

      {/* Body — scrollable field list */}
      <div className="bb-edit__body">
        {Object.keys(localData).length === 0 ? (
          <p className="bb-edit__empty">This block has no editable fields.</p>
        ) : (
          Object.entries(localData).map(([key, value]) => renderField(key, value))
        )}
      </div>

      {/* Footer */}
      <div className="bb-edit__footer">
        <button className="bb-edit__cancel" onClick={onClose}>
          Discard
        </button>
        <button className="bb-edit__save" onClick={handleSave}>
          Save Block
        </button>
      </div>
    </div>
  )
}

/** Convert camelCase or snake_case key to human-readable label */
function humanLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}
