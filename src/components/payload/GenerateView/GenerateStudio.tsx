'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PromptPanel } from './PromptPanel';
import { SettingsPanel } from './SettingsPanel';
import { ResultsPanel } from './ResultsPanel';
import { AIPreviewPanel } from '../BlocksBuilder/AIPreviewPanel';
import { useAISettings } from '@/lib/ai/useAISettings';
import type { GenerationHistoryItem } from './types';
import type { GenerateResponseWithCode, GenerationMode } from '@/lib/ai/types';
import './styles.css';

export const GenerateStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<GenerationMode>('block');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [previewBlocks, setPreviewBlocks] = useState<GenerateResponseWithCode['blocks'] | null>(null);

  const { settings } = useAISettings();
  const isLoaded = useRef(false);

  // Load history from localStorage and then DB
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const stored = localStorage.getItem('chambers_ai_history');
        if (stored) {
          setHistory(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to parse history from localStorage:', e);
      }

      try {
        const response = await fetch('/api/ai-history');
        const result = await response.json();
        
        if (result.success && result.data) {
          const dbHistory: GenerationHistoryItem[] = result.data.map((doc: any) => ({
            id: doc.id,
            prompt: doc.prompt,
            mode: doc.mode,
            provider: doc.provider,
            model: doc.model,
            timestamp: new Date(doc.createdAt).getTime(),
            response: { success: true, mode: 'code', blocks: doc.blocks },
          }));
          setHistory(dbHistory);
        }
      } catch (e) {
        console.error('Failed to fetch history from DB:', e);
      } finally {
        isLoaded.current = true;
      }
    };
    
    loadHistory();
  }, []);

  // Save history to localStorage (as cache)
  useEffect(() => {
    if (!isLoaded.current) return;
    localStorage.setItem('chambers_ai_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    if (!settings.apiKey?.trim()) {
      setError('Please enter your API key in the settings panel.');
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai-generate-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          mode,
          provider: settings.provider,
          model: settings.model,
          apiKey: settings.apiKey,
        }),
      });

      const data = await response.json() as
        | { success: boolean; mode?: 'code'; blocks?: GenerateResponseWithCode['blocks']; error?: string };

      if (!data.success) {
        throw new Error(data.error ?? 'Generation failed');
      }

      if (data.blocks) {
        // Save to DB
        let dbId = Math.random().toString(36).substring(2, 9);
        let dbTimestamp = Date.now();
        
        try {
          const dbResponse = await fetch('/api/ai-history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: prompt.trim(),
              mode,
              provider: settings.provider,
              model: settings.model,
              blocks: data.blocks,
            }),
          });
          const dbResult = await dbResponse.json();
          if (dbResult.success && dbResult.data) {
            dbId = dbResult.data.id;
            dbTimestamp = new Date(dbResult.data.createdAt).getTime();
          }
        } catch (e) {
          console.error('Failed to save to DB:', e);
        }

        const newItem: GenerationHistoryItem = {
          id: dbId,
          prompt: prompt.trim(),
          mode,
          provider: settings.provider,
          model: settings.model,
          timestamp: dbTimestamp,
          response: { success: true, mode: 'code', blocks: data.blocks },
        };

        setHistory((prev) => [newItem, ...prev]);
        setPreviewBlocks(data.blocks);
        setPrompt('');
      } else {
        throw new Error('No blocks returned from API');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenInEditor = (item: GenerationHistoryItem) => {
    setPreviewBlocks(item.response.blocks);
  };

  const handleAddToPage = (item: GenerationHistoryItem) => {
    alert('Adding to page is coming in Task 7');
  };

  return (
    <div className="bb-generate-container">
      {/* Ambient background */}
      <div className="bb-generate-aurora" />
      <div className="bb-generate-orb bb-generate-orb-1" />
      <div className="bb-generate-orb bb-generate-orb-2" />

      {/* Main three-column layout */}
      <div className="bb-generate-content">
        <SettingsPanel />

        <div className="bb-generate-prompt-wrapper">
          <PromptPanel
            prompt={prompt}
            onPromptChange={setPrompt}
            mode={mode}
            onModeChange={setMode}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            error={error}
          />
        </div>

        <ResultsPanel
          history={history}
          onOpenInEditor={handleOpenInEditor}
          onAddToPage={handleAddToPage}
        />
      </div>

      {/* Preview modal */}
      <AnimatePresence mode="wait">
        {previewBlocks && (
          <motion.div
            key="preview-phase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bb-modal-overlay bb-studio-modal"
            onClick={() => setPreviewBlocks(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 20, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="bb-modal-card bb-modal-card--wide"
            >
              <AIPreviewPanel
                blocks={previewBlocks}
                prompt={prompt}
                provider={settings.provider}
                model={settings.model}
                onBack={() => setPreviewBlocks(null)}
                onClose={() => setPreviewBlocks(null)}
                onRegenerate={() => {
                  setPreviewBlocks(null);
                  setError('');
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
