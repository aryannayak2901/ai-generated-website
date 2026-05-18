# Custom Admin Sidebar Account Overlap Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the default account setting button overlap and keep the new account settings button with responsive and beautiful styles.

**Architecture:** We will clean up the global CSS rules in BlocksBuilder/styles.css that pull down default/hidden account links, relocates the Next.js 15 dev indicator to the bottom-right of the screen to avoid conflicts, and implement elegant responsive flex styles for the custom sidebar footer in custom-admin.css.

**Tech Stack:** Next.js 15, Payload CMS, CSS, TypeScript

---

### Task 1: Relocate Next.js 15 Developer Indicator

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Open next.config.ts**
  - Locate `nextConfig` definition around line 9.

- [ ] **Step 2: Add devIndicators config**
  - Add `devIndicators: { position: 'bottom-right' },` to `nextConfig`.
  
  ```typescript
  const nextConfig: NextConfig = {
    devIndicators: {
      position: 'bottom-right',
    },
    images: {
      unoptimized: false,
      // ...
  ```

- [ ] **Step 3: Save and Verify Compilation**
  - Run terminal check to make sure dev compilation is successful.

- [ ] **Step 4: Commit**
  - Commit `next.config.ts` with message: `"chore: relocate nextjs dev indicator to bottom-right"`

---

### Task 2: Remove Generic Account Fixed Positioning CSS

**Files:**
- Modify: `src/components/payload/BlocksBuilder/styles.css`

- [ ] **Step 1: Open src/components/payload/BlocksBuilder/styles.css**
  - Locate the legacy selectors styling logout and account items around line 126 and line 181.

- [ ] **Step 2: Remove legacy styles**
  - Remove the following selector blocks completely (around line 126-135 and 181-209):
    - `[class*="logout"], [class*="log-out"], [href*="logout"], [href*="log-out"], [href*="account"], [class*="account"] { visibility: visible !important; pointer-events: auto !important; }`
    - `[class*="logout"], ... { position: fixed !important; bottom: 20px !important; ... }`
    - `[href*="account"], [class*="account"] { position: fixed !important; bottom: 20px !important; left: 70px !important; ... }`
  - *Keep* only the default `.bb-` classes or clean styles.

- [ ] **Step 3: Save and Verify**
  - Make sure the file saves successfully.

- [ ] **Step 4: Commit**
  - Commit `src/components/payload/BlocksBuilder/styles.css` with message: `"style: remove generic global account positioning styles"`

---

### Task 3: Implement Custom Sidebar Footer CSS & Responsiveness

**Files:**
- Modify: `src/app/(payload)/custom-admin.css`

- [ ] **Step 1: Open src/app/(payload)/custom-admin.css**
  - Scroll to the bottom of the file (around line 298).

- [ ] **Step 2: Add Footer Layout and Truncation CSS**
  - Append the following styles:
  
  ```css
  /* Custom Admin Sidebar Footer Wrapper */
  .bb-nav-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0.85rem;
    border-top: 1px solid var(--theme-elevation-150);
    background: rgba(10, 17, 40, 0.4);
    gap: 0.5rem;
    margin-top: auto; /* Pushes footer to the bottom of flex container */
    backdrop-filter: blur(10px);
  }

  /* Support graceful ellipsis truncation of long emails */
  .bb-nav-account-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    text-decoration: none;
    padding: 0.5rem;
    border-radius: var(--style-radius-m);
    transition: all 0.2s ease;
    min-width: 0; /* Critical for text-overflow to work in flex child */
  }

  .bb-nav-user-info {
    display: flex;
    flex-direction: column;
    min-width: 0; /* Critical for truncation */
    flex: 1;
  }

  .bb-nav-user-name {
    font-size: 0.85rem;
    color: #FFFFFF;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
  }
  
  /* Make sure spacing/sizing works on mobile/smaller screens */
  @media (max-width: 768px) {
    .bb-nav-footer {
      padding: 0.75rem 0.5rem;
    }
    .bb-nav-user-avatar {
      width: 30px;
      height: 30px;
    }
  }
  ```

- [ ] **Step 3: Save and Verify**
  - Verify file saves cleanly.

- [ ] **Step 4: Commit**
  - Commit `src/app/(payload)/custom-admin.css` with message: `"style: style custom sidebar footer with responsive flex layouts"`
