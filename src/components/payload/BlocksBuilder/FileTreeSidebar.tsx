'use client';

import React, { useState, useEffect, useCallback } from 'react';

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

  const fetchFolder = useCallback(async (folderPath: string) => {
    setLoadingPaths((prev) => {
      const next = new Set(prev);
      next.add(folderPath);
      return next;
    });

    try {
      const res = await fetch(`/api/github-files?path=${encodeURIComponent(folderPath)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.type === 'dir' && Array.isArray(data.entries)) {
          const newNodes: FileNode[] = data.entries.map((e: any) => ({
            name: e.name,
            path: e.path,
            type: e.type,
          }));
          
          // Sort folders first, then files
          newNodes.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'dir' ? -1 : 1;
          });

          setTree((prevTree) => {
            if (folderPath === '') {
              return newNodes;
            }
            
            // Helper to insert nodes into the tree
            const insertChildren = (nodes: FileNode[]): FileNode[] => {
              return nodes.map((node) => {
                if (node.path === folderPath) {
                  return { ...node, children: newNodes, loaded: true };
                }
                if (node.children) {
                  return { ...node, children: insertChildren(node.children) };
                }
                return node;
              });
            };
            
            return insertChildren(prevTree);
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch folder', folderPath, err);
    } finally {
      setLoadingPaths((prev) => {
        const next = new Set(prev);
        next.delete(folderPath);
        return next;
      });
    }
  }, []);

  // Fetch root on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchFolder('');
  }, [fetchFolder]);

  const toggleFolder = (folderPath: string, isLoaded?: boolean) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderPath)) {
        next.delete(folderPath);
      } else {
        next.add(folderPath);
        if (!isLoaded) {
          fetchFolder(folderPath);
        }
      }
      return next;
    });
  };

  const handleCreateFile = () => {
    const path = window.prompt('Enter file path (e.g. src/components/NewFile.tsx):');
    if (path) {
      onNewFile(path);
    }
  };

  const renderNodes = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node) => {
      if (deletedFiles.includes(node.path)) {
        return null;
      }

      // If search query is present, only show matching files/folders
      const isMatch = node.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Basic filtering: if it's a file and doesn't match, hide it. 
      // If it's a folder, we'd need more complex logic to show if children match, 
      // but for simplicity we will just show folders that match or have children.
      if (searchQuery && node.type === 'file' && !isMatch) {
        return null;
      }

      const isExpanded = expandedFolders.has(node.path);
      const isActive = activeFile === node.path;
      const isModified = node.path in modifiedFiles;
      const paddingLeft = `${depth * 12 + 12}px`;

      if (node.type === 'dir') {
        // If searching and folder doesn't match and has no loaded children that match, we could hide it.
        // For simplicity, we just render if it's a match, or if not searching.
        if (searchQuery && !isMatch && (!node.children || node.children.length === 0)) {
           return null;
        }

        return (
          <div key={node.path}>
            <div
              className={`bb-tree-node bb-tree-node--folder ${isActive ? 'bb-tree-node--active' : ''}`}
              style={{ paddingLeft }}
              onClick={() => toggleFolder(node.path, node.loaded)}
            >
              <span className="bb-tree-node__icon">
                {isExpanded ? '📂' : '📁'}
              </span>
              <span className="bb-tree-node__name">{node.name}</span>
            </div>
            {isExpanded && node.children && (
              <div>{renderNodes(node.children, depth + 1)}</div>
            )}
            {isExpanded && !node.children && loadingPaths.has(node.path) && (
              <div className="bb-tree-node bb-tree-node--loading" style={{ paddingLeft: `${(depth + 1) * 12 + 12}px` }}>
                <span className="bb-tree-node__name">Loading...</span>
              </div>
            )}
          </div>
        );
      }

      return (
        <div
          key={node.path}
          className={`bb-tree-node ${isActive ? 'bb-tree-node--active' : ''} ${isModified ? 'bb-tree-node--modified' : ''}`}
          style={{ paddingLeft }}
          onClick={() => onFileSelect(node.path)}
        >
          <span className="bb-tree-node__icon">
            📄
          </span>
          <span className="bb-tree-node__name">{node.name}</span>
          <button
             className="bb-tree-node__delete"
             onClick={(e) => {
               e.stopPropagation();
               if (window.confirm(`Delete ${node.path}?`)) {
                 onDeleteFile(node.path);
               }
             }}
             title="Delete file"
          >
            ×
          </button>
        </div>
      );
    });
  };

  return (
    <div className="bb-file-tree">
      <div className="bb-file-tree__header">
        <span>EXPLORER</span>
        <button 
          onClick={handleCreateFile}
          className="bb-file-tree__new-file-btn"
          title="New File"
        >
          +
        </button>
      </div>
      <div className="bb-file-tree__search">
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="bb-file-tree__content">
        {loadingPaths.has('') && tree.length === 0 ? (
          <div className="bb-file-tree__loading">Loading...</div>
        ) : (
          renderNodes(tree)
        )}
      </div>
    </div>
  );
};
