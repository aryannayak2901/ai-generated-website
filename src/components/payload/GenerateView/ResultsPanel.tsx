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
    <div className="bb-generate-panel bb-generate-results" style={{ width: '340px', flexShrink: 0, position: 'relative' }}>
      {/* Header */}
      <div className="bb-generate-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 1.5rem 0.5rem', borderBottom: 'none', background: 'transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="bb-generate-panel-header-icon" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} strokeWidth={2} color="#D4AF37" />
          </div>
          <span style={{ color: 'var(--bb-white)', fontSize: '1.125rem', fontWeight: 600 }}>Recent Generations</span>
        </div>
        {history.length > 0 && (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'var(--bb-muted)',
            }}
          >
            {history.length}
          </span>
        )}
      </div>

      {/* Body */}
      {history.length === 0 ? (
        <div className="bb-generate-panel-body" style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="bb-generate-empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
            <motion.div
              className="bb-generate-empty-icon"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '64px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed rgba(212, 175, 55, 0.4)',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderRadius: '1rem',
                marginBottom: '0.5rem'
              }}
            >
              <Sparkles size={28} color="#D4AF37" strokeWidth={2} />
            </motion.div>
            <h3 style={{ color: 'var(--bb-white)', fontSize: '1.125rem', fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>Your generated blocks will appear here</h3>
            <p style={{ color: 'var(--bb-muted)', fontSize: '0.9rem', margin: 0 }}>Your generated blocks will appear here</p>
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
