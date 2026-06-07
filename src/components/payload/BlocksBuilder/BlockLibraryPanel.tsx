'use client';

import React, { useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { blockMeta, blockCategoryOrder, BlockCategory } from './constants/blockMeta';
import { SparklesIcon } from 'lucide-react';

import { useField, useForm } from '@payloadcms/ui';
import { useHasMounted } from './hooks/useHasMounted';

interface BlockLibraryPanelProps {
  search: string;
  onSearchChange: (search: string) => void;
  onAiGenerateClick?: () => void;
}

function PageSettings() {
  const titleFieldObj = useField<string>({ path: 'title', validate: (val) => (val ? true : 'Title is required') });
  const slugFieldObj = useField<string>({ path: 'slug', validate: (val) => (val ? true : 'Slug is required') });
  
  const titleField = titleFieldObj?.value;
  const setTitleField = titleFieldObj?.setValue;
  const slugField = slugFieldObj?.value;
  const setSlugField = slugFieldObj?.setValue;

  const form = useForm();
  const hasMounted = useHasMounted();

  // Extreme defensive data access
  const formData = (form && typeof form.getData === 'function') ? form.getData() : {};
  const formFields = (form && form.fields) ? form.fields : {};
  const dispatchFields = form?.dispatchFields;
  
  // Try multiple sources for the values to ensure stability during typing/re-renders
  const title = titleField !== undefined 
    ? titleField 
    : (formFields && formFields.title && formFields.title.value !== undefined ? formFields.title.value : (formData?.title || ''));
    
  const slug = slugField !== undefined 
    ? slugField 
    : (formFields && formFields.slug && formFields.slug.value !== undefined ? formFields.slug.value : (formData?.slug || ''));

  const formatSlug = (val: string) => 
    (val || '').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    
    if (typeof setTitleField === 'function') {
      setTitleField(newTitle);
    } else if (typeof dispatchFields === 'function') {
      dispatchFields({ type: 'UPDATE', path: 'title', value: newTitle });
    }
    
    // Auto-generate slug logic
    const currentSlug = slug || '';
    const slugifiedTitle = formatSlug(String(title || ''));
    
    if (!currentSlug || currentSlug === slugifiedTitle) {
      const newSlug = formatSlug(newTitle);
      if (typeof setSlugField === 'function') {
        setSlugField(newSlug);
      } else if (typeof dispatchFields === 'function') {
        dispatchFields({ type: 'UPDATE', path: 'slug', value: newSlug });
      }
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = formatSlug(e.target.value);
    if (typeof setSlugField === 'function') {
      setSlugField(newSlug);
    } else if (typeof dispatchFields === 'function') {
      dispatchFields({ type: 'UPDATE', path: 'slug', value: newSlug });
    }
  };

  if (!hasMounted) return null;

  return (
    <div className="bb-library__group" style={{ borderBottom: '1px solid var(--bb-border)', paddingBottom: '12px', marginBottom: '8px' }}>
      <div className="bb-library__group-label" style={{ marginBottom: '8px' }}>Page Identity</div>
      <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="bb-edit__field">
          <label className="bb-edit__label">Title</label>
          <input 
            type="text"
            className="bb-edit__input" 
            placeholder="Page Title"
            value={String(title || '')} 
            onChange={handleTitleChange} 
          />
        </div>
        <div className="bb-edit__field">
          <label className="bb-edit__label">Slug</label>
          <input 
            type="text"
            className="bb-edit__input" 
            placeholder="page-slug"
            value={String(slug || '')} 
            onChange={handleSlugChange} 
          />
          <p style={{ fontSize: '10px', color: 'var(--bb-text-dim)', marginTop: '4px', opacity: 0.6 }}>
            {(!slug || slug === formatSlug(String(title || ''))) ? 'Auto-generating from title...' : 'Manual slug entered'}
          </p>
        </div>
      </div>
    </div>
  );
}

function BlockChip({ blockType, label, icon, category }: { 
  blockType: string; 
  label: string; 
  icon: string;
  category: BlockCategory;
}) {
  const hasMounted = useHasMounted();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: blockType,
    data: {
      type: 'library-block',
      blockType,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...(hasMounted ? listeners : {})}
      {...(hasMounted ? attributes : {})}
      className={`bb-chip ${isDragging ? 'bb-chip--dragging' : ''}`}
    >
      <span className="bb-chip__icon">{icon}</span>
      <span className="bb-chip__label">{label}</span>
      <span className="bb-chip__handle">⋮⋮</span>
    </div>
  );
}

export function BlockLibraryPanel({ search, onSearchChange, onAiGenerateClick }: BlockLibraryPanelProps) {
  const filteredBlocks = useMemo(() => {
    const blocks = Object.entries(blockMeta).map(([slug, meta]) => ({
      slug,
      ...meta,
    }));

    if (!search.trim()) return blocks;

    const searchLower = search.toLowerCase();
    return blocks.filter(
      (block) =>
        block.label.toLowerCase().includes(searchLower) ||
        block.category.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const blocksByCategory = useMemo(() => {
    const grouped: Record<string, typeof filteredBlocks> = {};
    
    filteredBlocks.forEach((block) => {
      if (!grouped[block.category]) {
        grouped[block.category] = [];
      }
      grouped[block.category].push(block);
    });
    
    return grouped;
  }, [filteredBlocks]);

  return (
    <div className="bb-library">
      <div className="bb-library__header">
        <div className="bb-library__title">Studio Panels</div>
      </div>

      <PageSettings />

      <div className="bb-library__search-wrap">
        <span className="bb-library__search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search blocks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bb-library__search"
        />
        {search && (
          <button className="bb-library__clear" onClick={() => onSearchChange('')}>✕</button>
        )}
      </div>

      {onAiGenerateClick && (
        <div style={{ padding: '0 12px', marginTop: '12px' }}>
          <button
            onClick={onAiGenerateClick}
            className="w-full flex items-center justify-center gap-2 mb-4 rounded-xl p-4 transition-all"
            style={{ 
              background: 'linear-gradient(to right, rgba(201, 168, 76, 0.1), rgba(226, 200, 122, 0.1))',
              border: '1px solid rgba(201, 168, 76, 0.2)',
              color: 'var(--bb-gold)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(201, 168, 76, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, rgba(201, 168, 76, 0.1), rgba(226, 200, 122, 0.1))';
            }}
          >
            <SparklesIcon className="w-5 h-5" />
            <span className="font-semibold">Generate new block with AI</span>
          </button>
        </div>
      )}

      <div className="bb-library__list">
        {blockCategoryOrder.map((category) => {
          const blocks = blocksByCategory[category];
          if (!blocks || blocks.length === 0) return null;

          return (
            <div key={category} className="bb-library__group">
              <div className="bb-library__group-label">{category}</div>
              {blocks.map((block) => (
                <BlockChip
                  key={block.slug}
                  blockType={block.slug}
                  label={block.label}
                  icon={block.icon}
                  category={block.category}
                />
              ))}
            </div>
          );
        })}

        {filteredBlocks.length === 0 && (
          <div className="bb-library__empty">
            No blocks found matching &quot;{search}&quot;
          </div>
        )}
      </div>
    </div>
  );
}


export default BlockLibraryPanel;