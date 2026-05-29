# Chambers of Jeet Bhatt: Comprehensive Modern System Design Spec

**Date:** May 6, 2026  
**Status:** Design Approved  
**Approach:** Comprehensive Modern System Redesign  
**Primary Goal:** Brand Presence with Modern & Animated Experience

---

## 1. Design System Foundation

### 1.1 Color Palette

| Role                        | Color         | Hex     | Usage                                    |
| --------------------------- | ------------- | ------- | ---------------------------------------- |
| **Primary Background**      | Deep Charcoal | #1a1a1a | Page backgrounds, dark sections          |
| **Secondary Background**    | Dark Slate    | #0f172a | Alternate sections, cards on dark        |
| **Surface/Card Background** | Light Gray    | #f7fafc | Card backgrounds, light sections         |
| **Primary Text**            | Slate Gray    | #2d3748 | Body text, primary readability           |
| **Secondary Text**          | Light Slate   | #64748b | Supporting text, metadata                |
| **Accent/Primary CTA**      | Teal          | #0891b2 | Buttons, hover states, highlights, links |
| **Accent Light**            | Teal Light    | #06b6d4 | Hover overlays, accents                  |
| **White**                   | Pure White    | #ffffff | Text on dark, high contrast              |
| **Semantic Success**        | Green         | #10b981 | Success messages, checkmarks             |
| **Semantic Warning**        | Amber         | #f59e0b | Warnings, alerts                         |
| **Semantic Error**          | Red           | #ef4444 | Errors, destructive actions              |

### 1.2 Typography

**Font Family:**

- **UI/Body:** Geist Sans (system: Inter, -apple-system, sans-serif)
- **Headings:** Geist Sans Bold
- **Premium Accents:** Optional serif (Playfair Display) for firm name/section titles

**Scale & Hierarchy:**

- **Display (h1):** 52px / 64px (desktop), 36px / 48px (tablet), 28px / 36px (mobile) | Bold | 110% line-height
- **Heading 2 (h2):** 36px / 48px (desktop), 28px / 36px (tablet), 24px / 32px (mobile) | Bold | 120% line-height
- **Heading 3 (h3):** 24px / 32px (desktop), 20px / 28px (tablet), 18px / 24px (mobile) | Semibold | 130% line-height
- **Body/Paragraph:** 16px / 24px (desktop), 14px / 20px (mobile) | Regular | 150% line-height
- **Small/Caption:** 12px / 16px | Regular | 140% line-height
- **Label/Tag:** 12px / 16px | Semibold | 140% line-height

**Letter Spacing:**

- Headings: -0.5px (tight for authority)
- Body: 0px (natural)
- Labels: 0.5px (slightly spaced)

### 1.3 Spacing & Grid System

**Base Unit:** 8px

**Spacing Scale:**

- xs: 4px (micro-spacing)
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px
- 4xl: 96px

**Responsive Breakpoints (Mobile-First):**

- Mobile: base (< 640px)
- Tablet: sm (640px+)
- Desktop: md (768px+)
- Wide: lg (1024px+)
- Ultra-wide: xl (1280px+)

**Container:**

- Max-width: 1280px on lg+ screens
- Padding: 24px (mobile), 32px (tablet), 48px (desktop)

### 1.4 Component Spacing & Corners

- **Border Radius:** 4px (buttons), 6px (input fields), 8px (cards), 12px (large cards/modals)
- **Shadows:**
  - sm: 0 1px 2px rgba(0,0,0,0.05)
  - md: 0 4px 6px rgba(0,0,0,0.1)
  - lg: 0 10px 15px rgba(0,0,0,0.1)
  - hover: 0 20px 25px rgba(0,0,0,0.15)

---

## 2. Component Library

### 2.1 Navigation Bar

- **Layout:** Flex horizontal, sticky on scroll
- **Background:** Deep Charcoal (#1a1a1a) with subtle bottom border (1px, rgba(8,145,178,0.1))
- **Content:** Logo/Brand left, nav links center, Contact CTA button right
- **Mobile:** Hamburger menu, nav links stack vertical in drawer
- **Hover State:** Link text color shifts to Teal, smooth 0.3s transition
- **Z-index:** 40 (stays above content on scroll)

### 2.2 Buttons

**Primary Button (CTA):**

- Background: Teal (#0891b2)
- Text: White, bold, 14px
- Padding: 12px 24px
- Border-radius: 4px
- Hover: Background → lighter Teal (#06b6d4), scale 1.02
- Active: Background darker, scale 0.98
- Transition: 0.2s ease

**Secondary Button:**

- Background: Transparent
- Border: 1px solid Teal (#0891b2)
- Text: Teal, bold
- Padding: 12px 24px
- Hover: Background light Slate (#f7fafc)
- Transition: 0.2s ease

**Ghost Button:**

- Background: Transparent
- Border: none
- Text: Slate Gray or Teal
- Padding: 12px 24px
- Underline on hover

### 2.3 Cards

- **Background:** Light Gray (#f7fafc) or White
- **Border:** 1px solid rgba(0,0,0,0.1) OR no border with shadow
- **Padding:** 24px
- **Border-radius:** 8px
- **Hover:**
  - Scale: 1.02 (subtle)
  - Shadow: lg (20px 25px)
  - Border/Accent: Teal glow (if accent version)
  - Transition: 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)

### 2.4 Form Inputs

- **Background:** White
- **Border:** 1px solid #e2e8f0 (light slate)
- **Padding:** 12px 16px
- **Font:** 16px, Slate Gray
- **Border-radius:** 6px
- **Focus State:** Border → Teal (#0891b2), box-shadow: 0 0 0 3px rgba(8,145,178,0.1)
- **Error State:** Border → Red (#ef4444), helper text in red below field
- **Label:** 12px semibold, Slate Gray, 8px margin below input

### 2.5 Links

- **Color:** Teal (#0891b2)
- **Underline:** None (by default)
- **Hover:** Underline appears (2px solid Teal), color → lighter Teal
- **Transition:** 0.2s ease

### 2.6 Badge/Tag

- **Background:** Light Gray (#f7fafc) or color-specific (e.g., teal tint)
- **Text:** 12px semibold, Slate Gray or Teal
- **Padding:** 4px 12px
- **Border-radius:** 12px (pill-shaped)
- **Border:** None or subtle

### 2.7 Divider

- **Color:** rgba(0,0,0,0.1) or Teal accent (rgba(8,145,178,0.2))
- **Height:** 1px
- **Margin:** 24px vertical, 0 horizontal

---

## 3. Page Architecture & Layouts

### 3.1 Homepage (/)

**Hero Section:**

- **Background:** Deep Charcoal (#1a1a1a) with optional gradient to Dark Slate
- **Content:**
  - Teal accent bar (4px width) on left side, full height
  - Headline (h1): "Premium Legal Expertise" or similar, White text
  - Subheading: Description, Light Slate text
  - CTA Button: "Get In Touch" in Teal
- **Animations:** Fade-in on load (0.8s), headline slides from left, subheading slides from right with stagger
- **Height:** 60-70vh minimum

**Practice Areas Showcase:**

- **Layout:** 3-column grid (1 column mobile, 2 tablet, 3 desktop)
- **Cards:** Title, icon, description, "Learn More" link
- **Hover:** Border → Teal accent, subtle scale 1.02, shadow elevation
- **Animations:** Staggered fade-in + slide-up as user scrolls into section
- **Spacing:** lg gap between cards (24px), max-width 1280px container

**Team Preview Section:**

- **Layout:** Horizontal scroll carousel or grid (4 visible items desktop, 1-2 mobile)
- **Cards:** Profile image (circular or rounded square), name, title/role, specialty tags
- **Hover:** Image zoom slightly, overlay with bio snippet + link to full profile
- **Animations:** Fade-in on scroll, items appear staggered

**Offices Section:**

- **Layout:** Interactive map or grid of office locations
- **Elements:** Location name, address, phone, "View Details" CTA
- **Interaction:** Click to open side panel or modal with full office info
- **Animation:** Fade-in, slight slide from bottom

**Call-to-Action Section:**

- **Layout:** Full-width dark background with centered text + button
- **Content:** Heading, supporting text, CTA button (Teal)
- **Background:** Dark Slate (#0f172a) or gradient
- **Animation:** Fade-in on scroll, button has pulsing subtle glow on load

### 3.2 Practice Areas Pages (/practice-areas/[slug])

**Hero Section:**

- **Background:** Gradient (Deep Charcoal → Dark Slate)
- **Content:** Practice area name (h1), Teal accent bar on left, brief description
- **Animation:** Fade-in + slide from left

**Content Sections:**

- **Layout:** Alternating text (left) / image (right) blocks
- **Animation:** Staggered scroll triggers—text slides from left, image fades in
- **Spacing:** Large vertical spacing (48px-64px) between sections

**Related Practice Areas:**

- **Layout:** 3-column grid cards at bottom
- **Content:** Practice area card with icon, title, brief description, "Explore" link
- **Hover:** Scale, shadow, Teal accent border
- **Animation:** Fade-in + slide-up staggered

**Contact CTA:**

- **Layout:** Full-width section with dark background, centered heading + button
- **Animation:** Fade-in on scroll

### 3.3 Team Pages (/team, /team/[member-id])

**Team Grid Page:**

- **Layout:** Grid (2 columns tablet, 3-4 columns desktop)
- **Cards:** Profile image, name, title, specialty badges
- **Hover:** Image overlaid with small bio, "View Profile" button fades in
- **Animation:** Cards fade-in + slide-up staggered as user scrolls

**Individual Team Member Profile:**

- **Hero Section:** Large image on left (or full-width on mobile), name/title on right
- **Content Sections:**
  - Bio/About
  - Areas of Focus (badge list)
  - Experience highlights
  - Contact CTA button (Teal)
- **Animation:** Fade-in on load, content slides from right with image

### 3.4 Blog Pages (/blog)

**Blog Hero:**

- **Background:** Deep Charcoal with Teal accent bar
- **Content:** "Blog & Insights", description
- **Filters:** Category/tag pills with Teal background on active selection
- **Animation:** Fade-in on load

**Blog Grid:**

- **Layout:** 2-column desktop, 1 column mobile
- **Cards:** Featured image, category badge, title, excerpt, author, read time, publish date
- **Hover:** Image zoom slightly, card shadow elevate, "Read More" link highlighted in Teal
- **Animation:** Cards fade-in + slide-up staggered on scroll

**Individual Blog Post:**

- **Hero:** Featured image full-width, title overlay bottom-left, category badge
- **Content:** Article text with proper typography hierarchy
- **Sidebar (desktop):** Table of contents, related articles, newsletter signup
- **Animation:** Fade-in on load, text content slides from left

### 3.5 Offices Pages (/offices)

**Offices Grid:**

- **Layout:** Grid of office cards (2 desktop, 1 mobile)
- **Cards:** Office name, address, phone, team members count, "View Details" CTA
- **Hover:** Card elevate, Teal accent border, CTA button highlights
- **Animation:** Cards fade-in + slide-up on scroll

**Individual Office Details:**

- **Map Section:** Interactive map (embed or custom)
- **Contact Info:** Full address, phone, email, office hours
- **Team:** Team members based in this office
- **Amenities/Highlights:** Key info about office
- **CTA:** "Schedule a Visit" or "Get Directions" button
- **Animation:** Sections fade-in on load

### 3.6 About Page (/about)

**Hero Section:** Title, Teal accent bar, description
**About Firm:** Full-width text content with proper spacing
**Values Section:** Grid of value cards (icon, title, description)
**History Timeline:** Visual timeline of firm milestones
**Team Showcase:** Grid of team members with roles
**CTA Section:** End with "Let's Work Together" button

---

## 4. Global Components

### 4.1 Header/Navigation

(See Component Library Section 2.1)

### 4.2 Footer

- **Background:** Deep Charcoal (#1a1a1a)
- **Layout:** 4-5 column grid on desktop, stacked on mobile
- **Columns:**
  - Logo/About (brief description)
  - Practice Areas (links)
  - About/Resources (links)
  - Contact Info (address, phone, email)
  - Newsletter/CTA
- **Text Color:** Light Slate
- **Links:** Teal on hover with underline
- **Bottom Bar:** Copyright, social links (icons with Teal fill on hover)
- **Padding:** lg (48px vertical, 32px horizontal on desktop)

### 4.3 Forms (Contact, Newsletter)

- **Fields:** Text input, email, textarea with proper labels
- **Validation:** Real-time, error messages in red below field
- **Button:** Teal primary button
- **Success State:** Green success message with checkmark

### 4.4 Modals/Dialogs

- **Overlay:** Semi-transparent dark (rgba(0,0,0,0.5))
- **Modal Body:** White or Light Gray background, rounded corners 8px
- **Close Button:** Top-right, icon or X
- **Content:** Proper spacing, clear hierarchy
- **Animation:** Fade-in overlay + scale modal up (0.3s)

### 4.5 Breadcrumbs (for internal navigation)

- **Format:** Home > Parent > Current
- **Styling:** Small text, Teal links on hover
- **Separator:** "/" or ">" character in Light Slate

---

## 5. Animations & Interactions Strategy

### 5.1 Entrance Animations (on page load)

- **Hero Headline:** Fade-in + slide from left (0.6s)
- **Hero Subheading:** Fade-in + slide from right (0.8s, staggered)
- **Hero CTA Button:** Fade-in + scale up (1s, staggered)
- **Cards/Content:** Default fade-in (0.5s) if not scroll-triggered

### 5.2 Scroll Animations (using Framer Motion or GSAP ScrollTrigger)

- **Cards entering viewport:** Fade-in + slide up (0.5s)
- **Stagger effect:** Each card in grid staggered by 100-150ms
- **Parallax on images:** Slight upward movement as user scrolls (parallax factor 0.5)
- **Section headings:** Fade-in + slide from left when scrolled into view
- **Text content:** Lines or blocks fade-in + slide from side as scrolled into view

### 5.3 Hover/Interaction Animations

- **Buttons:** Scale 1.02 on hover, 0.2s ease
- **Links:** Color → Teal, underline appears, 0.2s ease
- **Cards:**
  - Scale 1.02 on hover
  - Shadow elevation (sm → lg)
  - Border accent → Teal (if applicable)
  - Transition: 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
- **Inputs on focus:** Border → Teal, glow box-shadow, 0.2s ease
- **Images on hover:** Slight zoom (1.05 scale), 0.3s ease

### 5.4 Page Transitions

- **Between pages:** Fade-out current page (0.2s), fade-in new page (0.3s)
- **Optional:** Route-based slide transitions (next page slides in from right, previous page slides out left)

### 5.5 Micro-interactions

- **Button click:** Ripple effect (small radial expand, fade) or scale-down feedback
- **Form field error:** Shake animation (left-right 2x, 0.3s total)
- **Success toast:** Slide-in from top, auto-dismiss after 3s
- **Loading state:** Spinner (rotating circle) or skeleton loaders on content blocks

### 5.6 Easing Functions

- **Standard transitions:** cubic-bezier(0.25, 0.46, 0.45, 0.94)
- **Entrance animations:** ease-out
- **Hover/interaction:** ease-in-out
- **Exit animations:** ease-in

---

## 6. Technical Implementation Approach

### 6.1 Tech Stack (Confirmed)

- **Framework:** Next.js 16
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4
- **Animation Libraries:**
  - Framer Motion v12 (component-level animations)
  - GSAP v3.15 (scroll animations, advanced timelines)
- **Forms:** React Hook Form
- **CMS:** Payload CMS v3.24
- **Database:** MongoDB
- **Components:** shadcn/ui (already integrated)

### 6.2 File Structure for Design System

```
src/
  styles/
    globals.css          # Design tokens, CSS variables
    theme.css           # Color palette, typography
  components/
    ui/                 # Redesigned component library
      Button.tsx        # Primary, secondary, ghost variants
      Card.tsx          # Updated card component
      Input.tsx         # Form inputs with new styling
      Badge.tsx         # Tags/badges
      ...
    layout/
      Header.tsx        # Redesigned navbar
      Footer.tsx        # Redesigned footer
      Breadcrumbs.tsx   # Navigation aid
    animations/
      ScrollReveal.tsx  # Reusable scroll animation wrapper
      FadeInOnScroll.tsx
      StaggerContainer.tsx
  lib/
    animations.ts       # Framer Motion variants, GSAP configs
    constants.ts        # Updated color/spacing constants
```

### 6.3 Tailwind Configuration Updates

- Extend colors with custom palette (charcoal, teal, etc.)
- Extend spacing scale
- Add custom animation definitions (fade-in, slide-up, etc.)
- Safe-area insets for mobile devices

### 6.4 Implementation Phases

**Phase 1: Design System & Foundation (Week 1)**

- Update Tailwind config with new colors, spacing, typography
- Rebuild component library (buttons, cards, inputs, badges, etc.)
- Update globals.css and theme tokens
- Create reusable animation components (ScrollReveal, FadeInOnScroll)

**Phase 2: Global Components (Week 1-2)**

- Redesign Header/Navbar
- Redesign Footer
- Update Forms with new styling
- Create/update modals and dialogs

**Phase 3: Homepage Modernization (Week 2)**

- Rebuild hero section with teal accent bar
- Redesign practice areas showcase with scroll animations
- Update team preview carousel
- Modernize offices section
- Add CTA sections with animations

**Phase 4: Practice Areas Pages (Week 2-3)**

- Update heroes with new design
- Implement alternating content + scroll animations
- Redesign related practice areas cards
- Add content animations

**Phase 5: Team Pages (Week 3)**

- Rebuild team grid with new card design
- Redesign individual member profiles
- Add hover interactions and animations

**Phase 6: Blog Section (Week 3-4)**

- Redesign blog grid
- Update article layout
- Implement scroll animations on cards
- Add blog post layout with sidebar

**Phase 7: Other Pages (Week 4)**

- Offices page modernization
- About page redesign
- Contact page updates

**Phase 8: Polish & Testing (Week 4)**

- Cross-browser testing
- Mobile responsiveness verification
- Animation performance tuning
- Accessibility review (a11y)
- Final quality assurance

---

## 7. Acceptance Criteria

✓ All pages use new charcoal + teal color system  
✓ Typography hierarchy matches spec  
✓ All cards, buttons, inputs follow component library  
✓ Scroll animations implemented on all major sections  
✓ Hover states working smoothly (0.2s-0.3s transitions)  
✓ Mobile responsive (tested on 375px, 768px, 1024px, 1280px+)  
✓ Navigation sticky on scroll  
✓ Forms fully functional with validation & success states  
✓ Page transitions smooth and consistent  
✓ Animations performance: 60fps on modern devices  
✓ Accessibility: WCAG 2.1 AA (color contrast, keyboard nav, ARIA labels)  
✓ All internal links working, no 404s  
✓ CMS-driven content renders correctly in new layouts

---

## 8. Success Metrics

- **Visual Cohesion:** Every page feels part of one unified modern system
- **Brand Impact:** First-time visitors immediately perceive premium, modern law firm
- **Engagement:** Smooth animations and interactions encourage exploration
- **Mobile Experience:** Fully responsive, touch-friendly, fast-loading
- **Conversion:** Clear CTAs, easy navigation to contact/inquiry forms
- **Performance:** Animations are smooth (60fps), no janky scrolling or layout shifts

---

## Revision History

| Date        | Version | Changes                                           |
| ----------- | ------- | ------------------------------------------------- |
| May 6, 2026 | 1.0     | Initial comprehensive modernization spec approved |
