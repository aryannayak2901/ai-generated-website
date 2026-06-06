# Design Document: Dynamic Header Selection & Live CMS Preview

This design document outlines the technical specifications for implementing the multiple header layout styles, real-time reactive CMS preview, and dynamic storefront rendering for **Chambers of Jeet Bhatt**.

---

## 1. Overview & Objectives

Currently, the storefront navigation header (`Navbar.tsx`) is statically hardcoded in terms of structure and layout (Classic left logo, center nav, right CTA). We need to empower the administrator via Payload CMS to customize the storefront header in three major ways:
1. **Header Layout Styles:** Select from 4 prestigious legal-firm layout templates: *Chambers Classic*, *Centered Luxury*, *Glassmorphic Float*, and *Minimalist Drawer*.
2. **Functional Settings:** Toggle stickiness (`sticky`), hide/show CTA consult buttons, and configure CTA labels/links.
3. **CMS Live Preview:** Display a premium real-time preview frame at the very top of the global Header editor within Payload CMS. As the administrator modifies links, changes the logo, uploads assets, toggles features, or adjusts layouts, the changes must instantly re-render inside the preview frame before saving.

---

## 2. Payload CMS Global Configuration Schema

We will modify [src/globals/Header.ts](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/globals/Header.ts) to incorporate the new layout selection, functional controls, and register our custom React admin client component.

### Field Definitions:
1. **`headerPreview` (`ui` field):** Mounted at the very top of the editor page. Renders our custom admin component.
2. **`headerStyle` (`select` field):**
   * **classic:** Chambers Classic (Logo & branding left, nav center, CTA button right, solid primary background).
   * **centered:** Centered Luxury (Double-decker; logo & branding centered on top; nav links centered below with gold divider borders).
   * **glassmorphic:** Glassmorphic Float (Floating card layout, translucency, gold borders, heavy `backdrop-blur`).
   * **minimal:** Minimalist Drawer (Clean minimalist backdrop, left logo, right primary nav, right slide-in drawer for advanced links).
3. **`sticky` (`checkbox` field):** If enabled, the header clings to the top of the browser viewport on scroll (adds sticky positioning).
4. **`showCTA` (`checkbox` field):** Hides or displays the primary CTA button.
5. **`ctaLabel` (`text` field):** Text rendered inside the CTA button (e.g. "Get In Touch"). Visible only if `showCTA` is enabled.
6. **`ctaLink` (`text` field):** Destination URL for the CTA button. Visible only if `showCTA` is enabled.
7. **`logo` (`upload` field - existing):** File relation to `media` collection.
8. **`navItems` (`array` field - existing):** Custom navigation items containing `label` and `link`.

---

## 3. Real-Time CMS Live Preview Component

We will create a custom client component at `@/components/payload/HeaderPreview`.

```
src/components/payload/HeaderPreview.tsx
```

### Core Responsibilities:
1. **Form Binding via `useForm()`:** Uses `@payloadcms/ui`'s React Context hook `useForm` to read and subscribe to form changes in real time. We read the following fields reactively:
   * `headerStyle`, `sticky`, `showCTA`, `ctaLabel`, `ctaLink`, `logo`, `navItems`
2. **Logo Asset Resolution:** If `logo` is an ID (when first uploaded or selected but not populated), or an object containing a `url`, we resolve it correctly inside the preview. If no logo is selected, we fall back to a styled text placeholder representing the firm's initials ("JJB").
3. **Google Fonts Dynamic Sync:** Inject a dynamic `<link>` element inside the preview head to load fonts currently configured in the database or fall back to `'Playfair Display'` (headings) and `'Public Sans'` (UI text).
4. **Responsive Simulator Toolbar:**
   * **Desktop Mode (920px canvas width):** Simulates standard laptop/monitor display.
   * **Mobile Mode (375px canvas width):** Simulates smartphone screen. Shows mobile toggle drawers and compact typography.
5. **Aesthetics & Motion:**
   * Styled in deep navy backgrounds (`#0f1729`), stark whites (`#ffffff`), and subtle gold accents (`#d4af37`).
   * Fully responsive with micro-animations. Hover states translate button scales (`scale-[1.02]`) and animate link underlines seamlessly.

---

## 4. Storefront Navbar Integration

We will modify [src/components/Navbar.tsx](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/components/Navbar.tsx) to support the selected header style and functional parameters.

### Dynamic Rendering Logic:
1. **Functional Settings mapping:**
   * If `sticky` is enabled, the outer header wrapper gets `sticky top-0 z-40 w-full` styling, otherwise `relative w-full`.
   * If `showCTA` is enabled, we render the premium styled button `Get In Touch` with dynamic label and link (`ctaLabel`, `ctaLink`).
2. **Layout Layout Mapping:**
   * **Chambers Classic (`classic`):** Flex row layout. Logo left, nav center, CTA right. Deep navy primary bg.
   * **Centered Luxury (`centered`):** Double-decker layout. Logo top-center. A horizontal border separates the decks. Nav links centered below logo.
   * **Glassmorphic Float (`glassmorphic`):** Floating layout. Renders as a floating card inside a container, styled with `mx-auto my-4 max-w-[1200px] bg-primary/80 backdrop-blur-xl border border-accent/20 rounded-full px-8 py-3 shadow-2xl`.
   * **Minimalist Drawer (`minimal`):** Flat and simple layout. Minimal borders. Secondary nav links are tucked into a clean side-drawer that slides out with a Framer Motion transition.

---

## 5. Visual Standards & Motion Guidelines

In alignment with **frontend-design-rule.md** and **Tailwind CSS v4** practices:
* **Color Tokens:** Leverage HSL-tailored premium tokens:
  * Primary: Deep Navy (`var(--primary)` / `#0f1729`)
  * Accent: Subtle Gold / Brass (`var(--accent)` / `#d4af37`)
  * Surface: Translucent overlays (`bg-white/5` or `bg-navy/80` with `backdrop-blur-xl`)
* **Typography scales:** Playfair Display for branding, Public Sans for functional items.
* **Transition Polish:** Micro-interactions on active navigation links (e.g. elegant scroll-underlines and link active states).

---

## 6. Verification & Validation Plan

### Automated Tests & Linting:
* Execute `yarn lint` to verify TypeScript compile-time safety and ESLint conformance.
* Validate Next.js build compilation (`yarn build`) to ensure all paths are resolved successfully.

### Manual Verification:
* **Admin Verification:** Log in to Payload CMS admin path (`/admin/globals/header`). Modify logo, add navigation links, change layouts. Verify that the Live Preview at the top updates in real time on every keystroke/change.
* **Responsive Verification:** Click Desktop and Mobile triggers in the Live Preview and verify correct responsiveness.
* **Storefront Verification:** Go to local storefront home page (`http://localhost:3000`). Confirm storefront header reflects style choices (Classic, Centered, Glassmorphic, Minimal), sticky settings, and custom CTAs.
