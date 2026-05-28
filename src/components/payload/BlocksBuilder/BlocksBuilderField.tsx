'use client';

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
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
  onChangeBlockDirty?: (isDirty: boolean) => void;
}

export function BlocksBuilderField({ 
  path, 
  label, 
  customHeader, 
  id: propId, 
  collectionSlug: propCollectionSlug,
  isFullscreen: propIsFullscreen,
  onFullscreenChange: propOnFullscreenChange,
  onChangeBlockDirty
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
  const [isBlockDirty, setIsBlockDirty] = React.useState(false);
  const [pendingBlockAction, setPendingBlockAction] = React.useState<{ type: 'close' | 'switch'; targetBlockId?: string } | null>(null);

  // Propagate block-level dirty state to parent
  useEffect(() => {
    if (onChangeBlockDirty) {
      onChangeBlockDirty(isBlockDirty);
    }
  }, [isBlockDirty, onChangeBlockDirty]);

  const isFullscreen = propIsFullscreen !== undefined ? propIsFullscreen : internalIsFullscreen;
  const setIsFullscreen = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === 'function' ? val(isFullscreen) : val;
    if (propOnFullscreenChange) {
      propOnFullscreenChange(nextVal);
    } else {
      setInternalIsFullscreen(nextVal);
    }
  }, [isFullscreen, propOnFullscreenChange]);

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
  }, [isFullscreen, setIsFullscreen]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
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
  }, [blocks, addBlock, moveBlock]);

  const handleEditBlock = useCallback((blockId: string) => {
    if (isBlockDirty && selectedBlockId !== blockId) {
      setPendingBlockAction({ type: 'switch', targetBlockId: blockId });
    } else {
      selectBlock(blockId);
    }
  }, [isBlockDirty, selectedBlockId, selectBlock]);

  const handleSaveBlock = useCallback((blockId: string, updates: any) => {
    updateBlock(blockId, updates);
    setIsBlockDirty(false);
    
    if (pendingBlockAction?.type === 'switch' && pendingBlockAction.targetBlockId) {
      selectBlock(pendingBlockAction.targetBlockId);
    } else {
      selectBlock(null);
    }
    setPendingBlockAction(null);
  }, [updateBlock, pendingBlockAction, selectBlock]);

  const handleCancelBlock = useCallback(() => {
    if (isBlockDirty) {
      setPendingBlockAction({ type: 'close' });
    } else {
      selectBlock(null);
    }
  }, [isBlockDirty, selectBlock]);

  const handleSaveAndClose = useCallback(() => {
    const saveBtn = document.querySelector('.bb-edit__save') as HTMLButtonElement | null;
    if (saveBtn) {
      saveBtn.click();
    } else {
      setIsBlockDirty(false);
      if (pendingBlockAction?.type === 'switch' && pendingBlockAction.targetBlockId) {
        selectBlock(pendingBlockAction.targetBlockId);
      } else {
        selectBlock(null);
      }
    }
    setPendingBlockAction(null);
  }, [pendingBlockAction, selectBlock]);

  const handleDiscardChanges = useCallback(() => {
    setIsBlockDirty(false);
    if (pendingBlockAction?.type === 'switch' && pendingBlockAction.targetBlockId) {
      selectBlock(pendingBlockAction.targetBlockId);
    } else {
      selectBlock(null);
    }
    setPendingBlockAction(null);
  }, [pendingBlockAction, selectBlock]);

  const handleKeepEditing = useCallback(() => {
    setPendingBlockAction(null);
  }, []);

  const handleDeleteBlock = useCallback((blockId: string) => {
    removeBlock(blockId);
  }, [removeBlock]);

  const handleMoveBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
    const currentIndex = blocks.findIndex(b => b.id === blockId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < blocks.length) {
      moveBlock(currentIndex, newIndex);
    }
  }, [blocks, moveBlock]);

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
                key={`edit-panel-${selectedBlock.id}`}
                style={{ 
                  width: 340, 
                  height: '100%',
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
                  onCancel={handleCancelBlock}
                  onChangeDirty={setIsBlockDirty}
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

      <AnimatePresence>
        {pendingBlockAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(15, 27, 45, 0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '24px',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                background: 'var(--bb-navy)',
                border: '1px solid var(--bb-border)',
                borderRadius: '8px',
                padding: '32px',
                maxWidth: '480px',
                width: '100%',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '24px',
                    fontWeight: 600,
                    color: 'var(--bb-white)',
                    letterSpacing: '0.02em',
                    margin: 0,
                  }}
                >
                  Unsaved Changes
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--bb-muted)',
                    lineHeight: '1.6',
                    margin: 0,
                  }}
                >
                  You have unsaved modifications in this block. Would you like to save your progress before leaving?
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginTop: '8px',
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: 'var(--bb-gold-light)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveAndClose}
                  style={{
                    background: 'var(--bb-gold)',
                    color: 'var(--bb-navy)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s',
                  }}
                >
                  Save & Close
                </motion.button>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(224, 85, 85, 0.1)', borderColor: 'var(--bb-danger)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDiscardChanges}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--bb-danger)',
                      color: 'var(--bb-danger)',
                      borderRadius: '4px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.2s, border-color 0.2s',
                    }}
                  >
                    Discard Changes
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleKeepEditing}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: 'none',
                      color: 'var(--bb-white)',
                      borderRadius: '4px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    Keep Editing
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}