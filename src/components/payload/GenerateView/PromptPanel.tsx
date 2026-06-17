'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, AlertCircle } from 'lucide-react';

export interface PromptPanelProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  mode: 'block' | 'page';
  onModeChange: (mode: 'block' | 'page') => void;
  isGenerating: boolean;
  onGenerate: () => void;
  error?: string;
}

const SUGGESTIONS = [
  'Premium hero with gold CTA',
  'Full legal services page',
  'Contact form with map',
  'Attorney profile grid',
  'Practice areas accordion',
];

export const PromptPanel: React.FC<PromptPanelProps> = ({
  prompt,
  onPromptChange,
  mode,
  onModeChange,
  isGenerating,
  onGenerate,
  error,
}) => {
  const charCount = prompt.length;

  return (
    <div className="bb-generate-panel bb-generate-studio-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid rgba(212, 175, 55, 0.4)', position: 'relative' }}>
      {/* Panel Header */}
      <div className="bb-generate-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', padding: '1rem 1.5rem' }}>
        <div className="bb-generate-panel-header-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="bb-generate-panel-header-icon" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wand2 size={16} strokeWidth={2} color="#D4AF37" />
          </div>
          <span style={{ color: 'var(--bb-white)', fontSize: '1.125rem', fontWeight: 600 }}>AI Studio</span>
        </div>

        {/* Mode toggle pill */}
        <div className="bb-generate-mode-toggle" style={{ margin: 0, padding: '0.25rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '9999px', display: 'flex', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <button
            type="button"
            className={`bb-generate-mode-btn ${mode === 'block' ? 'active' : ''}`}
            onClick={() => onModeChange('block')}
            disabled={isGenerating}
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', borderRadius: '9999px', background: mode === 'block' ? '#D4AF37' : 'transparent', color: mode === 'block' ? '#0A192F' : 'var(--bb-muted)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontWeight: mode === 'block' ? 600 : 400 }}
          >
            Single Block
          </button>
          <span style={{ color: 'var(--bb-muted)', padding: '0.35rem 0.2rem', fontSize: '0.8rem' }}>/</span>
          <button
            type="button"
            className={`bb-generate-mode-btn ${mode === 'page' ? 'active' : ''}`}
            onClick={() => onModeChange('page')}
            disabled={isGenerating}
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', borderRadius: '9999px', background: mode === 'page' ? '#D4AF37' : 'transparent', color: mode === 'page' ? '#0A192F' : 'var(--bb-muted)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontWeight: mode === 'page' ? 600 : 400 }}
          >
            Full Page
          </button>
        </div>
      </div>

      {/* Panel Body */}
      <div className="bb-generate-prompt" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Descriptive headline */}
        <div className="bb-generate-headline" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
          <div className="bb-generate-headline-icon" style={{ color: '#D4AF37', marginTop: '0.25rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          <div className="bb-generate-headline-text">
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--bb-white)', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>Describe what you want to build</h2>
            <p style={{ color: 'var(--bb-muted)', margin: 0, fontSize: '0.95rem' }}>Describe what you want to build AI generation studio.</p>
          </div>
        </div>

        {/* Textarea */}
        <div className="bb-generate-textarea-wrapper" style={{ position: 'relative', flex: 1, minHeight: '180px', marginBottom: '1.5rem' }}>
          <textarea
            className="bb-generate-textarea"
            aria-label="Describe what you want to build"
            placeholder="Lorem ipsum dolor sit amet, consectetur..."
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            disabled={isGenerating}
            style={{ width: '100%', height: '100%', minHeight: '180px', resize: 'none', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', padding: '1rem', color: 'var(--bb-white)', fontSize: '0.95rem', lineHeight: '1.5' }}
          />
        </div>

        {/* Suggestion chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <span className="bb-generate-suggestions-label" style={{ color: 'var(--bb-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Quick starts</span>
          <motion.div
            className="bb-generate-suggestions"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.07 },
              },
            }}
            initial="hidden"
            animate="show"
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
          >
            {SUGGESTIONS.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                type="button"
                className="bb-generate-suggestion-chip"
                onClick={() =>
                  onPromptChange(prompt ? `${prompt} ${suggestion}` : suggestion)
                }
                disabled={isGenerating}
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  show: { opacity: 1, y: 0 },
                }}
                style={{
                  padding: '0.4rem 1rem',
                  fontSize: '0.85rem',
                  backgroundColor: index === 0 ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: index === 0 ? '1px solid rgba(212, 175, 55, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '9999px',
                  color: index === 0 ? '#D4AF37' : 'var(--bb-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            className="bb-generate-error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            aria-live="polite"
            style={{ color: '#ef4444', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}
          >
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Generate button */}
        <button
          id="ai-generate-btn"
          type="button"
          className={`bb-generate-button ${isGenerating ? 'loading' : ''}`}
          onClick={onGenerate}
          disabled={isGenerating || prompt.trim() === ''}
          style={{
            width: '100%',
            padding: '0.875rem',
            background: 'linear-gradient(135deg, #E6C875 0%, #D4AF37 50%, #B8860B 100%)',
            color: '#0A192F',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 16px rgba(212, 175, 55, 0.25)',
            textTransform: 'none',
          }}
        >
          {isGenerating ? (
            'Generating...'
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              Generate
            </>
          )}
        </button>
      </div>
    </div>
  );
};
