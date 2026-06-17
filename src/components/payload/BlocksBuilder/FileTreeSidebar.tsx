'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FilePlus, ChevronRight, ChevronDown, Trash2 } from 'lucide-react';

export interface FileTreeSidebarProps {
  onFileSelect: (path: string) => void;
  modifiedFiles: Record<string, string>;
  deletedFiles: string[];
  onNewFile: (path: string) => void;
  onDeleteFile: (path: string) => void;
  activeFile: string | null;
}

type FileNode = {
  name: string;
  path: string;
  type: 'dir' | 'file';
  children?: FileNode[];
  loaded?: boolean;
};

function getFileIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    tsx: '⚛',
    jsx: '⚛',
    ts: '𝘁',
    js: 'JS',
    css: '⎉',
    json: '{}',
    md: '✏',
    html: '⬡',
    svg: '◈',
    png: '⬡',
    jpg: '⬡',
    jpeg: '⬡',
  };
  return map[ext] ?? '·';
}

export const FileTreeSidebar: React.FC<FileTreeSidebarProps> = ({
  onFileSelect,
  modifiedFiles,
  deletedFiles,
  onNewFile,
  onDeleteFile,
  activeFile,
}) => {
  const [tree, setTree] = useState<FileNode[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingPaths, setLoadingPaths] = useState<Set<string>>(new Set());
  const [hovered, setHovered] = useState<string | null>(null);

  const fetchFolder = useCallback(async (folderPath: string) => {
    setLoadingPaths((prev) => { const next = new Set(prev); next.add(folderPath); return next; });
    try {
      const res = await fetch(`/api/github-files?path=${encodeURIComponent(folderPath)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.type === 'dir' && Array.isArray(data.entries)) {
          const newNodes: FileNode[] = data.entries.map((e: any) => ({
            name: e.name, path: e.path, type: e.type,
          }));
          newNodes.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'dir' ? -1 : 1;
          });
          setTree((prevTree) => {
            if (folderPath === '') return newNodes;
            const insertChildren = (nodes: FileNode[]): FileNode[] =>
              nodes.map((node) => {
                if (node.path === folderPath) return { ...node, children: newNodes, loaded: true };
                if (node.children) return { ...node, children: insertChildren(node.children) };
                return node;
              });
            return insertChildren(prevTree);
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch folder', folderPath, err);
    } finally {
      setLoadingPaths((prev) => { const next = new Set(prev); next.delete(folderPath); return next; });
    }
  }, []);

  useEffect(() => { void fetchFolder(''); }, [fetchFolder]);

  const toggleFolder = (folderPath: string, isLoaded?: boolean) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderPath)) { next.delete(folderPath); }
      else { next.add(folderPath); if (!isLoaded) fetchFolder(folderPath); }
      return next;
    });
  };

  const handleCreateFile = () => {
    const path = window.prompt('Enter file path (e.g. src/components/NewFile.tsx):');
    if (path) onNewFile(path);
  };

  const renderNodes = (nodes: FileNode[], depth = 0): React.ReactNode => {
    return nodes.map((node) => {
      if (deletedFiles.includes(node.path)) return null;

      const isMatch = node.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (searchQuery && node.type === 'file' && !isMatch) return null;

      const isExpanded = expandedFolders.has(node.path);
      const isActive = activeFile === node.path;
      const isModified = node.path in modifiedFiles;
      const isHovered = hovered === node.path;
      const indent = depth * 12 + 10;

      if (node.type === 'dir') {
        if (searchQuery && !isMatch && (!node.children || node.children.length === 0)) return null;
        return (
          <div key={node.path}>
            <div
              className="bb-tree-node bb-tree-node--folder"
              style={{ paddingLeft: `${indent}px` }}
              onClick={() => toggleFolder(node.path, node.loaded)}
            >
              <span className="bb-tree-node__chevron">
                {isExpanded
                  ? <ChevronDown size={11} strokeWidth={2.5} />
                  : <ChevronRight size={11} strokeWidth={2.5} />}
              </span>
              <span className="bb-tree-folder-icon">
                {isExpanded ? '📂' : '📁'}
              </span>
              <span className="bb-tree-node__name">{node.name}</span>
            </div>
            {isExpanded && node.children && (
              <div>{renderNodes(node.children, depth + 1)}</div>
            )}
            {isExpanded && !node.children && loadingPaths.has(node.path) && (
              <div className="bb-tree-node bb-tree-node--loading" style={{ paddingLeft: `${indent + 20}px` }}>
                <span className="bb-tree-node__name" style={{ color: 'var(--bb-muted-2)', fontSize: '0.72rem' }}>
                  Loading…
                </span>
              </div>
            )}
          </div>
        );
      }

      return (
        <div
          key={node.path}
          className={`bb-tree-node ${isActive ? 'bb-tree-node--active' : ''} ${isModified ? 'bb-tree-node--modified' : ''}`}
          style={{ paddingLeft: `${indent}px` }}
          onClick={() => onFileSelect(node.path)}
          onMouseEnter={() => setHovered(node.path)}
          onMouseLeave={() => setHovered(null)}
        >
          <span
            className="bb-tree-file-icon"
            style={{
              fontSize: '0.6rem',
              fontWeight: 700,
              color: isActive ? 'var(--bb-gold)' : 'var(--bb-muted-2)',
              minWidth: 16,
              textAlign: 'center',
              letterSpacing: '-0.02em',
            }}
          >
            {getFileIcon(node.name)}
          </span>
          <span className="bb-tree-node__name">{node.name}</span>
          {isModified && (
            <span
              style={{
                width: 6, height: 6,
                borderRadius: '50%',
                background: 'var(--bb-gold)',
                flexShrink: 0,
                marginLeft: 'auto',
              }}
            />
          )}
          {isHovered && !isModified && (
            <button
              className="bb-tree-node__delete"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete ${node.path}?`)) onDeleteFile(node.path);
              }}
              title="Delete file"
            >
              <Trash2 size={11} strokeWidth={2} />
            </button>
          )}
        </div>
      );
    });
  };

  return (
    <div className="bb-file-tree">
      <div className="bb-file-tree__header">
        <span>Explorer</span>
        <button
          onClick={handleCreateFile}
          className="bb-file-tree__new-file-btn"
          title="New File"
        >
          <FilePlus size={13} strokeWidth={2} />
        </button>
      </div>
      <div className="bb-file-tree__search">
        <input
          type="text"
          placeholder="Search files…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="bb-file-tree__content">
        {loadingPaths.has('') && tree.length === 0 ? (
          <div className="bb-file-tree__loading">
            <span style={{ color: 'var(--bb-muted-2)', fontSize: '0.75rem' }}>Loading…</span>
          </div>
        ) : (
          renderNodes(tree)
        )}
      </div>
    </div>
  );
};
