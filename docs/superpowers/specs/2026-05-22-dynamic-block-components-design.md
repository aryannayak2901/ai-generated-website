# Design Specification: Dynamic Block Components Configuration & Mapping Alignment

**Date:** 2026-05-22  
**Topic:** Aligning Payload CMS block configurations with their frontend React components to make all component UIs fully dynamic and high-performing.  
**Approach Chosen:** Approach 1 (Bidirectional Schema & UI Alignment)

---

## 1. Goal Description

Currently, the Payload CMS block configurations (`src/blocks/`) and the React components (`src/components/`) in the Chambers of Jeet Bhatt codebase are misaligned. Some components completely ignore the Payload CMS block properties and render hardcoded placeholder layouts, while others fail to map dynamic fields correctly (such as rendering icons as strings, resulting in `null` renders). 

This design aligns both systems bidirectionally, updating the Payload configurations where fields are missing and updating frontend components where configurations are ignored, achieving a fully dynamic, custom-configured, premium user experience.

---

## 2. Component Design & Changes

### 2.1 Practice Areas Grid (`src/components/practice-areas/PracticeAreasGrid.tsx`)

#### Problem
*   `PracticeAreaCard` expects a React component (e.g. `LucideIcon`) as the `icon` prop.
*   `PracticeAreasGrid.tsx` maps dynamic areas by passing the `area.icon` string (e.g., `"Briefcase"`) directly to the card:
    ```typescript
    icon: area.icon && iconMap[area.icon] ? area.icon : "Briefcase",
    ```
*   This causes `PracticeAreaCard` to receive a string, which triggers `{typeof Icon === 'string' ? null : ...}` and renders **no icons at all** for dynamic and default areas.

#### Proposed Changes
*   Map the `icon` field to the actual LucideIcon component resolved from `iconMap` for both dynamic and default areas.
*   Ensure fallback works gracefully for all areas:
    ```typescript
    const activeAreas = payloadAreas && payloadAreas.length > 0
      ? payloadAreas.map((area, index) => ({
          id: `payload-area-${index}`,
          title: area.title,
          description: area.description || "",
          icon: area.icon && iconMap[area.icon] ? iconMap[area.icon] : iconMap.Briefcase,
          services: area.services ? area.services.map(s => s.name) : []
        }))
      : defaultAreas.map((area) => ({
          ...area,
          icon: iconMap[area.icon as keyof typeof iconMap] || iconMap.Briefcase,
        }));
    ```

---

### 2.2 Contact Info Section (`src/components/contact/ContactInfo.tsx` & `src/blocks/ContactBlocks.ts`)

#### Problem
*   `ContactBlocks.ts` defines the `ContactInfo` block schema with `infoItems` (array of `icon`, `title`, `value`, and `link`).
*   `ContactInfo.tsx` component ignores this completely, accepting props like `address`, `phone`, `email`, and `hours`, and hardcoding three cards with static fallbacks.

#### Proposed Changes
*   Update `ContactInfo.tsx` to support the `infoItems` array prop.
*   Implement dynamic card rendering. When `infoItems` is provided, iterate and render cards with resolved Lucide icons (`Phone`, `Mail`, `MapPin`, `Clock`).
*   Add a link wrapper (`a` tag) if a `link` property is present for the card.
*   Fall back to a beautiful default info list if no items are configured.
    ```typescript
    export interface ContactInfoProps {
      infoItems?: {
        icon: string;
        title: string;
        value: string;
        link?: string | null;
      }[] | null;
    }
    ```

---

### 2.3 Contact Form Section (`src/components/contact/ContactForm.tsx`)

#### Problem
*   The `ContactFormBlock` config defines `badge`, `title`, `subtitle`, and a `features` array.
*   The React component `ContactForm.tsx` accepts no props, hardcodes the form title/subtitle, and does not render the value-proposition features.

#### Proposed Changes
*   Add props to `ContactForm.tsx`:
    ```typescript
    export interface ContactFormProps {
      badge?: string | null;
      title?: string | null;
      subtitle?: string | null;
      features?: {
        icon: string;
        title: string;
        description?: string | null;
      }[] | null;
    }
    ```
*   Implement a **Premium Split Layout** if features are present:
    *   **Left Column (5 cols):** Badge, title, subtitle, and vertical list of value props with icons (`Clock`, `Users`, `ShieldCheck`).
    *   **Right Column (7 cols):** Form wrapped in a beautifully styled, high-end container.
*   If features are absent, fall back gracefully to the clean, centered single-column layout.

---

### 2.4 Contact Map Section (`src/components/contact/ContactMap.tsx`)

#### Problem
*   `ContactMap` block config has `mapUrl`, `locationTitle`, and `locationAddress`.
*   The `ContactMap.tsx` component ignores them and displays a grey mock placeholder card.

#### Proposed Changes
*   Update `ContactMap.tsx` to accept the block configuration fields:
    ```typescript
    export interface ContactMapProps {
      mapUrl?: string | null;
      locationTitle?: string | null;
      locationAddress?: string | null;
    }
    ```
*   Render an **interactive, premium, nested map layout**:
    *   **Main Iframe (8 cols):** Real interactive Google Maps iframe embedding the configured `mapUrl` (with absolute positioning and a clean layout).
    *   **Location Sidebar (4 cols):** Interactive pin icon, bold location title, formatted address block (supporting multi-line `whitespace-pre-line`), and a high-end "Get Directions" link.

---

### 2.5 Office Map Section (`src/components/offices/MapSection.tsx` & `src/blocks/OfficeBlocks.ts`)

#### Problem
*   `MapSection.tsx` has a completely hardcoded map placeholder and does not render a real map.
*   The `MapSection` block configuration in `OfficeBlocks.ts` lacks a `mapUrl` field.

#### Proposed Changes
*   Modify `OfficeBlocks.ts`: Add `mapUrl` (type `text`) to `MapSection` block configuration.
*   Update `MapSection.tsx` to accept `mapUrl`:
    *   Render a real iframe interactive map.
    *   Lay a **premium, floating glassmorphic overlay card** in the bottom-left corner of the map containing `mapOverlayTitle` and `mapOverlayDescription`.

---

### 2.6 Awards Marquee (`src/components/home/AwardsMarquee.tsx` & `src/blocks/AwardsMarquee.ts`)

#### Problem
*   `AwardsMarquee.ts` only defines `title`, `year`, and `organization` in its awards array.
*   The frontend marquee cards require an image and a description, which currently fallback to hardcoded unsplash images and empty descriptions.

#### Proposed Changes
*   Modify `src/blocks/AwardsMarquee.ts` to add `image` (upload relation to `media`) and `description` (textarea) fields inside the awards array.
*   Update `AwardsMarquee.tsx` mapping to feed these dynamic values directly to the sliding cards, with a fallback to the default styling assets.

---

### 2.7 Newsletter (`src/components/blog/Newsletter.tsx` & `src/blocks/BlogBlocks.ts`)

#### Problem
*   The component supports `badge` and `disclaimer` props but not `buttonText` (hardcoded).
*   The block config only supports `title`, `subtitle`, and `buttonText`.

#### Proposed Changes
*   Add `badge` (type `text`) and `disclaimer` (type `text`) to the `Newsletter` block config in `BlogBlocks.ts`.
*   Add `buttonText` to `NewsletterProps` in `Newsletter.tsx` and render it on the subscribe button.

---

### 2.8 About Core Values (`src/blocks/AboutValues.ts` & `src/components/about/AboutValues.tsx`)

#### Problem
*   Select options in `AboutValues.ts` (`['Scale', 'Shield', 'Target', 'Users', 'Award', 'Handshake']`) do not match keys in `AboutValues.tsx` `iconMap` (e.g. it maps `ShieldCheck`, which causes selected options like `'Shield'` to fail and default).

#### Proposed Changes
*   Align the options in `AboutValues.ts` with the keys in the frontend:
    `options: ['Scale', 'ShieldCheck', 'Award', 'Handshake', 'Gavel', 'Building2']`.

---

## 3. Verification Plan

### 3.1 Automated Build Check
- Run compilation check: `npm run build` or similar compilation validation in Next.js to ensure no TypeScript or compile errors.

### 3.2 Visual & Functional Testing
- Check and verify that icons are rendering correctly in the Practice Areas grid.
- Verify that Contact info cards render from the dynamic array.
- Verify the premium double-column split layout for Contact Form.
- Verify that Google Maps embeds load and function within the Contact Map and Map Section.
