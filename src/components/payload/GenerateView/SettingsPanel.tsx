'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PROVIDERS, AI_SETTINGS_KEY } from '@/lib/ai/providers';
import type { AIProvider } from '@/lib/ai/types';

export interface AISettings {
  provider: AIProvider | string;
  model: string;
  apiKey: string;
}

interface SettingsPanelProps {
  settings: AISettings;
  onSettingsChange: (newSettings: AISettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange }) => {
  const [isOpen, setIsOpen] = useState(false); // For mobile toggle
  const [providers, setProviders] = useState<Record<string, any>>(PROVIDERS);
  const [isLoadingOpenRouter, setIsLoadingOpenRouter] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AI_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.provider && parsed.model) {
          onSettingsChange(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to parse settings from localStorage', err);
    } finally {
      setIsInitialized(true);
    }
    // We intentionally only run this on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to localStorage when settings change
  useEffect(() => {
    if (isInitialized && settings.provider && settings.model) {
      localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(settings));
    }
  }, [settings, isInitialized]);

  // Fetch OpenRouter models dynamically if OpenRouter is selected
  useEffect(() => {
    if (settings.provider === 'openrouter') {
      const fetchOpenRouterModels = async () => {
        setIsLoadingOpenRouter(true);
        try {
          const res = await fetch('https://openrouter.ai/api/v1/models');
          const data = await res.json();
          if (data && data.data) {
            const dynamicModels = data.data.map((m: any) => ({
              value: m.id,
              label: m.name || m.id,
            }));
            
            setProviders((prev) => {
              // Merge to avoid duplicates
              const existingOpenRouterModels = prev.openrouter.models;
              const existingValues = new Set(existingOpenRouterModels.map((m: any) => m.value));
              const newModels = dynamicModels.filter((m: any) => !existingValues.has(m.value));
              
              return {
                ...prev,
                openrouter: {
                  ...prev.openrouter,
                  models: [...existingOpenRouterModels, ...newModels],
                }
              };
            });
          }
        } catch (error) {
          console.error('Failed to fetch OpenRouter models', error);
        } finally {
          setIsLoadingOpenRouter(false);
        }
      };
      
      fetchOpenRouterModels();
    }
  }, [settings.provider]);

  const handleChange = (field: keyof AISettings, value: string) => {
    let newSettings = { ...settings, [field]: value };
    
    // When provider changes, select the first model of that provider automatically
    if (field === 'provider') {
      const providerInfo = providers[value];
      if (providerInfo && providerInfo.models.length > 0) {
        newSettings.model = providerInfo.models[0].value;
      }
    }
    
    onSettingsChange(newSettings);
  };

  const currentProviderInfo = providers[settings.provider] || providers.gemini;

  return (
    <div className={`bb-generate-panel bb-generate-settings ${isOpen ? 'open' : ''}`}>
      <div 
        className="bb-generate-panel-header" 
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span>AI Settings</span>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bb-generate-panel-toggle"
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, color: 'inherit' }}
          aria-label={isOpen ? "Close AI Settings" : "Open AI Settings"}
        >
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      <div className="bb-generate-panel-body">
        <div className="bb-generate-form-group">
          <label className="bb-generate-label">AI Provider</label>
          <select 
            className="bb-generate-select"
            value={settings.provider || 'gemini'}
            onChange={(e) => handleChange('provider', e.target.value)}
          >
            {Object.entries(providers).map(([key, info]) => (
              <option key={key} value={key}>{info.label}</option>
            ))}
          </select>
        </div>

        <div className="bb-generate-form-group">
          <label className="bb-generate-label">
            Model
          </label>
          <select 
            className="bb-generate-select"
            value={settings.model || ''}
            onChange={(e) => handleChange('model', e.target.value)}
          >
            {currentProviderInfo.models.map((model: any) => (
              <option key={model.value} value={model.value}>{model.label}</option>
            ))}
          </select>
        </div>

        <div className="bb-generate-form-group">
          <label className="bb-generate-label">API Key</label>
          <input 
            type="password"
            className="bb-generate-input"
            value={settings.apiKey || ''}
            onChange={(e) => handleChange('apiKey', e.target.value)}
            placeholder={currentProviderInfo.apiKeyPlaceholder}
          />
        </div>
      </div>
    </div>
  );
};
