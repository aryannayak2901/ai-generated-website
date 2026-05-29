'use client';

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { BlockInstance } from './hooks/useBlocksBuilder';
import { blockMeta, FieldSchema } from './constants/blockMeta';
import { isDeepEqual } from './utils/comparison';

interface EditPanelProps {
  block: BlockInstance;
  onSave: (blockId: string, updates: any) => void;
  onCancel: () => void;
  onChangeDirty?: (isDirty: boolean) => void;
}

export function EditPanel({ block, onSave, onCancel, onChangeDirty }: EditPanelProps) {
  const [formData, setFormData] = useState<any>({ ...block });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
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
  const [postsList, setPostsList] = useState<{
    id: string;
    title: string;
    slug: string;
  }[]>([]);

  const isDirty = useMemo(() => {
    return !isDeepEqual(block, formData);
  }, [block, formData]);

  useEffect(() => {
    if (onChangeDirty) {
      onChangeDirty(isDirty);
    }
  }, [isDirty, onChangeDirty]);

  const meta = blockMeta[block.blockType];
  const fields = useMemo(() => meta?.fields || [], [meta]);

  // Fetch dynamic media, team, and posts options on component mount with active flag checks to prevent memory leaks
  useEffect(() => {
    let active = true;

    // 1. Fetch Media List
    fetch('/api/media?limit=150')
      .then((res) => {
        if (!res.ok) throw new Error('Network response not ok');
        return res.json();
      })
      .then((data) => {
        if (active && data.docs && Array.isArray(data.docs)) {
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
        if (active && data.docs && Array.isArray(data.docs)) {
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

    // 3. Fetch Posts List
    fetch('/api/posts?limit=150')
      .then((res) => {
        if (!res.ok) throw new Error('Network response not ok');
        return res.json();
      })
      .then((data) => {
        if (active && data.docs && Array.isArray(data.docs)) {
          setPostsList(
            data.docs.map((d: any) => ({
              id: d.id,
              title: d.title || d.id,
              slug: d.slug || '',
            }))
          );
        }
      })
      .catch((err) => console.error('EditPanel: Error fetching posts collection:', err));

    return () => {
      active = false;
    };
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
        
        // Prevent Prototype Pollution
        if (p === '__proto__' || p === 'constructor' || p === 'prototype') {
          return prev;
        }

        // Safely initialize the next level
        if (current[p] === null || current[p] === undefined) {
          const nextKey = fieldPath[i + 1];
          const isNextKeyIndex = !isNaN(Number(nextKey));
          current[p] = isNextKeyIndex ? [] : {};
        } else if (Array.isArray(current[p])) {
          current[p] = [...current[p]];
        } else if (typeof current[p] === 'object') {
          current[p] = { ...current[p] };
        } else {
          // Fallback if primitive
          const nextKey = fieldPath[i + 1];
          const isNextKeyIndex = !isNaN(Number(nextKey));
          current[p] = isNextKeyIndex ? [] : {};
        }
        current = current[p];
      }
      
      const lastKey = fieldPath[fieldPath.length - 1];
      if (lastKey !== '__proto__' && lastKey !== 'constructor' && lastKey !== 'prototype') {
        current[lastKey] = value;
      }
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

  const handleSubmit = (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
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
      const relationTo = field.relationTo || 'team';
      const optionsList = (relationTo === 'posts' ? postsList : teamList) as any[];
      
      const getLabel = (opt: any) => {
        if (relationTo === 'posts') {
          return opt.title || opt.id;
        }
        return opt.name + (opt.designation ? ` (${opt.designation})` : '');
      };

      const isMulti = field.name === 'teamMembers' || field.name === 'members' || Array.isArray(value);

      if (isMulti) {
        const selectedIds = Array.isArray(value)
          ? value.map((item) => (typeof item === 'object' && item ? item.id || item : item))
          : value
          ? [typeof value === 'object' ? value.id || value : value]
          : [];

        return (
          <div className="bb-edit__relationship-container">
            <div className="bb-edit__relationship-list">
              {optionsList.length === 0 ? (
                <div style={{ fontSize: '11px', color: '#8899aa', fontStyle: 'italic' }}>
                  No {relationTo} items found.
                </div>
              ) : (
                optionsList.map((item) => {
                  const isChecked = selectedIds.includes(item.id);
                  return (
                    <label key={item.id} className="bb-edit__relationship-item">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          let nextIds;
                          if (e.target.checked) {
                            nextIds = [...selectedIds, item.id];
                          } else {
                            nextIds = selectedIds.filter((id) => id !== item.id);
                          }

                          const populated = nextIds.map((id) => {
                            const orig = optionsList.find((opt) => opt.id === id);
                            if (relationTo === 'posts') {
                              return {
                                id,
                                title: orig?.title || '',
                                slug: orig?.slug || '',
                              };
                            } else {
                              return {
                                id,
                                name: orig?.name || '',
                                designation: orig?.designation || '',
                                stats: orig?.stats || { experience: '10+' },
                                slug: orig?.slug || orig?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
                                image: orig?.image || null,
                              };
                            }
                          });
                          onChange(populated);
                        }}
                      />
                      <span className="bb-edit__relationship-label">
                        {getLabel(item)}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        );
      } else {
        const currentId = typeof value === 'object' && value ? value.id || value : value || '';

        return (
          <div className="bb-edit__relationship-container--single">
            <select
              value={currentId}
              onChange={(e) => {
                const selectedId = e.target.value;
                if (!selectedId) {
                  onChange(null);
                  return;
                }
                const orig = optionsList.find((opt) => opt.id === selectedId);
                if (orig) {
                  if (relationTo === 'posts') {
                    onChange({
                      id: orig.id,
                      title: orig.title || '',
                      slug: orig.slug || '',
                    });
                  } else {
                    onChange({
                      id: orig.id,
                      name: orig.name || '',
                      designation: orig.designation || '',
                      stats: orig.stats || { experience: '10+' },
                      slug: orig.slug || orig.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
                      image: orig.image || null,
                    });
                  }
                } else {
                  onChange(selectedId);
                }
              }}
              className="bb-edit__input bb-edit__select"
              style={{ width: '100%' }}
            >
              <option value="">Select {relationTo === 'posts' ? 'Post' : 'Team Member'}...</option>
              {optionsList.map((item) => (
                <option key={item.id} value={item.id}>
                  {getLabel(item)}
                </option>
              ))}
            </select>
          </div>
        );
      }
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

                const newItemKey = `${arrayKey}-${items.length}`;
                setExpandedItems((prev) => ({
                  ...prev,
                  [newItemKey]: true
                }));

                // Smooth scroll to the bottom of the form body using ref
                setTimeout(() => {
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                      top: scrollContainerRef.current.scrollHeight,
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
      <div className="bb-edit__header">
        <h4 className="bb-edit__title">
          <span className="bb-edit__icon">{meta?.icon}</span>
          Edit {meta?.label}
        </h4>
        <button className="bb-edit__close" onClick={onCancel}>✕</button>
      </div>

      <div 
        ref={scrollContainerRef}
        className="bb-edit__body"
        onKeyDown={(e) => {
          if (
            e.key === 'Enter' &&
            e.target instanceof HTMLInputElement &&
            e.target.type !== 'checkbox'
          ) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      >
        {fields.length === 0 ? (
          <div style={{ color: '#8899aa', fontSize: '12px', fontStyle: 'italic', padding: '12px' }}>
            No editable fields defined for this block.
          </div>
        ) : (
          fields.map((field) => {
            const error = errors[field.name];
            return (
              <div key={field.name} className="bb-edit__field">
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
      </div>

      <div className="bb-edit__footer">
        <button type="button" className="bb-edit__cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="bb-edit__save" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
}

export default EditPanel;