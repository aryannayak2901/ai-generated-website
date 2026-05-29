# Sidebar Button Overlap Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the redundant static collapse button inside the custom Payload Admin Sidebar and globally style the native Payload CMS `.nav-toggler` button to match our high-end, premium design.

**Architecture:** Remove duplicate markup in the client component and customize the global stylesheet (`custom-admin.css`) to target Payload's built-in `.nav-toggler` using clean, modern, AA-compliant contrast styling.

**Tech Stack:** Next.js, Payload CMS 3.x, CSS / custom-admin.css

---

### Task 1: Remove Redundant Collapse Button from Nav Component

**Files:**
- Modify: `src/components/payload/Nav.tsx:58-91`

- [ ] **Step 1: Remove redundant `<button>` markup**
  Open [Nav.tsx](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/components/payload/Nav.tsx) and remove the `<button className="bb-nav-collapse-btn">` from the header block.

  ```diff
        <div className="bb-nav-header">
  -        <button
  -          type="button"
  -          className="bb-nav-collapse-btn"
  -          title="Toggle Sidebar"
  -        >
  -          <ChevronRight size={18} className="bb-nav-collapse-icon" />
  -        </button>
           <div className="bb-nav-header-logo">🏛️</div>
         </div>
  ```

- [ ] **Step 2: Commit Task 1**
  Run:
  ```bash
  git add src/components/payload/Nav.tsx
  git commit -m "refactor: remove redundant static collapse button from custom Nav"
  ```

---

### Task 2: Style Native Sidebar Toggler in custom-admin.css

**Files:**
- Modify: `src/app/(payload)/custom-admin.css:105-128` (or append to the end of the file)

- [ ] **Step 1: Replace custom button styling with native toggler styling**
  Open [custom-admin.css](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/app/(payload)/custom-admin.css) and replace the CSS classes `.bb-nav-collapse-btn` and `.bb-nav-collapse-icon` with modern, premium styling targeting Payload's native `.nav-toggler` button class:

  ```css
  /* Premium Styling for Native Sidebar Toggler */
  .nav-toggler.template-default__nav-toggler {
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
    /* Perfect alignment inside custom header padding */
    position: absolute !important;
    top: 1.5rem !important;
    left: 1.25rem !important;
    z-index: 100 !important;
  }
  
  .nav-toggler.template-default__nav-toggler:hover {
    background: var(--theme-elevation-150) !important;
    color: #FFFFFF !important;
    border-color: #C5A059 !important; /* Gold accent */
  }
  
  /* Make sure the nested hamburger/close SVG inside Payload's nav toggler styles perfectly */
  .nav-toggler.template-default__nav-toggler svg {
    width: 14px !important;
    height: 14px !important;
    stroke: currentColor !important;
  }
  
  /* Ensure clean transitions when rotating/animating the toggle button */
  .template-default__nav-toggler-wrapper {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  ```

- [ ] **Step 2: Commit Task 2**
  Run:
  ```bash
  git add src/app/(payload)/custom-admin.css
  git commit -m "style: apply premium theme to Payload native nav toggler"
  ```

---

### Task 3: Verify Visuals and Interactive Behavior

- [ ] **Step 1: Restart next dev server**
  Run: `npm run dev` and ensure it runs on local port `3001` or `3000`.

- [ ] **Step 2: Verify in browser**
  Use the browser subagent to navigate to `http://localhost:3001/admin`.
  Confirm:
  1. No duplicate border or overlapping outline is present at the top-left of the sidebar.
  2. The collapse/expand button looks premium, clean, and harmonizes with the Navy and Gold theme.
  3. Hovering over the button triggers a golden border highlight.
  4. Clicking the button expands/minimizes the sidebar cleanly.
