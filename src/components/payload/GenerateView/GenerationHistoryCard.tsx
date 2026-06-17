import React from 'react';
import { GenerationHistoryItem } from './types';
import { Code, ArrowRight, Box } from 'lucide-react';

interface GenerationHistoryCardProps {
  item: GenerationHistoryItem;
  onOpenInEditor: (item: GenerationHistoryItem) => void;
  onAddToPage: (item: GenerationHistoryItem) => void;
}

function getRelativeTime(timestamp: number) {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diffInSeconds = (timestamp - Date.now()) / 1000;

  if (Math.abs(diffInSeconds) < 60) return rtf.format(Math.round(diffInSeconds), 'second');
  if (Math.abs(diffInSeconds) < 3600) return rtf.format(Math.round(diffInSeconds / 60), 'minute');
  if (Math.abs(diffInSeconds) < 86400) return rtf.format(Math.round(diffInSeconds / 3600), 'hour');

  return rtf.format(Math.round(diffInSeconds / 86400), 'day');
}

export const GenerationHistoryCard: React.FC<GenerationHistoryCardProps> = ({
  item,
  onOpenInEditor,
  onAddToPage,
}) => {
  const block = item.response.blocks?.[0];
  const blockName = block?.label || 'Generated Block';
  const blockIcon = block?.icon;

  return (
    <div className="bb-generate-history-card" style={{ padding: '1.25rem 1.5rem', border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'transparent', borderRadius: 0, boxShadow: 'none' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D4AF37', fontWeight: 500, fontSize: '0.95rem' }}>
          {blockIcon ? <span>{blockIcon}</span> : <Box size={14} />}
          <span>{blockName}</span>
        </div>
        <span style={{ color: 'var(--bb-muted)', fontSize: '0.8rem' }}>
          {getRelativeTime(item.timestamp)}
        </span>
      </div>

      {/* Prompt preview */}
      <p style={{ color: 'var(--bb-white)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {item.prompt}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.25rem' }}>
        <span style={{ color: 'var(--bb-white)', fontSize: '0.9rem' }}>
          {item.provider} / {item.model}
        </span>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onOpenInEditor(item)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.25)', color: 'var(--bb-white)', border: 'none', borderRadius: '0.25rem', fontSize: '0.8rem', cursor: 'pointer', transition: 'background-color 0.2s' }}
          >
            <Code size={12} strokeWidth={2.2} />
            Editor
          </button>
          <button
            onClick={() => onAddToPage(item)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.25)', color: 'var(--bb-white)', border: 'none', borderRadius: '0.25rem', fontSize: '0.8rem', cursor: 'pointer', transition: 'background-color 0.2s' }}
          >
            Add
            <ArrowRight size={12} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
};
