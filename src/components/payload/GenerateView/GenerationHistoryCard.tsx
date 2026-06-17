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
    <div className="bb-generate-history-card p-4 border rounded-xl bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <div className="bb-generate-history-card-header flex items-center justify-between mb-2">
        <div className="bb-generate-history-card-type flex items-center font-medium">
          {blockIcon ? (
            <span className="mr-2 text-primary">{blockIcon}</span>
          ) : (
            <Box className="w-4 h-4 mr-2 text-primary" />
          )}
          {blockName}
        </div>
        <div className="bb-generate-history-card-time text-xs text-muted-foreground">
          {getRelativeTime(item.timestamp)}
        </div>
      </div>
      
      <div className="bb-generate-history-card-prompt text-sm text-muted-foreground mb-4 line-clamp-2">
        {item.prompt}
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
        <span className="text-[10px] font-mono bg-muted px-2 py-1 rounded text-muted-foreground uppercase tracking-wide">
          {item.provider} / {item.model}
        </span>
        
        <div className="flex gap-2">
          <button 
            onClick={() => onOpenInEditor(item)}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            Open in Editor
          </button>
          <button 
            onClick={() => onAddToPage(item)}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors shadow-sm"
          >
            Add to Page
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
