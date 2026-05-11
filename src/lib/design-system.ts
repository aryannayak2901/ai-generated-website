/**
 * Design System Exports
 * Central source of truth for design tokens, colors, spacing, and styling utilities
 * Used throughout the application for consistent styling
 */

// Color Palette
export const colors = {
  charcoal: {
    primary: "#1a1a1a",
    50: "#f5f5f5",
    100: "#e7e7e7",
    200: "#d3d3d3",
    300: "#b3b3b3",
    400: "#808080",
    500: "#4d4d4d",
    600: "#262626",
    700: "#1a1a1a",
    800: "#0d0d0d",
    900: "#000000",
  },
  slate: {
    dark: "#0f172a",
    primary: "#2d3748",
    secondary: "#64748b",
    light: "#f7fafc",
  },
  teal: {
    primary: "#0891b2",
    light: "#06b6d4",
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },
  white: "#ffffff",
  semantic: {
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  },
};

// Spacing Scale
export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
  "4xl": "96px",
};

// Border Radius
export const borderRadius = {
  sm: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
};

// Shadows
export const shadows = {
  sm: "0 1px 2px rgba(0,0,0,0.05)",
  md: "0 4px 6px rgba(0,0,0,0.1)",
  lg: "0 10px 15px rgba(0,0,0,0.1)",
  hover: "0 20px 25px rgba(0,0,0,0.15)",
};

// Transitions
export const transitions = {
  fast: "0.2s ease",
  base: "0.3s ease-in-out",
  slow: "0.5s ease-in-out",
};

// Typography
export const typography = {
  fontFamily: {
    sans: '"Geist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    serif: '"Playfair Display", ui-serif, Georgia, serif',
  },
  fontWeights: {
    regular: 400,
    semibold: 600,
    bold: 700,
  },
  fontSize: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "32px",
    "4xl": "48px",
  },
  lineHeight: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.8,
  },
};

// Component Defaults
export const components = {
  button: {
    borderRadius: borderRadius.sm,
    transition: transitions.fast,
    padding: {
      sm: `${spacing.sm} ${spacing.md}`,
      md: `${spacing.md} ${spacing.lg}`,
      lg: `${spacing.lg} ${spacing.xl}`,
    },
  },
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    boxShadow: shadows.md,
  },
  input: {
    borderRadius: borderRadius.md,
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: typography.fontSize.base,
  },
};

// Z-index scale
export const zIndex = {
  dropdown: 1000,
  sticky: 500,
  fixed: 1000,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};
