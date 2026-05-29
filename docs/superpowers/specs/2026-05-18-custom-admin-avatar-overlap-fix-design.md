# Design Spec: Custom Admin Sidebar Account Overlap Fix

**Date:** 2026-05-18  
**Topic:** Overlap and responsiveness fixes for the custom Payload admin sidebar footer and account settings layout.

## 1. Problem Description
- **Overlapping Avatars:** The custom account settings button (a gold "A" avatar badge with the email ID) in the sidebar footer is overlapped by the default Gravatar button (`.app-header__account`) and the Next.js 15 developer indicator ("N" logo).
- **Cause 1:** `src/components/payload/BlocksBuilder/styles.css` contains global CSS selectors (`[href*="account"]` and `[class*="account"]`) that reposition all account links using `position: fixed` to the bottom left corner. This pulls down the hidden default Gravatar link and overlaps it with the custom sidebar footer.
- **Cause 2:** The Next.js 15 developer indicator is floating in the bottom-left corner of the screen by default.
- **Responsive Layout:** The custom `.bb-nav-footer` wrapping the custom account and logout buttons has no responsive CSS styling, leading to layout bugs on smaller viewports.

## 2. Proposed Changes

### A. CSS and Layout Cleanup
- **File:** [src/components/payload/BlocksBuilder/styles.css](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/components/payload/BlocksBuilder/styles.css)
- **Changes:** Remove the legacy positioning rules for `[class*="logout"]`, `[href*="logout"]`, `[href*="account"]`, and `[class*="account"]` that style them as `position: fixed` in the bottom left.
- **Goal:** Allow the default, hidden elements to remain fully hidden and prevent them from overriding our custom sidebar's layout.

### B. Custom Sidebar Footer Styling & Responsiveness
- **File:** [src/app/(payload)/custom-admin.css](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/app/(payload)/custom-admin.css)
- **Changes:** Add proper styling for the `.bb-nav-footer` and apply text truncation to `.bb-nav-user-name` (`white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;`).
- **Goal:** Ensure a professional, beautiful, and fully responsive layout where elements sit side-by-side cleanly and adapt dynamically to screen sizing.

### C. Next.js 15 Developer Indicator Relocation
- **File:** [next.config.ts](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/next.config.ts)
- **Changes:** Set `devIndicators.position = 'bottom-right'` inside the next configuration object.
- **Goal:** Move the Next.js compilation/status indicator to the bottom-right corner, avoiding conflicts with the custom sidebar footer in development.

## 3. Verification Plan
- **Manual Visual Verification:** Load `http://localhost:3000/admin` using the browser tool. Verify that:
  - The default Gravatar (blue/white circle) is fully hidden and no longer visible behind the custom gold "A" avatar.
  - The Next.js developer indicator is relocated to the bottom-right corner.
  - The email and logout button in the sidebar footer are styled elegantly, side-by-side, with a top border.
  - Truncation works perfectly when resizing the screen.
