'use client';
import React, { useRef, useEffect } from 'react';

interface ResizeHandleProps {
  onResize: (fraction: number) => void;
  minFraction?: number;
  maxFraction?: number;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  onResize,
  minFraction = 0.2,
  maxFraction = 0.8,
}) => {
  const isDragging = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      const newFraction = e.clientX / window.innerWidth;
      const clampedFraction = Math.max(minFraction, Math.min(newFraction, maxFraction));
      onResize(clampedFraction);
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
  }, [onResize, minFraction, maxFraction]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      
      const currentRect = e.currentTarget.getBoundingClientRect();
      const currentFraction = currentRect.left / window.innerWidth;
      
      let newFraction = currentFraction;
      if (e.key === 'ArrowLeft') newFraction -= 0.05;
      if (e.key === 'ArrowRight') newFraction += 0.05;
      
      const clampedFraction = Math.max(minFraction, Math.min(newFraction, maxFraction));
      onResize(clampedFraction);
    }
  };

  return (
    <div
      className="bb-resize-handle"
      role="separator"
      aria-orientation="vertical"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseDown={() => {
        isDragging.current = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
      }}
    />
  );
};
