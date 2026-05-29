'use client';

import React from 'react';
import { useField, useDocumentInfo } from '@payloadcms/ui';
import { useHasMounted } from './hooks/useHasMounted';

interface PreviewPanelProps {
  viewport: 'desktop' | 'mobile';
  onViewportChange: (viewport: 'desktop' | 'mobile') => void;
  onIframeRef: (iframe: HTMLIFrameElement | null) => void;
  id?: string | null;
  collectionSlug?: string;
}

export function PreviewPanel({
  viewport,
  onViewportChange,
  onIframeRef,
  id: propId,
  collectionSlug: propCollectionSlug,
}: PreviewPanelProps) {
  const { value: slugValue } = useField<string>({ path: 'slug' });
  const { id: docId, collectionSlug: docCollectionSlug } = useDocumentInfo();
  
  // Use prop if available, otherwise fallback to document info
  const id = propId || docId;
  const collectionSlug = propCollectionSlug || docCollectionSlug;
  const [loading, setLoading] = React.useState(true);
  const hasMounted = useHasMounted();
  
  // Get the page slug for preview
  const slug = slugValue === 'home' ? '' : (slugValue || '');
  const previewSecret = process.env.NEXT_PUBLIC_PREVIEW_SECRET || '';
  
  // Build the preview URL (client-only)
  // We route through /api/draft to enable draft mode in the iframe session
  const previewUrl = hasMounted && typeof window !== 'undefined' 
    ? `${window.location.origin}/api/draft?slug=${slug}&secret=${previewSecret}`
    : '';

  // Build the API URL for the current document
  const apiUrl = hasMounted && typeof window !== 'undefined' && id
    ? `${window.location.origin}/api/${collectionSlug}/${id}?depth=1&draft=true`
    : '';

  return (
    <div className="bb-preview">
      <div className="bb-preview__header">
        <div className="bb-preview__title">
          <span className="bb-preview__live-dot"></span>
          Live Preview
        </div>
        
        <div className="bb-canvas__viewport-toggle">
          {apiUrl && (
            <button
              className="bb-canvas__vp-btn"
              onClick={() => window.open(apiUrl, '_blank')}
              title="View API Response"
              style={{ marginRight: '8px', borderColor: 'var(--bb-gold)', color: 'var(--bb-gold)' }}
            >
              API
            </button>
          )}
          <button
            className={`bb-canvas__vp-btn ${viewport === 'desktop' ? 'bb-canvas__vp-btn--active' : ''}`}
            onClick={() => onViewportChange('desktop')}
          >
            Desktop
          </button>
          <button
            className={`bb-canvas__vp-btn ${viewport === 'mobile' ? 'bb-canvas__vp-btn--active' : ''}`}
            onClick={() => onViewportChange('mobile')}
          >
            Mobile
          </button>
        </div>
      </div>

      <div className="bb-preview__body">
        {previewUrl ? (
          <>
            {loading && (
              <div className="bb-preview__loading">
                <div className="bb-preview__spinner"></div>
                <span>Loading preview...</span>
              </div>
            )}
            <iframe
              ref={onIframeRef}
              src={previewUrl}
              className="bb-preview__iframe"
              style={{ width: viewport === 'mobile' ? '390px' : '100%', opacity: loading ? 0 : 1 }}
              onLoad={() => setLoading(false)}
            />
          </>
        ) : (
          <div className="bb-preview__unavailable">
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>👁️</div>
            <div style={{ fontWeight: 600 }}>Preview Unavailable</div>
            <p style={{ opacity: 0.7 }}>Save changes to see preview</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PreviewPanel;
