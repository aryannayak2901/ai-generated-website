'use client';

import React from 'react';

export interface EditorTabBarProps {
  openFiles: string[];
  activeFile: string | null;
  modifiedFiles: Record<string, string>;
  onTabSelect: (path: string) => void;
  onTabClose: (path: string) => void;
}

export const EditorTabBar: React.FC<EditorTabBarProps> = ({
  openFiles,
  activeFile,
  modifiedFiles,
  onTabSelect,
  onTabClose,
}) => {
  if (openFiles.length === 0) {
    return null;
  }

  return (
    <div className="bb-editor-tabs">
      {openFiles.map((filePath) => {
        const isActive = activeFile === filePath;
        const isModified = filePath in modifiedFiles;
        const fileName = filePath.split('/').pop() || filePath;

        return (
          <div
            key={filePath}
            className={`bb-editor-tab ${isActive ? 'bb-editor-tab--active' : ''} ${
              isModified ? 'bb-editor-tab--modified' : ''
            }`}
            onClick={() => onTabSelect(filePath)}
          >
            <span className="bb-editor-tab-icon">
              📄
            </span>
            <span className="bb-editor-tab-name">{fileName}</span>
            {isModified && <span className="bb-editor-tab-dot" />}
            <button
              className="bb-editor-tab-close"
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(filePath);
              }}
              title="Close"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};
