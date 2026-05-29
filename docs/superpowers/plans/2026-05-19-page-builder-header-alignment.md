# Page Builder Header Height Alignment & Responsiveness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Increase the height of the page builder header to match the left sidebar header (exactly `60px`) and introduce elegant responsive scaling for smaller viewports.

**Architecture:** Use CSS Flexbox centering with an explicit `60px` height on `.bb-titlebar` instead of implicit vertical paddings, and adjust dynamic workspace panels. Use pure CSS `@media` queries with utility classes to scale buttons and dropdowns on smaller devices.

**Tech Stack:** React, Vanilla CSS, CSS Media Queries.

---

### Task 1: Update CSS Styles for Height & Responsiveness

**Files:**
* Modify: `src/components/payload/BlocksBuilder/styles.css`

- [ ] **Step 1: Implement the explicit height, flex centering, and responsive styles**
  
  Insert the following CSS updates into `src/components/payload/BlocksBuilder/styles.css`:

```css
/* Update .bb-titlebar layout and height */
.bb-titlebar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px; /* Vertical padding is now 0 since height centers children */
  height: 60px; /* Lock height to match sidebar header */
  box-sizing: border-box;
  background: var(--bb-navy-mid);
  border-bottom: 1px solid var(--bb-border);
  font-size: 13px;
}

/* Adjust panel height calculations to respect the new 60px header height */
.bb-root--studio .bb-studio {
  height: calc(100% - 60px); /* Changed from 40px */
}

.bb-root--fullscreen .bb-studio {
  height: calc(100vh - 60px); /* Changed from 40px */
}

/* Responsive styles for Page Builder Header */
@media (max-width: 768px) {
  .bb-titlebar {
    gap: 8px;
    padding: 0 12px;
  }
  .bb-page-selector {
    min-width: 110px;
    padding: 4px 6px;
    font-size: 11px;
  }
  .bb-add-page-btn, 
  .bb-delete-page-btn, 
  .bb-studio-save-btn {
    padding: 6px 10px;
    font-size: 11px;
  }
  /* Responsive text-hiding utility classes */
  .bb-btn-label-text-long {
    display: none; /* Hides "Page" in "+ New Page" and "Delete Page" */
  }
}

@media (max-width: 580px) {
  .bb-page-selector {
    min-width: 90px;
    max-width: 120px;
  }
  .bb-btn-label-text-short {
    display: none; /* Hides text entirely for compact icon/symbol layout */
  }
}
```

- [ ] **Step 2: Verify git diff for Task 1**
  
  Run: `git diff src/components/payload/BlocksBuilder/styles.css`
  Expected: Show additions of explicit `height: 60px;`, adjustments to studio height calc, and responsive media queries.

- [ ] **Step 3: Commit Task 1**
  
  Run:
  ```bash
  git add src/components/payload/BlocksBuilder/styles.css
  git commit -m "style: set explicit 60px height on page builder titlebar and add media queries"
  ```

---

### Task 2: Implement Responsive Button Labels in PagesStudioView

**Files:**
* Modify: `src/components/payload/PagesStudioView.tsx`

- [ ] **Step 1: Add responsive utility classes to buttons inside StudioHeader**
  
  Modify `src/components/payload/PagesStudioView.tsx` so button text labels hide selectively on smaller screens:

```tsx
// Inside StudioHeader (src/components/payload/PagesStudioView.tsx)
// Around line 99-125:

      <button
        type="button"
        className="bb-add-page-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAddNewPage();
        }}
        disabled={isCreating || isDeleting}
      >
        <span>+ New</span>
        <span className="bb-btn-label-text-long"> Page</span>
      </button>

      {selectedPageId && (
        <button
          type="button"
          className="bb-delete-page-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDeletePage();
          }}
          disabled={isDeleting}
        >
          <span className="bb-btn-label-text-short">
            {isDeleting ? "Deleting..." : "Delete"}
          </span>
          <span className="bb-btn-label-text-long"> Page</span>
        </button>
      )}
```

Also around line 152-166 for the Save Changes button:

```tsx
        <button
          type="button"
          className="bb-studio-save-btn"
          onClick={() => submit({ skipValidation: true })}
          disabled={processing}
          style={{ opacity: processing ? 0.6 : 1 }}
        >
          {processing ? (
            selectedPageId ? (
              <>
                <span className="bb-btn-label-text-short">Saving</span>
                <span className="bb-btn-label-text-long">...</span>
              </>
            ) : (
              <>
                <span className="bb-btn-label-text-short">Creating</span>
                <span className="bb-btn-label-text-long">...</span>
              </>
            )
          ) : selectedPageId ? (
            <>
              <span>Save</span>
              <span className="bb-btn-label-text-short"> Changes</span>
            </>
          ) : (
            <>
              <span>Create</span>
              <span className="bb-btn-label-text-short"> Page</span>
            </>
          )}
        </button>
```

- [ ] **Step 2: Verify code syntax and compile state**
  
  Run a build check or inspect to ensure no JSX errors are introduced.

- [ ] **Step 3: Commit Task 2**
  
  Run:
  ```bash
  git add src/components/payload/PagesStudioView.tsx
  git commit -m "feat: use responsive label classes on pages studio header controls"
  ```

---

### Task 3: Visual Verification of Layout Alignment and Responsiveness

**Files:**
* Verification only

- [ ] **Step 1: Check computed layout alignment in desktop viewport**
  
  Verify using browser inspection tools that:
  - Both `.bb-nav-header` and `.bb-titlebar` show an exact computed height of `60px`.
  - The bottom border forms a perfectly straight continuous line.
  - Buttons and the dropdown are vertically centered.

- [ ] **Step 2: Check responsiveness in mobile viewport**
  
  Resize the browser width to:
  1. `768px`: Confirm that gaps decrease and button labels adapt (hiding the word "Page" so we see `+ New` and `Delete`).
  2. `480px`: Confirm that the page selector narrows down, and save changes buttons shrink beautifully without horizontal page overflow.

- [ ] **Step 3: Commit Plan Completion**
  
  Verify git status is completely clean.
