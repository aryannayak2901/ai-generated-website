'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { useField, useDocumentInfo, useForm } from '@payloadcms/ui';

export interface BlockInstance {
  id: string;
  blockType: string;
  [key: string]: any;
}

export function useBlocksBuilder(fieldPath: string) {
  const { value, setValue } = useField<BlockInstance[]>({ path: fieldPath, validate: () => true });
  const { doc } = useDocumentInfo() as any;
  const form = useForm();

  // Local state for the builder
  const [blocks, setBlocks] = useState<BlockInstance[]>([]);
  const hasInitialized = useRef(false);

  // Sync from Payload value/doc to local state (One-way)
  // CRITICAL: We do NOT include 'blocks' in the dependency array to prevent 
  // the "revert to previous" bug when local state updates.
  useEffect(() => {
    const valueBlocks = Array.isArray(value) ? value : [];
    const docBlocks = (doc && Array.isArray(doc[fieldPath])) ? doc[fieldPath] as BlockInstance[] : [];
    
    // Choose the best source of truth on load
    // We prefer 'value' if it has data, otherwise fallback to 'doc'
    const incomingBlocks = valueBlocks.length > 0 ? valueBlocks : docBlocks;

    if (incomingBlocks.length > 0) {
      // Only sync if we haven't initialized yet OR if the incoming data is different
      // from what we currently have (using a local check, not a dependency)
      const currentBlocksJson = JSON.stringify(blocks);
      const incomingBlocksJson = JSON.stringify(incomingBlocks);

      if (incomingBlocksJson !== currentBlocksJson) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBlocks(incomingBlocks);
      }
      
      if (valueBlocks.length > 0) {
        hasInitialized.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, doc, fieldPath]); // Removed 'blocks' to fix the revert bug

  // Local UI state (non-persisted)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [search, setSearch] = useState('');

  const generateBlockId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addBlock = useCallback((blockType: string, defaultValues: any) => {
    const newBlock: BlockInstance = {
      id: generateBlockId(),
      blockType,
      ...defaultValues,
    };

    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    setValue(newBlocks);
    if (form && typeof form.setModified === 'function') {
      form.setModified(true);
    }
    return newBlock.id;
  }, [blocks, generateBlockId, setValue, form]);

  const addBlocks = useCallback((newBlocksData: { blockType: string; defaultValues: any }[]) => {
    const newInstances = newBlocksData.map(data => ({
      id: generateBlockId(),
      blockType: data.blockType,
      ...data.defaultValues,
    }));

    const newBlocks = [...blocks, ...newInstances];
    setBlocks(newBlocks);
    setValue(newBlocks);
    if (form && typeof form.setModified === 'function') {
      form.setModified(true);
    }
    return newInstances.map(b => b.id);
  }, [blocks, generateBlockId, setValue, form]);

  const removeBlock = useCallback((blockId: string) => {
    const newBlocks = blocks.filter(b => b.id !== blockId);
    setBlocks(newBlocks);
    setValue(newBlocks);
    if (form && typeof form.setModified === 'function') {
      form.setModified(true);
    }
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  }, [blocks, selectedBlockId, setValue, form]);

  const moveBlock = useCallback((fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    setBlocks(newBlocks);
    setValue(newBlocks);
    if (form && typeof form.setModified === 'function') {
      form.setModified(true);
    }
  }, [blocks, setValue, form]);

  const updateBlock = useCallback((blockId: string, updates: Partial<BlockInstance>) => {
    const newBlocks = blocks.map(b =>
      b.id === blockId ? { ...b, ...updates } : b
    );
    setBlocks(newBlocks);
    setValue(newBlocks);
    if (form && typeof form.setModified === 'function') {
      form.setModified(true);
    }
  }, [blocks, setValue, form]);

  const selectBlock = useCallback((blockId: string | null) => {
    setSelectedBlockId(blockId);
  }, []);

  const getSelectedBlock = useCallback(() => {
    return blocks.find(b => b.id === selectedBlockId) || null;
  }, [blocks, selectedBlockId]);

  return {
    blocks,
    selectedBlockId,
    viewport,
    search,
    addBlock,
    addBlocks,
    removeBlock,
    moveBlock,
    updateBlock,
    selectBlock,
    setViewport,
    setSearch,
    getSelectedBlock,
  };
}