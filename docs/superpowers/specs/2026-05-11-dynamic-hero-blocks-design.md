# Dynamic Hero Blocks Design Spec

## Overview
This document outlines the architecture for implementing dynamic, page-specific hero sections across the Chambers of Jeet Bhatt portfolio. To support bespoke, high-end hero sections for different pages (Home, About, Practice Areas, etc.), we will implement a Payload CMS-driven architecture using flexible Hero Blocks.

## Architecture

### 1. Payload CMS (Backend)
We will introduce a `Hero` block to the Payload CMS block system, available to the `pages` collection layout array. This block will act as the primary configuration layer for the hero section of any given page.

**Schema Definition (`HeroBlock`):**
- `layoutType` (Select): `split`, `centered`, `asymmetric`.
- `heading` (Text/RichText): The primary authoritative statement (Playfair Display).
- `subheading` (Text/RichText): Secondary contextual text.
- `media` (Upload -> relationTo: 'media'): Background or side image.
- `ctas` (Array):
  - `label` (Text)
  - `link` (Text/Relationship)
  - `style` (Select: `primary`, `secondary`, `ghost`)

### 2. Frontend Architecture (Next.js)
The frontend will dynamically render the appropriate hero style based on the CMS data.

**Component Structure:**
- `HeroBlockRenderer` (Server Component): Receives the block data from Payload and dynamically routes to the correct visual component based on `layoutType`.
- `HeroSplit` (Client Component): Renders the 'Classic Split Layout' with text on the left and imagery on the right.
- `HeroCentered` (Client Component): Renders the 'Centered Typographic Focus' with bold, centered text and a floating CTA.
- `HeroAsymmetric` (Client Component): Renders the 'Asymmetric Glassmorphism' layout with a full background and frosted glass card.

### 3. Styling & Animation (UI/UX)
Adhering to `frontend-design-rule.md`:
- **Colors**: Deep Navy, Subtle Gold, Stark White.
- **Typography**: Playfair Display (headings), Public/Geist Sans (UI).
- **Glassmorphism**: Utilize `backdrop-blur` for cards in the Asymmetric layout and floating CTAs.
- **Animations**:
  - Integrate Framer Motion for staggered entrance reveals (fade-up text/CTAs).
  - Integrate GSAP for scroll-triggered parallax effects on background media.
  
## Data Flow
1. Content editor selects a `Hero` block in Payload and chooses a `layoutType`.
2. Next.js fetches the page data (via `getPayload`).
3. `RenderBlocks` passes the block data to `HeroBlockRenderer`.
4. `HeroBlockRenderer` checks the `layoutType` and instantiates `<HeroSplit />`, `<HeroCentered />`, or `<HeroAsymmetric />` passing the necessary props (`heading`, `media`, `ctas`).

## Error Handling & Fallbacks
- If `layoutType` is undefined or unrecognized, gracefully default to `<HeroCentered />`.
- If `media` is missing, apply a gradient Deep Navy background as a fallback.

## Implementation Scope
This design is self-contained and focuses solely on the creation of the `HeroBlock` in Payload, the corresponding React components, and their integration into the existing Next.js page rendering loop.
