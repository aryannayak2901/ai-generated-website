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
    <div className="bb-generate-history-card">
      {/* Header */}
      <div className="bb-generate-history-card-header">
        <div className="bb-generate-history-card-type">
          {blockIcon ? (
            <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>{blockIcon}</span>
          ) : (
            <Box size={13} strokeWidth={2} />
          )}
          <span>{blockName}</span>
          <span className="bb-generate-history-card-badge">
            {item.mode === 'page' ? 'Page' : 'Block'}
          </span>
        </div>
        <span className="bb-generate-history-card-time">
          {getRelativeTime(item.timestamp)}
        </span>
      </div>

      {/* Prompt preview */}
      <p className="bb-generate-history-card-prompt">{item.prompt}</p>

      {/* Footer */}
      <div className="bb-generate-history-card-footer">
        <span
          className="bb-generate-history-card-meta"
          title={`${item.provider} / ${item.model}`}
        >
          {item.provider} / {item.model}
        </span>

        <div className="bb-generate-history-actions">
          <button
            onClick={() => onOpenInEditor(item)}
            className="bb-generate-icon-btn bb-generate-icon-btn--secondary"
            title="Open in Editor"
          >
            <Code size={11} strokeWidth={2.2} />
            Editor
          </button>
          <button
            onClick={() => onAddToPage(item)}
            className="bb-generate-icon-btn bb-generate-icon-btn--primary"
            title="Add to Page"
          >
            Add
            <ArrowRight size={11} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
};
