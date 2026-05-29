# Spec: Page-Level Unsaved Changes Confirmation Modal Fix

**Date:** 2026-05-28  
**Status:** Proposed  
**Author:** Antigravity (Elite Frontend Engineer)  

---

## 1. Problem Statement

In the Payload CMS Custom Pages Studio, the block-level unsaved changes modal works correctly, but the page-level confirmation modal does not correctly stop the user from navigating away or closing the tab/window when blocks are modified or reordered, or when page identity details (title/slug) are updated.

### Root Cause Analysis
1. **No Form Subscriptions for Re-rendering**: The current `FormModifiedReporter` component retrieves the form context using `useForm()`. In Payload CMS, the `form` context object is stable and changes to individual fields (like `layout`, `title`, and `slug`) do not trigger component re-renders for context subscribers to keep the form performance high. As a result, the `isPageDirty` state remains `false` even if fields are modified.
2. **Block-Level Edit Panel Changes Untracked**: While a user is editing a block's fields in the `EditPanel`, `isBlockDirty` is `true` inside `BlocksBuilderField.tsx`. However, these changes are local to the block's `EditPanel` and are not written to the parent Form's `layout` field until the user clicks "Save & Close". Since the parent Form isn't modified yet, the page-level confirmation modal is not aware of these unsaved block-level edits. Navigating away or closing the tab at this point loses all of the active block's unsaved edits without any warning.

---

## 2. Proposed Design (Approach A - Recommended)

We will implement a React-declarative and highly robust dirty-state tracking system that listens to active form field modifications using Payload's `useField` hook subscriptions, and forwards block-level dirty states upwards.

```mermaid
graph TD
    A[PagesStudioView] -->|Computes isPageDirty = isFormModified || isBlockDirty| B(Page-Level Interceptors)
    A -->|Renders| C[BlocksBuilderField]
    C -->|Local isBlockDirty state| D[EditPanel]
    C -->|onChangeBlockDirty callback| A
    E[FormModifiedReporter] -->|useField subscriptions: title, slug, layout| A
    E -->|Computes isFormModified = initial vs current| A
```

### Key Elements of the Solution

1. **Reactive `FormModifiedReporter` using `useField` subscriptions**:
   We will update `FormModifiedReporter` to explicitly call `useField` for the page fields: `title`, `slug`, and `layout`.
   This registers React subscriptions, ensuring that whenever these field values change, `FormModifiedReporter` re-renders and evaluates whether they are modified compared to the initial page data fetched from the database:
   ```typescript
   const titleField = useField<string>({ path: 'title' });
   const slugField = useField<string>({ path: 'slug' });
   const layoutField = useField<any[]>({ path: 'layout' });
   ```

2. **Block-Level Dirty State Propagation**:
   - We will add an `onChangeBlockDirty?: (isDirty: boolean) => void` prop to `BlocksBuilderFieldProps` in `BlocksBuilderField.tsx`.
   - Whenever `isBlockDirty` changes in `BlocksBuilderField`, we call `onChangeBlockDirty(isBlockDirty)`.
   - In `PagesStudioView.tsx`, we will maintain an `isBlockDirty` state and pass its setter down to `BlocksBuilderField`.

3. **Combined Page-Level Dirty State**:
   In `PagesStudioView.tsx`, we will compute the final `isPageDirty` state as:
   ```typescript
   const [isFormModified, setIsFormModified] = useState(false);
   const [isBlockDirty, setIsBlockDirty] = useState(false);

   const isPageDirty = isFormModified || isBlockDirty;
   ```

4. **Robust Navigation Interceptor with Propagation Blocking**:
   Ensure `handleBodyClick` in `PagesStudioView` calls both `e.preventDefault()` and `e.stopPropagation()` during the capture phase to fully block route transitions (such as those triggered by Next.js / Payload links).

---

## 3. Detailed Proposed Changes

### A. [MODIFY] [PagesStudioView.tsx](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/components/payload/PagesStudioView.tsx)
- Update `FormModifiedReporter` to use `useField` hooks for `title`, `slug`, and `layout`.
- Compare current values with initial page values loaded from `currentPageData`.
- Introduce `isFormModified` and `isBlockDirty` states.
- Propagate block-dirty changes from `BlocksBuilderField` through `onChangeBlockDirty`.
- Compute `isPageDirty = isFormModified || isBlockDirty`.
- Update `handleBodyClick` to add `e.stopPropagation()`.

### B. [MODIFY] [BlocksBuilderField.tsx](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/components/payload/BlocksBuilder/BlocksBuilderField.tsx)
- Add `onChangeBlockDirty?: (isDirty: boolean) => void` to `BlocksBuilderFieldProps`.
- Forward internal `isBlockDirty` changes to `onChangeBlockDirty` callback via a `useEffect`.

---

## 4. Verification Plan

### Automated/Compilation Checks
- Run `npm run build` or `npx tsc --noEmit` to ensure there are no TypeScript syntax or compilation errors.

### Manual Verification Flow
1. Open Pages Studio in Payload.
2. Select any page or create a new page.
3. Modify a block (e.g. edit a text field) without clicking "Save". Try to close the tab or navigate to a collection via the sidebar. Verify that the Unsaved Changes confirmation modal triggers.
4. Save the block (which updates the layout on the canvas) but do not click page save. Verify that the Unsaved Changes modal triggers when attempting to navigate/close the tab.
5. Change page title or slug inside "Page Identity". Verify that the Unsaved Changes modal triggers when attempting to navigate/close the tab.
6. Click "Discard & Leave" to verify it leaves, or "Stay on Page" to verify it cancels.
7. Click "Save & Leave" to verify it saves and navigates successfully.
