# Design Spec: Drag-and-Drop Page Builder with Live Preview

**Date:** 2026-05-11  
**Project:** Chambers of Jeet Bhatt  
**Status:** Approved

---

## 1. Problem Statement

Payload CMS's default `blocks` field UI presents layout blocks as a flat vertical list of accordion rows. Adding a new block requires clicking "Add Block" → scrolling a modal dropdown → selecting a type — a clunky, form-centric flow. There is no visual sense of page structure and no live preview of how the page looks.

This spec defines a custom Payload field component that replaces the default blocks UI with a **Shopify-style Three-Panel Studio** supporting drag-and-drop reordering, slide-in field editing, and a live iframe preview that reflects changes in real time.

---

## 2. Scope

**In scope:**
- Custom `BlocksBuilderField` component for the `layout` field on the `Pages` Payload collection
- Four-panel UI: Block Library, Canvas, Edit Panel (slide-in), Live Preview (iframe)
- Drag-and-drop reordering via `@dnd-kit`
- Slide-in edit panel rendering Payload's native field components for each block type
- Next.js Draft Mode API routes (`/api/draft`, `/api/disable-draft`) for the preview iframe
- All ~20 existing block types supported (dynamicHero, homeHero, practiceAreas, awardsMarquee, aboutHero, aboutTeam, aboutValues, aboutCta, practiceAreasHero, practiceAreasGrid, practiceAreasCta, contactHero, contactInfo, contactForm, contactMap, blogHero, blogFilters, newsletter, officeHero, officeSelector, mapSection, officeCta)

**Out of scope:**
- Visual block previews inside the library (thumbnails of real block renders)
- Undo/redo history
- Multi-page drag-and-drop (blocks belong to one page at a time)
- Mobile admin usage (desktop admin only)
- Changes to any non-Pages collections

---

## 3. UI Architecture: Three-Panel Studio

The builder replaces the standard `blocks` field render inside Payload's page edit view. It occupies the full width of the field area and renders four vertical panels.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Titlebar: "Page Builder"  ·  breadcrumb  ·  [Save & Publish]           │
├──────────────┬──────────────────────┬──────────────────┬─────────────────┤
│  PANEL 1     │  PANEL 2             │  PANEL 3         │  PANEL 4        │
│  Block       │  Canvas              │  Edit Panel      │  Live Preview   │
│  Library     │  (drag-and-drop)     │  (slide-in)      │  (iframe)       │
│  190px       │  flex: 1             │  220px           │  240px          │
│              │                      │  (hidden by       │                 │
│              │                      │   default)        │                 │
└──────────────┴──────────────────────┴──────────────────┴─────────────────┘
```

When no block is being edited, Panel 3 is hidden and Panel 4 (preview) is visible.
When a block is clicked for editing, Panel 3 slides in and Panel 4 collapses. On close of Panel 3, it slides out and Panel 4 re-expands.

### 3.1 Panel 1 — Block Library

- Fixed width: `190px`
- Search input at top (client-side filter, no API call)
- Blocks grouped by category:
  - **Hero**: dynamicHero, homeHero, aboutHero, practiceAreasHero, contactHero, blogHero, officeHero
  - **Content**: practiceAreas, practiceAreasGrid, awardsMarquee, aboutTeam, aboutValues, officeSelector, mapSection, blogFilters
  - **CTA / Forms**: aboutCta, practiceAreasCta, officeCta, contactForm, contactInfo, contactMap, newsletter
- Each block chip: drag handle icon + block label + block icon
- Chips are draggable (`useDraggable`) — dropping onto the canvas appends the block

### 3.2 Panel 2 — Canvas

- Sortable list of active blocks using `@dnd-kit/sortable` with `SortableContext`
- Each block row (`CanvasBlock`) shows:
  - Drag handle (`⠿`) from `useSortable`'s `listeners` + `attributes`
  - Colour-coded type badge (e.g., "Hero", "Grid", "Mq")
  - Block display name
  - Action buttons: ✏ Edit · ↑ Move Up · ↓ Move Down · 🗑 Delete
- Active (selected) block highlighted with gold border
- Drop zone at bottom of list for blocks dragged from the library
- Toolbar above canvas: Desktop / Mobile viewport toggle
- Block count displayed in toolbar

### 3.3 Panel 3 — Edit Panel (Slide-in)

- Hidden by default; animates in from the right (`translateX`, 200ms ease-out) when ✏ is clicked
- Header: "Edit: {block display name}" + ✕ close button
- Body: scrollable form rendering **Payload's native field components** for the selected block type using `useField` hook per sub-field
- Footer: "Save Block" button — validates required fields; on success closes the panel and triggers preview refresh
- Closing without saving discards unsaved changes

### 3.4 Panel 4 — Live Preview (iframe)

- `iframe src`: `http://localhost:3000/{pageSlug}?draft=true&secret={PREVIEW_SECRET}`
- Refreshes after: block added, block deleted, block reordered, "Save Block" clicked
- Refresh debounced: 600ms after last change
- Viewport switcher changes iframe `width` CSS — Desktop: 100%, Mobile: 390px centered
- "Live" indicator badge (green pulsing dot) in panel header

---

## 4. Component Structure

```
src/components/payload/BlocksBuilder/
├── BlocksBuilderField.tsx        # Root Payload field override; owns all state
├── BlockLibraryPanel.tsx         # Panel 1 — searchable draggable block list
├── CanvasPanel.tsx               # Panel 2 — sortable canvas + toolbar
├── CanvasBlock.tsx               # Single sortable block row
├── EditPanel.tsx                 # Panel 3 — slide-in form
├── PreviewPanel.tsx              # Panel 4 — iframe preview
├── hooks/
│   ├── useBlocksBuilder.ts       # Central state: blocks array, selected block, panel visibility
│   └── usePreviewRefresh.ts      # Debounced iframe reload logic
├── constants/
│   └── blockMeta.ts              # Block display names, icons, categories, default values
└── index.ts                      # Re-exports BlocksBuilderField
```

---

## 5. State Management

All mutable state lives in `useBlocksBuilder` (a plain React hook inside `BlocksBuilderField`):

```ts
interface BuilderState {
  blocks: BlockInstance[]        // ordered array of blocks on the canvas
  selectedBlockId: string | null // which block is open in the edit panel
  viewport: 'desktop' | 'mobile'
  search: string                 // library search filter
}
```

`BlockInstance` mirrors Payload's block data shape: `{ id, blockType, blockName?, ...fields }`.

**Payload sync**: `BlocksBuilderField` uses Payload's `useField<BlockInstance[]>` hook to read the initial value and write updates. Every change to `blocks` calls `setValue(blocks)` — keeping Payload's form state in sync so the standard "Save" button continues to work.

---

## 6. Drag-and-Drop

**Library → Canvas (add):** `useDraggable` on each library chip. Canvas has a `useDroppable` zone. On `DragEndEvent` where `over.id === 'canvas-drop'`, a new block is created from `blockMeta[blockType].defaultValues` and appended to `blocks`.

**Canvas reorder:** `SortableContext` wrapping `CanvasBlock` items. `DndContext.onDragEnd` calls `arrayMove(blocks, oldIndex, newIndex)` and triggers preview refresh.

**Drag overlay:** `DragOverlay` renders a ghost chip. Uses `{pointerEvents: 'none'}` to prevent accidental clicks.

**Accessibility:** `KeyboardSensor` added alongside `PointerSensor` for keyboard reordering.

---

## 7. Draft Mode & Live Preview

### 7.1 API Routes

**`src/app/api/draft/route.ts`**
```
GET /api/draft?secret={PREVIEW_SECRET}&slug={slug}
```
- Validates `secret === process.env.PREVIEW_SECRET`
- Calls `draftMode().enable()`
- Redirects to `/{slug}`

**`src/app/api/disable-draft/route.ts`**
```
GET /api/disable-draft
```
- Calls `draftMode().disable()`
- Redirects to `/`

### 7.2 Page Route Changes

Each public page route must be updated to:
1. Check `draftMode().isEnabled` from `next/headers`
2. If enabled, fetch the page's `layout` data from Payload REST API with `{ cache: 'no-store' }`
3. Pass the layout blocks to a new `RenderBlocks` component (switch on `blockType`)
4. If not in draft mode, render existing static component tree (no regression)

A new `src/components/RenderBlocks.tsx` component will render the correct section component per `blockType`, reusing all existing components (HeroSection, AboutHero, etc.) unchanged.

### 7.3 Environment Variable

Add `PREVIEW_SECRET=<random-64-char-string>` to `.env` and `.env.local`.

### 7.4 next.config.ts

Add `X-Frame-Options: SAMEORIGIN` header for all non-admin routes to allow iframe embedding within the admin.

---

## 8. blockMeta Constants

`constants/blockMeta.ts` exports a record keyed by `blockType`:

| Field | Purpose |
|---|---|
| `label` | Human-readable display name ("Home Hero") |
| `category` | "Hero" \| "Content" \| "CTA / Forms" |
| `icon` | Emoji for library chip |
| `badgeLabel` | 2–4 char canvas badge ("Hero", "Grid", "Mq") |
| `defaultValues` | Minimal valid block data for new instances |

---

## 9. Payload Config Registration

In `payload.config.ts`, the `Pages` collection's `layout` field gets an `admin.components.Field` override:

```ts
{
  name: 'layout',
  type: 'blocks',
  blocks: [...],
  admin: {
    components: {
      Field: '@/components/payload/BlocksBuilder'
    }
  }
}
```

`importMap.js` must be regenerated (via `payload generate:importmap`) after registration.

---

## 10. Error Handling

| Scenario | Handling |
|---|---|
| Preview iframe fails to load | Fallback: "Preview unavailable" + manual refresh button |
| Draft mode secret mismatch | API returns 401; preview shows inline error state |
| Block missing required field | "Save Block" disabled; inline validation error per field |
| Payload form save fails | Existing Payload toast notification system handles it |
| Keyboard DnD | Full `KeyboardSensor` support for accessibility |

---

## 11. New Dependencies

```bash
yarn add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

No other new runtime dependencies. Payload's built-in hooks (`useField`, `useFormFields`, `useDocumentInfo`) handle form integration.

---

## 12. Key Assumptions

- **Payload version**: v3.24.0 (confirmed from yarn cache). `useField` hook and `admin.components.Field` override are v3-compatible.
- **payload.config.ts location**: Must be located during implementation (not confirmed from filesystem scan). It is the standard entry point for Payload v3 — typically at project root or `src/`.
- **RenderBlocks prerequisite**: The project currently uses static component trees per page. A `RenderBlocks` switch component is a required prerequisite before draft mode integration can work.
- **Draft token security**: `PREVIEW_SECRET` is stored in env only; never exposed to the browser directly. The iframe URL includes it only as a query param on the local admin (not public internet).
