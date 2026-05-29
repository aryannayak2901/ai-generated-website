# Page Builder Fullscreen Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide the left sidebar toggler button when the page builder is in fullscreen mode, and render a premium back-chevron button at the top-left of the page builder header that exits fullscreen on click.

**Architecture:** Lift `isFullscreen` state to `PagesStudioView.tsx`, support controlled fullscreen props in `BlocksBuilderField.tsx`, render a matching chevron-left button inside the custom header, and use custom CSS overrides to toggle button visibility.

**Tech Stack:** React, Next.js, CSS, Lucide Icons

---

### Task 1: Lift Fullscreen State to PagesStudioView and Implement Chevron Button

**Files:**
- Modify: `src/components/payload/PagesStudioView.tsx`

- [ ] **Step 1: Add imports and lift state**
  Open [PagesStudioView.tsx](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/components/payload/PagesStudioView.tsx).
  Import `ChevronLeft` from `lucide-react`.
  Update `StudioHeader` to accept `isFullscreen` and `onToggleFullscreen` props, and render the toggle button before the select dropdown.
  Update `PagesStudioView` to declare `const [isFullscreen, setIsFullscreen] = useState(false);` and pass it to `BlocksBuilderField` and `StudioHeader`.

  ```tsx
  // Add to top imports:
  import { ChevronLeft } from "lucide-react";
  ```

  Update `StudioHeader` signature and JSX:
  ```tsx
  const StudioHeader = ({
    pages,
    selectedPageId,
    onPageChange,
    onAddNewPage,
    onDeletePage,
    isCreating,
    isDeleting,
    isFullscreen,
    onToggleFullscreen,
  }: {
    pages: { id: string; title: string }[];
    selectedPageId: string | null;
    onPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onAddNewPage: () => void;
    onDeletePage: () => void;
    isCreating: boolean;
    isDeleting: boolean;
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
  }) => {
    const form = useForm();
    const submit = form?.submit || (() => {});
    const processing = (form as any)?.processing || false;
    const modified = (form as any)?.modified || false;

    return (
      <div
        style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}
      >
        {isFullscreen && (
          <button
            type="button"
            className="bb-studio-fullscreen-toggle-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFullscreen();
            }}
            title="Exit Fullscreen"
          >
            <ChevronLeft size={16} />
          </button>
        )}
        <select
          className="bb-page-selector"
          value={selectedPageId || "new"}
          onChange={onPageChange}
        >
  ```

  Update `PagesStudioView` render block:
  ```tsx
  export const PagesStudioView = () => {
    const [pages, setPages] = useState<{ id: string; title: string }[]>([]);
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
    const [currentPageData, setCurrentPageData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false); // LIFTED STATE
  ```

  And pass it down in the JSX:
  ```tsx
            <BlocksBuilderField
              path="layout"
              label="Layout"
              id={selectedPageId}
              collectionSlug="pages"
              isFullscreen={isFullscreen}
              onFullscreenChange={setIsFullscreen}
              customHeader={
                <StudioHeader
                  pages={pages || []}
                  selectedPageId={selectedPageId}
                  onPageChange={handlePageChange}
                  onAddNewPage={handleAddNewPage}
                  onDeletePage={handleDeletePage}
                  isCreating={false}
                  isDeleting={isDeleting}
                  isFullscreen={isFullscreen}
                  onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                />
              }
            />
  ```

- [ ] **Step 2: Commit Task 1**
  Run:
  ```bash
  git add src/components/payload/PagesStudioView.tsx
  git commit -m "feat: lift fullscreen state and render back chevron button in StudioHeader"
  ```

---

### Task 2: Support Controlled Fullscreen Props in BlocksBuilderField

**Files:**
- Modify: `src/components/payload/BlocksBuilder/BlocksBuilderField.tsx`

- [ ] **Step 1: Update component signature to support optional props**
  Open [BlocksBuilderField.tsx](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/components/payload/BlocksBuilder/BlocksBuilderField.tsx).
  Add `isFullscreen` and `onFullscreenChange` to `BlocksBuilderFieldProps`.
  Update `BlocksBuilderField` function to destructure these props and use them if provided, falling back to internal state.

  ```tsx
  interface BlocksBuilderFieldProps {
    path: string;
    label: string;
    customHeader?: React.ReactNode;
    id?: string | null;
    collectionSlug?: string;
    isFullscreen?: boolean;
    onFullscreenChange?: (isFullscreen: boolean) => void;
  }
  ```

  Update hook setup inside `BlocksBuilderField`:
  ```tsx
  export function BlocksBuilderField({ 
    path, 
    label, 
    customHeader, 
    id: propId, 
    collectionSlug: propCollectionSlug,
    isFullscreen: propIsFullscreen,
    onFullscreenChange: propOnFullscreenChange
  }: BlocksBuilderFieldProps) {
    // ...
    const { refresh, setIframeRef } = usePreviewRefresh();
    const [activeId, setActiveId] = React.useState<string | null>(null);
    const [internalIsFullscreen, setInternalIsFullscreen] = React.useState(false);

    const isFullscreen = propIsFullscreen !== undefined ? propIsFullscreen : internalIsFullscreen;
    const setIsFullscreen = (val: boolean) => {
      if (propOnFullscreenChange) {
        propOnFullscreenChange(val);
      } else {
        setInternalIsFullscreen(val);
      }
    };
  ```

- [ ] **Step 2: Commit Task 2**
  Run:
  ```bash
  git add src/components/payload/BlocksBuilder/BlocksBuilderField.tsx
  git commit -m "feat: support controlled fullscreen props in BlocksBuilderField"
  ```

---

### Task 3: Style the New Chevron Button and Hide Sidebar Button in Fullscreen

**Files:**
- Modify: `src/app/(payload)/custom-admin.css`

- [ ] **Step 1: Add new styling rule**
  Open [custom-admin.css](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/app/(payload)/custom-admin.css) and append the styles for the new chevron-left button and the fullscreen state layout overrides:

  ```css
  /* Premium Styling for the Header Fullscreen Exit Button */
  .bb-studio-fullscreen-toggle-btn {
    background: transparent !important;
    border: 1px solid var(--theme-elevation-200) !important;
    color: #A0ABC0 !important;
    cursor: pointer !important;
    width: 28px !important;
    height: 28px !important;
    border-radius: 6px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s ease !important;
    box-shadow: none !important;
    flex-shrink: 0 !important;
  }
  
  .bb-studio-fullscreen-toggle-btn:hover {
    background: var(--theme-elevation-150) !important;
    color: #FFFFFF !important;
    border-color: #C5A059 !important; /* Gold accent */
  }
  
  .bb-studio-fullscreen-toggle-btn svg {
    width: 14px !important;
    height: 14px !important;
    stroke: currentColor !important;
  }
  
  /* Hide the left sidebar toggle button completely when the Page Builder is in fullscreen */
  body:has(.bb-root--fullscreen) .nav-toggler.template-default__nav-toggler {
    display: none !important;
  }
  ```

- [ ] **Step 2: Commit Task 3**
  Run:
  ```bash
  git add src/app/(payload)/custom-admin.css
  git commit -m "style: add custom styling for fullscreen exit button and sidebar button hiding"
  ```

---

### Task 4: Verify the Visual Layout and Toggling

- [ ] **Step 1: Verify the build succeeds with no type errors**
  Run: `npx tsc --noEmit` and check that the only errors are pre-existing.

- [ ] **Step 2: Verify visually in the browser**
  Use the browser subagent to:
  1. Load the page builder workspace.
  2. Click the enter fullscreen button.
  3. Verify that the left sidebar collapse button is hidden.
  4. Verify that the back-chevron button is displayed in the top-left of the page builder.
  5. Click the back-chevron button and confirm that it exits fullscreen and returns to the normal view perfectly.
