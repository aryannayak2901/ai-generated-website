'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { CanvasBlock } from './CanvasBlock';
import { BlockInstance } from './hooks/useBlocksBuilder';
import { blockMeta } from './constants/blockMeta';

interface CanvasPanelProps {
  blocks: BlockInstance[];
  selectedBlockId: string | null;
  viewport: 'desktop' | 'mobile';
  onEditBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
  onMoveBlock: (blockId: string, direction: 'up' | 'down') => void;
  onViewportChange: (viewport: 'desktop' | 'mobile') => void;
}

export function CanvasPanel({
  blocks,
  selectedBlockId,
  viewport,
  onEditBlock,
  onDeleteBlock,
  onMoveBlock,
  onViewportChange,
}: CanvasPanelProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop',
  });

  return (
    <div className="bb-canvas">
      <div className="bb-canvas__toolbar">
        <div className="bb-canvas__count">
          {blocks.length} block{blocks.length !== 1 ? 's' : ''}
        </div>
        
        <div className="bb-canvas__viewport-toggle">
          <button
            className={`bb-canvas__vp-btn ${viewport === 'desktop' ? 'bb-canvas__vp-btn--active' : ''}`}
            onClick={() => onViewportChange('desktop')}
          >
            Desktop
          </button>
          <button
            className={`bb-canvas__vp-btn ${viewport === 'mobile' ? 'bb-canvas__vp-btn--active' : ''}`}
            onClick={() => onViewportChange('mobile')}
          >
            Mobile
          </button>
        </div>
      </div>

      <div className="bb-canvas__list" ref={setNodeRef}>
        {blocks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bb-canvas__empty"
          >
            <div className="bb-canvas__empty-icon">✨</div>
            <div className="bb-canvas__empty-title">Studio Canvas Empty</div>
            <p className="bb-canvas__empty-text">
              Transform your vision into reality by dragging blocks from the library.
            </p>
            <div className="bb-canvas__empty-hint">
              <span className="bb-canvas__empty-badge">Pro Tip</span>
              Use the full-screen mode for the best editing experience.
            </div>
          </motion.div>
        ) : (
          <SortableContext items={blocks.map(b => b.id)}>
            {blocks.map((block, index) => (
              <CanvasBlock
                key={block.id}
                block={block}
                meta={blockMeta[block.blockType]}
                isSelected={selectedBlockId === block.id}
                isFirst={index === 0}
                isLast={index === blocks.length - 1}
                onEdit={() => onEditBlock(block.id)}
                onDelete={() => onDeleteBlock(block.id)}
                onMoveUp={() => onMoveBlock(block.id, 'up')}
                onMoveDown={() => onMoveBlock(block.id, 'down')}
              />
            ))}
          </SortableContext>
        )}
        
        <div className={`bb-canvas__dropzone ${isOver ? 'bb-canvas__dropzone--over' : ''}`}>
          {isOver ? 'Release to add block' : 'Drop blocks here'}
        </div>
      </div>
    </div>
  );
}

export default CanvasPanel;