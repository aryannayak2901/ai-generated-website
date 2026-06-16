'use client';

import React from 'react';

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
    <div className="bb-generate-panel bb-generate-prompt-wrapper">
      <div className="bb-generate-panel-header">
        Prompt
      </div>
      <div className="bb-generate-panel-body">
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
          placeholder="Describe what you want to build..."
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          disabled={isGenerating}
        />

        <div className="bb-generate-suggestions">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="bb-generate-suggestion-chip"
              onClick={() => onPromptChange(suggestion)}
              disabled={isGenerating}
            >
              {suggestion}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>
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
    </div>
  );
};
