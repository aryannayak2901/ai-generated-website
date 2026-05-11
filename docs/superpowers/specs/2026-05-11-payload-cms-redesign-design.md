# Payload CMS Redesign Specification

## Overview
The goal of this project is to modernize the Payload CMS administrative interface for the "Chambers of Jeet Bhatt" application. The redesign will transition the default Payload interface into a "Premium Editorial Dashboard" that aligns with the frontend's aesthetic: Deep Navy, Subtle Gold, and high-contrast Playfair Display typography.

## Architecture & Integration
The redesign will be implemented using a **Global CSS Theme Override** strategy. This minimizes maintenance overhead while maximizing visual impact.

1. **CSS Injection:** 
   - A new SCSS/CSS file (e.g., `src/styles/payload-theme.scss`) will be created to house the theme overrides.
   - This file will be injected globally into the Payload admin panel via the `admin.css` configuration property or imported globally in the root layout if using Payload 3 Next.js integration.
   
2. **Variable Overriding:** 
   - We will target and override Payload's native CSS variables (e.g., `--theme-bg`, `--theme-text`, `--theme-elevation-150`) to map to our specific design tokens. This ensures that all built-in Payload views automatically inherit the new theme.

## Custom Components
We will update the existing custom React components registered in `payload.config.ts` to reflect the new premium aesthetic.

1. **`BeforeLogin` Component:**
   - **Background:** Deep navy background with subtle visual depth (e.g., dark gradient or background blur).
   - **Container:** An elegant, centered login box with subtle glassmorphism or gold border accents.
   - **Typography:** Use Playfair Display for the main welcome heading to convey authority.

2. **`Logo` & `Icon` Components:**
   - Ensure the logo components utilize the high-resolution brand logo.
   - Scale appropriately to fit within the new dark navy sidebar header area.

## Theme Application Details
The CSS override will implement the following specific design choices:

- **Colors:**
  - **Base Backgrounds:** The main dashboard background and the sidebar will utilize the deep navy palette (e.g., `#0A1128` or matching DESIGN.md token).
  - **Cards & Elevated Elements:** Inputs, cards, and dropdowns will use slightly lighter navy tones to create visual separation and hierarchy.
  - **Accents:** Active states, buttons, and focus outlines will use the subtle gold/brass accent color.
- **Typography:**
  - **Headings:** The `font-family` for major section titles, collection headers, and the login screen will be forced to `Playfair Display, serif`.
  - **Body / Functional UI:** Table data, input fields, and standard UI text will use `Public Sans, sans-serif` (or `Geist Sans`) for high readability and functional clarity.
