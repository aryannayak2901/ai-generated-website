'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BlockInstance } from './hooks/useBlocksBuilder';
import { BlockMeta } from './constants/blockMeta';
import { useHasMounted } from './hooks/useHasMounted';

interface CanvasBlockProps {
  block: BlockInstance;
  meta: BlockMeta;
  isSelected: boolean;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function CanvasBlock({
  block,
  meta,
  isSelected,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: CanvasBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: {
      type: 'canvas-block',
      block,
    },
  });
  const hasMounted = useHasMounted();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const _badgeClass = `bb-canvas-block__badge bb-canvas-block__badge--${meta.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bb-canvas-block ${isSelected ? 'bb-canvas-block--selected' : ''}`}
      onClick={onEdit}
    >
      <button
        className="bb-canvas-block__handle"
        {...(hasMounted ? attributes : {})}
        {...(hasMounted ? listeners : {})}
        onClick={(e) => e.stopPropagation()}
      >
        ⋮⋮
      </button>

      <div className="bb-canvas-block__badge">
        {meta.icon}
      </div>

      <div className="bb-canvas-block__label">
        {meta.label}
        <span className="bb-canvas-block__type" style={{ marginLeft: '8px', opacity: 0.5 }}>
          {meta.badgeLabel}
        </span>
      </div>

      <div className="bb-canvas-block__actions">
        <button
          className="bb-canvas-block__action"
          onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
          disabled={isFirst}
          title="Move up"
        >
          ↑
        </button>
        <button
          className="bb-canvas-block__action"
          onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
          disabled={isLast}
          title="Move down"
        >
          ↓
        </button>
        <button
          className="bb-canvas-block__action bb-canvas-block__action--danger"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title="Delete block"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default CanvasBlock;