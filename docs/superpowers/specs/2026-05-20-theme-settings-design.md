# Technical Specification: Unified Theme Settings System

**Author:** Elite Frontend Engineer & Principal UI/UX Designer  
**Date:** May 20, 2026  
**Status:** Approved for Implementation  
**Architecture:** Approach 1 (High-Performance Server-Side Compilation & Link Injection)

---

## 1. Goal & Objective

Implement a unified theme management system for the website and the Payload CMS admin panel. The system will allow admins to control all styling aspects from a single dashboard in Payload CMS. 

### Core Features:
- **Centralized Admin Dashboard:** Edit 19 website colors, 12 admin colors, Dynamic Google Fonts, and border radius in a tabbed panel.
- **Theme Presets with Autopopulate & Customize:** Instantly populate all 31 color variables using one of the 14 curated presets, with the ability to tweak individual colors as needed.
- **High-Performance Static CSS Compilation:** Save changes immediately to static `.css` files on the server (`/public/theme-variables.css` and `/public/admin-theme.css`) to eliminate rendering flicker (FOUC).
- **Direct Mapping to Payload Native Variables:** Customize the admin panel by directly overriding Payload CMS 3.x's built-in CSS custom properties instead of using fragile DOM selectors.
- **Fully Dynamic Google Fonts:** Load user-specified font names on the fly with a server-rendered preconnected `<link>` tag.
- **Instant Cache Revalidation:** Call Next.js `revalidatePath` to refresh the layout cache instantly.

---

## 2. Directory Structure & Files

We will implement this system across the following directory layout:

```
src/
├── app/
│   └── (frontend)/
│       └── layout.tsx                ← Server-side link injection & fonts setup
│   └── globals/                      ← Global styles (Tailwind CSS v4)
│       └── ThemeSettings/
│           ├── config.ts              ← Global Schema & Preset Custom Components
│           └── hooks/
│               ├── syncTheme.ts       ← Hook triggering compilers & revalidation
│               ├── generateThemeCSS.ts ← Website CSS compiler
│               └── generateAdminCSS.ts ← Admin CSS compiler
├── components/
│   └── Theme/
│       ├── theme-presets.ts          ← 14+ pre-configured color schemes
│       ├── ColorPickerField.tsx      ← Elegant CMS Color Picker Component
│       ├── RadiusSliderField.tsx     ← Slider UI component for corners
│       └── ThemePlayground.tsx       ← Multi-mockup dynamic live previewer
├── payload.config.ts                 ← Injecting precompiled admin-theme.css
```

---

## 3. Detailed Component & Schema Design

### 3.1 CMS Schema: `ThemeSettings` Global
Registered in `src/payload.config.ts` as a Global under the "Settings" group.

- **Tab 1: Typography & Structure (General)**
  - `mode`: Select `[system, light, dark]`
  - `sansFont`: Text field (Default: `"Public Sans"`)
  - `serifFont`: Text field (Default: `"Playfair Display"`)
  - `websiteRadius`: Number (range 0 to 2, step 0.05, Default: `0.5` rem)
  - `adminRadius`: Number (range 0 to 2, step 0.05, Default: `0.375` rem)

- **Tab 2: Theme Presets**
  - `themePreset`: Custom React `Select` component listing 14+ themes.
  - **Interaction:** Selecting a preset calls `setValue` for the color pickers in the current form state, auto-populating all variables.

- **Tab 3: Website Colors (19 Fields)**
  - Color pickers for: `--background`, `--foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--ring`.

- **Tab 4: Admin Panel Colors (12 Fields)**
  - Color pickers for: `--admin-bg`, `--admin-fg`, `--admin-primary`, `--admin-primary-fg`, `--admin-secondary`, `--admin-secondary-fg`, `--admin-surface`, `--admin-surface-fg`, `--admin-accent`, `--admin-accent-fg`, `--admin-border`, `--admin-muted`.

- **Tab 5: Custom CSS**
  - `websiteCSSOverrides`: Code editor field (CSS mode)
  - `adminCSSOverrides`: Code editor field (CSS mode)

---

## 4. Compiler & Hook Design

### 4.1 `beforeChange` Font Sanitization
Strips special characters and formats custom font entries for link injection:
```typescript
const sanitizeFont = (font: string) => font.trim().replace(/[^a-zA-Z0-9 ]/g, "");
```

### 4.2 `afterChange` CSS Compilation (`syncTheme.ts`)
Creates standard HSL/Hex variables and writes files asynchronously to the `public/` folder.

- **`theme-variables.css` Compilation:**
  ```css
  :root {
    --background: ${websiteColors.background};
    --foreground: ${websiteColors.foreground};
    /* ... rest of the 19 variables ... */
    --radius: ${websiteRadius}rem;
  }
  
  /* Website custom CSS overrides */
  ${websiteCSSOverrides}
  ```

- **`admin-theme.css` Compilation (Direct Native Payload 3.x Mapping):**
  ```css
  /* Overrides Payload's native theme properties seamlessly */
  :root, :root.dark, [data-theme="light"], [data-theme="dark"] {
    --theme-bg: ${adminColors.adminBg};
    --theme-elevation-0: ${adminColors.adminBg};
    --theme-elevation-50: ${adminColors.adminSecondary};
    --theme-elevation-100: ${adminColors.adminSurface};
    --theme-text: ${adminColors.adminFg};
    --theme-border-color: ${adminColors.adminBorder};
    --theme-color-primary-500: ${adminColors.adminPrimary};
    --theme-color-primary-600: ${adminColors.adminPrimaryHover}; /* Computed darker HSL value */
    --theme-input-radius: ${adminRadius}rem;
    --theme-button-radius: ${adminRadius}rem;
  }

  /* Admin custom CSS overrides */
  ${adminCSSOverrides}
  ```

- **Next.js Revalidation:**
  Clears the server-side caches so that colors apply instantly without an app reload:
  ```typescript
  import { revalidatePath } from "next/cache";
  revalidatePath("/", "layout");
  ```

---

## 5. Next.js & Payload Config Integration

### 5.1 Root Layout (`src/app/(frontend)/layout.tsx`)
Incorporate the dynamic fonts preconnect and CSS injection.

```tsx
import "../globals.css";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch Theme settings via local API
  const theme = await payload.findGlobal({ slug: "theme-settings" });
  
  const sansFontSafe = theme.sansFont.replace(/ /g, "+");
  const serifFontSafe = theme.serifFont.replace(/ /g, "+");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts Dynamic Load */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link 
          rel="stylesheet" 
          href={`https://fonts.googleapis.com/css2?family=${sansFontSafe}:wght@400;600;700&family=${serifFontSafe}:wght@400;700&display=swap`} 
        />
        
        {/* Load precompiled theme CSS variables */}
        <link rel="stylesheet" href="/theme-variables.css" />

        {/* Dynamic Font Assignments */}
        <style id="dynamic-fonts">
          {`
            :root {
              --font-sans: "${theme.sansFont}", sans-serif;
              --font-serif: "${theme.serifFont}", serif;
            }
          `}
        </style>
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

### 5.2 Payload Config (`src/payload.config.ts`)
Inject `/public/admin-theme.css` directly as the primary stylesheet for the Admin panel:
```typescript
export default buildConfig({
  admin: {
    css: path.resolve(__dirname, "../public/admin-theme.css"),
    // ...
  }
});
```

---

## 6. Verification Plan

### 6.1 Automated Compilation Test
- Run verification tests to ensure saving theme config creates the CSS files in the `public/` directory.
- Confirm files are readable and contain correct values.

### 6.2 Manual UI Verification
- Verify layout on the frontend and ensure fonts load successfully.
- Verify the admin panel theme and confirm it styles Payload UI elements dynamically without visual anomalies or console errors.
- Confirm light/dark toggle switches work properly.
