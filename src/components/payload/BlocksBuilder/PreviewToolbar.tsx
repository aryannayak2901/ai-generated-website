'use client';
import React from 'react';
import { Monitor, Laptop, Tablet, Smartphone, Minus, Plus, RefreshCw } from 'lucide-react';

interface PreviewToolbarProps {
  viewport: 'desktop' | 'laptop' | 'tablet' | 'mobile';
  setViewport: (v: 'desktop' | 'laptop' | 'tablet' | 'mobile') => void;
  zoom: number;
  setZoom: (v: number) => void;
  onRefresh: () => void;
}

export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  viewport,
  setViewport,
  zoom,
  setZoom,
  onRefresh,
}) => {
  const handleZoomOut = () => {
    setZoom(Math.max(25, zoom - 25));
  };

  const handleZoomIn = () => {
    setZoom(Math.min(200, zoom + 25));
  };

  return (
    <div className="bb-preview-toolbar">
      <div className="bb-viewport-group">
        <button
          type="button"
          className={`bb-viewport-btn ${viewport === 'desktop' ? 'bb-viewport-btn--active' : ''}`}
          onClick={() => setViewport('desktop')}
          title="Desktop"
        >
          <Monitor size={16} />
        </button>
        <button
          type="button"
          className={`bb-viewport-btn ${viewport === 'laptop' ? 'bb-viewport-btn--active' : ''}`}
          onClick={() => setViewport('laptop')}
          title="Laptop"
        >
          <Laptop size={16} />
        </button>
        <button
          type="button"
          className={`bb-viewport-btn ${viewport === 'tablet' ? 'bb-viewport-btn--active' : ''}`}
          onClick={() => setViewport('tablet')}
          title="Tablet"
        >
          <Tablet size={16} />
        </button>
        <button
          type="button"
          className={`bb-viewport-btn ${viewport === 'mobile' ? 'bb-viewport-btn--active' : ''}`}
          onClick={() => setViewport('mobile')}
          title="Mobile"
        >
          <Smartphone size={16} />
        </button>
      </div>

      <div className="bb-zoom-controls">
        <button type="button" onClick={handleZoomOut} disabled={zoom <= 25} title="Zoom Out">
          <Minus size={16} />
        </button>
        <span>{zoom}%</span>
        <button type="button" onClick={handleZoomIn} disabled={zoom >= 200} title="Zoom In">
          <Plus size={16} />
        </button>
      </div>

      <button type="button" className="bb-viewport-btn" onClick={onRefresh} title="Refresh Preview">
        <RefreshCw size={16} />
      </button>
    </div>
  );
};
