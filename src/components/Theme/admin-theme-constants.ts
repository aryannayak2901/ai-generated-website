/**
 * Admin-specific color mappings for Payload CMS theming.
 * Smaller palette than frontend (12 colors vs 19).
 * CamelCase naming matches theme-presets.ts for automatic mapping.
 */

export const ADMIN_THEME_CONFIG = {
  colors: [
    {
      var: "--admin-bg",
      name: "adminBg",
      label: "Admin Background",
      description: "Main admin panel background surface",
    },
    {
      var: "--admin-fg",
      name: "adminFg",
      label: "Admin Text Color",
      description: "Primary text and icons in the admin panel",
    },
    {
      var: "--admin-primary",
      name: "adminPrimary",
      label: "Admin Primary Action",
      description: "Primary buttons, active states, and highlights",
    },
    {
      var: "--admin-primary-fg",
      name: "adminPrimaryFg",
      label: "Admin Primary Text",
      description: "Text/icons displayed on top of primary elements",
    },
    {
      var: "--admin-secondary",
      name: "adminSecondary",
      label: "Admin Secondary Surface",
      description: "Sidebar, headers, and auxiliary surfaces",
    },
    {
      var: "--admin-secondary-fg",
      name: "adminSecondaryFg",
      label: "Admin Secondary Text",
      description: "Text and labels in secondary areas (e.g. sidebar)",
    },
    {
      var: "--admin-surface",
      name: "adminSurface",
      label: "Admin Card/Surface",
      description: "Cards, panels, popups, and modal dialogs",
    },
    {
      var: "--admin-surface-fg",
      name: "adminSurfaceFg",
      label: "Admin Surface Text",
      description: "Text and headers inside cards or modal panels",
    },
    {
      var: "--admin-accent",
      name: "adminAccent",
      label: "Admin Accent Color",
      description: "Selected inputs, focus rings, and secondary accents",
    },
    {
      var: "--admin-accent-fg",
      name: "adminAccentFg",
      label: "Admin Accent Text",
      description: "Text on accented UI components",
    },
    {
      var: "--admin-border",
      name: "adminBorder",
      label: "Admin Border Color",
      description: "Lines, input borders, and card separators",
    },
    {
      var: "--admin-muted",
      name: "adminMuted",
      label: "Admin Muted Color",
      description: "Disabled states, placeholder text, and subtle labels",
    },
  ],
  radius: {
    var: "--admin-radius",
    name: "adminRadius",
    label: "Admin Corner Radius (rem)",
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
 * Payload-specific CSS selectors to target for direct visual overrides if needed.
 * In addition to defining variables, we map them directly to Payload's native theme properties.
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
