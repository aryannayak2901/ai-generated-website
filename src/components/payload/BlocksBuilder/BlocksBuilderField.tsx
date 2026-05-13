'use client'

import React, { useRef, useCallback } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useDocumentInfo } from '@payloadcms/ui'

import { useBlocksBuilder } from './hooks/useBlocksBuilder'
import { BlockLibraryPanel } from './BlockLibraryPanel'
import { CanvasPanel } from './CanvasPanel'
import { EditPanel } from './EditPanel'
import { PreviewPanel, PreviewPanelHandle } from './PreviewPanel'
import { blockMeta } from './constants/blockMeta'

import './styles.css'

interface BlocksBuilderFieldProps {
  path: string
}

export function BlocksBuilderField({ path }: BlocksBuilderFieldProps) {
  const { id: docId, slug } = useDocumentInfo()

  const {
    blocks,
    selectedBlockId,
    selectedBlock,
    viewport,
    search,
    addBlock,
    removeBlock,
    reorderBlocks,
    moveUp,
    moveDown,
    selectBlock,
    updateBlock,
    setViewport,
    setSearch,
  } = useBlocksBuilder({ path })

  const previewRef = useRef<PreviewPanelHandle>(null)

  /** After any mutation, debounce-refresh the preview */
  const refreshPreview = useCallback(() => {
    previewRef.current?.refresh()
  }, [])

  // ─── DnD sensors ──────────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const [activeLibraryBlockType, setActiveLibraryBlockType] = React.useState<string | null>(null)

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current
    if (data?.source === 'library') {
      setActiveLibraryBlockType(data.blockType as string)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveLibraryBlockType(null)
    const { active, over } = event
    if (!over) return

    const activeData = active.data.current

    // Library chip dropped onto the canvas drop zone
    if (activeData?.source === 'library' && over.id === 'canvas-drop') {
      addBlock(activeData.blockType as string)
      refreshPreview()
      return
    }

    // Canvas reorder
    if (!activeData?.source || activeData?.source !== 'library') {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        reorderBlocks(oldIndex, newIndex)
        refreshPreview()
      }
    }
  }

  // ─── Derived state ────────────────────────────────────────────────────
  const editPanelOpen = selectedBlockId !== null

  // Page slug comes from the document info; fall back to a reasonable default
  const pageSlug = (docId as string) ? (slug as string) ?? '' : ''
  const previewSecret = process.env.NEXT_PUBLIC_PREVIEW_SECRET ?? ''

  return (
    <div className="bb-root">
      {/* Titlebar */}
      <div className="bb-titlebar">
        <span className="bb-titlebar__logo">⚖</span>
        <span className="bb-titlebar__title">Page Builder</span>
        <span className="bb-titlebar__breadcrumb">{pageSlug || 'Unsaved page'}</span>
      </div>

      {/* Main studio area */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={`bb-studio${editPanelOpen ? ' bb-studio--editing' : ''}`}>
          {/* Panel 1 — Library */}
          <BlockLibraryPanel search={search} onSearchChange={setSearch} />

          {/* Panel 2 — Canvas */}
          <CanvasPanel
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            viewport={viewport}
            onEdit={(id) => selectBlock(id)}
            onMoveUp={(id) => { moveUp(id); refreshPreview() }}
            onMoveDown={(id) => { moveDown(id); refreshPreview() }}
            onDelete={(id) => { removeBlock(id); refreshPreview() }}
            onViewportChange={setViewport}
          />

          {/* Panel 3 — Edit (slide-in) */}
          <EditPanel
            block={selectedBlock}
            isOpen={editPanelOpen}
            onClose={() => selectBlock(null)}
            onSave={(id, data) => { updateBlock(id, data); refreshPreview() }}
          />

          {/* Panel 4 — Live Preview */}
          <PreviewPanel
            ref={previewRef}
            pageSlug={pageSlug}
            viewport={viewport}
            previewSecret={previewSecret}
          />
        </div>

        {/* Drag overlay — ghost chip shown while dragging from library */}
        <DragOverlay>
          {activeLibraryBlockType ? (
            <div className="bb-drag-ghost" style={{ pointerEvents: 'none' }}>
              <span>{blockMeta[activeLibraryBlockType]?.icon}</span>
              <span>{blockMeta[activeLibraryBlockType]?.label}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
