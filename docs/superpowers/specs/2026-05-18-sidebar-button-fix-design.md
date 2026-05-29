# Design Spec: Sidebar Button Overlap Fix

A design specification to address the duplicate/overlapping sidebar toggle button in the custom Payload CMS Admin sidebar.

## Problem Description

In the custom Payload CMS admin panel, the sidebar toggle button appears with "double borders" and overlapping outlines (visible in user screenshot). 

### Root Cause Analysis
1. **Redundant React Markup**: In [Nav.tsx](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/components/payload/Nav.tsx), a custom static button `.bb-nav-collapse-btn` is rendered inside `.bb-nav-header`. This button has no event handlers and is strictly visual.
2. **Built-in Toggler Collision**: Payload CMS's default layout automatically renders a native sidebar toggle button `.nav-toggler` (with classes `.nav-toggler`, `.template-default__nav-toggler`).
3. **Identical Positioning**: The native toggler is absolute/fixed-positioned at the top-left of the sidebar. This matches the exact location of `.bb-nav-collapse-btn`, causing the two border boxes to render directly on top of each other slightly offset, creating an unprofessional "ghost overlap" outline.

---

## Proposed Solution: Approach 1 (Recommended)

Style the native `.nav-toggler` to look premium and match our custom design system, and completely remove the redundant static `.bb-nav-collapse-btn` from the React component.

### 1. Component Changes
Modify [Nav.tsx](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/components/payload/Nav.tsx) to remove the static `<button className="bb-nav-collapse-btn">` from the header:
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

### 2. Styling Changes
Update [custom-admin.css](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/app/(payload)/custom-admin.css) to apply the premium design styling to Payload's native `.nav-toggler` button:
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
  /* Match header padding positioning */
  top: 1.5rem !important;
  left: 1.25rem !important;
}

.nav-toggler.template-default__nav-toggler:hover {
  background: var(--theme-elevation-150) !important;
  color: #FFFFFF !important;
  border-color: #C5A059 !important;
}

/* Ensure inside icons scale correctly */
.nav-toggler.template-default__nav-toggler svg {
  width: 14px !important;
  height: 14px !important;
}
```

---

## Verification Plan

### Automated/Local Visual Checks
1. Boot up development server: `npm run dev`.
2. Access `http://localhost:3001/admin`.
3. Verify that only a single button is displayed on the sidebar header.
4. Test clicking the button to collapse and expand the sidebar.
5. Verify hover effects (gold outline border, background transition) function correctly and look extremely premium.
