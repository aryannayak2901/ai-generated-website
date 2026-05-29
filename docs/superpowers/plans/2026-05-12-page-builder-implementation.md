# Drag-and-Drop Page Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Payload CMS blocks UI into a high-end, three-panel visual page builder with drag-and-drop capabilities and live preview.

**Architecture:**
- Create a custom Payload Field component `BlocksBuilderField` to override the `layout` field.
- Implement a four-panel layout: Block Library (draggable chips), Canvas (sortable blocks), Edit Panel (slide-in form using Payload's `useField`), and Preview Panel (iframe with Next.js Draft Mode).
- Centralize state management using a `useBlocksBuilder` hook that syncs with Payload's form state.
- Update Next.js routes to support Draft Mode and dynamic block rendering via a standardized `RenderBlocks` component.

**Tech Stack:** Next.js, Payload CMS v3, `@dnd-kit`, Framer Motion, Tailwind CSS v4.

---

## Phase 1: Infrastructure & Setup

### Task 1: Install Dependencies
**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install @dnd-kit core and utilities**
Run: `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`

- [ ] **Step 2: Commit**
```bash
git add package.json
git commit -m "chore: install dnd-kit dependencies"
```

### Task 2: Environment Setup
**Files:**
- Create: `.env.local` (if not exists)
- Modify: `.env`

- [ ] **Step 1: Add PREVIEW_SECRET to .env files**
Generate a random 64-char string and add it to `.env` and `.env.local`.
```bash
PREVIEW_SECRET=your-random-64-char-string
```

- [ ] **Step 2: Commit**
```bash
git add .env .env.local
git commit -m "chore: add preview secret to env"
```

---

## Phase 2: Core Logic & State Management

### Task 3: Block Meta Constants
**Files:**
- Create: `src/components/payload/BlocksBuilder/constants/blockMeta.ts`

- [ ] **Step 1: Define block metadata for all 20+ block types**
```typescript
export interface BlockMeta {
  label: string;
  category: 'Hero' | 'Content' | 'CTA / Forms';
  icon: string;
  badgeLabel: string;
  defaultValues: any;
}

export const blockMeta: Record<string, BlockMeta> = {
  hero: {
    label: 'Standard Hero',
    category: 'Hero',
    icon: '⚡',
    badgeLabel: 'Hero',
    defaultValues: { blockType: 'hero', title: 'New Hero' }
  },
  // ... add all other blocks from Pages.ts
};
```

- [ ] **Step 2: Commit**
```bash
git add src/components/payload/BlocksBuilder/constants/blockMeta.ts
git commit -m "feat: add blockMeta constants"
```

### Task 4: Custom Hooks
**Files:**
- Create: `src/components/payload/BlocksBuilder/hooks/useBlocksBuilder.ts`
- Create: `src/components/payload/BlocksBuilder/hooks/usePreviewRefresh.ts`

- [ ] **Step 1: Implement useBlocksBuilder hook**
This hook manages the `blocks` array, `selectedBlockId`, `viewport`, and `search`.
It should use Payload's `useField` to sync with the form.

- [ ] **Step 2: Implement usePreviewRefresh hook**
Debounced logic to reload the preview iframe.

- [ ] **Step 3: Commit**
```bash
git add src/components/payload/BlocksBuilder/hooks/*.ts
git commit -m "feat: add BlocksBuilder hooks"
```

---

## Phase 3: UI Components

### Task 5: Root BlocksBuilderField
**Files:**
- Create: `src/components/payload/BlocksBuilder/BlocksBuilderField.tsx`
- Create: `src/components/payload/BlocksBuilder/index.ts`

- [ ] **Step 1: Build the main container with the four-panel grid layout**
Use CSS Grid or Flexbox as per `DESIGN.md` (Panel 1: 190px, Panel 2: flex-1, Panel 3: 220px/hidden, Panel 4: 240px).

- [ ] **Step 2: Commit**
```bash
git add src/components/payload/BlocksBuilder/BlocksBuilderField.tsx src/components/payload/BlocksBuilder/index.ts
git commit -m "feat: add BlocksBuilderField root component"
```

### Task 6: Panel 1 - Block Library
**Files:**
- Create: `src/components/payload/BlocksBuilder/BlockLibraryPanel.tsx`

- [ ] **Step 1: Implement searchable list of draggable block chips**
Use `useDraggable` from `@dnd-kit/core`.

- [ ] **Step 2: Commit**
```bash
git add src/components/payload/BlocksBuilder/BlockLibraryPanel.tsx
git commit -m "feat: add BlockLibraryPanel"
```

### Task 7: Panel 2 - Canvas
**Files:**
- Create: `src/components/payload/BlocksBuilder/CanvasPanel.tsx`
- Create: `src/components/payload/BlocksBuilder/CanvasBlock.tsx`

- [ ] **Step 1: Implement sortable list using @dnd-kit/sortable**
Show block name, type badge, and action buttons (Edit, Up, Down, Delete).

- [ ] **Step 2: Commit**
```bash
git add src/components/payload/BlocksBuilder/CanvasPanel.tsx src/components/payload/BlocksBuilder/CanvasBlock.tsx
git commit -m "feat: add CanvasPanel and CanvasBlock"
```

### Task 8: Panel 3 - Edit Panel (Slide-in)
**Files:**
- Create: `src/components/payload/BlocksBuilder/EditPanel.tsx`

- [ ] **Step 1: Implement slide-in form using Payload's native field components**
Use `useField` or `RenderFields` if available in Payload v3.

- [ ] **Step 2: Commit**
```bash
git add src/components/payload/BlocksBuilder/EditPanel.tsx
git commit -m "feat: add EditPanel"
```

### Task 9: Panel 4 - Preview Panel
**Files:**
- Create: `src/components/payload/BlocksBuilder/PreviewPanel.tsx`

- [ ] **Step 1: Implement iframe preview with viewport toggle**
URL should be `/{pageSlug}?draft=true&secret={PREVIEW_SECRET}`.

- [ ] **Step 2: Commit**
```bash
git add src/components/payload/BlocksBuilder/PreviewPanel.tsx
git commit -m "feat: add PreviewPanel"
```

---

## Phase 4: Next.js Integration

### Task 10: Draft Mode API Routes
**Files:**
- Create: `src/app/api/draft/route.ts`
- Create: `src/app/api/disable-draft/route.ts`

- [ ] **Step 1: Implement draft mode enable/disable logic**
Use `draftMode().enable()` and `draftMode().disable()`.

- [ ] **Step 2: Commit**
```bash
git add src/app/api/draft/route.ts src/app/api/disable-draft/route.ts
git commit -m "feat: add draft mode API routes"
```

### Task 11: RenderBlocks Component
**Files:**
- Modify: `src/components/RenderBlocks.tsx` (Ensure it supports all blocks)

- [ ] **Step 1: Update RenderBlocks to handle dynamic block mapping**
Ensure it takes `layout` array and renders the correct component for each `blockType`.

- [ ] **Step 2: Commit**
```bash
git add src/components/RenderBlocks.tsx
git commit -m "feat: update RenderBlocks for dynamic layout"
```

### Task 12: Public Page Routes Update
**Files:**
- Modify: `src/app/(app)/[slug]/page.tsx` (or equivalent)

- [ ] **Step 1: Integrate Draft Mode check and RenderBlocks**
Fetch data with `cache: 'no-store'` if draft mode is enabled.

- [ ] **Step 2: Commit**
```bash
git add src/app/(app)/[slug]/page.tsx
git commit -m "feat: integrate draft mode in page route"
```

---

## Phase 5: Payload Registration

### Task 13: Register Custom Field
**Files:**
- Modify: `src/collections/Pages.ts`

- [ ] **Step 1: Add admin.components.Field override to 'layout' field**
```typescript
admin: {
  components: {
    Field: '@/components/payload/BlocksBuilder'
  }
}
```

- [ ] **Step 2: Commit**
```bash
git add src/collections/Pages.ts
git commit -m "feat: register BlocksBuilderField in Pages collection"
```

### Task 14: Regenerate Import Map
- [ ] **Step 1: Run payload generate:importmap**
Run: `npx payload generate:importmap`

- [ ] **Step 2: Commit**
```bash
git add src/payload-import-map.js (or equivalent)
git commit -m "chore: regenerate payload import map"
```

---

## Verification

- [ ] Verify dragging from library adds block to canvas.
- [ ] Verify sorting blocks on canvas updates Payload state.
- [ ] Verify clicking "Edit" slides in the panel and shows correct fields.
- [ ] Verify iframe preview updates on changes.
- [ ] Verify viewport toggle changes iframe size.
