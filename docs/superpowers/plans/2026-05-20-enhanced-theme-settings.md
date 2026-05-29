# Enhanced Theme Settings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a comprehensive Unified Theme Settings System in Payload CMS 3.x that dynamically generates static CSS files to theme both the frontend website and the native admin panel from a single dashboard, including customizable theme presets and dynamic Google Fonts.

**Architecture:** Compiles database-stored theme inputs into two static CSS files (`public/theme-variables.css` and `public/admin-theme.css`) inside a Payload hook, delivering them with zero-flicker link tags in Next.js layouts and the Payload admin configuration.

**Tech Stack:** Next.js 15+, React 19, Tailwind CSS v4, Payload CMS 3.24.0, MongoDB (Mongoose)

---

### Task 1: Theme Presets Constants & Mappings

**Files:**
- Create: `src/components/Theme/theme-presets.ts`
- Test: Run validation compilation using `npx tsc --noEmit`

- [ ] **Step 1: Write Presets and Color Palette Configuration**
  Create the main configuration file containing the 14+ preset themes for both the website and the admin panel, as well as the mapping arrays for individual variables.
  
  ```typescript
  // src/components/Theme/theme-presets.ts
  
  export interface ColorPreset {
    name: string;
    label: string;
    websiteColors: Record<string, string>;
    adminColors: Record<string, string>;
    websiteRadius: number;
    adminRadius: number;
  }
  
  export const THEME_PRESETS: Record<string, ColorPreset> = {
    chambersClassic: {
      name: "chambersClassic",
      label: "Chambers Classic (Deep Navy & Subtle Gold)",
      websiteColors: {
        background: "#ffffff",
        foreground: "#1e293b",
        primary: "#0f1729",
        primaryForeground: "#ffffff",
        secondary: "#f8fafc",
        secondaryForeground: "#0f1729",
        card: "#ffffff",
        cardForeground: "#1e293b",
        popover: "#ffffff",
        popoverForeground: "#1e293b",
        muted: "#f1f5f9",
        mutedForeground: "#64748b",
        accent: "#d4af37",
        accentForeground: "#ffffff",
        destructive: "#ef4444",
        destructiveForeground: "#ffffff",
        border: "#e2e8f0",
        input: "#e2e8f0",
        ring: "#d4af37",
      },
      adminColors: {
        adminBg: "#ffffff",
        adminFg: "#0f1729",
        adminPrimary: "#0f1729",
        adminPrimaryFg: "#ffffff",
        adminSecondary: "#f8fafc",
        adminSecondaryFg: "#0f1729",
        adminSurface: "#ffffff",
        adminSurfaceFg: "#0f1729",
        adminAccent: "#d4af37",
        adminAccentFg: "#ffffff",
        adminBorder: "#e2e8f0",
        adminMuted: "#64748b",
      },
      websiteRadius: 0.5,
      adminRadius: 0.375,
    },
    slateMinimalist: {
      name: "slateMinimalist",
      label: "Slate Minimalist (Stark Charcoal)",
      websiteColors: {
        background: "#ffffff",
        foreground: "#111827",
        primary: "#1f2937",
        primaryForeground: "#ffffff",
        secondary: "#f3f4f6",
        secondaryForeground: "#111827",
        card: "#ffffff",
        cardForeground: "#111827",
        popover: "#ffffff",
        popoverForeground: "#111827",
        muted: "#f3f4f6",
        mutedForeground: "#4b5563",
        accent: "#374151",
        accentForeground: "#ffffff",
        destructive: "#dc2626",
        destructiveForeground: "#ffffff",
        border: "#e5e7eb",
        input: "#e5e7eb",
        ring: "#1f2937",
      },
      adminColors: {
        adminBg: "#ffffff",
        adminFg: "#111827",
        adminPrimary: "#1f2937",
        adminPrimaryFg: "#ffffff",
        adminSecondary: "#f3f4f6",
        adminSecondaryFg: "#111827",
        adminSurface: "#ffffff",
        adminSurfaceFg: "#111827",
        adminAccent: "#374151",
        adminAccentFg: "#ffffff",
        adminBorder: "#e5e7eb",
        adminMuted: "#4b5563",
      },
      websiteRadius: 0.25,
      adminRadius: 0.25,
    }
  };
  
  export const WEBSITE_COLOR_KEYS = [
    "background", "foreground", "primary", "primaryForeground",
    "secondary", "secondaryForeground", "card", "cardForeground",
    "popover", "popoverForeground", "muted", "mutedForeground",
    "accent", "accentForeground", "destructive", "destructiveForeground",
    "border", "input", "ring"
  ];
  
  export const ADMIN_COLOR_KEYS = [
    "adminBg", "adminFg", "adminPrimary", "adminPrimaryFg",
    "adminSecondary", "adminSecondaryFg", "adminSurface",
    "adminSurfaceFg", "adminAccent", "adminAccentFg", "adminBorder",
    "adminMuted"
  ];
  ```

- [ ] **Step 2: Verify code compiling**
  Run: `npx tsc --noEmit`
  Expected: Successful compilation, no syntax errors.

- [ ] **Step 3: Commit**
  ```bash
  git add src/components/Theme/theme-presets.ts
  git commit -m "feat: add theme presets configuration"
  ```

---

### Task 2: Custom CMS Input Fields & Components

**Files:**
- Create: `src/components/Theme/ColorPickerField.tsx`
- Create: `src/components/Theme/RadiusSliderField.tsx`
- Create: `src/components/Theme/ThemePlayground.tsx`

- [ ] **Step 1: Implement custom ColorPickerField**
  Create a custom color picker input component for Payload CMS admin panel.
  
  ```tsx
  // src/components/Theme/ColorPickerField.tsx
  "use client";
  import React from "react";
  import { useField } from "@payloadcms/ui";
  
  export const ColorPickerField: React.FC<{ path: string; label: string }> = ({ path, label }) => {
    const { value, setValue } = useField<string>({ path });
  
    return (
      <div className="field-type text" style={{ marginBottom: "1rem" }}>
        <label className="field-label" style={{ marginBottom: "0.25rem", display: "block", fontWeight: "bold" }}>
          {label}
        </label>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input
            type="color"
            value={value || "#ffffff"}
            onChange={(e) => setValue(e.target.value)}
            style={{ width: "40px", height: "40px", padding: "0", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer" }}
          />
          <input
            type="text"
            value={value || ""}
            onChange={(e) => setValue(e.target.value)}
            placeholder="#ffffff"
            style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", flex: 1 }}
          />
        </div>
      </div>
    );
  };
  ```

- [ ] **Step 2: Implement custom RadiusSliderField**
  Create a custom slider component for adjusting corner radius rem values.
  
  ```tsx
  // src/components/Theme/RadiusSliderField.tsx
  "use client";
  import React from "react";
  import { useField } from "@payloadcms/ui";
  
  export const RadiusSliderField: React.FC<{ path: string; label: string; max?: number }> = ({ path, label, max = 2 }) => {
    const { value, setValue } = useField<number>({ path });
    const currentValue = value !== undefined ? value : 0.5;
  
    return (
      <div className="field-type number" style={{ marginBottom: "1rem" }}>
        <label className="field-label" style={{ marginBottom: "0.25rem", display: "block", fontWeight: "bold" }}>
          {label} ({currentValue}rem)
        </label>
        <input
          type="range"
          min="0"
          max={max}
          step="0.05"
          value={currentValue}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          style={{ width: "100%", accentColor: "var(--theme-color-primary-500)" }}
        />
      </div>
    );
  };
  ```

- [ ] **Step 3: Implement custom ThemePlayground component**
  Create the dynamic mockup preview component that updates in real-time as fields change in the CMS form.
  
  ```tsx
  // src/components/Theme/ThemePlayground.tsx
  "use client";
  import React from "react";
  import { useFormFields } from "@payloadcms/ui";
  
  export const ThemePlayground: React.FC = () => {
    const fields = useFormFields(([state]) => state);
  
    const getValue = (key: string, fallback: string) => {
      const field = fields[key];
      return field && field.value ? (field.value as string) : fallback;
    };
  
    const bg = getValue("background", "#ffffff");
    const fg = getValue("foreground", "#1e293b");
    const primary = getValue("primary", "#0f1729");
    const primaryFg = getValue("primaryForeground", "#ffffff");
    const accent = getValue("accent", "#d4af37");
    const radius = getValue("websiteRadius", "0.5");
  
    const adminBg = getValue("adminBackground", "#ffffff");
    const adminFg = getValue("adminForeground", "#0f1729");
    const adminPrimary = getValue("adminPrimaryColor", "#0f1729");
    const adminPrimaryFg = getValue("adminPrimaryForeground", "#ffffff");
    const adminSecondary = getValue("adminSecondaryColor", "#f8fafc");
    const adminRadius = getValue("adminRadius", "0.375");
  
    return (
      <div style={{ marginTop: "2rem", border: "1px solid #ccc", borderRadius: "8px", padding: "1.5rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Real-Time Brand Mockups</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* Website Mockup */}
          <div style={{ background: bg, color: fg, border: "1px solid #ddd", borderRadius: `${radius}rem`, padding: "1rem" }}>
            <h4 style={{ color: primary, marginBottom: "0.5rem" }}>Website Preview</h4>
            <p style={{ fontSize: "0.875rem", marginBottom: "1rem" }}>Authoritative legal presentation.</p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button style={{ background: primary, color: primaryFg, border: "none", padding: "0.5rem 1rem", borderRadius: `${radius}rem`, fontWeight: "bold" }}>
                Primary Action
              </button>
              <button style={{ background: "transparent", color: accent, border: `2px solid ${accent}`, padding: "0.5rem 1rem", borderRadius: `${radius}rem`, fontWeight: "bold" }}>
                Accent CTA
              </button>
            </div>
          </div>
          {/* Admin Panel Mockup */}
          <div style={{ background: adminBg, color: adminFg, border: "1px solid #ddd", borderRadius: `${adminRadius}rem`, padding: "1rem" }}>
            <h4 style={{ color: adminPrimary, marginBottom: "0.5rem" }}>Admin Panel Preview</h4>
            <div style={{ background: adminSecondary, padding: "0.75rem", borderRadius: `${adminRadius}rem`, marginBottom: "0.75rem", fontSize: "0.875rem" }}>
              Sidebar navigation row placeholder
            </div>
            <button style={{ background: adminPrimary, color: adminPrimaryFg, border: "none", padding: "0.5rem 1rem", borderRadius: `${adminRadius}rem`, width: "100%", fontWeight: "bold" }}>
              Save Theme Changes
            </button>
          </div>
        </div>
      </div>
    );
  };
  ```

- [ ] **Step 4: Commit components**
  ```bash
  git add src/components/Theme/ColorPickerField.tsx src/components/Theme/RadiusSliderField.tsx src/components/Theme/ThemePlayground.tsx
  git commit -m "feat: implement custom theme CMS input components"
  ```

---

### Task 3: Centralized Global Schema Definition

**Files:**
- Create: `src/globals/ThemeSettings/config.ts`
- Modify: `src/payload.config.ts`

- [ ] **Step 1: Write ThemeSettings schema file**
  Implement the global schema in Payload containing tabs for general, website, admin, and CSS overrides settings. We will also implement the hooks integration which gets built in Task 4.
  
  ```typescript
  // src/globals/ThemeSettings/config.ts
  import type { GlobalConfig } from "payload";
  import { THEME_PRESETS, WEBSITE_COLOR_KEYS, ADMIN_COLOR_KEYS } from "../../components/Theme/theme-presets";
  
  export const ThemeSettings: GlobalConfig = {
    slug: "theme-settings",
    label: "Theme Settings",
    admin: {
      group: "Settings",
    },
    access: {
      read: () => true,
      update: ({ req }) => (req.user ? true : false),
    },
    fields: [
      {
        type: "tabs",
        tabs: [
          {
            label: "General Settings",
            fields: [
              {
                type: "row",
                fields: [
                  {
                    name: "mode",
                    type: "select",
                    label: "Theme Mode",
                    options: [
                      { label: "Synchronized with System", value: "system" },
                      { label: "Forced Light Mode", value: "light" },
                      { label: "Forced Dark Mode", value: "dark" },
                    ],
                    defaultValue: "system",
                    admin: { width: "33%" },
                  },
                  {
                    name: "sansFont",
                    type: "text",
                    label: "Google Sans Font Family",
                    defaultValue: "Public Sans",
                    admin: { width: "33%" },
                  },
                  {
                    name: "serifFont",
                    type: "text",
                    label: "Google Serif Font Family",
                    defaultValue: "Playfair Display",
                    admin: { width: "34%" },
                  },
                ],
              },
              {
                type: "row",
                fields: [
                  {
                    name: "websiteRadius",
                    type: "number",
                    label: "Website Corner Radius (rem)",
                    defaultValue: 0.5,
                    admin: {
                      components: {
                        Field: "@/components/Theme/RadiusSliderField#RadiusSliderField",
                      },
                      width: "50%",
                    },
                  },
                  {
                    name: "adminRadius",
                    type: "number",
                    label: "Admin Corner Radius (rem)",
                    defaultValue: 0.375,
                    admin: {
                      components: {
                        Field: "@/components/Theme/RadiusSliderField#RadiusSliderField",
                      },
                      width: "50%",
                    },
                  },
                ],
              },
              {
                name: "themePreset",
                type: "select",
                label: "Load A Theme Preset (Click Save afterwards)",
                options: Object.values(THEME_PRESETS).map((p) => ({
                  label: p.label,
                  value: p.name,
                })),
                admin: {
                  description: "Selecting a preset will populate the colors under the Website and Admin tabs automatically.",
                },
              },
            ],
          },
          {
            label: "Website Colors",
            fields: WEBSITE_COLOR_KEYS.map((key) => ({
              name: key,
              type: "text",
              label: `Website ${key.charAt(0).toUpperCase() + key.slice(1)}`,
              admin: {
                components: {
                  Field: "@/components/Theme/ColorPickerField#ColorPickerField",
                },
              },
            })),
          },
          {
            label: "Admin Panel Colors",
            fields: ADMIN_COLOR_KEYS.map((key) => ({
              name: key,
              type: "text",
              label: `Admin ${key.charAt(0).toUpperCase() + key.slice(1)}`,
              admin: {
                components: {
                  Field: "@/components/Theme/ColorPickerField#ColorPickerField",
                },
              },
            })),
          },
          {
            label: "CSS Overrides",
            fields: [
              {
                name: "websiteCSSOverrides",
                type: "code",
                label: "Website CSS Overrides",
                admin: {
                  language: "css",
                },
              },
              {
                name: "adminCSSOverrides",
                type: "code",
                label: "Admin CSS Overrides",
                admin: {
                  language: "css",
                },
              },
            ],
          },
          {
            label: "Mockups Preview",
            fields: [
              {
                name: "livePreviewBlock",
                type: "ui",
                admin: {
                  components: {
                    Field: "@/components/Theme/ThemePlayground#ThemePlayground",
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  };
  ```

- [ ] **Step 2: Register Global in payload.config.ts**
  Import and add `ThemeSettings` to the `globals` list in `src/payload.config.ts`.
  
  ```typescript
  // Modify src/payload.config.ts
  // Add import:
  import { ThemeSettings } from "./globals/ThemeSettings/config";
  
  // Update globals array:
  globals: [Header, GA4Settings, ThemeSettings],
  ```

- [ ] **Step 3: Test Schema Registration**
  Run compilation: `npx tsc --noEmit`
  Expected: Successful, no compilation errors.

- [ ] **Step 4: Commit**
  ```bash
  git add src/globals/ThemeSettings/config.ts src/payload.config.ts
  git commit -m "feat: define ThemeSettings global schema in Payload"
  ```

---

### Task 4: Hook Orchestration & CSS Compilers

**Files:**
- Create: `src/globals/ThemeSettings/hooks/generateThemeCSS.ts`
- Create: `src/globals/ThemeSettings/hooks/generateAdminCSS.ts`
- Create: `src/globals/ThemeSettings/hooks/syncTheme.ts`
- Modify: `src/globals/ThemeSettings/config.ts`

- [ ] **Step 1: Write generateThemeCSS compiler**
  This maps the 19 CMS fields into standard frontend website variables.
  
  ```typescript
  // src/globals/ThemeSettings/hooks/generateThemeCSS.ts
  import { WEBSITE_COLOR_KEYS } from "../../../components/Theme/theme-presets";
  
  export const generateThemeCSS = (settings: any): string => {
    let css = `:root {\n`;
  
    WEBSITE_COLOR_KEYS.forEach((key) => {
      const val = settings[key];
      if (val) {
        // Map camelCase to css-variable (e.g. primaryForeground -> --primary-foreground)
        const cssVarName = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        css += `  --${cssVarName}: ${val};\n`;
      }
    });
  
    const radius = settings.websiteRadius !== undefined ? settings.websiteRadius : 0.5;
    css += `  --radius: ${radius}rem;\n`;
    css += `}\n\n`;
  
    if (settings.websiteCSSOverrides) {
      css += `/* Custom Overrides */\n${settings.websiteCSSOverrides}\n`;
    }
  
    return css;
  };
  ```

- [ ] **Step 2: Write generateAdminCSS compiler**
  This overrides Payload's native 3.x CSS variables based on the 12 admin settings. We compute a slightly darker tone for primary hover buttons dynamically.
  
  ```typescript
  // src/globals/ThemeSettings/hooks/generateAdminCSS.ts
  
  // Helper to convert hex to HSL and return a slightly darker hex for hover states
  const lightenDarkenColor = (col: string, amt: number) => {
    let usePound = false;
    if (col[0] === "#") {
      col = col.slice(1);
      usePound = true;
    }
    const num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00ff) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    let g = (num & 0x0000ff) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, "0");
  };
  
  export const generateAdminCSS = (settings: any): string => {
    const adminBg = settings.adminBg || "#ffffff";
    const adminFg = settings.adminFg || "#0f1729";
    const adminPrimary = settings.adminPrimary || "#0f1729";
    const adminPrimaryFg = settings.adminPrimaryFg || "#ffffff";
    const adminSecondary = settings.adminSecondary || "#f8fafc";
    const adminSecondaryFg = settings.adminSecondaryFg || "#0f1729";
    const adminSurface = settings.adminSurface || "#ffffff";
    const adminSurfaceFg = settings.adminSurfaceFg || "#0f1729";
    const adminAccent = settings.adminAccent || "#d4af37";
    const adminBorder = settings.adminBorder || "#e2e8f0";
    const adminRadius = settings.adminRadius !== undefined ? settings.adminRadius : 0.375;
  
    // Compute primary hover
    const adminPrimaryHover = lightenDarkenColor(adminPrimary, -20);
  
    let css = `
  /* Overrides Payload's native theme properties seamlessly */
  :root, :root.dark, [data-theme="light"], [data-theme="dark"] {
    --theme-bg: ${adminBg} !important;
    --theme-elevation-0: ${adminBg} !important;
    --theme-elevation-50: ${adminSecondary} !important;
    --theme-elevation-100: ${adminSurface} !important;
    --theme-text: ${adminFg} !important;
    --theme-border-color: ${adminBorder} !important;
    --theme-color-primary-500: ${adminPrimary} !important;
    --theme-color-primary-600: ${adminPrimaryHover} !important;
    --theme-input-radius: ${adminRadius}rem !important;
    --theme-button-radius: ${adminRadius}rem !important;
  }
  `;
  
    if (settings.adminCSSOverrides) {
      css += `\n/* Custom Overrides */\n${settings.adminCSSOverrides}\n`;
    }
  
    return css;
  };
  ```

- [ ] **Step 3: Write syncTheme hooks orchestrator**
  Writes files asynchronously to public/ and triggers Next.js layout revalidation.
  
  ```typescript
  // src/globals/ThemeSettings/hooks/syncTheme.ts
  import type { GlobalAfterChangeHook, GlobalBeforeChangeHook } from "payload";
  import { generateThemeCSS } from "./generateThemeCSS";
  import { generateAdminCSS } from "./generateAdminCSS";
  import { THEME_PRESETS } from "../../../components/Theme/theme-presets";
  import fs from "fs/promises";
  import path from "path";
  
  export const sanitizeThemeInput: GlobalBeforeChangeHook = async ({ data }) => {
    // If a preset was selected in the form, automatically apply it to the colors in data before saving
    if (data.themePreset && THEME_PRESETS[data.themePreset]) {
      const preset = THEME_PRESETS[data.themePreset];
      data = {
        ...data,
        ...preset.websiteColors,
        ...preset.adminColors,
        websiteRadius: preset.websiteRadius,
        adminRadius: preset.adminRadius,
        themePreset: "", // Clear selection so it can be re-selected if wanted
      };
    }
    
    // Sanitize font family fields
    if (data.sansFont) {
      data.sansFont = data.sansFont.trim().replace(/[^a-zA-Z0-9 ]/g, "");
    }
    if (data.serifFont) {
      data.serifFont = data.serifFont.trim().replace(/[^a-zA-Z0-9 ]/g, "");
    }
    
    return data;
  };
  
  export const syncTheme: GlobalAfterChangeHook = async ({ doc, req: { payload } }) => {
    try {
      const themeCss = generateThemeCSS(doc);
      const adminCss = generateAdminCSS(doc);
  
      const publicDir = path.join(process.cwd(), "public");
      
      // Ensure public dir exists
      await fs.mkdir(publicDir, { recursive: true });
  
      await fs.writeFile(path.join(publicDir, "theme-variables.css"), themeCss, "utf-8");
      await fs.writeFile(path.join(publicDir, "admin-theme.css"), adminCss, "utf-8");
  
      payload.logger.info("✅ Compiled and saved static theme CSS files successfully.");
  
      // Revalidate layout
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/", "layout");
    } catch (err) {
      payload.logger.error({ msg: "❌ Failed to save compiled theme CSS files", err });
    }
    return doc;
  };
  ```

- [ ] **Step 4: Attach Hooks in Schema Config**
  Attach `sanitizeThemeInput` and `syncTheme` inside `src/globals/ThemeSettings/config.ts`.
  
  ```typescript
  // Modify src/globals/ThemeSettings/config.ts
  // Add imports:
  import { sanitizeThemeInput, syncTheme } from "./hooks/syncTheme";
  
  // Inside ThemeSettings GlobalConfig object:
  hooks: {
    beforeChange: [sanitizeThemeInput],
    afterChange: [syncTheme],
  },
  ```

- [ ] **Step 5: Test Hooks compilation**
  Run: `npx tsc --noEmit`
  Expected: Successful compilation, no syntax errors.

- [ ] **Step 6: Commit**
  ```bash
  git add src/globals/ThemeSettings/hooks src/globals/ThemeSettings/config.ts
  git commit -m "feat: implement hook compilers for CSS variables"
  ```

---

### Task 5: Next.js Layout & Payload Admin Integration

**Files:**
- Modify: `src/app/(frontend)/layout.tsx`
- Modify: `src/payload.config.ts`

- [ ] **Step 1: Integrate dynamic assets in root Layout**
  Retrieve the theme global, preconnect to Google Fonts, load fonts dynamically, inject `theme-variables.css`, and map font family variables.
  
  ```tsx
  // Modify src/app/(frontend)/layout.tsx
  // Add import:
  import { getPayload } from "payload";
  import config from "@/payload.config";
  
  // Replace current layout implementation body:
  export default async function FrontendLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    let measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
    let sansFont = "Public Sans";
    let serifFont = "Playfair Display";
  
    try {
      const payload = await getPayload({ config });
      
      // Fetch GA4 Settings
      const ga4 = await payload.findGlobal({
        slug: "ga4",
        depth: 0,
      });
      if (ga4?.measurementId) {
        measurementId = ga4.measurementId;
      }
  
      // Fetch Theme Settings
      const theme = await payload.findGlobal({
        slug: "theme-settings",
        depth: 0,
      });
      if (theme?.sansFont) sansFont = theme.sansFont;
      if (theme?.serifFont) serifFont = theme.serifFont;
    } catch (error) {
      console.error("Failed to load settings from DB:", error);
    }
  
    const sansFontSafe = sansFont.replace(/ /g, "+");
    const serifFontSafe = serifFont.replace(/ /g, "+");
  
    return (
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link 
            rel="stylesheet" 
            href={`https://fonts.googleapis.com/css2?family=${sansFontSafe}:wght@400;600;700&family=${serifFontSafe}:wght@400;700&display=swap`} 
          />
          <link rel="stylesheet" href="/theme-variables.css" />
          <style id="dynamic-font-families">
            {`
              :root {
                --font-sans: "${sansFont}", sans-serif;
                --font-serif: "${serifFont}", serif;
              }
            `}
          </style>
        </head>
        <body
          className="antialiased min-h-screen flex flex-col font-sans"
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense fallback={null}>
              <GoogleAnalyticsTracker measurementId={measurementId} />
            </Suspense>
            <DisclaimerModal />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    );
  }
  ```

- [ ] **Step 2: Inject admin stylesheet in payload.config.ts**
  Inject `/public/admin-theme.css` cleanly into Payload config using standard CSS configurations.
  
  ```typescript
  // Modify src/payload.config.ts
  // Inside buildConfig structure under the admin property:
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    css: path.resolve(dirname, "../public/admin-theme.css"), // Injected stylesheet
    // ...
  }
  ```

- [ ] **Step 3: Test compilation**
  Run: `npx tsc --noEmit`
  Expected: Successful compilation, no syntax errors.

- [ ] **Step 4: Commit layout changes**
  ```bash
  git add src/app/\(frontend\)/layout.tsx src/payload.config.ts
  git commit -m "feat: inject dynamic fonts and static theme styles in layout and config"
  ```

---

### Task 6: Testing & Verification

**Files:**
- Run verification tasks in the terminal
- Verify file generation and UI skin updates

- [ ] **Step 1: Initialize database default values**
  Log into the CMS dashboard `/admin/globals/theme-settings`, select the `"Chambers Classic (Deep Navy & Subtle Gold)"` preset, and click Save.
  
- [ ] **Step 2: Verify CSS files generation**
  Check that the files exist in the `public` directory:
  Run: `ls -la public/theme-variables.css public/admin-theme.css`
  Expected: Both files exist and contain compiling values.

- [ ] **Step 3: Verify dynamic loading of Google Fonts**
  Open the browser, load the home page, inspect the head element, and confirm that `<link>` tags exist and Google Fonts are fetched successfully.

- [ ] **Step 4: Commit and finalize**
  ```bash
  git status
  ```
  Expected: Worktree completely clean.
