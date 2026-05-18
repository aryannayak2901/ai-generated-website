# Design Spec: Sidebar Collapse Toggle & Relocation

A design specification to address the sidebar collapse (shrink) toggle button and relocation of the expand button inside the page builder header.

## Problem Description

Normally, Payload CMS renders a native `.nav-toggler` button at the top-left of the sidebar. When the user collapses (shrinks) the sidebar, the sidebar slides shut, but the native toggler continues to hover in empty space, causing layout clutter.

### Requirement
1. When the left sidebar is expanded (open):
   - Show the native sidebar collapse button `.nav-toggler` (with the ChevronLeft/close icon) in its normal position.
2. When the user clicks the collapse button to shrink the sidebar:
   - Hide the native `.nav-toggler` completely.
   - Show a matching premium expand button (hamburger Menu icon) in the page builder header at the top left corner before the page selector dropdown.
3. Clicking this hamburger Menu button should programmatically reopen the left sidebar, transitioning focus back to the native layout smoothly.

---

## Proposed Design & Approach

We will track the active state of the sidebar inside `PagesStudioView` by setting up a robust, high-performance `MutationObserver` targeting the native `.nav-toggler` element's class list.

### 1. Sidebar State Detection Hook
In `PagesStudioView.tsx`, we will declare a state:
```typescript
const [isSidebarOpen, setIsSidebarOpen] = useState(true);
```

We will implement a `useEffect` hook to observe class name changes on `.nav-toggler`:
```typescript
useEffect(() => {
  const toggler = document.querySelector('.nav-toggler');
  if (!toggler) return;

  const checkState = () => {
    setIsSidebarOpen(toggler.classList.contains('nav-toggler--is-open'));
  };

  checkState();

  const observer = new MutationObserver(checkState);
  observer.observe(toggler, { attributes: true, attributeFilter: ['class'] });

  toggler.addEventListener('click', checkState);

  return () => {
    observer.disconnect();
    toggler.removeEventListener('click', checkState);
  };
}, []);
```

### 2. StudioHeader Hamburger Button
In `StudioHeader`, if `isFullscreen` is `false` AND `isSidebarOpen` is `false`, we will display the hamburger button:
```tsx
{!isFullscreen && !isSidebarOpen && (
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
)}
```

### 3. Native Button Collapse Styling
In `custom-admin.css`, we will add a clean, scoped style to hide the closed native toggler button:
```css
body:has(.pages-studio-view) .nav-toggler:not(.nav-toggler--is-open) {
  display: none !important;
}
```

---

## Verification Plan

### Manual Verification
1. Open the page builder with the sidebar expanded.
2. Click the collapse (ChevronLeft) button in the sidebar.
3. Observe:
   - The sidebar collapses cleanly.
   - The native collapse button disappears.
   - A beautiful Menu (hamburger) button appears in the page builder header at the top-left, right before the page dropdown list.
4. Click the Menu button.
5. Observe:
   - The sidebar opens cleanly.
   - The Menu button disappears, and the native collapse button becomes visible in the sidebar again.
