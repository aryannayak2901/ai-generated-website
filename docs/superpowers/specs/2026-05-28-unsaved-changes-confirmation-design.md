# Design Spec: Unsaved Changes Confirmation Dialogs

**Author**: Antigravity  
**Date**: 2026-05-28  
**Status**: Proposal  

---

## 1. Goal Description
The objective is to implement an authoritative, premium user experience that prevents accidental loss of data in the Studio page editor. When a user has modified a block's configuration or general page settings, navigating away, closing the block settings panel, switching blocks, or closing the tab must trigger confirmation prompts.

This is split into two layers:
1. **Block Config level:** Intercept panel closures (via "Cancel" or `✕`) and block switches to confirm before discarding unsaved block settings.
2. **Page level:** Intercept external page navigation (sidebar links, dropdown selectors, creation of new pages, window reloading) to confirm before losing page changes.

---

## 2. Component Design & State Flow

### A. Block-Level (EditPanel & BlocksBuilderField)

To know if a block is dirty, we compare the current `formData` in `EditPanel.tsx` with the initial `block` prop.

#### 1. Deep Comparison Utility
Since block data can be heavily nested (containing arrays, relation objects, and text fields), we implement a recursive deep comparison utility:
```typescript
function isDeepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }
  
  // Ignore metadata and ID differences
  const keysA = Object.keys(a).filter(k => k !== 'id' && k !== 'blockType');
  const keysB = Object.keys(b).filter(k => k !== 'id' && k !== 'blockType');
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!isDeepEqual(a[key], b[key])) return false;
  }
  
  return true;
}
```

#### 2. Component Integration
* **`EditPanel.tsx`**:
  * Tracks `isDirty = !isDeepEqual(block, formData)` inside a React `useMemo`.
  * Triggers `onChangeDirty?.(isDirty)` in a `useEffect`.
* **`BlocksBuilderField.tsx`**:
  * Tracks `isBlockDirty` state.
  * Tracks `pendingBlockAction: { type: 'switch' | 'close'; targetId?: string } | null`.
  * If a user triggers block panel close or switches to another block, and `isBlockDirty` is true, display the premium modal.
  * Clicking **Save & Close** calls `handleSubmit()` on the block form.
  * Clicking **Discard Changes** resets the state and completes the action.

---

### B. Page-Level (PagesStudioView)

#### 1. Form Modified Reporting
Inside the Payload CMS `<Form>` element in `PagesStudioView.tsx`, we render a custom `FormModifiedReporter` component:
```typescript
const FormModifiedReporter = ({ onChange }: { onChange: (modified: boolean) => void }) => {
  const form = useForm();
  const modified = (form as any)?.modified || false;
  
  useEffect(() => {
    onChange(modified);
  }, [modified, onChange]);
  
  return null;
};
```

#### 2. Navigation Click Interceptor
A global listener on `document.body` checks for anchor element clicks. If `isPageDirty` is true, the click is intercepted and navigation is deferred:
```typescript
useEffect(() => {
  if (!isPageDirty) return;

  const handleGlobalClick = (e: MouseEvent) => {
    const anchor = (e.target as HTMLElement).closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
      e.preventDefault();
      e.stopPropagation();
      setPendingNavigationUrl(href); // Displays Page Modal
    }
  };

  document.body.addEventListener('click', handleGlobalClick, true);
  return () => document.body.removeEventListener('click', handleGlobalClick, true);
}, [isPageDirty]);
```

#### 3. Window Close / Tab Reload Security (`beforeunload`)
```typescript
useEffect(() => {
  if (!isPageDirty) return;

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
    return e.returnValue;
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [isPageDirty]);
```

---

## 3. UI/UX Style Architecture

Both modals will have a consistent visual presentation that matches the Deep Navy and Gold styling:

* **Backdrop**: `fixed inset-0 z-[9999] flex items-center justify-center bg-[#050a18]/80 backdrop-blur-md`
* **Card**: Sleek dark navy card, `bg-[#0A1128]/95 border border-[#c9a84c]/30 rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4`
* **Typography**: **Playfair Display** (Gold accent) for title, **Geist Sans/Outfit** for description.
* **Layout**: Staggered buttons with subtle micro-animations (hover shifts, smooth scaling).

### Visual Button Style Specification:
1. **Save Button (Primary Action)**: Solid gold button, text color navy. Gold color: `#c9a84c` (`bg-[#c9a84c] text-[#0A1128] hover:bg-[#ebd281]`).
2. **Discard Button (Secondary / Warning)**: Transparent background, thin warning red border, text color red (`border border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500`).
3. **Cancel Button (Neutral)**: Dark translucent background, text color white (`bg-white/5 text-white hover:bg-white/10`).

---

## 4. Verification Plan

### Automated Verification
1. Verify compiler type-safety using:
   ```bash
   npx tsc --noEmit
   ```
2. Verify production build optimization:
   ```bash
   yarn build
   ```

### Manual Verification Checklist
* Edit a block and click `✕` in the header or `Cancel`. Confirm the beautiful custom modal appears.
* Edit a block and click on another block on the canvas. Confirm the modal appears.
* Edit a block and click "Save & Close". Confirm modifications are preserved and saved.
* Edit a block and click "Discard Changes". Confirm the block reverts to its previous state.
* Modify the page fields and click on a sidebar link (e.g. "Teams"). Confirm the full page-level modal appears.
* Modify the page fields and attempt to reload the browser. Confirm the native security prompt blocks immediate reloading.
