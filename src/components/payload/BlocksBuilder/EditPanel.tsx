'use client';

import React, { useState, useCallback } from 'react';
import { BlockInstance } from './hooks/useBlocksBuilder';
import { blockMeta } from './constants/blockMeta';

interface EditPanelProps {
  block: BlockInstance;
  onSave: (blockId: string, updates: any) => void;
  onCancel: () => void;
}

export function EditPanel({ block, onSave, onCancel }: EditPanelProps) {
  const [formData, setFormData] = useState<any>({ ...block });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const meta = blockMeta[block.blockType];

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    // Simple validation
    Object.entries(formData).forEach(([key, value]) => {
      if (
        value === '' ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      ) {
        if (key === 'title' || key === 'heading' || key === 'name') {
          newErrors[key] = 'Required';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const { id, blockType, ...dataToSave } = formData;
      onSave(block.id, dataToSave);
    }
  };

  const renderField = (key: string, value: any) => {
    if (key === 'id' || key === 'blockType') return null;
    
    const error = errors[key];
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

    if (typeof value === 'boolean') {
      return (
        <div key={key} className="bb-edit__field bb-edit__field--checkbox">
          <input
            type="checkbox"
            id={`field-${key}`}
            checked={value}
            onChange={(e) => handleChange(key, e.target.checked)}
          />
          <label htmlFor={`field-${key}`}>{label}</label>
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div key={key} className="bb-edit__field">
          <label className="bb-edit__label">
            {label} <span className="bb-edit__json-badge">{value.length} items</span>
          </label>
          <div className="bb-edit__input" style={{ opacity: 0.6, fontSize: '11px' }}>
            Array editing coming soon
          </div>
        </div>
      );
    }

    return (
      <div key={key} className="bb-edit__field">
        <label className="bb-edit__label" htmlFor={key}>{label}</label>
        <input
          id={key}
          type="text"
          value={value || ''}
          onChange={(e) => handleChange(key, e.target.value)}
          className={`bb-edit__input ${error ? 'bb-edit__input--error' : ''}`}
        />
        {error && <span style={{ color: 'var(--bb-danger)', fontSize: '10px' }}>{error}</span>}
      </div>
    );
  };

  return (
    <div className="bb-edit" style={{ width: '100%', borderRight: 'none' }}>
      <div className="bb-edit__header">
        <h4 className="bb-edit__title">
          <span className="bb-edit__icon">{meta?.icon}</span>
          Edit {meta?.label}
        </h4>
        <button className="bb-edit__close" onClick={onCancel}>✕</button>
      </div>

      <form onSubmit={handleSubmit} className="bb-edit__body">
        {Object.entries(formData)
          .filter(([key]) => key !== 'id' && key !== 'blockType')
          .map(([key, value]) => renderField(key, value))}
      </form>

      <div className="bb-edit__footer">
        <button type="button" className="bb-edit__cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="bb-edit__save" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
}

export default EditPanel;