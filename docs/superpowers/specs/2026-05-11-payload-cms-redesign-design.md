# Payload CMS Admin Redesign Specification

## 1. Overview
This project aims to transform the native Payload CMS Admin panel into a modern, user-friendly, and attractive interface that aligns with the "Chambers of Jeet Bhatt" premium brand. The redesign focuses purely on visual presentation (CSS and presentational component injection), ensuring that all underlying Payload functionality (authentication, data modeling, table sorting, document saving) remains 100% native and intact.

## 2. Architecture & Approach
The modernization leverages Payload's native customization API:
- **Global CSS Injection (`admin.css`)**: Overriding Payload's SCSS variables to apply the firm's specific colors, typography, and styling nuances.
- **Component Injection (`admin.components`)**: Injecting custom React components into specific slots (like Logo, Icon, and BeforeLogin) to introduce high-end branded elements without breaking core logic.

## 3. Visual Implementation
The UI will adopt the firm's authoritative and premium aesthetic defined in the design system:
- **Color Palette**:
  - Backgrounds & Major Surfaces: Deep Navy (`#0f1729`)
  - Text & Accents: Stark White (`#ffffff`) and Subtle Gold (`#d4af37`) for active states and primary buttons.
- **Typography**:
  - Headings & Titles: Playfair Display
  - Body & Table Data: Public Sans (or Geist Sans)
- **Styling Details**:
  - Whisper-soft shadows (`box-shadow`) applied to cards and modals.
  - Gently rounded corners (`border-radius: 6px` or `8px`) for all buttons, inputs, and list items.
  - High-contrast form fields with dark backgrounds and gold focus rings.

## 4. Component Overrides
We will customize the following specific structural components in `payload.config.ts`:
- **`graphics.Logo` & `graphics.Icon`**: Replaced with the firm's official branding. The Icon appears in the sidebar; the Logo appears on the login screen.
- **`beforeLogin` (Auth Screen Upgrade)**: Inject a custom React component rendering above the native Payload login form. This component will feature a high-end graphic or firm welcome message. The login form itself will be styled via the global CSS overrides, creating a seamless, custom-built feel while retaining native security and logic.

## 5. Scope & Constraints
- **Out of Scope**: We will **not** rebuild the entire dashboard from scratch or alter the functional logic of the tables, lists, or authentication flows.
- **Maintenance**: By relying on CSS variable overrides and standard component slots, the redesign remains robust against future Payload CMS version updates.
