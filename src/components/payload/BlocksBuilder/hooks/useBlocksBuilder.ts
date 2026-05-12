'use client'

import { useCallback, useMemo, useReducer } from 'react'
import { useField } from '@payloadcms/ui'
import { arrayMove } from '@dnd-kit/sortable'
import { blockMeta } from '../constants/blockMeta'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlockInstance {
  id: string
  blockType: string
  blockName?: string
  [key: string]: unknown
}

export type Viewport = 'desktop' | 'mobile'

interface BuilderState {
  blocks: BlockInstance[]
  selectedBlockId: string | null
  viewport: Viewport
  search: string
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_BLOCKS'; payload: BlockInstance[] }
  | { type: 'ADD_BLOCK'; payload: { blockType: string } }
  | { type: 'REMOVE_BLOCK'; payload: { id: string } }
  | { type: 'REORDER_BLOCKS'; payload: { oldIndex: number; newIndex: number } }
  | { type: 'MOVE_UP'; payload: { id: string } }
  | { type: 'MOVE_DOWN'; payload: { id: string } }
  | { type: 'SELECT_BLOCK'; payload: { id: string | null } }
  | { type: 'UPDATE_BLOCK'; payload: { id: string; data: Partial<BlockInstance> } }
  | { type: 'SET_VIEWPORT'; payload: Viewport }
  | { type: 'SET_SEARCH'; payload: string }

// ─── Reducer ──────────────────────────────────────────────────────────────────

function generateId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function reducer(state: BuilderState, action: Action): BuilderState {
  switch (action.type) {
    case 'SET_BLOCKS':
      return { ...state, blocks: action.payload }

    case 'ADD_BLOCK': {
      const meta = blockMeta[action.payload.blockType]
      const newBlock: BlockInstance = {
        id: generateId(),
        ...(meta?.defaultValues ?? {}),
        blockType: action.payload.blockType,
      }
      return { ...state, blocks: [...state.blocks, newBlock] }
    }

    case 'REMOVE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.filter((b) => b.id !== action.payload.id),
        selectedBlockId:
          state.selectedBlockId === action.payload.id ? null : state.selectedBlockId,
      }

    case 'REORDER_BLOCKS': {
      const { oldIndex, newIndex } = action.payload
      return { ...state, blocks: arrayMove(state.blocks, oldIndex, newIndex) }
    }

    case 'MOVE_UP': {
      const idx = state.blocks.findIndex((b) => b.id === action.payload.id)
      if (idx <= 0) return state
      return { ...state, blocks: arrayMove(state.blocks, idx, idx - 1) }
    }

    case 'MOVE_DOWN': {
      const idx = state.blocks.findIndex((b) => b.id === action.payload.id)
      if (idx < 0 || idx >= state.blocks.length - 1) return state
      return { ...state, blocks: arrayMove(state.blocks, idx, idx + 1) }
    }

    case 'SELECT_BLOCK':
      return { ...state, selectedBlockId: action.payload.id }

    case 'UPDATE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.map((b) =>
          b.id === action.payload.id ? { ...b, ...action.payload.data } : b,
        ),
      }

    case 'SET_VIEWPORT':
      return { ...state, viewport: action.payload }

    case 'SET_SEARCH':
      return { ...state, search: action.payload }

    default:
      return state
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseBlocksBuilderOptions {
  /** The dot-notation path to the `layout` field in Payload's form context */
  path: string
}

export function useBlocksBuilder({ path }: UseBlocksBuilderOptions) {
  const { value: rawValue, setValue } = useField<BlockInstance[]>({ path })

  const initial = useMemo<BuilderState>(
    () => ({
      blocks: Array.isArray(rawValue) ? (rawValue as BlockInstance[]) : [],
      selectedBlockId: null,
      viewport: 'desktop',
      search: '',
    }),
    // rawValue intentionally omitted — we only seed from Payload once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const [state, dispatch] = useReducer(reducer, initial)

  /** Sync updated blocks back to Payload's form state */
  const syncToPayload = useCallback(
    (blocks: BlockInstance[]) => {
      setValue(blocks)
    },
    [setValue],
  )

  // ─── Actions ──────────────────────────────────────────────────────────

  const addBlock = useCallback(
    (blockType: string) => {
      dispatch({ type: 'ADD_BLOCK', payload: { blockType } })
      // Derive new state inline to sync immediately
      const meta = blockMeta[blockType]
      const newBlock: BlockInstance = {
        id: generateId(),
        ...(meta?.defaultValues ?? {}),
        blockType,
      }
      const updated = [...state.blocks, newBlock]
      syncToPayload(updated)
    },
    [state.blocks, syncToPayload],
  )

  const removeBlock = useCallback(
    (id: string) => {
      dispatch({ type: 'REMOVE_BLOCK', payload: { id } })
      syncToPayload(state.blocks.filter((b) => b.id !== id))
    },
    [state.blocks, syncToPayload],
  )

  const reorderBlocks = useCallback(
    (oldIndex: number, newIndex: number) => {
      dispatch({ type: 'REORDER_BLOCKS', payload: { oldIndex, newIndex } })
      syncToPayload(arrayMove(state.blocks, oldIndex, newIndex))
    },
    [state.blocks, syncToPayload],
  )

  const moveUp = useCallback(
    (id: string) => {
      const idx = state.blocks.findIndex((b) => b.id === id)
      if (idx <= 0) return
      dispatch({ type: 'MOVE_UP', payload: { id } })
      syncToPayload(arrayMove(state.blocks, idx, idx - 1))
    },
    [state.blocks, syncToPayload],
  )

  const moveDown = useCallback(
    (id: string) => {
      const idx = state.blocks.findIndex((b) => b.id === id)
      if (idx < 0 || idx >= state.blocks.length - 1) return
      dispatch({ type: 'MOVE_DOWN', payload: { id } })
      syncToPayload(arrayMove(state.blocks, idx, idx + 1))
    },
    [state.blocks, syncToPayload],
  )

  const selectBlock = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_BLOCK', payload: { id } })
  }, [])

  const updateBlock = useCallback(
    (id: string, data: Partial<BlockInstance>) => {
      dispatch({ type: 'UPDATE_BLOCK', payload: { id, data } })
      const updated = state.blocks.map((b) => (b.id === id ? { ...b, ...data } : b))
      syncToPayload(updated)
    },
    [state.blocks, syncToPayload],
  )

  const setViewport = useCallback((viewport: Viewport) => {
    dispatch({ type: 'SET_VIEWPORT', payload: viewport })
  }, [])

  const setSearch = useCallback((search: string) => {
    dispatch({ type: 'SET_SEARCH', payload: search })
  }, [])

  const selectedBlock = useMemo(
    () => state.blocks.find((b) => b.id === state.selectedBlockId) ?? null,
    [state.blocks, state.selectedBlockId],
  )

  return {
    // State
    blocks: state.blocks,
    selectedBlockId: state.selectedBlockId,
    selectedBlock,
    viewport: state.viewport,
    search: state.search,
    // Actions
    addBlock,
    removeBlock,
    reorderBlocks,
    moveUp,
    moveDown,
    selectBlock,
    updateBlock,
    setViewport,
    setSearch,
  }
}
