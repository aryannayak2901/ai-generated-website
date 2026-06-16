'use client';

import React from 'react';
import { motion } from 'framer-motion';

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
  "Premium hero with gold CTA",
  "Full legal services page",
  "Contact form with map",
  "Attorney profile grid",
  "Practice areas accordion"
];

export const PromptPanel: React.FC<PromptPanelProps> = ({
  prompt,
  onPromptChange,
  mode,
  onModeChange,
  isGenerating,
  onGenerate,
  error
}) => {
  return (
    <div className="bb-generate-prompt">
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

      <textarea
        className="bb-generate-textarea"
        aria-label="Describe what you want to build"
        placeholder="Describe what you want to build..."
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        disabled={isGenerating}
      />

      <motion.div 
        className="bb-generate-suggestions"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        initial="hidden"
        animate="show"
      >
        {SUGGESTIONS.map((suggestion) => (
          <motion.button
            key={suggestion}
            type="button"
            className="bb-generate-suggestion-chip"
            onClick={() => onPromptChange(prompt ? `${prompt} ${suggestion}` : suggestion)}
            disabled={isGenerating}
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 }
            }}
          >
            {suggestion}
          </motion.button>
        ))}
      </motion.div>

      {error && (
        <div className="bb-generate-error" role="alert" aria-live="polite">
          {error}
        </div>
      )}

      <button
        type="button"
        className={`bb-generate-button ${isGenerating ? 'loading' : ''}`}
        onClick={onGenerate}
        disabled={isGenerating || prompt.trim() === ''}
      >
        {isGenerating ? 'Generating...' : 'Generate ✨'}
      </button>
    </div>
  );
};
