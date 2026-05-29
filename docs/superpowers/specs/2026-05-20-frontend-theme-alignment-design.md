# Frontend Theme Alignment Design Spec

**Date:** 2026-05-20  
**Status:** Ready for Review  
**Complexity:** Medium-High (38+ components)

---

## Problem Statement

The Payload CMS theme system generates `/public/theme-overrides.css` with semantic CSS variables (`--primary`, `--accent`, `--background`, `--foreground`, etc.) that update dynamically when an admin changes the theme preset. However, **all 38+ frontend components use a legacy, hardcoded Tailwind design token system** (`bg-charcoal-primary`, `bg-teal-primary`, `text-slate-secondary`, etc.) that is defined as **static hex values** in `design-tokens.css` and never updated by the CMS.

This creates a "dead link" — the CMS theme changes, writes new CSS, but nothing on the actual website responds to it.

---

## Root Cause

Two parallel color systems exist in the codebase:

| System | Variables | Source | Dynamic? |
|--------|-----------|--------|----------|
| Legacy design tokens | `--color-charcoal-primary`, `--color-teal-primary`, `--color-slate-secondary`, `--color-gray-light`, `--color-slate-dark` | `design-tokens.css` | ❌ Static |
| CMS semantic theme | `--primary`, `--accent`, `--background`, `--foreground`, `--muted-foreground`, `--secondary` | `/public/theme-overrides.css` (CMS-generated) | ✅ Dynamic |

All components consume the **static** legacy system. The dynamic CMS variables are injected but never referenced.

---

## Semantic Mapping

The legacy tokens map to CMS semantic variables as follows:

| Legacy Token | Tailwind Class | Maps To | Rationale |
|---|---|---|---|
| `--color-charcoal-primary` | `bg-charcoal-primary` | `var(--primary)` | Brand dominant dark color (navy/charcoal) |
| `--color-slate-dark` | `bg-slate-dark`, `to-slate-dark` | `var(--primary)` | Deeper variant — same CMS primary |
| `--color-teal-primary` | `bg-teal-primary`, `text-teal-primary` | `var(--accent)` | Brand interactive/highlight color |
| `--color-teal-light` | `hover:bg-teal-light` | `color-mix(in srgb, var(--accent) 85%, white)` | Lightened accent for hover states |
| `--color-slate-primary` | `text-slate-primary` | `var(--foreground)` | Primary body text |
| `--color-slate-secondary` | `text-slate-secondary` | `var(--muted-foreground)` | Muted/secondary text |
| `--color-gray-light` | `bg-gray-light` | `var(--secondary)` | Light section backgrounds |

> **Design Intent for Dark Sections:** Navbar, HeroSection, CTASection, Footer, and other sections with dark backgrounds intentionally use the brand `primary` color (deep navy/charcoal). When an admin selects "Royal Bar" (blue primary) or "Crimson Court" (burgundy primary), these dark sections correctly reflect the new primary brand color. This is correct behavior.

---

## Implementation Plan

### Phase 1 — CSS Bridge (Alias Legacy → Semantic)

**File:** `src/styles/design-tokens.css`

Update all legacy `--color-*` declarations to be dynamic aliases referencing the CMS semantic variables:

```css
:root {
  /* Dynamic aliases — bridge legacy tokens to CMS semantic variables */
  --color-charcoal-primary: var(--primary);
  --color-slate-dark: var(--primary);
  --color-slate-primary: var(--foreground);
  --color-slate-secondary: var(--muted-foreground);
  --color-gray-light: var(--secondary);
  --color-teal-primary: var(--accent);
  --color-teal-light: color-mix(in srgb, var(--accent) 85%, white);

  /* Keep non-theme static tokens */
  --color-white: #ffffff;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}
```

**Result:** All 38+ existing component class names instantly respond to the CMS theme. Zero component edits. Instant win.

---

### Phase 2 — Full Component Migration (Semantic Token Replacement)

Replace all legacy Tailwind utility classes with their semantic equivalents to remove the dependency on `--color-*` legacy tokens.

#### Replacement Map

| Old class | New class |
|---|---|
| `bg-charcoal-primary` | `bg-primary` |
| `bg-slate-dark` | `bg-primary` |
| `from-charcoal-primary` | `from-primary` |
| `via-charcoal-primary` | `via-primary` |
| `to-slate-dark` | `to-primary` |
| `bg-teal-primary` | `bg-accent` |
| `bg-teal-primary/5` | `bg-accent/5` |
| `bg-teal-primary/10` | `bg-accent/10` |
| `bg-teal-primary/20` | `bg-accent/20` |
| `hover:bg-teal-light` | `hover:bg-accent/90` |
| `hover:bg-teal-primary` | `hover:bg-accent` |
| `text-teal-primary` | `text-accent` |
| `hover:text-teal-primary` | `hover:text-accent` |
| `border-teal-primary` | `border-accent` |
| `border-teal-primary/10` | `border-accent/10` |
| `text-slate-primary` | `text-foreground` |
| `text-slate-secondary` | `text-muted-foreground` |
| `bg-gray-light` | `bg-secondary` |

#### Files to Migrate (38+ components)

**Shared Components:**
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `src/components/DisclaimerModal.tsx`

**Home Components:**
- `src/components/home/HeroSection.tsx`
- `src/components/home/CTASection.tsx`
- `src/components/home/AwardsMarquee.tsx`
- `src/components/home/PracticeAreasBento.tsx`
- `src/components/home/TeamPreview.tsx`

**About Components:**
- `src/components/about/AboutHero.tsx`
- `src/components/about/AboutCta.tsx`
- `src/components/about/AboutTeam.tsx`
- `src/components/about/AboutValues.tsx`

**Blog Components:**
- `src/components/blog/BlogCard.tsx`
- `src/components/blog/BlogHero.tsx`
- `src/components/blog/BlogFilters.tsx`
- `src/components/blog/BlogList.tsx`
- `src/components/blog/BlogModal.tsx`
- `src/components/blog/Newsletter.tsx`

**Contact Components:**
- `src/components/contact/ContactForm.tsx`
- `src/components/contact/ContactHero.tsx`
- `src/components/contact/ContactInfo.tsx`
- `src/components/contact/ContactMap.tsx`

**Offices Components:**
- `src/components/offices/OfficeHero.tsx`
- `src/components/offices/OfficeCard.tsx`
- `src/components/offices/OfficeCTA.tsx`
- `src/components/offices/MapSection.tsx`
- `src/components/offices/OfficeSelector.tsx`

**Practice Areas Components:**
- `src/components/practice-areas/PracticeAreasHero.tsx`
- `src/components/practice-areas/PracticeAreaCard.tsx`
- `src/components/practice-areas/PracticeAreasGrid.tsx`
- `src/components/practice-areas/CTASection.tsx`

**Team Components:**
- `src/components/team/TeamMemberClient.tsx`
- `src/app/(frontend)/team/page.tsx`
- `src/app/(frontend)/offices/page.tsx`

**UI Primitives:**
- `src/components/ui/button.tsx` — update `primary` variant to `bg-accent text-accent-foreground`, `secondary` to `border-accent text-accent`
- `src/components/ui/card.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/input.tsx`

---

### Phase 3 — Tailwind @theme Cleanup

**File:** `src/app/globals.css`

After Phase 2, remove the now-redundant static color tokens from the `@theme` block:

```css
/* REMOVE these static entries from @theme: */
--color-charcoal-primary: #1a1a1a;
--color-slate-dark: #0f172a;
--color-slate-primary: #2d3748;
--color-slate-secondary: #64748b;
--color-gray-light: #f7fafc;
--color-teal-primary: #0891b2;
--color-teal-light: #06b6d4;
/* Keep: Spacing, typography, shadows, transitions, semantic color aliases */
```

---

### Phase 4 — Font Alignment (Verify Only)

The layout already reads `headingFont`/`bodyFont` from Payload and loads them from Google Fonts. `generateThemeCSS.ts` outputs `--font-playfair-display` and `--font-public-sans` with the CMS values. The `@theme` block correctly references `var(--font-public-sans)` and `var(--font-playfair-display)`. **No code changes needed** — verify it works correctly with different font selections.

---

## Architecture After Implementation

```
Payload CMS Admin → saves theme preset
    ↓
syncThemeAfterChange hook → writes /public/theme-overrides.css
    :root { --primary: #0f1729; --accent: #d4af37; --background: #fff; }
    ↓
Frontend <head>
    <link rel="stylesheet" href="/theme-overrides.css" />
    ↓
Tailwind semantic classes
    bg-primary     → var(--color-primary)     → var(--primary)     ← CMS VALUE ✅
    bg-accent      → var(--color-accent)       → var(--accent)      ← CMS VALUE ✅
    bg-secondary   → var(--color-secondary)    → var(--secondary)   ← CMS VALUE ✅
    text-muted-foreground → var(--muted-foreground)                ← CMS VALUE ✅
    ↓
All 38+ components correctly reflect CMS theme 🎉
```

---

## Edge Cases & Considerations

1. **Decorative glows** (`bg-teal-primary/5 blur-3xl`) → `bg-accent/5` — Tailwind v4 opacity modifier works correctly on `--accent`.

2. **Gradient pattern** (`from-charcoal-primary via-charcoal-primary to-slate-dark`) → `from-primary via-primary to-primary` — subtle gradient on brand primary. Correct.

3. **White text on dark sections** — `text-white` is used explicitly on dark-background sections and should stay as `text-white` (not `text-primary-foreground`) since these sections are always inverted regardless of theme.

4. **shadcn UI components** (`Card`, `Input`, `Badge`) — already use shadcn's semantic classes internally but have custom overrides with legacy tokens. Audit per file.

5. **`teal-light` hover** — becomes `hover:bg-accent/90`. For most presets this reads as a slightly lighter/more opaque accent on hover. Correct behavior.

---

## Verification Plan

1. After Phase 1: Switch theme in Payload Admin → verify Navbar, Hero, Footer, CTA section backgrounds change instantly in browser. Test 3 presets: `chambersClassic`, `royalBar`, `crimsonCourt`.

2. After Phase 2: Verify each page section visually matches expectations with the switched theme.

3. Dark preset test: Apply `midnightExecutive` (dark background preset) — verify all light text remains readable.

4. Build verification: `npm run build` — confirm no TypeScript or CSS compilation errors.

5. Regression: `chambersClassic` preset must render identically to the original design (navy bg, gold accent).
