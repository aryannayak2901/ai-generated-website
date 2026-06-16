'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PROVIDERS, DEFAULT_PROVIDER } from '@/lib/ai/providers';
import type { AIProvider, AISettings } from '@/lib/ai/types';
import { useAISettings } from '@/lib/ai/useAISettings';

export const SettingsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // For mobile toggle
  const { settings, updateSettings, dynamicModels, isLoadingModels } = useAISettings();

  const handleChange = (field: keyof AISettings, value: string) => {
    updateSettings({ [field]: value });
  };

  const currentProviderInfo = PROVIDERS[settings.provider] || PROVIDERS[DEFAULT_PROVIDER];
  const models = dynamicModels[settings.provider] || currentProviderInfo.models;

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
            value={settings.provider || DEFAULT_PROVIDER}
            onChange={(e) => handleChange('provider', e.target.value as AIProvider)}
          >
            {Object.entries(PROVIDERS).map(([key, info]) => (
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
            disabled={isLoadingModels}
          >
            {models.map((model: any) => (
              <option key={model.value} value={model.value}>{model.label}</option>
            ))}
          </select>
          {isLoadingModels && <span style={{ fontSize: '10px', color: 'var(--bb-muted)', marginTop: '4px', display: 'block' }}>Loading models...</span>}
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
