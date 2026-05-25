'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { BlockInstance } from './hooks/useBlocksBuilder';
import { blockMeta, FieldSchema } from './constants/blockMeta';

interface EditPanelProps {
  block: BlockInstance;
  onSave: (blockId: string, updates: any) => void;
  onCancel: () => void;
}

export function EditPanel({ block, onSave, onCancel }: EditPanelProps) {
  const [formData, setFormData] = useState<any>({ ...block });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  // Dynamic collections states
  const [mediaList, setMediaList] = useState<{ id: string; filename: string; url: string }[]>([]);
  const [teamList, setTeamList] = useState<{
    id: string;
    name: string;
    designation: string;
    slug: string;
    image: any;
    stats?: { experience?: string; cases?: string; publications?: string; clients?: string } | null;
  }[]>([]);

  const meta = blockMeta[block.blockType];
  const fields = useMemo(() => meta?.fields || [], [meta]);

  // Fetch dynamic media and team options on component mount
  useEffect(() => {
    // 1. Fetch Media List
    fetch('/api/media?limit=150')
      .then((res) => {
        if (!res.ok) throw new Error('Network response not ok');
        return res.json();
      })
      .then((data) => {
        if (data.docs && Array.isArray(data.docs)) {
          setMediaList(
            data.docs.map((d: any) => ({
              id: d.id,
              filename: d.filename || d.id,
              url: d.url || '',
            }))
          );
        }
      })
      .catch((err) => console.error('EditPanel: Error fetching media collection:', err));

    // 2. Fetch Team List
    fetch('/api/team?limit=150')
      .then((res) => {
        if (!res.ok) throw new Error('Network response not ok');
        return res.json();
      })
      .then((data) => {
        if (data.docs && Array.isArray(data.docs)) {
          setTeamList(
            data.docs.map((d: any) => ({
              id: d.id,
              name: d.name,
              designation: d.designation || '',
              slug: d.slug || '',
              image: d.image || null,
              stats: d.stats || null,
            }))
          );
        }
      })
      .catch((err) => console.error('EditPanel: Error fetching team collection:', err));
  }, []);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    // Validate based on defined fields
    fields.forEach((field) => {
      const val = formData[field.name];
      if (
        val === '' ||
        val === null ||
        val === undefined ||
        (Array.isArray(val) && val.length === 0)
      ) {
        if (field.name === 'title' || field.name === 'heading' || field.name === 'name') {
          newErrors[field.name] = 'Required';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, fields]);

  const handleChange = (fieldPath: string[], value: any) => {
    setFormData((prev: any) => {
      const updated = { ...prev };
      let current = updated;
      
      for (let i = 0; i < fieldPath.length - 1; i++) {
        const p = fieldPath[i];
        if (Array.isArray(current[p])) {
          current[p] = [...current[p]];
        } else {
          current[p] = { ...current[p] };
        }
        current = current[p];
      }
      
      const lastKey = fieldPath[fieldPath.length - 1];
      current[lastKey] = value;
      return updated;
    });

    // Clear error
    const errorKey = fieldPath[0];
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const dataToSave = { ...formData };
      delete dataToSave.id;
      delete dataToSave.blockType;
      onSave(block.id, dataToSave);
    }
  };

  // Dynamic Recursive Inputs Renderer
  const renderFieldInput = (
    field: FieldSchema,
    value: any,
    path: string[]
  ): React.ReactNode => {
    const onChange = (newVal: any) => handleChange(path, newVal);

    if (field.type === 'boolean') {
      return (
        <div className="bb-edit__field--checkbox">
          <input
            type="checkbox"
            id={`field-${path.join('-')}`}
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
          />
          <label htmlFor={`field-${path.join('-')}`} style={{ marginLeft: '8px', fontSize: '12px' }}>
            Enabled
          </label>
        </div>
      );
    }

    if (field.type === 'select') {
      return (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="bb-edit__input bb-edit__select"
          style={{ width: '100%' }}
        >
          <option value="">Select option...</option>
          {Array.isArray(field.options) &&
            field.options.map((opt: any) => {
              const label = typeof opt === 'object' ? opt.label : opt;
              const val = typeof opt === 'object' ? opt.value : opt;
              return (
                <option key={val} value={val}>
                  {label}
                </option>
              );
            })}
        </select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="bb-edit__input bb-edit__textarea"
          rows={3}
          style={{ width: '100%' }}
        />
      );
    }

    if (field.type === 'upload') {
      const currentMediaVal =
        typeof value === 'object' && value ? value.id || value.url || '' : value || '';
      
      const isSelectedFromLibrary = mediaList.some(
        (m) => m.id === currentMediaVal || m.url === currentMediaVal
      );

      return (
        <div className="bb-edit__upload-container">
          <select
            value={isSelectedFromLibrary ? (mediaList.find((m) => m.id === currentMediaVal || m.url === currentMediaVal)?.id || '') : ''}
            onChange={(e) => {
              const selected = mediaList.find((m) => m.id === e.target.value);
              if (selected) {
                onChange({ id: selected.id, url: selected.url, filename: selected.filename });
              } else {
                onChange('');
              }
            }}
            className="bb-edit__input bb-edit__select"
            style={{ width: '100%' }}
          >
            <option value="">[ Choose from Library ]</option>
            {mediaList.map((media) => (
              <option key={media.id} value={media.id}>
                {media.filename}
              </option>
            ))}
          </select>
          <div className="bb-edit__upload-row-or">or enter direct image URL:</div>
          <input
            type="text"
            placeholder="https://images.unsplash.com/..."
            value={typeof value === 'object' && value ? value.url || '' : value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="bb-edit__input"
            style={{ width: '100%' }}
          />
          {((typeof value === 'object' && value?.url) ||
            (typeof value === 'string' && value.startsWith('http'))) && (
            <div className="bb-edit__media-preview">
              <img
                src={typeof value === 'object' ? value.url : value}
                alt="Preview"
                className="bb-edit__media-thumb"
              />
            </div>
          )}
        </div>
      );
    }

    if (field.type === 'relationship') {
      const selectedIds = Array.isArray(value)
        ? value.map((item) => (typeof item === 'object' && item ? item.id || item : item))
        : value
        ? [typeof value === 'object' ? value.id || value : value]
        : [];

      return (
        <div className="bb-edit__relationship-container">
          <div className="bb-edit__relationship-list">
            {teamList.length === 0 ? (
              <div style={{ fontSize: '11px', color: '#8899aa', fontStyle: 'italic' }}>
                No team members found. Create some in Team collection first.
              </div>
            ) : (
              teamList.map((member) => {
                const isChecked = selectedIds.includes(member.id);
                return (
                  <label key={member.id} className="bb-edit__relationship-item">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        let nextIds;
                        if (e.target.checked) {
                          nextIds = [...selectedIds, member.id];
                        } else {
                          nextIds = selectedIds.filter((id) => id !== member.id);
                        }

                        // Map populated objects in real time to satisfy preview component instantly
                        const populated = nextIds.map((id) => {
                          const orig = teamList.find((t) => t.id === id);
                          return {
                            id,
                            name: orig?.name || '',
                            designation: orig?.designation || '',
                            stats: orig?.stats || { experience: '10+' },
                            slug: orig?.slug || orig?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
                            image: orig?.image || null,
                          };
                        });
                        onChange(populated);
                      }}
                    />
                    <span className="bb-edit__relationship-label">
                      {member.name}{' '}
                      <small style={{ opacity: 0.5, fontSize: '9px' }}>
                        ({member.designation})
                      </small>
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      );
    }

    if (field.type === 'array') {
      const items = Array.isArray(value) ? value : [];
      const subFields = field.fields || [];
      const arrayKey = path.join('.');

      return (
        <div className="bb-edit__array-container">
          <div className="bb-edit__array-header">
            <label className="bb-edit__label" style={{ margin: 0 }}>
              {field.label} <span className="bb-edit__json-badge">{items.length} items</span>
            </label>
            <button
              type="button"
              className="bb-edit__add-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const newItem: Record<string, any> = {};
                subFields.forEach((sf) => {
                  newItem[sf.name] =
                    sf.defaultValue !== undefined
                      ? sf.defaultValue
                      : sf.type === 'array'
                      ? []
                      : sf.type === 'boolean'
                      ? false
                      : '';
                });

                const newItems = [...items, newItem];
                onChange(newItems);

                // Auto-expand the newly created item
                const newItemKey = `${arrayKey}-${items.length}`;
                setExpandedItems((prev) => ({
                  ...prev,
                  [newItemKey]: true
                }));

                // Smooth scroll to the bottom of the form body
                setTimeout(() => {
                  const scrollContainer = document.querySelector('.bb-edit__body');
                  if (scrollContainer) {
                    scrollContainer.scrollTo({
                      top: scrollContainer.scrollHeight,
                      behavior: 'smooth'
                    });
                  }
                }, 80);
              }}
            >
              + Add Item
            </button>
          </div>

          <div className="bb-edit__array-list" style={{ marginTop: '8px' }}>
            {items.map((item, idx) => {
              const itemKey = `${arrayKey}-${idx}`;
              const isExpanded = !!expandedItems[itemKey];

              // Fallbacks to determine visual title insideCollapsed list item
              const itemTitle =
                item.title ||
                item.name ||
                item.label ||
                item.day ||
                item.number ||
                item.text ||
                `Item ${idx + 1}`;

              return (
                <div key={itemKey} className="bb-edit__item-card">
                  <div
                    className="bb-edit__item-card-header"
                    onClick={() =>
                      setExpandedItems((prev) => ({ ...prev, [itemKey]: !isExpanded }))
                    }
                  >
                    <span className="bb-edit__item-card-title">
                      {idx + 1}. {itemTitle}
                    </span>
                    <div className="bb-edit__item-card-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="bb-edit__item-card-delete"
                        onClick={(e) => {
                          e.preventDefault();
                          const newItems = items.filter((_, i) => i !== idx);
                          onChange(newItems);
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bb-edit__item-card-body">
                      {subFields.map((sf) => {
                        const childPath = [...path, idx.toString(), sf.name];
                        return (
                          <div key={sf.name} className="bb-edit__field">
                            <label className="bb-edit__label">{sf.label}</label>
                            {renderFieldInput(sf, item[sf.name], childPath)}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Default Fallback: Plain Input Box
    return (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="bb-edit__input"
        style={{ width: '100%' }}
      />
    );
  };

  return (
    <div className="bb-edit" style={{ width: '100%', height: '100%', borderRight: 'none' }}>
      {/* Dynamic styling override inside EditPanel itself */}
      <style dangerouslySetInnerHTML={{ __html: `
        .bb-edit__array-container {
          margin-top: 12px;
          border-top: 1px solid var(--bb-border);
          padding-top: 12px;
        }
        .bb-edit__array-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .bb-edit__add-btn {
          background: var(--bb-gold) !important;
          color: var(--bb-navy) !important;
          border: none !important;
          padding: 4px 10px !important;
          border-radius: 4px !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }
        .bb-edit__add-btn:hover {
          background: #f1c40f !important;
          transform: translateY(-1px) !important;
        }
        .bb-edit__item-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          margin-bottom: 8px;
          overflow: hidden;
          transition: all 0.2s ease;
        }
        .bb-edit__item-card:hover {
          border-color: rgba(212, 175, 55, 0.3);
        }
        .bb-edit__item-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.02);
          cursor: pointer;
        }
        .bb-edit__item-card-title {
          font-size: 12px;
          font-weight: 600;
          color: #fff;
        }
        .bb-edit__item-card-delete {
          background: transparent !important;
          border: none !important;
          cursor: pointer !important;
          font-size: 13px !important;
          opacity: 0.6 !important;
          transition: opacity 0.2s ease !important;
          padding: 0 !important;
        }
        .bb-edit__item-card-delete:hover {
          opacity: 1 !important;
        }
        .bb-edit__item-card-body {
          padding: 12px;
          background: rgba(0, 0, 0, 0.15);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .bb-edit__textarea {
          min-height: 80px;
          resize: vertical;
          line-height: 1.4;
          padding: 8px;
        }
        .bb-edit__select {
          background: var(--bb-navy-dark) !important;
          color: #fff !important;
          border: 1px solid var(--bb-border) !important;
          padding: 6px 10px !important;
          border-radius: 4px !important;
          outline: none !important;
        }
        .bb-edit__upload-container {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .bb-edit__upload-row-or {
          font-size: 10px;
          color: #8899aa;
          text-align: center;
          font-style: italic;
        }
        .bb-edit__media-preview {
          margin-top: 6px;
          border: 1px solid var(--bb-border);
          border-radius: 4px;
          overflow: hidden;
          max-height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
        }
        .bb-edit__media-thumb {
          max-width: 100%;
          max-height: 100px;
          object-fit: contain;
        }
        .bb-edit__relationship-container {
          background: rgba(0, 0, 0, 0.1);
          border: 1px solid var(--bb-border);
          border-radius: 4px;
          max-height: 150px;
          overflow-y: auto;
          padding: 8px;
        }
        .bb-edit__relationship-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .bb-edit__relationship-item {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 11px;
        }
        .bb-edit__relationship-label {
          color: #ddd;
        }
      ` }} />

      <div className="bb-edit__header">
        <h4 className="bb-edit__title">
          <span className="bb-edit__icon">{meta?.icon}</span>
          Edit {meta?.label}
        </h4>
        <button className="bb-edit__close" onClick={onCancel}>✕</button>
      </div>

      <form onSubmit={handleSubmit} className="bb-edit__body">
        {fields.length === 0 ? (
          <div style={{ color: '#8899aa', fontSize: '12px', fontStyle: 'italic', padding: '12px' }}>
            No editable fields defined for this block.
          </div>
        ) : (
          fields.map((field) => {
            const error = errors[field.name];
            return (
              <div key={field.name} className="bb-edit__field">
                {/* Note: Array and checkbox label rendering is managed inside renderFieldInput */}
                {field.type !== 'array' && field.type !== 'boolean' && (
                  <label className="bb-edit__label" htmlFor={field.name}>
                    {field.label}
                  </label>
                )}
                {renderFieldInput(field, formData[field.name], [field.name])}
                {error && <span style={{ color: 'var(--bb-danger)', fontSize: '10px' }}>{error}</span>}
              </div>
            );
          })
        )}
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