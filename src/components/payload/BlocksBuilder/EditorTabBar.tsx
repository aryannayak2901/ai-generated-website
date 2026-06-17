'use client';

import React from 'react';
import { X } from 'lucide-react';

export interface EditorTabBarProps {
  openFiles: string[];
  activeFile: string | null;
  modifiedFiles: Record<string, string>;
  onTabSelect: (path: string) => void;
  onTabClose: (path: string) => void;
}

function getFileIconColor(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const colors: Record<string, string> = {
    tsx: '#61dafb',
    jsx: '#61dafb',
    ts: '#3178c6',
    js: '#f0db4f',
    css: '#264de4',
    json: '#cbcb41',
    md: '#ffffff',
    html: '#e44d26',
  };
  return colors[ext] ?? '#8899aa';
}

function getFileExt(name: string): string {
  const ext = name.split('.').pop()?.toUpperCase() ?? '';
  return ext.length <= 4 ? ext : '';
}

export const EditorTabBar: React.FC<EditorTabBarProps> = ({
  openFiles,
  activeFile,
  modifiedFiles,
  onTabSelect,
  onTabClose,
}) => {
  if (openFiles.length === 0) return null;

  return (
    <div className="bb-editor-tabs">
      {openFiles.map((filePath) => {
        const isActive = activeFile === filePath;
        const isModified = filePath in modifiedFiles;
        const fileName = filePath.split('/').pop() || filePath;
        const iconColor = getFileIconColor(fileName);
        const ext = getFileExt(fileName);

        return (
          <div
            key={filePath}
            className={`bb-editor-tab ${isActive ? 'bb-editor-tab--active' : ''} ${isModified ? 'bb-editor-tab--modified' : ''}`}
            onClick={() => onTabSelect(filePath)}
            title={filePath}
          >
            {/* File type color indicator */}
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: iconColor,
                flexShrink: 0,
                opacity: isActive ? 1 : 0.5,
              }}
            />
            <span className="bb-editor-tab-name">{fileName}</span>
            {/* Modified dot */}
            {isModified && (
              <span
                style={{
                  width: 6, height: 6,
                  borderRadius: '50%',
                  background: 'var(--bb-gold)',
                  flexShrink: 0,
                }}
                title="Modified"
              />
            )}
            {/* Close button */}
            <button
              className="bb-editor-tab-close"
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(filePath);
              }}
              title="Close tab"
            >
              <X size={11} strokeWidth={2.5} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
