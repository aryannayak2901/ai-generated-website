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
    <>
      {/* Panel Header */}
      <div className="bb-generate-panel-header">
        <div className="bb-generate-panel-header-title">
          <div className="bb-generate-panel-header-icon">
            <Wand2 size={14} strokeWidth={2.2} />
          </div>
          <span>AI Studio</span>
        </div>

        {/* Mode toggle pill */}
        <div className="bb-generate-mode-toggle">
          <button
            type="button"
            className={`bb-generate-mode-btn ${mode === 'block' ? 'active' : ''}`}
            onClick={() => onModeChange('block')}
            disabled={isGenerating}
          >
            Single Block
          </button>
          <button
            type="button"
            className={`bb-generate-mode-btn ${mode === 'page' ? 'active' : ''}`}
            onClick={() => onModeChange('page')}
            disabled={isGenerating}
          >
            Full Page
          </button>
        </div>
      </div>

      {/* Panel Body */}
      <div className="bb-generate-prompt">
        {/* Descriptive headline */}
        <div className="bb-generate-headline">
          <div className="bb-generate-headline-icon">✦</div>
          <div className="bb-generate-headline-text">
            <h2>Describe what you want to build</h2>
            <p>Generates production-ready components for the Chambers of Jeet Bhatt design system</p>
          </div>
        </div>

        {/* Textarea */}
        <div className="bb-generate-textarea-wrapper">
          <textarea
            className="bb-generate-textarea"
            aria-label="Describe what you want to build"
            placeholder="e.g. A premium hero section with a dark navy background, gold CTA button, and an attorney headshot on the right..."
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            disabled={isGenerating}
          />
          {charCount > 0 && (
            <span className="bb-generate-char-count">{charCount}</span>
          )}
        </div>

        {/* Suggestion chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span className="bb-generate-suggestions-label">Quick starts</span>
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
          >
            {SUGGESTIONS.map((suggestion) => (
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
          >
            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
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
        >
          {isGenerating ? 'Generating...' : '✦ Generate'}
        </button>
      </div>
    </>
  );
};
