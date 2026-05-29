# Page-Level Unsaved Changes Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor dirty state tracking in PagesStudioView to use React Refs, preventing parent component re-renders that reset the form and layout while keeping tab closure and navigation blockers completely secure.

**Architecture:** We will use `useRef` to track `isFormModifiedRef`, `isBlockDirtyRef`, and `isPageDirtyRef` dynamically inside `PagesStudioView.tsx`. We will define stable callbacks (`handleFormModifiedChange` and `handleBlockDirtyChange`) and register event interceptors exactly once on mount, checking ref values dynamically. We will also memoize the `initialState` of the Form component using `useMemo` to prevent form resets on parent renders.

**Tech Stack:** React, TypeScript, Payload CMS UI hooks

---

### Task 1: Refactor PagesStudioView to Use Refs and Memoization

We will modify `PagesStudioView.tsx` to memoize the Form's initial state, convert dirty tracking from React states to stable Refs, and update event interceptors and page switch actions to read from these Refs.

**Files:**
- Modify: `src/components/payload/PagesStudioView.tsx`

- [ ] **Step 1: Memoize formInitialState**

Inside the `PagesStudioView` component (around line 290), memoize `formInitialState` using `useMemo` with a dependency on `currentPageData`:
```typescript
  // Memoize formInitialState to prevent resetting form on parent re-renders
  const formInitialState = useMemo(() => {
    return transformDataToFormState(currentPageData);
  }, [currentPageData]);
```

- [ ] **Step 2: Replace state variables with React Refs and define stable callbacks**

Replace the previous tracking states and add the Ref declarations along with `useCallback` setters:
```typescript
  // Unsaved Changes Tracking Refs
  const isFormModifiedRef = React.useRef(false);
  const isBlockDirtyRef = React.useRef(false);
  const isPageDirtyRef = React.useRef(false);

  const handleFormModifiedChange = useCallback((modified: boolean) => {
    isFormModifiedRef.current = modified;
    isPageDirtyRef.current = isFormModifiedRef.current || isBlockDirtyRef.current;
  }, []);

  const handleBlockDirtyChange = useCallback((dirty: boolean) => {
    isBlockDirtyRef.current = dirty;
    isPageDirtyRef.current = isFormModifiedRef.current || isBlockDirtyRef.current;
  }, []);
```

- [ ] **Step 3: Update window tab reload block (beforeunload) to use Refs**

Rewrite the beforeunload effect to mount exactly once (`[]` dependencies) and dynamically check `isPageDirtyRef.current`:
```typescript
  // Window Tab Reload Block (beforeunload)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isPageDirtyRef.current) return;
      e.preventDefault();
      e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
```

- [ ] **Step 4: Update sidebar & routing click interceptor to use Refs**

Rewrite the navigation click interceptor to mount exactly once (`[]` dependencies) and dynamically check `isPageDirtyRef.current`:
```typescript
  // Sidebar & External Routing Interceptor
  useEffect(() => {
    const handleBodyClick = (e: MouseEvent) => {
      if (!isPageDirtyRef.current) return;

      // Do NOT intercept clicks when modifier keys are pressed
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const target = e.target as Element | null;
      const anchor = target?.closest?.("a");
      if (anchor) {
        // Do NOT intercept links with target="_blank" or the download attribute
        if (anchor.getAttribute("target") === "_blank" || anchor.hasAttribute("download")) {
          return;
        }

        const href = anchor.getAttribute("href");
        if (href && !href.startsWith("#") && !href.startsWith("javascript:")) {
          e.preventDefault();
          e.stopPropagation();
          setPendingNavigationUrl(href);
        }
      }
    };

    document.body.addEventListener("click", handleBodyClick, true);
    return () => {
      document.body.removeEventListener("click", handleBodyClick, true);
    };
  }, []);
```

- [ ] **Step 5: Update page creation and selection change actions**

Update `handleAddNewPage`, `handlePageChange`, and `handleDiscardAndLeave` to read/write Refs instead of state:
```typescript
  const handleAddNewPage = useCallback(() => {
    if (isPageDirtyRef.current) {
      setPendingPageSwitchId("new");
      return;
    }
    setSelectedPageId(null);
    setCurrentPageData({
      title: "",
      slug: "",
      layout: [],
    });
  }, []);
```
And `handleDiscardAndLeave`:
```typescript
  const handleDiscardAndLeave = () => {
    isFormModifiedRef.current = false;
    isBlockDirtyRef.current = false;
    isPageDirtyRef.current = false;
    const targetUrl = pendingNavigationUrl;
    const targetPageId = pendingPageSwitchId;

    setPendingNavigationUrl(null);
    setPendingPageSwitchId(null);

    if (targetUrl) {
      window.location.href = targetUrl;
    } else if (targetPageId) {
      if (targetPageId === "new") {
        setSelectedPageId(null);
        setCurrentPageData({
          title: "",
          slug: "",
          layout: [],
        });
      } else {
        setSelectedPageId(targetPageId);
      }
    }
  };
```
And `handlePageChange`:
```typescript
  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextVal = e.target.value;
    if (isPageDirtyRef.current) {
      // Force the select value back immediately to keep it visually stable
      e.target.value = selectedPageId || "new";
      setPendingPageSwitchId(nextVal);
      return;
    }
    if (nextVal === "new") {
      handleAddNewPage();
    } else {
      setSelectedPageId(nextVal);
    }
  };
```

- [ ] **Step 6: Update Form onSuccess callback to reset block ref**

Update the `onSuccess` callback of the `<Form>` component to reset the `isBlockDirtyRef` and `isPageDirtyRef`:
```typescript
          onSuccess={(json: any) => {
            isBlockDirtyRef.current = false;
            isPageDirtyRef.current = isFormModifiedRef.current || isBlockDirtyRef.current;
```

- [ ] **Step 7: Update Form component initial state and child props**

Pass memoized `formInitialState`, `handleFormModifiedChange`, and `handleBlockDirtyChange` to the form components:
```typescript
        <Form
          key={selectedPageId || "new"}
          initialState={formInitialState}
          disableValidationOnSubmit={true}
          action={
            selectedPageId ? `/api/pages/${selectedPageId}` : "/api/pages"
          }
          method={selectedPageId ? "PATCH" : "POST"}
          onSuccess={(json: any) => {
            isBlockDirtyRef.current = false;
            isPageDirtyRef.current = isFormModifiedRef.current || isBlockDirtyRef.current;

            const doc = json?.doc || json;
            if (doc && doc.id) {
              setCurrentPageData(doc);
              setSelectedPageId(doc.id);
              setPages((prev) => {
                const safePrev = Array.isArray(prev) ? prev : [];
                if (!doc) return safePrev;

                const exists = safePrev.find((p) => p && p.id === doc.id);
                const updatedPage = {
                  id: doc.id,
                  title:
                    doc && typeof doc === "object" && "title" in doc
                      ? doc.title || "Untitled"
                      : "Untitled",
                };

                if (exists) {
                  return safePrev
                    .map((p) => (p && p.id === doc.id ? updatedPage : p))
                    .filter(Boolean) as { id: string; title: string }[];
                }
                return [...safePrev, updatedPage].filter(Boolean) as {
                  id: string;
                  title: string;
                }[];
              });
            }

            if (pendingNavigationUrl) {
              window.location.href = pendingNavigationUrl;
            } else if (pendingPageSwitchId) {
              if (pendingPageSwitchId === "new") {
                setSelectedPageId(null);
                setCurrentPageData({
                  title: "",
                  slug: "",
                  layout: [],
                });
              } else {
                setSelectedPageId(pendingPageSwitchId);
              }
              setPendingPageSwitchId(null);
            }
          }}
        >
          <FormModifiedReporter 
            initialLayout={currentPageData?.layout || []} 
            initialTitle={currentPageData?.title || ""}
            initialSlug={currentPageData?.slug || ""}
            onChange={handleFormModifiedChange} 
          />
          <FormProcessingReporter onChange={setIsSaving} />
          <BlocksBuilderField
            path="layout"
            label="Layout"
            id={selectedPageId}
            collectionSlug="pages"
            isFullscreen={isFullscreen}
            onFullscreenChange={setIsFullscreen}
            onChangeBlockDirty={handleBlockDirtyChange}
            customHeader={
```

- [ ] **Step 8: Run quick TypeScript syntax checks**
Verify no immediate syntax errors:
Run: `npx tsc --noEmit`
Expected: Success

- [ ] **Step 9: Commit Task 1 changes**
```bash
git add src/components/payload/PagesStudioView.tsx
git commit -m "feat(pages-studio): refactor page dirty state tracking to use stable Refs and memoized initialState"
```

---

### Task 2: Build and Verify Changes

Verify that the application compiles perfectly under Next.js production conditions and that the page editing capability is fully restored without resets.

- [ ] **Step 1: Run full Next.js production build check**
Run: `npm run build`
Expected: Successful production build without compilation errors.
