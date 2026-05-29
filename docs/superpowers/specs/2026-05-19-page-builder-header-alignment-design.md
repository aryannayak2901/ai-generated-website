# Page Builder Header Height Alignment & Responsiveness Design Spec

Aligns the Page Builder header (`.bb-titlebar`) height with the left sidebar header (`.bb-nav-header`) to achieve a perfect, unified admin layout, while adding premium responsive scaling for smaller viewports.

---

## 1. Context & Objectives

* **Sidebar Header (`.bb-nav-header`):** Computed height is **`60px`**.
* **Page Builder Header (`.bb-titlebar`):** Computed height is **`51px`**.
* **Goal:** 
  1. Lock the Page Builder header to exactly **`60px`** with clean Flexbox vertical centering.
  2. Adjust structural workspace calculations (`.bb-studio` height) to prevent double scrollbars and layout shifts.
  3. Introduce responsive styling to elegantly fit all controls (dropdown page selector, new page button, delete page button, and save changes button) on smaller screen sizes.

---

## 2. Detailed Technical Design

### A. CSS Styles Alignment (`src/components/payload/BlocksBuilder/styles.css`)

We will update the page builder styles to enforce the `60px` height constraint and adjust container layout offsets.

```css
/* 1. Header Sizing & Flex Centering */
.bb-titlebar {
  height: 60px;
  box-sizing: border-box;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 2. Parent & Studio Height Adjustments */
.bb-root--studio .bb-studio {
  height: calc(100% - 60px); /* Changed from 40px */
}
.bb-root--fullscreen .bb-studio {
  height: calc(100vh - 60px); /* Changed from 40px */
}
```

### B. Responsive Control Scaling (`src/components/payload/PagesStudioView.tsx` & CSS)

To prevent crowding and horizontal scrolling on smaller screens (tablets & mobile), we will introduce a CSS-driven responsive design:

1. **Responsive Text Labels:**
   We will wrap button text parts in `.bb-btn-label-text` spans that hide on small viewports, automatically transforming buttons into compact versions (e.g., `+ New Page` becomes `+ New` or `+`, and `Delete Page` becomes `Delete` or a compact button).
   
2. **Page Selector Compact Mode:**
   On smaller screens, the page selector dropdown min-width will scale down from `160px` to `120px` to save valuable horizontal space.

3. **Horizontal Spacing:**
   Reduce flex gaps inside the header from `12px` to `8px` on screens below `768px`.

```css
/* Responsive Styles in styles.css */
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
  .bb-add-page-btn, .bb-delete-page-btn, .bb-studio-save-btn {
    padding: 6px 10px;
    font-size: 11px;
  }
  .bb-btn-label-text-long {
    display: none; /* Hides "Page" from "+ New Page" and "Delete Page" */
  }
}

@media (max-width: 480px) {
  .bb-page-selector {
    min-width: 90px;
    max-width: 120px;
  }
  .bb-btn-label-text-short {
    display: none; /* Hides text entirely for pure icon/symbol buttons on ultra-small screens */
  }
  .bb-add-page-btn::after {
    content: '+';
  }
}
```

---

## 3. Verification Plan

### Automated/Code Verification
* Inspect the compiled JSX and CSS bundle output.
* Validate that no linting errors are introduced in the component files.

### Manual Verification (via Browser tool)
1. Open the Admin Panel at `/admin/collections/pages` in the browser.
2. Measure computed heights for `.bb-nav-header` and `.bb-titlebar` to ensure they are **exactly 60px**.
3. Verify that the top border/bottom border alignment forms a continuous visual line across the screen.
4. Scale down viewport to mobile (768px, 480px) and check:
   * The page builder header does not overflow.
   * Buttons scale down cleanly.
   * Flex gaps adapt beautifully.
