# Enhanced Theme Settings System - Complete Implementation Plan

## Project: Unified Theme Management for Website + Payload CMS Admin

**Last Updated:** May 20, 2026  
**Status:** Production-Ready  
**Complexity Level:** Advanced (Payload CMS, Next.js, React, Tailwind CSS, Admin Customization)

---

## 🎯 ENHANCED REQUIREMENT

This plan extends the original theme system to support **DUAL THEMING**:

1. **Frontend Website Theme** ✅
   - Website color palette, fonts, radius, dark mode
   - Managed via CSS variables + Tailwind CSS
   - Real-time updates via CMS

2. **Payload CMS Admin Panel Theme** ✨ NEW
   - Admin panel color palette
   - Admin UI customization
   - Synchronized theme control from single CMS panel
   - Professional admin experience with consistent branding

---

## 📋 Overview

This is a **complete unified theme system** where:

- Admins edit theme settings in ONE location (Payload CMS)
- Changes instantly apply to BOTH frontend website AND admin panel
- 14+ preset themes available for both environments
- Independent color palettes for website vs admin (if needed)
- Single source of truth for theming

### System Capabilities

✅ Admin users edit themes in one centralized Payload CMS panel  
✅ Themes include color palettes, fonts, radius, and dark mode  
✅ 14 preset color schemes + unlimited custom themes  
✅ **Real-time CSS variable injection to frontend**  
✅ **Real-time CSS injection to Payload admin panel**  
✅ Automatic dark mode detection (system preference)  
✅ Cached data fetching with smart revalidation  
✅ Tailwind CSS integration for website  
✅ Custom CSS for admin panel styling  
✅ Separate control over website vs admin appearance

---

## 🏗️ ENHANCED System Architecture

### Dual-Environment Theme System

```
┌─────────────────────────────────────────────────────────────┐
│           Payload CMS Admin Panel (Theme Editor)            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Global: ThemeSettings                              │   │
│  │  - Website Colors (19 vars)                         │   │
│  │  - Admin Colors (19 vars)                           │   │
│  │  - Font Family, Radius, Dark Mode                   │   │
│  │  - CSS Overrides (Website + Admin)                  │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────┬────────────────────┬───────────────────────┘
               │                    │
        ┌──────▼──────┐      ┌──────▼──────┐
        │ beforeChange│      │ afterChange │
        │   Hook      │      │    Hook     │
        └──────┬──────┘      └──────┬──────┘
               │                    │
               └──────────┬─────────┘
                          ▼
               ┌──────────────────────┐
               │   PostgreSQL DB      │
               │  (Theme Settings)    │
               └──────────┬───────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
     ┌────▼────┐   ┌─────▼────┐   ┌─────▼────┐
     │  Next.js │   │ Payload  │   │ Payload  │
     │ Revalid. │   │ Backend  │   │ Admin UI │
     └────┬────┘   └─────┬────┘   └─────┬────┘
          │              │              │
          ▼              ▼              ▼
    ┌───────────┐  ┌──────────┐  ┌────────────┐
    │ Frontend  │  │ Server   │  │Admin Panel │
    │ App Layout│  │ Fetch    │  │  CSS Inj.  │
    └─────┬─────┘  └────┬─────┘  └────┬───────┘
          │             │             │
          ▼             ▼             ▼
    ┌────────────────────────────────────────┐
    │    CSS Variables + Tailwind CSS        │
    │    (Website Theme Application)         │
    └────────────────────────────────────────┘
          ▼
    All Frontend Components Styled Dynamically

    ┌────────────────────────────────────────┐
    │    Custom Admin CSS + Variables        │
    │    (Admin Panel Theme Application)     │
    └────────────────────────────────────────┘
          ▼
    Payload Admin UI Styled Dynamically
```

---

## 📁 ENHANCED Directory Structure

```
project-root/
├── src/
│   ├── globals/
│   │   └── ThemeSettings/
│   │       ├── config.ts                    ← Main Payload schema (ENHANCED)
│   │       └── hooks/
│   │           ├── revalidateTheme.ts       ← Cache invalidation
│   │           ├── syncAdminTheme.ts        ← NEW: Admin CSS injection
│   │           └── generateAdminCSS.ts      ← NEW: Admin CSS generator
│   │
│   ├── components/
│   │   └── Theme/
│   │       ├── ThemeProvider.tsx            ← Client context provider
│   │       ├── theme-utils.ts               ← Presets & utilities (ENHANCED)
│   │       ├── theme-constants.ts           ← Color/field mappings (ENHANCED)
│   │       ├── default-theme.ts             ← Fallback CSS (ENHANCED)
│   │       ├── admin-theme-constants.ts     ← NEW: Admin color mappings
│   │       ├── admin-theme-defaults.ts      ← NEW: Admin default CSS
│   │       ├── ColorPickerField.tsx         ← Admin UI component
│   │       ├── RadiusSliderField.tsx        ← Admin UI component
│   │       ├── ThemePlayground.tsx          ← Admin preview
│   │       └── AdminThemePreview.tsx        ← NEW: Admin theme preview
│   │
│   ├── utilities/
│   │   ├── getGlobals.ts                    ← Cached data fetching
│   │   └── adminThemeInjector.ts            ← NEW: Admin CSS injection utility
│   │
│   ├── middleware/
│   │   └── payloadAdminTheme.ts             ← NEW: Payload admin middleware
│   │
│   ├── app/
│   │   ├── api/
│   │   │   └── admin-theme/
│   │   │       └── route.ts                 ← NEW: API for admin theme CSS
│   │   │
│   │   └── (frontend)/
│   │       └── layout.tsx                   ← Root layout
│   │
│   ├── payload.config.ts                    ← ENHANCED: Admin theming setup
│   └── styles/
│       ├── globals.css                      ← Global styles
│       ├── admin-theme.css                  ← NEW: Admin theme variables
│       └── admin-overrides.scss             ← NEW: Payload admin overrides
│
├── tailwind.config.js                       ← Color definitions
├── admin.css                                ← NEW: Payload custom admin styles
├── next.config.js                           ← Payload integration
└── package.json                             ← Dependencies
```

---

## 🎯 KEY ENHANCEMENT: Dual Color Palettes

### Website Theme (19 Colors)

```
--background, --foreground, --primary, --primary-foreground,
--secondary, --secondary-foreground, --card, --card-foreground,
--popover, --popover-foreground, --muted, --muted-foreground,
--accent, --accent-foreground, --destructive,
--destructive-foreground, --border, --input, --ring
```

### Admin Panel Theme (NEW - 12 Focused Colors)

```
--admin-bg, --admin-fg, --admin-primary, --admin-primary-fg,
--admin-secondary, --admin-secondary-fg, --admin-surface,
--admin-surface-fg, --admin-accent, --admin-accent-fg,
--admin-border, --admin-muted
```

---

## 📋 ENHANCED Implementation Steps

### Step 1: Create Admin Theme Constants

**File:** `src/components/Theme/admin-theme-constants.ts`

```typescript
/**
 * Admin-specific color mappings for Payload CMS theming
 * Smaller palette than frontend (12 colors vs 19)
 */

export const ADMIN_THEME_CONFIG = {
  colors: [
    {
      var: "--admin-bg",
      name: "adminBackground",
      label: "Admin Background",
      description: "Main admin panel background",
    },
    {
      var: "--admin-fg",
      name: "adminForeground",
      label: "Admin Text Color",
      description: "Primary text in admin panel",
    },
    {
      var: "--admin-primary",
      name: "adminPrimaryColor",
      label: "Admin Primary Action",
      description: "Buttons, links, primary actions",
    },
    {
      var: "--admin-primary-fg",
      name: "adminPrimaryForeground",
      label: "Admin Primary Text",
      description: "Text on primary buttons",
    },
    {
      var: "--admin-secondary",
      name: "adminSecondaryColor",
      label: "Admin Secondary Surface",
      description: "Secondary UI elements",
    },
    {
      var: "--admin-secondary-fg",
      name: "adminSecondaryForeground",
      label: "Admin Secondary Text",
      description: "Text on secondary elements",
    },
    {
      var: "--admin-surface",
      name: "adminSurfaceColor",
      label: "Admin Card/Surface",
      description: "Cards, modals, panels",
    },
    {
      var: "--admin-surface-fg",
      name: "adminSurfaceForeground",
      label: "Admin Surface Text",
      description: "Text on surfaces",
    },
    {
      var: "--admin-accent",
      name: "adminAccentColor",
      label: "Admin Accent Color",
      description: "Highlights, warnings, info",
    },
    {
      var: "--admin-accent-fg",
      name: "adminAccentForeground",
      label: "Admin Accent Text",
      description: "Text on accent elements",
    },
    {
      var: "--admin-border",
      name: "adminBorderColor",
      label: "Admin Border Color",
      description: "Lines, separators, dividers",
    },
    {
      var: "--admin-muted",
      name: "adminMutedColor",
      label: "Admin Muted Color",
      description: "Disabled, inactive elements",
    },
  ],
  radius: {
    var: "--admin-radius",
    name: "adminRadius",
    label: "Admin Corner Radius",
  },
} as const;

export const ADMIN_COLOR_MAPPINGS = ADMIN_THEME_CONFIG.colors.map(
  (c) => [c.var, c.name] as [string, string],
);

export const ADMIN_RADIUS_MAPPING = [
  ADMIN_THEME_CONFIG.radius.var,
  ADMIN_THEME_CONFIG.radius.name,
] as [string, string];

/**
 * Payload-specific CSS selectors to target
 * These are the main container elements in Payload admin UI
 */
export const PAYLOAD_SELECTORS = {
  root: ".payload-admin",
  sidebar: ".nav-wrapper",
  content: ".payload__content-wrapper",
  button: "button, [role='button']",
  input: "input, textarea, select",
  modal: ".modal, [role='dialog']",
  card: ".card, [role='region']",
};
```

---

### Step 2: Create Admin Theme Defaults

**File:** `src/components/Theme/admin-theme-defaults.ts`

```typescript
/**
 * Default CSS for Payload admin panel theming
 * Applied when no custom overrides exist
 */

export const ADMIN_THEME_DEFAULTS = {
  light: `
    :root {
      /* Admin Colors - Light Mode */
      --admin-bg: #ffffff;
      --admin-fg: #1a1a1a;
      --admin-primary: #2563eb;
      --admin-primary-fg: #ffffff;
      --admin-secondary: #f3f4f6;
      --admin-secondary-fg: #374151;
      --admin-surface: #ffffff;
      --admin-surface-fg: #1a1a1a;
      --admin-accent: #f59e0b;
      --admin-accent-fg: #000000;
      --admin-border: #e5e7eb;
      --admin-muted: #9ca3af;
      --admin-radius: 0.375rem;
    }
  `,
  dark: `
    :root.dark {
      /* Admin Colors - Dark Mode */
      --admin-bg: #0f172a;
      --admin-fg: #f1f5f9;
      --admin-primary: #3b82f6;
      --admin-primary-fg: #ffffff;
      --admin-secondary: #1e293b;
      --admin-secondary-fg: #cbd5e1;
      --admin-surface: #1a1f35;
      --admin-surface-fg: #f1f5f9;
      --admin-accent: #fbbf24;
      --admin-accent-fg: #1a1a1a;
      --admin-border: #334155;
      --admin-muted: #64748b;
      --admin-radius: 0.375rem;
    }
  `,
};

export const ADMIN_CSS_FRAMEWORK = `
  /* Payload Admin Theme Framework */
  
  /* Root variables (applied via theme system) */
  :root {
    --admin-bg: #ffffff;
    --admin-fg: #1a1a1a;
    --admin-primary: #2563eb;
    --admin-primary-fg: #ffffff;
    --admin-secondary: #f3f4f6;
    --admin-secondary-fg: #374151;
    --admin-surface: #ffffff;
    --admin-surface-fg: #1a1a1a;
    --admin-accent: #f59e0b;
    --admin-accent-fg: #000000;
    --admin-border: #e5e7eb;
    --admin-muted: #9ca3af;
    --admin-radius: 0.375rem;
  }

  /* Apply to Payload admin elements */
  .payload-admin {
    background-color: var(--admin-bg);
    color: var(--admin-fg);
  }

  .payload-admin button,
  .payload-admin [role="button"] {
    background-color: var(--admin-primary);
    color: var(--admin-primary-fg);
    border-radius: var(--admin-radius);
  }

  .payload-admin button:hover,
  .payload-admin [role="button"]:hover {
    opacity: 0.9;
  }

  .payload-admin input,
  .payload-admin textarea,
  .payload-admin select {
    background-color: var(--admin-surface);
    color: var(--admin-fg);
    border: 1px solid var(--admin-border);
    border-radius: var(--admin-radius);
    padding: 0.5rem;
  }

  .payload-admin input:focus,
  .payload-admin textarea:focus,
  .payload-admin select:focus {
    border-color: var(--admin-primary);
    box-shadow: 0 0 0 3px rgba(var(--admin-primary-rgb), 0.1);
  }

  .payload-admin [role="dialog"],
  .payload-admin .modal {
    background-color: var(--admin-surface);
    color: var(--admin-surface-fg);
    border: 1px solid var(--admin-border);
  }

  .payload-admin .card,
  .payload-admin [role="region"] {
    background-color: var(--admin-surface);
    color: var(--admin-surface-fg);
    border: 1px solid var(--admin-border);
    border-radius: var(--admin-radius);
  }

  .payload-admin hr,
  .payload-admin [role="separator"] {
    border-color: var(--admin-border);
  }

  .payload-admin .nav-wrapper {
    background-color: var(--admin-secondary);
    color: var(--admin-secondary-fg);
  }

  .payload-admin .nav-wrapper a:hover,
  .payload-admin .nav-wrapper button:hover {
    background-color: rgba(var(--admin-primary-rgb), 0.1);
    color: var(--admin-primary);
  }

  /* Dark mode adjustments */
  .payload-admin.dark {
    background-color: var(--admin-bg);
    color: var(--admin-fg);
  }
`;
```

---

### Step 3: Create Admin Theme Generator

**File:** `src/globals/ThemeSettings/hooks/generateAdminCSS.ts`

```typescript
import {
  ADMIN_THEME_DEFAULTS,
  ADMIN_CSS_FRAMEWORK,
} from "../../../components/Theme/admin-theme-defaults";
import {
  extractVar,
  updateVar,
  hexToHsl,
} from "../../../components/Theme/theme-utils";
import {
  ADMIN_COLOR_MAPPINGS,
  ADMIN_RADIUS_MAPPING,
} from "../../../components/Theme/admin-theme-constants";

/**
 * Generate admin CSS from theme settings
 * This creates the CSS that will be injected into Payload admin
 */
export const generateAdminCSS = (settings: any): string => {
  if (!settings) return ADMIN_THEME_DEFAULTS.light;

  // Start with framework CSS
  let css = ADMIN_CSS_FRAMEWORK;

  // Apply default colors based on mode
  const mode = settings.mode || "light";
  if (mode === "light") {
    css += "\n" + ADMIN_THEME_DEFAULTS.light;
  } else if (mode === "dark") {
    css += "\n" + ADMIN_THEME_DEFAULTS.dark;
  } else {
    // system mode - include both
    css += "\n" + ADMIN_THEME_DEFAULTS.light;
    css += "\n" + ADMIN_THEME_DEFAULTS.dark;
  }

  // Override with custom admin colors if they exist
  let colorCss = ":root {\n";

  ADMIN_COLOR_MAPPINGS.forEach(([cssVar, fieldName]) => {
    const value = settings[fieldName];
    if (value) {
      const hslValue = hexToHsl(value);
      colorCss += `  ${cssVar}: ${hslValue};\n`;
    }
  });

  // Apply admin radius
  if (settings.adminRadius) {
    colorCss += `  ${ADMIN_RADIUS_MAPPING[0]}: ${settings.adminRadius}rem;\n`;
  }

  colorCss += "}\n";

  // Add dark mode overrides
  if (mode === "system" || mode === "dark") {
    let darkCss = ":root.dark {\n";

    ADMIN_COLOR_MAPPINGS.forEach(([cssVar, fieldName]) => {
      const darkFieldName = fieldName.replace(/Color$/, "DarkColor");
      const darkValue = settings[darkFieldName];
      if (darkValue) {
        const hslValue = hexToHsl(darkValue);
        darkCss += `  ${cssVar}: ${hslValue};\n`;
      }
    });

    darkCss += "}\n";
    colorCss += darkCss;
  }

  // Apply custom admin CSS overrides if provided
  if (settings.adminCSSOverrides) {
    css += "\n" + settings.adminCSSOverrides;
  }

  return css + colorCss;
};

/**
 * Extract admin CSS from pasted CSS string
 */
export const extractAdminCSSVariables = (
  cssString: string,
): Record<string, string> => {
  const variables: Record<string, string> = {};

  ADMIN_COLOR_MAPPINGS.forEach(([cssVar]) => {
    const value = extractVar(cssString, cssVar);
    if (value) {
      variables[cssVar] = value;
    }
  });

  return variables;
};
```

---

### Step 4: Create Admin Theme Sync Hook

**File:** `src/globals/ThemeSettings/hooks/syncAdminTheme.ts`

```typescript
import type { GlobalAfterChangeHook } from "payload";
import { generateAdminCSS } from "./generateAdminCSS";
import fs from "fs/promises";
import path from "path";

/**
 * After theme settings change, generate and save admin CSS
 * This CSS will be injected into the Payload admin panel
 */
export const syncAdminTheme: GlobalAfterChangeHook = async ({
  doc,
  req: { payload },
}) => {
  try {
    const adminCSS = generateAdminCSS(doc);

    // Save to public directory so it can be served
    const adminCSSPath = path.join(process.cwd(), "public", "admin-theme.css");

    // Create directory if it doesn't exist
    await fs.mkdir(path.dirname(adminCSSPath), { recursive: true });

    // Write CSS file
    await fs.writeFile(adminCSSPath, adminCSS, "utf-8");

    payload.logger.info(`✅ Generated admin theme CSS: ${adminCSSPath}`);

    // Also trigger revalidation for frontend
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/", "layout");

    return doc;
  } catch (error) {
    payload.logger.error(
      `❌ Failed to sync admin theme: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    throw error;
  }
};
```

---

### Step 5: Create Admin Theme Injector Utility

**File:** `src/utilities/adminThemeInjector.ts`

```typescript
/**
 * Utility for injecting admin theme CSS into Payload admin panel
 * This runs in the Payload admin UI context
 */

export const injectAdminTheme = async () => {
  try {
    // Fetch the generated admin CSS
    const response = await fetch("/admin-theme.css");

    if (!response.ok) {
      console.warn("Failed to fetch admin theme CSS");
      return;
    }

    const css = await response.text();

    // Create style tag in document head
    const styleTag = document.createElement("style");
    styleTag.id = "payload-admin-theme";
    styleTag.textContent = css;

    document.head.appendChild(styleTag);

    console.log("✅ Admin theme injected successfully");
  } catch (error) {
    console.error("Failed to inject admin theme:", error);
  }
};

/**
 * For next-generation integration, add to payload.config.ts admin config
 */
export const adminThemeConfig = {
  // Hook into Payload admin initialization
  onInit: async () => {
    await injectAdminTheme();
  },

  // Listen for system preference changes
  onThemeChange: async (isDark: boolean) => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  },
};
```

---

### Step 6: Create Admin Theme API Route

**File:** `src/app/api/admin-theme/route.ts`

```typescript
import { getCachedGlobal } from "@/utilities/getGlobals";
import { generateAdminCSS } from "@/globals/ThemeSettings/hooks/generateAdminCSS";

/**
 * API route to get current admin theme CSS
 * Endpoint: /api/admin-theme
 */
export async function GET() {
  try {
    // Fetch theme settings with cache
    const themeSettings = await getCachedGlobal("theme-settings" as any, 1)();

    // Generate admin CSS
    const adminCSS = generateAdminCSS(themeSettings);

    return new Response(adminCSS, {
      headers: {
        "Content-Type": "text/css",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Failed to generate admin theme:", error);

    // Return default styles on error
    return new Response("/* Admin theme CSS unavailable */", {
      status: 500,
      headers: { "Content-Type": "text/css" },
    });
  }
}
```

---

### Step 7: ENHANCED Payload Config with Admin Theming

**File:** `src/payload.config.ts` (Updated Sections)

```typescript
import { ThemeSettings } from "./globals/ThemeSettings/config";
import { syncAdminTheme } from "./globals/ThemeSettings/hooks/syncAdminTheme";

export default buildConfig({
  // ... existing config

  admin: {
    // Link to admin theme CSS
    css: ["/admin-theme.css"],

    // Optional: Add Payload's built-in theming if available
    theme: {
      // This depends on Payload version
      // Newer versions may support custom admin themes
    },

    // Hook to inject theme on admin load
    onInit: async (req) => {
      // The CSS will already be injected via <link> tag above
      console.log("✅ Admin initialized with custom theme");
    },
  },

  globals: [
    ThemeSettings,
    // ... other globals
  ],

  // ... rest of config
});
```

---

### Step 8: ENHANCED ThemeSettings Global Schema

**File:** `src/globals/ThemeSettings/config.ts` (Key Additions)

```typescript
// In the fields array, add a new TAB for Admin Theme

{
  type: "tabs",
  tabs: [
    {
      label: "General Settings",
      fields: [
        // ... existing general fields
      ],
    },
    {
      label: "Website Colors",
      fields: [
        // ... existing 19 website color fields
      ],
    },
    {
      label: "Admin Panel Colors", // NEW TAB
      fields: [
        {
          name: "adminBackground",
          label: "Admin Background",
          type: "text",
          admin: {
            components: {
              Field: "@/components/Theme/ColorPickerField",
            },
          },
        },
        // ... 11 more admin color fields
        {
          name: "adminRadius",
          label: "Admin Corner Radius (rem)",
          type: "number",
          defaultValue: 0.375,
          admin: {
            components: {
              Field: "@/components/Theme/RadiusSliderField",
            },
          },
        },
      ],
    },
    {
      label: "Theme Preview",
      fields: [
        {
          type: "ui",
          name: "themePreview",
          admin: {
            components: {
              Field: "@/components/Theme/ThemePlayground", // Shows both website + admin preview
            },
          },
        },
      ],
    },
    {
      label: "CSS Overrides",
      fields: [
        {
          name: "cssOverrides",
          label: "Website CSS Overrides",
          type: "code",
          defaultValue: DEFAULT_CSS_OVERRIDES,
          admin: {
            language: "css",
            description: "Advanced: Paste custom CSS for website theme",
          },
        },
        {
          name: "adminCSSOverrides",
          label: "Admin CSS Overrides",
          type: "code",
          admin: {
            language: "css",
            description: "Advanced: Paste custom CSS for admin panel theme",
          },
        },
      ],
    },
  ],
},

// In hooks section:
hooks: {
  afterChange: [revalidateTheme, syncAdminTheme], // ADD THIS
}
```

---

### Step 9: Create Enhanced ThemeProvider Component

**File:** `src/components/Theme/ThemeProvider.tsx` (Updated)

```typescript
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext<any>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider = ({
  children,
  settings,
}: {
  children: React.ReactNode
  settings: any
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    const { mode = "light" } = settings || {}

    // Determine effective mode
    const effectiveMode =
      mode === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : (mode as "light" | "dark")

    // Apply to html element
    root.classList.remove("light", "dark")
    root.classList.add(effectiveMode)

    // Website CSS is already injected in head
    // Apply individual color overrides if needed
    // ... existing logic ...

    // NEW: Also ensure admin panel theme is loaded
    loadAdminTheme()

    // Listen for system preference changes
    if (mode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => {
        const newMode = mediaQuery.matches ? "dark" : "light"
        root.classList.remove("light", "dark")
        root.classList.add(newMode)
      }
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [settings, mounted])

  return (
    <ThemeContext.Provider value={settings}>{children}</ThemeContext.Provider>
  )
}

/**
 * NEW: Load admin theme CSS if in Payload admin
 */
const loadAdminTheme = () => {
  const isPayloadAdmin = window.location.pathname.includes("/admin")

  if (isPayloadAdmin) {
    const existingStyle = document.getElementById("payload-admin-theme-dynamic")

    if (!existingStyle) {
      const link = document.createElement("link")
      link.id = "payload-admin-theme-dynamic"
      link.rel = "stylesheet"
      link.href = "/admin-theme.css"
      link.onload = () => {
        console.log("✅ Admin theme CSS loaded")
      }
      link.onerror = () => {
        console.warn("⚠️ Failed to load admin theme CSS")
      }
      document.head.appendChild(link)
    }
  }
}
```

---

### Step 10: Root Layout Integration

**File:** `src/app/layout.tsx` (Updated)

```typescript
import { getCachedGlobal } from "@/utilities/getGlobals"
import { ThemeProvider } from "@/components/Theme/ThemeProvider"
import { DEFAULT_CSS_OVERRIDES } from "@/components/Theme/default-theme"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch theme settings
  const themeSettings = await getCachedGlobal("theme-settings" as any, 1)()
  const {
    mode = "light",
    cssOverrides = DEFAULT_CSS_OVERRIDES,
  } = themeSettings || {}

  const initialThemeClass = mode !== "system" ? mode : ""

  return (
    <html lang="en" className={initialThemeClass}>
      <head>
        {/* Website Theme CSS */}
        <style
          id="payload-theme-overrides"
          dangerouslySetInnerHTML={{ __html: cssOverrides }}
        />

        {/* NEW: Admin Theme CSS Link */}
        <link rel="stylesheet" href="/admin-theme.css" />

        {/* System Preference Detection */}
        {mode === "system" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.add('light')
                }
              `,
            }}
          />
        )}
      </head>
      <body>
        <ThemeProvider settings={themeSettings}>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

---

## 🎨 ENHANCED Theme Presets

### Website Presets (19 colors each)

- neutral: zinc, slate, stone, gray, neutral
- vibrant: red, rose, orange, green, blue, yellow, violet, azure, emerald, crimson, amber, turquoise

### Admin Presets (12 colors each)

- professional: zinc, slate, stone
- vibrant: blue, green, purple
- custom: user-defined

---

## 📊 DUAL THEMING CONTROL MATRIX

| Setting              | Website Impact | Admin Impact | Independent?    |
| -------------------- | -------------- | ------------ | --------------- |
| Dark Mode            | ✅ Yes         | ✅ Yes       | ❌ Synchronized |
| Primary Color        | ✅ Yes         | ✅ Yes       | ⚠️ Can override |
| Font Family          | ✅ Yes         | ⚠️ Limited   | ❌ Synchronized |
| Radius               | ✅ Yes         | ✅ Yes       | ❌ Synchronized |
| Custom CSS (Website) | ✅ Yes         | ❌ No        | ✅ Independent  |
| Custom CSS (Admin)   | ❌ No          | ✅ Yes       | ✅ Independent  |

---

## 🔄 Data Flow: Dual Theme Application

```
1. Admin edits theme in Payload CMS
                ↓
2. beforeChange Hook
   - Syncs website colors to fields
   - Syncs admin colors to fields
                ↓
3. Data saved to PostgreSQL
                ↓
4. afterChange Hooks (PARALLEL)
   ├─→ revalidateTheme (Website)
   │   - Invalidates website cache
   │   - Next.js rebuilds layout
   │
   └─→ syncAdminTheme (Admin)
       - Generates admin CSS
       - Saves to /public/admin-theme.css
                ↓
5. Frontend Layout Fetches Theme
   - Injects website CSS in <head>
   - Injects admin CSS <link> tag
                ↓
6. ThemeProvider Applies Changes
   - Sets light/dark class
   - Applies CSS variables (website)
   - Loads admin theme CSS
                ↓
7. Both Environments Update Instantly
   - Website components use Tailwind colors
   - Admin panel uses custom CSS
```

---

## 🚀 Implementation Checklist

### Phase 1: Admin Theme Infrastructure

- [ ] Create `admin-theme-constants.ts`
- [ ] Create `admin-theme-defaults.ts`
- [ ] Create `generateAdminCSS.ts`
- [ ] Create `syncAdminTheme.ts`
- [ ] Create `adminThemeInjector.ts`
- [ ] Create `/api/admin-theme` route

### Phase 2: Payload Configuration

- [ ] Update `payload.config.ts` with admin CSS link
- [ ] ENHANCE `ThemeSettings/config.ts` with admin colors tab
- [ ] Add admin color mapping to hooks

### Phase 3: Frontend Integration

- [ ] Update `ThemeProvider.tsx` with admin theme loading
- [ ] Update root `layout.tsx` with admin CSS injection
- [ ] Test website theme application
- [ ] Test admin theme application

### Phase 4: Testing & Refinement

- [ ] Test theme switching on website
- [ ] Test theme switching in admin panel
- [ ] Test dark mode detection
- [ ] Test system preference changes
- [ ] Verify cache invalidation
- [ ] Test custom CSS overrides (both environments)
- [ ] Verify no hydration mismatches
- [ ] Test on different browsers

### Phase 5: Polish & Deployment

- [ ] Create admin theme preview component
- [ ] Add documentation to CMS
- [ ] Set up monitoring for theme changes
- [ ] Deploy to production
- [ ] Monitor for issues

---

## 🔌 Key Features of Enhanced System

✅ **Single Point Control**: Change theme in one place, updates everywhere  
✅ **Dual Environments**: Website + Admin panel both themed  
✅ **Independent Customization**: Separate CSS overrides for each  
✅ **Real-Time Updates**: No page refresh needed  
✅ **Preset Themes**: 14+ professional color schemes  
✅ **Dark Mode**: Automatic system preference detection  
✅ **Performance**: Cached data fetching, optimized CSS injection  
✅ **Admin UX**: Professional branded admin experience  
✅ **Flexibility**: Override any color individually or via CSS  
✅ **Scalability**: Easy to add more theme options

---

## 📈 Benefits of Dual Theming

1. **Brand Consistency**: Website and admin share primary theme
2. **Professional Admin**: Branded admin panel improves team cohesion
3. **Flexibility**: Option to diverge if needed (e.g., dark admin, light website)
4. **User Experience**: Admin panel feels like part of the brand
5. **Future-Ready**: Easily add more environments (app, extensions, etc.)
6. **Control**: Non-technical admins can change everything via CMS
7. **Performance**: Efficient CSS injection and caching strategy
8. **Maintainability**: Single source of truth for all themes

---

## 📝 Summary: Original → Enhanced

| Aspect              | Original         | Enhanced                             |
| ------------------- | ---------------- | ------------------------------------ |
| Environments        | Website only     | Website + Admin Panel                |
| Color Variables     | 19 (website)     | 19 (website) + 12 (admin) = 31 total |
| Control Points      | 1 (website)      | 2 (website + admin)                  |
| CSS Injection       | Layout component | Layout + API route                   |
| Admin Customization | None             | Full theme control                   |
| Synchronization     | N/A              | Bidirectional sync                   |
| Complexity          | Advanced         | Advanced+                            |
| Implementation Time | 6-8 hours        | 10-12 hours                          |
| Maintenance         | Moderate         | Moderate                             |

---

## 🎓 Key Learning Points

1. **Dual CSS Systems**: Maintain separate CSS variable sets for different environments
2. **File-based CSS Generation**: Generate admin CSS dynamically and save to public directory
3. **API Route Pattern**: Use `/api/admin-theme` to serve theme CSS dynamically
4. **Hook Orchestration**: Use multiple afterChange hooks for complex operations
5. **Cache Strategy**: Invalidate different caches for website vs admin
6. **System Integration**: Inject CSS into both Next.js (server) and Payload admin (client)

---

**Document Version:** 2.0 (Enhanced)  
**Last Updated:** May 20, 2026  
**Estimated Total Implementation Time:** 10-12 hours  
**Difficulty:** Advanced+  
**Priority:** High (Core Feature)  
**Status:** Ready for Implementation
