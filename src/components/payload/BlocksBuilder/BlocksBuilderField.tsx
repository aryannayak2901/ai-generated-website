'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useBlocksBuilder } from './hooks/useBlocksBuilder';
import { usePreviewRefresh } from './hooks/usePreviewRefresh';
import { BlockLibraryPanel } from './BlockLibraryPanel';
import { CanvasPanel } from './CanvasPanel';
import { EditPanel } from './EditPanel';
import { PreviewPanel } from './PreviewPanel';
import { blockMeta } from './constants/blockMeta';
import './styles.css';

interface BlocksBuilderFieldProps {
  path: string;
  label: string;
  customHeader?: React.ReactNode;
  id?: string | null;
  collectionSlug?: string;
  isFullscreen?: boolean;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

export function BlocksBuilderField({ 
  path, 
  label, 
  customHeader, 
  id: propId, 
  collectionSlug: propCollectionSlug,
  isFullscreen: propIsFullscreen,
  onFullscreenChange: propOnFullscreenChange
}: BlocksBuilderFieldProps) {
  const {
    blocks,
    selectedBlockId,
    viewport,
    search,
    addBlock,
    removeBlock,
    moveBlock,
    updateBlock,
    selectBlock,
    setViewport,
    setSearch,
    getSelectedBlock,
  } = useBlocksBuilder(path);

  const { refresh, setIframeRef } = usePreviewRefresh();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [internalIsFullscreen, setInternalIsFullscreen] = React.useState(false);

  const isFullscreen = propIsFullscreen !== undefined ? propIsFullscreen : internalIsFullscreen;
  const setIsFullscreen = (val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === 'function' ? val(isFullscreen) : val;
    if (propOnFullscreenChange) {
      propOnFullscreenChange(nextVal);
    } else {
      setInternalIsFullscreen(nextVal);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const selectedBlock = getSelectedBlock();

  // Refresh preview when blocks change
  useEffect(() => {
    if (blocks.length > 0) {
      refresh(blocks);
    }
  }, [blocks, refresh]);

  // Handle escape to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    // Handle adding new block from library
    if (active.id && over.id === 'canvas-drop' && active.data.current?.type === 'library-block') {
      const blockType = active.id as string;
      const meta = blockMeta[blockType];
      
      if (meta) {
        addBlock(blockType, meta.defaultValues);
      }
    }
    
    // Handle reordering existing blocks
    if (active.id && over.id && active.id !== over.id && active.data.current?.type === 'canvas-block') {
      const oldIndex = blocks.findIndex(b => b.id === active.id);
      const newIndex = blocks.findIndex(b => b.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        moveBlock(oldIndex, newIndex);
      }
    }

    setActiveId(null);
  };

  const handleEditBlock = (blockId: string) => {
    selectBlock(blockId);
  };

  const handleSaveBlock = (blockId: string, updates: any) => {
    updateBlock(blockId, updates);
    selectBlock(null);
    // refresh() is handled by useEffect when blocks change
  };

  const handleDeleteBlock = (blockId: string) => {
    removeBlock(blockId);
  };

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    const currentIndex = blocks.findIndex(b => b.id === blockId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < blocks.length) {
      moveBlock(currentIndex, newIndex);
    }
  };

  return (
    <motion.div 
      layout
      className={`bb-root ${isFullscreen ? 'bb-root--fullscreen' : ''} ${customHeader ? 'bb-root--studio' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="bb-titlebar">
          {customHeader ? customHeader : (
            <>
              <div className="bb-titlebar__title">CHAMBERS STUDIO</div>
            </>
          )}
          <div className="bb-titlebar__breadcrumb">
            {blocks.length} block{blocks.length !== 1 ? 's' : ''} in layout
          </div>
          <button 
            type="button"
            className="bb-titlebar__fullscreen-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            )}
          </button>
        </div>

        <div className={`bb-studio ${selectedBlockId ? 'bb-studio--editing' : ''}`}>
          <div className="bb-library">
            <BlockLibraryPanel
              search={search}
              onSearchChange={setSearch}
            />
          </div>

          <div className="bb-canvas">
            <CanvasPanel
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              viewport={viewport}
              onEditBlock={handleEditBlock}
              onDeleteBlock={handleDeleteBlock}
              onMoveBlock={handleMoveBlock}
              onViewportChange={setViewport}
            />
          </div>

          <AnimatePresence mode="wait">
            {selectedBlockId && selectedBlock ? (
              <motion.div 
                key="edit-panel"
                style={{ 
                  width: 340, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  flexShrink: 0,
                  background: 'var(--bb-navy-mid)',
                  borderRight: '1px solid var(--bb-border)',
                  overflow: 'hidden',
                  zIndex: 10
                }}
                initial={{ x: 340, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 340, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                <EditPanel
                  block={selectedBlock}
                  onSave={handleSaveBlock}
                  onCancel={() => selectBlock(null)}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="bb-preview">
            <PreviewPanel
              viewport={viewport}
              onViewportChange={setViewport}
              onIframeRef={setIframeRef}
              id={propId}
              collectionSlug={propCollectionSlug}
            />
          </div>
        </div>

        <DragOverlay>
          {activeId && (
            <div className="bb-drag-ghost">
              <span style={{ fontSize: '14px' }}>{blockMeta[activeId]?.icon || '🧱'}</span>
              <span>{blockMeta[activeId]?.label || 'Block'}</span>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </motion.div>
  );
}