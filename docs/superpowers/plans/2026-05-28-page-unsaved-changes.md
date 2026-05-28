# Page-Level Unsaved Changes Confirmation Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correctly stop the user from navigating away or closing the tab/window when any page-level changes (reordering, block-level additions/deletions/edits, or page settings) are made but not saved.

**Architecture:** We will implement React-declarative field tracking using Payload's standard `useField` subscriptions in a redesigned `FormModifiedReporter`. We will also bubble up block-level active editing dirty states through an `onChangeBlockDirty` prop callback from `BlocksBuilderField` to `PagesStudioView`, computing a combined `isPageDirty` state that controls navigation and window unload handlers reliably.

**Tech Stack:** React, TypeScript, Tailwind CSS v4, Framer Motion, Payload CMS UI hooks

---

### Task 1: Update BlocksBuilderField to Propagate Block-Level Dirty State

We will add a prop callback to `BlocksBuilderField` to bubble up the block's `isBlockDirty` state (unsaved active edits inside the block `EditPanel`) to the parent Pages Studio view.

**Files:**
- Modify: `src/components/payload/BlocksBuilder/BlocksBuilderField.tsx`

- [ ] **Step 1: Update BlocksBuilderFieldProps and function signature**

Add `onChangeBlockDirty` to `BlocksBuilderFieldProps` interface and extract it in the component arguments:
```typescript
interface BlocksBuilderFieldProps {
  path: string;
  label: string;
  customHeader?: React.ReactNode;
  id?: string | null;
  collectionSlug?: string;
  isFullscreen?: boolean;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onChangeBlockDirty?: (isDirty: boolean) => void; // Added for bubbling up active block edits
}
```
And update the destructured props in the component definition:
```typescript
export function BlocksBuilderField({ 
  path, 
  label, 
  customHeader, 
  id: propId, 
  collectionSlug: propCollectionSlug,
  isFullscreen: propIsFullscreen,
  onFullscreenChange: propOnFullscreenChange,
  onChangeBlockDirty
}: BlocksBuilderFieldProps) {
```

- [ ] **Step 2: Add useEffect to propagate internal block-level dirty state**

Add a `useEffect` inside `BlocksBuilderField` component body (e.g., right after `isBlockDirty` state is defined):
```typescript
  // Propagate block level dirty state to parent component
  useEffect(() => {
    if (typeof onChangeBlockDirty === 'function') {
      onChangeBlockDirty(isBlockDirty);
    }
  }, [isBlockDirty, onChangeBlockDirty]);
```

- [ ] **Step 3: Run quick TypeScript syntax checks**
Verify no immediate syntax errors:
Run: `npx tsc --noEmit`
Expected: Success or compilation succeeds (ignore unrelated pre-existing system warnings if any)

- [ ] **Step 4: Commit changes**
```bash
git add src/components/payload/BlocksBuilder/BlocksBuilderField.tsx
git commit -m "feat(blocks-builder): propagate block-level dirty state to parent"
```

---

### Task 2: Redesign PagesStudioView to Track Dirty States and Intercept Navigation

We will import `useField` in `PagesStudioView.tsx`, redesign `FormModifiedReporter` to subscribe to field changes, update PagesStudioView to track form and block dirty states, and block SPA-level navigation clicks by calling `e.stopPropagation()` during event capture.

**Files:**
- Modify: `src/components/payload/PagesStudioView.tsx`

- [ ] **Step 1: Add useField to Payload imports**

Modify imports from `@payloadcms/ui` to include `useField` around line 6:
```typescript
import { Form, useForm, useField } from "@payloadcms/ui";
```

- [ ] **Step 2: Redesign FormModifiedReporter to use useField subscriptions**

Rewrite the `FormModifiedReporter` component around line 211 to hook into field subscriptions and evaluate changes accurately:
```typescript
/**
 * A helper component that hooks into the Payload Form context
 * to monitor and report unsaved (modified) changes to the parent.
 */
const FormModifiedReporter = ({ 
  initialLayout, 
  initialTitle,
  initialSlug,
  onChange 
}: { 
  initialLayout: any[]; 
  initialTitle: string;
  initialSlug: string;
  onChange: (modified: boolean) => void 
}) => {
  const titleField = useField<string>({ path: 'title' });
  const slugField = useField<string>({ path: 'slug' });
  const layoutField = useField<any[]>({ path: 'layout' });

  const currentTitle = titleField?.value || '';
  const currentSlug = slugField?.value || '';
  const currentLayout = layoutField?.value || [];

  const isModified = useMemo(() => {
    const titleChanged = currentTitle !== initialTitle;
    const slugChanged = currentSlug !== initialSlug;
    const layoutChanged = !isDeepEqual(initialLayout, currentLayout);
    return titleChanged || slugChanged || layoutChanged;
  }, [currentTitle, initialTitle, currentSlug, initialSlug, currentLayout, initialLayout]);

  useEffect(() => {
    onChange(isModified);
  }, [isModified, onChange]);

  return null;
};
```

- [ ] **Step 3: Update PagesStudioView tracking states and isPageDirty computation**

Around line 291, split dirty state into `isFormModified` and `isBlockDirty`, and compute `isPageDirty` dynamically:
```typescript
  // Unsaved Changes Tracking State
  const [isFormModified, setIsFormModified] = useState(false);
  const [isBlockDirty, setIsBlockDirty] = useState(false);
  const [pendingNavigationUrl, setPendingNavigationUrl] = useState<string | null>(null);
  const [pendingPageSwitchId, setPendingPageSwitchId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const isPageDirty = isFormModified || isBlockDirty;
```

- [ ] **Step 4: Update handleBodyClick to block SPA navigation propagation**

In the "Sidebar & External Routing Interceptor" `useEffect` around line 342, add `e.stopPropagation()` in `handleBodyClick` to fully prevent other listeners (like Next.js Link router) from executing:
```typescript
        const href = anchor.getAttribute("href");
        if (href && !href.startsWith("#") && !href.startsWith("javascript:")) {
          e.preventDefault();
          e.stopPropagation(); // Block route handlers from executing
          setPendingNavigationUrl(href);
        }
```

- [ ] **Step 5: Instantiate FormModifiedReporter with correct initial fields**

Update the `FormModifiedReporter` call inside the `<Form>` block around line 602:
```typescript
          <FormModifiedReporter 
            initialLayout={currentPageData?.layout || []} 
            initialTitle={currentPageData?.title || ""}
            initialSlug={currentPageData?.slug || ""}
            onChange={setIsFormModified} 
          />
```

- [ ] **Step 6: Pass setIsBlockDirty down to BlocksBuilderField**

Update the `BlocksBuilderField` render call around line 607:
```typescript
          <BlocksBuilderField
            path="layout"
            label="Layout"
            id={selectedPageId}
            collectionSlug="pages"
            isFullscreen={isFullscreen}
            onFullscreenChange={setIsFullscreen}
            onChangeBlockDirty={setIsBlockDirty}
            customHeader={
```

- [ ] **Step 7: Update onSuccess in Form component**

Update the `onSuccess` callback of the `<Form>` around line 553 to safeguard block dirty state reset:
```typescript
          onSuccess={(json: any) => {
            setIsBlockDirty(false); // Reset block dirty state if it was active
```

---

### Task 3: Build and Verify Changes

We will compile the application to ensure that all changes are 100% type-safe and build perfectly.

- [ ] **Step 1: Run full Next.js production build check**
Run: `npm run build`
Expected: Successful production build without compilation errors.

- [ ] **Step 2: Commit all PagesStudioView changes**
```bash
git add src/components/payload/PagesStudioView.tsx
git commit -m "feat(studio): implement reactive useField subscription tracking and block propagation"
```
