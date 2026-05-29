# Design Spec: Page Builder Fullscreen Toggle & Sidebar Button Relocation

A design specification to address the sidebar toggle button hiding and page builder fullscreen-exit toggle behavior.

## Problem Description

When the custom Page Builder (BlocksBuilder) is expanded to fullscreen, it visually covers the left sidebar completely because it is rendered with `position: fixed` and `z-index: 9999`. 
As a result:
1. The left sidebar collapse button is visually hidden under the fullscreen page builder.
2. The user has no easy/intuitive way to exit fullscreen and return to the default dashboard/sidebar view other than pressing `Escape`.

### Requirement
1. When the page builder is in fullscreen mode:
   - Completely hide the left sidebar button `.nav-toggler.template-default__nav-toggler` (to prevent duplicate overlay/clicks).
   - Show a matching chevron-left toggle button inside the Page Builder header *before* the page selector list dropdown.
2. When clicked, this chevron-left button should collapse the Page Builder back to its normal size (exit fullscreen).

---

## Proposed Design & Approach

We will lift the `isFullscreen` state from `BlocksBuilderField` to the parent `PagesStudioView`, allowing both the `StudioHeader` and the `BlocksBuilderField` to share the same controlled state.

### 1. Parent Controlled Fullscreen State
We will update `BlocksBuilderFieldProps` to support controlled state:
```typescript
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

In `PagesStudioView.tsx`, we will lift the state:
```typescript
const [isFullscreen, setIsFullscreen] = useState(false);
```

### 2. StudioHeader Chevron Button
Inside `StudioHeader`, if `isFullscreen` is `true`, we will render a `bb-studio-fullscreen-toggle-btn` containing a `<ChevronLeft size={16} />` icon.
```tsx
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
```

### 3. Styles and CSS Overrides
1. Style the `bb-studio-fullscreen-toggle-btn` to look exactly like our premium sidebar toggle buttons.
2. Hide the native left sidebar toggler when in fullscreen:
```css
body:has(.bb-root--fullscreen) .nav-toggler.template-default__nav-toggler {
  display: none !important;
}
```

---

## Verification Plan

### Manual Verification
1. Open the page builder.
2. Click the expand button in the top-right of the page builder to enter fullscreen.
3. Observe:
   - The left sidebar is completely hidden, and the left sidebar collapse button is NOT visible.
   - A beautiful new back-chevron button is displayed in the page builder header at the top left corner, right before the page list dropdown.
4. Click the new back-chevron button.
5. Observe:
   - The page builder exits fullscreen cleanly.
   - The left sidebar and its original toggler button reappear perfectly in their standard state.
