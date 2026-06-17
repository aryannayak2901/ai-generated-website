'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Settings2, Cpu, Key, Zap } from 'lucide-react';
import { PROVIDERS, DEFAULT_PROVIDER } from '@/lib/ai/providers';
import type { AIProvider, AISettings } from '@/lib/ai/types';
import { useAISettings } from '@/lib/ai/useAISettings';

export const SettingsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSettings, activeModels, isLoadingModels } = useAISettings();

  const handleChange = (field: keyof AISettings, value: string) => {
    updateSettings({ [field]: value });
  };

  const currentProviderInfo = PROVIDERS[settings.provider] || PROVIDERS[DEFAULT_PROVIDER];

  return (
    <div className={`bb-generate-panel bb-generate-settings ${isOpen ? 'open' : ''}`}>
      {/* Panel Header */}
      <div className="bb-generate-panel-header">
        <div className="bb-generate-panel-header-title">
          <div className="bb-generate-panel-header-icon">
            <Settings2 size={14} strokeWidth={2.2} />
          </div>
          <span>AI Settings</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bb-generate-panel-toggle"
          aria-label={isOpen ? 'Close AI Settings' : 'Open AI Settings'}
        >
          {isOpen ? <ChevronUp size={13} strokeWidth={2.5} /> : <ChevronDown size={13} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Panel Body */}
      <div className="bb-generate-panel-body">
        {/* Provider */}
        <div className="bb-generate-form-group">
          <label className="bb-generate-label">
            <Zap size={10} strokeWidth={2.5} />
            AI Provider
          </label>
          <select
            className="bb-generate-select"
            value={settings.provider || DEFAULT_PROVIDER}
            onChange={(e) => handleChange('provider', e.target.value as AIProvider)}
          >
            {Object.entries(PROVIDERS).map(([key, info]) => (
              <option key={key} value={key}>
                {info.label}
              </option>
            ))}
          </select>
        </div>

        <div className="bb-generate-divider" />

        {/* Model */}
        <div className="bb-generate-form-group">
          <label className="bb-generate-label">
            <Cpu size={10} strokeWidth={2.5} />
            Model
          </label>
          <select
            className="bb-generate-select"
            value={settings.model || ''}
            onChange={(e) => handleChange('model', e.target.value)}
            disabled={isLoadingModels}
          >
            {activeModels.map((model: any) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
          {isLoadingModels && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '6px',
              }}
            >
              <span className="bb-generate-thinking-dot" />
              <span className="bb-generate-thinking-dot" />
              <span className="bb-generate-thinking-dot" />
              <span style={{ fontSize: '0.7rem', color: 'var(--gs-muted-2)', marginLeft: '2px' }}>
                Loading models...
              </span>
            </div>
          )}
        </div>

        <div className="bb-generate-divider" />

        {/* API Key */}
        <div className="bb-generate-form-group" style={{ marginBottom: 0 }}>
          <label className="bb-generate-label">
            <Key size={10} strokeWidth={2.5} />
            API Key
          </label>
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
