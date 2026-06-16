import React from 'react';
import { GenerationHistoryItem } from './types';
import { GenerationHistoryCard } from './GenerationHistoryCard';
import { Sparkles } from 'lucide-react';

interface ResultsPanelProps {
  history: GenerationHistoryItem[];
  onOpenInEditor: (item: GenerationHistoryItem) => void;
  onAddToPage: (item: GenerationHistoryItem) => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  history,
  onOpenInEditor,
  onAddToPage,
}) => {
  return (
    <div className="bb-generate-results flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-lg font-semibold tracking-tight">Recent Generations</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-8 border-2 border-dashed rounded-2xl border-border/50 bg-muted/10">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-base font-medium text-foreground mb-2">Your generated blocks will appear here</h3>
            <p className="text-sm text-muted-foreground max-w-[280px]">
              Enter a prompt in the left panel to create new UI components and layout blocks.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {history.map((item) => (
              <GenerationHistoryCard 
                key={item.id} 
                item={item} 
                onOpenInEditor={onOpenInEditor} 
                onAddToPage={onAddToPage} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
