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
  const [isAgentMode, setIsAgentMode] = useState(false);
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
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
      if (isAgentMode) {
        setAgentLogs(['Initializing agent...']);
        const response = await fetch('/api/ai-agent', {
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

        if (!response.body) throw new Error('ReadableStream not supported');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let resultData = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim() === '') continue;
            try {
              const parsed = JSON.parse(line);
              if (parsed.type === 'log') {
                setAgentLogs(prev => [...prev, parsed.message]);
              } else if (parsed.type === 'result') {
                resultData = parsed.data;
              } else if (parsed.type === 'error') {
                throw new Error(parsed.message);
              }
            } catch (e) {
              // Ignore parse errors from partial chunks
            }
          }
        }

        if (resultData && resultData.success) {
          processSuccessResponse(resultData);
        } else if (resultData && !resultData.success) {
          throw new Error(resultData.error || 'Agent generation failed');
        } else {
          throw new Error('Agent did not return a valid result');
        }
      } else {
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

        processSuccessResponse(data);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const processSuccessResponse = async (data: any) => {
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
            isAgentMode={isAgentMode}
            onAgentModeChange={setIsAgentMode}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            error={error}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minWidth: '320px' }}>
          <ResultsPanel
            history={history}
            onOpenInEditor={handleOpenInEditor}
            onAddToPage={handleAddToPage}
          />

          {isAgentMode && agentLogs.length > 0 && (
            <div className="bb-generate-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255, 255, 255, 0.05)', overflow: 'hidden' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#8b5cf6', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m12 16 4-4-4-4"/><path d="M8 12h8"/></svg>
                Agent Activity Log
              </h3>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                {agentLogs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ color: 'var(--bb-muted)', padding: '0.25rem 0' }}
                  >
                    <span style={{ color: '#8b5cf6', marginRight: '0.5rem' }}>&gt;</span>
                    {log}
                  </motion.div>
                ))}
                {isGenerating && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{ color: 'var(--bb-muted)', padding: '0.25rem 0' }}
                  >
                    <span style={{ color: '#8b5cf6', marginRight: '0.5rem' }}>&gt;</span>
                    ...
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
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
