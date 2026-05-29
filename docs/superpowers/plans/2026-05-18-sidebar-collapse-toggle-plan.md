# Sidebar Collapse Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide the native left sidebar toggler button when it is collapsed, and render a premium hamburger (Menu) button at the top-left of the page builder header that programmatically expands/reopens the sidebar on click.

**Architecture:** Implement a DOM `MutationObserver` inside `PagesStudioView.tsx` to reactively track changes to the native `.nav-toggler` element's class list, render the expand button in the custom header, and configure custom CSS overrides in `custom-admin.css`.

**Tech Stack:** React, Next.js, MutationObserver API, Lucide Icons

---

### Task 1: Track Sidebar State and Render Hamburger Button in PagesStudioView

**Files:**
- Modify: `src/components/payload/PagesStudioView.tsx`

- [ ] **Step 1: Update imports and add isSidebarOpen state hook**
  Open [PagesStudioView.tsx](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/components/payload/PagesStudioView.tsx).
  Import `Menu` from `lucide-react`.
  Declare `isSidebarOpen` state and configure `MutationObserver` inside `PagesStudioView` to automatically update this state when the sidebar collapses/expands.

  ```tsx
  // Add Menu to lucide-react imports:
  import { ChevronLeft, Menu } from "lucide-react";
  ```

  Inside `PagesStudioView`:
  ```typescript
  export const PagesStudioView = () => {
    const [pages, setPages] = useState<{ id: string; title: string }[]>([]);
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
    const [currentPageData, setCurrentPageData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // SIDEBAR STATE

    // Monitor native sidebar open/collapsed class list changes
    useEffect(() => {
      const toggler = document.querySelector(".nav-toggler");
      if (!toggler) return;

      const checkState = () => {
        setIsSidebarOpen(toggler.classList.contains("nav-toggler--is-open"));
      };

      // Initial check
      checkState();

      // Configure observer
      const observer = new MutationObserver(checkState);
      observer.observe(toggler, {
        attributes: true,
        attributeFilter: ["class"],
      });

      // Click listener fallback
      toggler.addEventListener("click", checkState);

      return () => {
        observer.disconnect();
        toggler.removeEventListener("click", checkState);
      };
    }, []);
  ```

- [ ] **Step 2: Update StudioHeader signature and render Hamburger button**
  Modify `StudioHeader`'s parameters to accept `isSidebarOpen` and `onToggleSidebar` callbacks. Render the `Menu` icon when the sidebar is collapsed and the page builder is not in fullscreen mode.

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
    isSidebarOpen,
    onToggleSidebar,
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
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
  }) => {
  ```

  Inside the JSX return block of `StudioHeader`:
  ```tsx
    return (
      <div
        style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}
      >
        {isFullscreen ? (
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
        ) : (
          !isSidebarOpen && (
            <button
              type="button"
              className="bb-studio-header-toggle-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleSidebar();
              }}
              title="Open Menu"
            >
              <Menu size={16} />
            </button>
          )
        )}
        <select
          className="bb-page-selector"
  ```

  And pass the parameters down in `PagesStudioView` JSX:
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
                  isSidebarOpen={isSidebarOpen}
                  onToggleSidebar={() => {
                    const toggler = document.querySelector(".nav-toggler") as HTMLButtonElement | null;
                    if (toggler) toggler.click();
                  }}
                />
              }
            />
  ```

- [ ] **Step 3: Commit Task 1**
  Run:
  ```bash
  git add src/components/payload/PagesStudioView.tsx
  git commit -m "feat: track native sidebar state and render hamburger menu button in StudioHeader"
  ```

---

### Task 2: Hide Collapsed Native Toggler and Add CSS Style Rules

**Files:**
- Modify: `src/app/(payload)/custom-admin.css`

- [ ] **Step 1: Configure styling override**
  Open [custom-admin.css](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/app/(payload)/custom-admin.css) and append the styles for `.bb-studio-header-toggle-btn` and the native `.nav-toggler` hide rules:

  ```css
  /* Premium Styling for Header Action/Toggle Buttons */
  .bb-studio-header-toggle-btn {
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
  
  .bb-studio-header-toggle-btn:hover {
    background: var(--theme-elevation-150) !important;
    color: #FFFFFF !important;
    border-color: #C5A059 !important; /* Gold accent */
  }
  
  .bb-studio-header-toggle-btn svg {
    width: 14px !important;
    height: 14px !important;
    stroke: currentColor !important;
  }
  
  /* Hide the closed native sidebar collapse button completely inside pages studio view */
  body:has(.pages-studio-view) .nav-toggler:not(.nav-toggler--is-open) {
    display: none !important;
  }
  ```

- [ ] **Step 2: Commit Task 2**
  Run:
  ```bash
  git add src/app/(payload)/custom-admin.css
  git commit -m "style: add styles for hamburger toggler and hide collapsed native sidebar button"
  ```

---

### Task 3: Verify the New Layout and Click Handlers

- [ ] **Step 1: Verify the build succeeds with no type errors**
  Run: `npx tsc --noEmit` and check that the only errors are pre-existing.

- [ ] **Step 2: Verify visually in the browser**
  Use the browser subagent to:
  1. Open the page builder.
  2. Click the sidebar collapse button.
  3. Verify that the collapse button disappears and a beautiful gold-highlighted Hamburger (Menu) button appears inside the page builder header before the page dropdown list.
  4. Click the Hamburger button.
  5. Verify that it expands the sidebar cleanly and toggles the layout state back.
