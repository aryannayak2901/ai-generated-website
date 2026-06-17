# Fullscreen Preview Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modify the "Preview & Push" modal used for AI generation to cover the full window screen without margins or rounded corners.

**Architecture:** Pure CSS styling updates targeting `.bb-modal-overlay--wide` and `.bb-modal-card--wide` in the Payload BlocksBuilder and GenerateView styles.

**Tech Stack:** CSS

---

### Task 1: Update GenerateView Modal Styles

**Files:**
- Modify: `src/components/payload/GenerateView/styles.css`

- [ ] **Step 1: Write the minimal implementation**

Modify `.bb-modal-card--wide` (around line 828) to have 100vw/100vh and no constraints. Update `.bb-modal-card--wide` as follows:

```css
.bb-modal-card--wide {
  max-width: 100vw;
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  border-radius: 0;
  border: none;
}
```

Add `.bb-modal-overlay--wide` below `.bb-modal-overlay` (around line 811):
```css
.bb-modal-overlay--wide {
  padding: 0;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/payload/GenerateView/styles.css
git commit -m "style: make wide modal fullscreen in generate view"
```

### Task 2: Update BlocksBuilder Modal Styles

**Files:**
- Modify: `src/components/payload/BlocksBuilder/styles.css`

- [ ] **Step 1: Write the minimal implementation**

Modify `.bb-modal-card--wide` (around line 1437) to ensure it overrides any border and border-radius:

```css
.bb-modal-card--wide {
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  max-height: 100vh;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 0;
  gap: 0;
  overflow: hidden;
  border: none;
  box-shadow: none;
  border-radius: 0;
}
```

(Check that `.bb-modal-overlay--wide` around line 995 already has `padding: 0`).

- [ ] **Step 2: Commit**

```bash
git add src/components/payload/BlocksBuilder/styles.css
git commit -m "style: ensure wide modal is fullscreen in blocks builder"
```
