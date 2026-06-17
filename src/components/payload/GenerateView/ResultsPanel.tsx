import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="bb-generate-panel bb-generate-results">
      {/* Header */}
      <div className="bb-generate-panel-header">
        <div className="bb-generate-panel-header-title">
          <div className="bb-generate-panel-header-icon">
            <Sparkles size={14} strokeWidth={2.2} />
          </div>
          <span>Recent Generations</span>
        </div>
        {history.length > 0 && (
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
              background: 'var(--gs-gold-dim)',
              color: 'var(--gs-gold-light)',
              border: '1px solid rgba(201, 168, 76, 0.2)',
            }}
          >
            {history.length}
          </span>
        )}
      </div>

      {/* Body */}
      {history.length === 0 ? (
        <div className="bb-generate-panel-body" style={{ display: 'flex', flex: 1 }}>
          <div className="bb-generate-empty-state">
            <motion.div
              className="bb-generate-empty-icon"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✦
            </motion.div>
            <h3 className="bb-generate-empty-title">Your generated blocks will appear here</h3>
            <p className="bb-generate-empty-sub">
              Enter a prompt in the left panel to create new UI components and layout blocks.
            </p>
          </div>
        </div>
      ) : (
        <div className="bb-generate-history-list">
          <AnimatePresence initial={false}>
            {history.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, delay: i === 0 ? 0 : 0 }}
              >
                <GenerationHistoryCard
                  item={item}
                  onOpenInEditor={onOpenInEditor}
                  onAddToPage={onAddToPage}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
