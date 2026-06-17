'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Settings, Share2, Package, Lock, Eye, EyeOff } from 'lucide-react';
import { PROVIDERS, DEFAULT_PROVIDER } from '@/lib/ai/providers';
import type { AIProvider, AISettings } from '@/lib/ai/types';
import { useAISettings } from '@/lib/ai/useAISettings';

export const SettingsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { settings, updateSettings, activeModels, isLoadingModels } = useAISettings();

  const handleChange = (field: keyof AISettings, value: string) => {
    updateSettings({ [field]: value });
  };

  const currentProviderInfo = PROVIDERS[settings.provider] || PROVIDERS[DEFAULT_PROVIDER];

  return (
    <div className={`bb-generate-panel bb-generate-settings ${isOpen ? 'open' : ''}`}>
      {/* Top Glow */}
      <div className="bb-generate-settings-glow" />

      {/* Panel Header */}
      <div className="bb-generate-panel-header">
        <div className="bb-generate-panel-header-title">
          <div className="bb-generate-panel-header-icon">
            <Settings size={18} strokeWidth={2} color="#D4AF37" />
          </div>
          <span>AI Settings</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bb-generate-panel-toggle"
          aria-label={isOpen ? 'Close AI Settings' : 'Open AI Settings'}
        >
          {isOpen ? <ChevronUp size={16} strokeWidth={2} /> : <ChevronDown size={16} strokeWidth={2} />}
        </button>
      </div>

      {/* Panel Body */}
      <div className="bb-generate-panel-body">
        {/* Provider */}
        <div className="bb-generate-form-group">
          <label className="bb-generate-label">
            <Share2 size={14} strokeWidth={2} />
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

        {/* Model */}
        <div className="bb-generate-form-group">
          <label className="bb-generate-label">
            <Package size={14} strokeWidth={2} />
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

        {/* API Key */}
        <div className="bb-generate-form-group" style={{ marginBottom: 0 }}>
          <label className="bb-generate-label">
            <Lock size={14} strokeWidth={2} />
            API Key password
          </label>
          <div className="bb-generate-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className="bb-generate-input"
              value={settings.apiKey || ''}
              onChange={(e) => handleChange('apiKey', e.target.value)}
              placeholder={currentProviderInfo.apiKeyPlaceholder || "........."}
              style={{ paddingRight: '2.5rem' }}
            />
            <button
              type="button"
              className="bb-generate-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={16} strokeWidth={2} /> : <EyeOff size={16} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
