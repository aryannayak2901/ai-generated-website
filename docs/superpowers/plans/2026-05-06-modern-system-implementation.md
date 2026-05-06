# Chambers of Jeet Bhatt: Comprehensive Modern System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the law firm portfolio from its current classic aesthetic into a modern, animated corporate tech-forward brand system featuring charcoal/teal design, scroll animations, and premium interactions.

**Architecture:** Phase-based implementation starting with design system foundation, then rebuilding component library, then modernizing each page section systematically. Design tokens stored as CSS variables and Tailwind config extensions. Animations managed via Framer Motion and GSAP. All changes preserve Payload CMS integration.

**Tech Stack:**
- Next.js 16, React 19, Tailwind CSS v4
- Framer Motion v12 (component animations)
- GSAP v3.15 (scroll animations, timelines)
- shadcn/ui (component base)
- React Hook Form (forms)
- Payload CMS v3.24 (content)

**Duration:** 4 weeks (28 days) | **Effort:** High

---

## File Structure

### New Files to Create

**Design System & Tokens:**
- `src/styles/design-tokens.css` — CSS variables for colors, spacing, typography
- `src/lib/design-system.ts` — Exported constants and helper functions
- `src/lib/animations.ts` — Framer Motion variants, GSAP configurations
- `tailwind.config.extended.ts` — Extended color palette, spacing, animations

**Component Library:**
- `src/components/ui/Button.tsx` — Primary, secondary, ghost variants
- `src/components/ui/Card.tsx` — Updated card component with new styling
- `src/components/ui/Input.tsx` — Form inputs with teal focus states
- `src/components/ui/Badge.tsx` — Tags/badges with new colors
- `src/components/ui/Divider.tsx` — Divider component
- `src/components/layout/Header.tsx` — Redesigned sticky navigation
- `src/components/layout/Footer.tsx` — Redesigned footer with columns
- `src/components/layout/Breadcrumbs.tsx` — Breadcrumb navigation

**Animation Components:**
- `src/components/animations/ScrollReveal.tsx` — Reusable scroll trigger wrapper
- `src/components/animations/FadeInOnScroll.tsx` — Fade-in animation on scroll
- `src/components/animations/StaggerContainer.tsx` — Stagger children animations
- `src/components/animations/SlideInFromSide.tsx` — Slide animation variant

**Page Components (New/Redesigned):**
- `src/components/home/HeroSection.tsx` — New hero with teal accent bar
- `src/components/home/PracticeAreasShowcase.tsx` — 3-column grid with animations
- `src/components/home/TeamPreview.tsx` — Team carousel with hover effects
- `src/components/home/OfficesSection.tsx` — Interactive offices display
- `src/components/home/CTASection.tsx` — Full-width CTA sections
- `src/components/practice-areas/HeroSection.tsx` — Practice area page hero
- `src/components/practice-areas/ContentBlock.tsx` — Alternating text/image
- `src/components/practice-areas/RelatedAreas.tsx` — Related practice grid
- `src/components/team/TeamGrid.tsx` — Team member grid
- `src/components/team/TeamMemberProfile.tsx` — Individual profile page
- `src/components/blog/BlogHero.tsx` — Blog hero section
- `src/components/blog/BlogGrid.tsx` — Blog card grid
- `src/components/blog/BlogPost.tsx` — Individual blog post layout
- `src/components/offices/OfficesGrid.tsx` — Offices grid
- `src/components/offices/OfficeDetail.tsx` — Individual office detail
- `src/components/about/AboutHero.tsx` — About page hero
- `src/components/about/ValuesSection.tsx` — Values grid section
- `src/components/about/TimelineSection.tsx` — History timeline

**Global Styles:**
- `src/app/globals.css` — Updated global styles, design tokens
- `src/styles/animations.css` — Custom animation definitions
- `tailwind.config.ts` — Extended configuration (updated)

**Documentation:**
- `docs/superpowers/plans/2026-05-06-modern-system-implementation.md` — This file

### Modified Files

- `src/payload.config.ts` — Update content display (if needed)
- `src/app/(frontend)/layout.tsx` — Update layout for new header/footer
- `src/app/(frontend)/page.tsx` — Homepage refactor
- `src/app/(frontend)/about/page.tsx` — About page refactor
- `src/app/(frontend)/blog/page.tsx` — Blog page refactor
- `src/app/(frontend)/practice-areas/page.tsx` — Practice areas index
- `src/app/(frontend)/practice-areas/[slug]/page.tsx` — Practice area detail
- `src/app/(frontend)/team/page.tsx` — Team grid page
- `src/app/(frontend)/team/[id]/page.tsx` — Team member profile
- `src/app/(frontend)/offices/page.tsx` — Offices page
- `src/app/(frontend)/offices/[id]/page.tsx` — Office detail
- `package.json` — No new deps (all already installed)
- `.gitignore` — Add `.superpowers/` if not already present

---

## Phase 1: Design System Foundation (Days 1-2)

### Task 1.1: Create Design Tokens CSS

**Files:**
- Create: `src/styles/design-tokens.css`

- [ ] **Step 1: Create the design tokens file with color variables**

```css
:root {
  /* Colors */
  --color-charcoal-primary: #1a1a1a;
  --color-slate-dark: #0f172a;
  --color-slate-primary: #2d3748;
  --color-slate-secondary: #64748b;
  --color-gray-light: #f7fafc;
  --color-white: #ffffff;
  --color-teal-primary: #0891b2;
  --color-teal-light: #06b6d4;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;

  /* Typography */
  --font-family-base: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 20px 25px rgba(0, 0, 0, 0.15);

  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-base: 0.3s ease-in-out;
  --transition-slow: 0.5s ease-in-out;
}
```

- [ ] **Step 2: Commit the design tokens file**

```bash
git add src/styles/design-tokens.css
git commit -m "feat: add design system tokens CSS variables"
```

### Task 1.2: Extend Tailwind Configuration

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Open and review current tailwind.config.ts**

Read current content to understand existing config structure.

- [ ] **Step 2: Extend colors, spacing, and animations in tailwind.config.ts**

Update the `theme.extend` section to include:
- Custom color palette (charcoal, teal, grays)
- Extended spacing scale
- Animation definitions (fade-in, slide-up, scale, etc.)

```javascript
theme: {
  extend: {
    colors: {
      charcoal: '#1a1a1a',
      slate: {
        dark: '#0f172a',
        primary: '#2d3748',
        secondary: '#64748b',
        light: '#f7fafc',
      },
      teal: {
        primary: '#0891b2',
        light: '#06b6d4',
      },
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px',
      '3xl': '64px',
      '4xl': '96px',
    },
    borderRadius: {
      sm: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px',
    },
    animation: {
      'fade-in': 'fadeIn 0.6s ease-out',
      'slide-up': 'slideUp 0.6s ease-out',
      'slide-left': 'slideLeft 0.6s ease-out',
      'scale-up': 'scaleUp 0.4s ease-out',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      slideUp: {
        '0%': { transform: 'translateY(20px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
      slideLeft: {
        '0%': { transform: 'translateX(-20px)', opacity: '0' },
        '100%': { transform: 'translateX(0)', opacity: '1' },
      },
      scaleUp: {
        '0%': { transform: 'scale(0.95)', opacity: '0' },
        '100%': { transform: 'scale(1)', opacity: '1' },
      },
    },
  },
}
```

- [ ] **Step 3: Test Tailwind compilation**

```bash
npm run build
```

Verify no errors and Tailwind classes are generated.

- [ ] **Step 4: Commit the updated config**

```bash
git add tailwind.config.ts
git commit -m "feat: extend tailwind with custom colors, spacing, animations"
```

### Task 1.3: Create Design System Exports

**Files:**
- Create: `src/lib/design-system.ts`

- [ ] **Step 1: Create design-system.ts with exported constants**

```typescript
// Colors
export const colors = {
  charcoal: '#1a1a1a',
  slate: {
    dark: '#0f172a',
    primary: '#2d3748',
    secondary: '#64748b',
    light: '#f7fafc',
  },
  teal: {
    primary: '#0891b2',
    light: '#06b6d4',
  },
  white: '#ffffff',
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
};

// Spacing
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
};

// Border Radius
export const borderRadius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
};

// Shadow elevation
export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px rgba(0,0,0,0.1)',
  lg: '0 10px 15px rgba(0,0,0,0.1)',
  hover: '0 20px 25px rgba(0,0,0,0.15)',
};

// Transitions
export const transitions = {
  fast: '0.2s ease',
  base: '0.3s ease-in-out',
  slow: '0.5s ease-in-out',
};
```

- [ ] **Step 2: Commit the design-system exports**

```bash
git add src/lib/design-system.ts
git commit -m "feat: create design-system exports and constants"
```

### Task 1.4: Create Animations Configuration

**Files:**
- Create: `src/lib/animations.ts`

- [ ] **Step 1: Create animations.ts with Framer Motion variants and GSAP configs**

```typescript
import { Variants } from 'framer-motion';

// Framer Motion Variants
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// GSAP ScrollTrigger configs
export const scrollRevealConfig = {
  trigger: '',
  start: 'top 80%',
  end: 'top 50%',
  scrub: false,
  markers: false,
};

export const parallaxConfig = {
  factor: 0.5, // Adjust for parallax intensity
};
```

- [ ] **Step 2: Commit the animations configuration**

```bash
git add src/lib/animations.ts
git commit -m "feat: create animations library with Framer Motion variants and GSAP configs"
```

### Task 1.5: Update Global Styles

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Open globals.css and add new global styles**

Add after existing styles:
```css
@import url('../styles/design-tokens.css');

/* Base typography updates */
body {
  font-family: var(--font-family-base);
  color: var(--color-slate-primary);
  background-color: var(--color-white);
}

h1, h2, h3, h4, h5, h6 {
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.5px;
  line-height: 1.2;
}

h1 {
  font-size: clamp(28px, 5vw, 64px);
  line-height: 1.1;
}

h2 {
  font-size: clamp(24px, 4vw, 48px);
  line-height: 1.2;
}

p {
  line-height: 1.6;
  font-size: 16px;
}

/* Link styling */
a {
  color: var(--color-teal-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--color-teal-light);
  text-decoration: underline;
}

/* Focus states for accessibility */
:focus-visible {
  outline: 2px solid var(--color-teal-primary);
  outline-offset: 2px;
}
```

- [ ] **Step 2: Commit the updated globals**

```bash
git add src/app/globals.css
git commit -m "feat: update global styles with new typography and design tokens"
```

---

## Phase 2: Component Library Redesign (Days 3-5)

### Task 2.1: Rebuild Button Component

**Files:**
- Modify: `src/components/ui/Button.tsx`

- [ ] **Step 1: Review current Button.tsx structure**

Check existing implementation to understand props and variants.

- [ ] **Step 2: Update Button with new variants and styling**

```typescript
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold rounded transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-primary disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-teal-primary text-white hover:bg-teal-light active:scale-95',
        secondary: 'border border-teal-primary text-teal-primary hover:bg-slate-light active:scale-95',
        ghost: 'text-slate-primary hover:text-teal-primary underline',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

- [ ] **Step 3: Test Button component renders correctly**

Check that all variants (primary, secondary, ghost) and sizes render without errors.

- [ ] **Step 4: Commit the updated Button component**

```bash
git add src/components/ui/Button.tsx
git commit -m "feat: redesign Button component with new colors and hover states"
```

### Task 2.2: Rebuild Card Component

**Files:**
- Modify: `src/components/ui/Card.tsx`

- [ ] **Step 1: Review current Card.tsx**

Understand existing structure and props.

- [ ] **Step 2: Update Card with new styling and hover effects**

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'accent';
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = true, ...props }, ref) => {
    const baseStyles = 'rounded-lg bg-slate-light border border-slate-200 p-6';
    const hoverStyles = hover
      ? 'transition-all duration-300 hover:shadow-hover hover:scale-102 hover:border-teal-primary'
      : '';
    const accentStyles = variant === 'accent' ? 'border-teal-primary' : '';

    return (
      <div
        ref={ref}
        className={cn(baseStyles, hoverStyles, accentStyles, className)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export { Card };
```

- [ ] **Step 3: Test Card component with different variants**

Render cards with default and accent variants, verify hover effects.

- [ ] **Step 4: Commit the updated Card component**

```bash
git add src/components/ui/Card.tsx
git commit -m "feat: redesign Card component with teal accent and hover animations"
```

### Task 2.3: Update Input Component

**Files:**
- Modify: `src/components/ui/Input.tsx`

- [ ] **Step 1: Review current Input.tsx**

Check existing implementation.

- [ ] **Step 2: Update Input with teal focus state and new styling**

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-primary mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-slate-primary placeholder-slate-secondary',
          'transition-all duration-200',
          'focus:outline-none focus:border-teal-primary focus:ring-2 focus:ring-teal-primary/10',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
);

Input.displayName = 'Input';

export { Input };
```

- [ ] **Step 3: Test Input with focus state and error state**

Verify focus border is teal, error state shows red.

- [ ] **Step 4: Commit the updated Input component**

```bash
git add src/components/ui/Input.tsx
git commit -m "feat: update Input component with teal focus and error states"
```

### Task 2.4: Create Badge Component

**Files:**
- Create: `src/components/ui/Badge.tsx`

- [ ] **Step 1: Create new Badge component**

```typescript
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-slate-light text-slate-primary',
        teal: 'bg-teal-primary/10 text-teal-primary',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-amber-100 text-amber-800',
        error: 'bg-red-100 text-red-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  )
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
```

- [ ] **Step 2: Commit the new Badge component**

```bash
git add src/components/ui/Badge.tsx
git commit -m "feat: create Badge component with multiple variants"
```

### Task 2.5: Create Divider Component

**Files:**
- Create: `src/components/ui/Divider.tsx`

- [ ] **Step 1: Create new Divider component**

```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'accent';
  orientation?: 'horizontal' | 'vertical';
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, variant = 'default', orientation = 'horizontal', ...props }, ref) => {
    const baseStyles = orientation === 'horizontal' ? 'w-full h-px' : 'h-full w-px';
    const colorStyles =
      variant === 'accent'
        ? 'bg-teal-primary/20'
        : 'bg-slate-200';

    return (
      <div
        ref={ref}
        className={cn(baseStyles, colorStyles, className)}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

export { Divider };
```

- [ ] **Step 2: Commit the new Divider component**

```bash
git add src/components/ui/Divider.tsx
git commit -m "feat: create Divider component with accent variant"
```

---

## Phase 3: Global Components (Days 6-7)

### Task 3.1: Redesign Header Component

**Files:**
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Review current Header.tsx**

Check existing navigation structure and links.

- [ ] **Step 2: Rebuild Header with sticky behavior, new colors, and nav structure**

```typescript
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-charcoal border-b border-teal-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-xl font-bold text-white">Chambers of Jeet Bhatt</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/practice-areas" className="text-slate-secondary hover:text-teal-primary transition-colors">
              Practice Areas
            </Link>
            <Link href="/team" className="text-slate-secondary hover:text-teal-primary transition-colors">
              Team
            </Link>
            <Link href="/blog" className="text-slate-secondary hover:text-teal-primary transition-colors">
              Blog
            </Link>
            <Link href="/offices" className="text-slate-secondary hover:text-teal-primary transition-colors">
              Offices
            </Link>
            <Link href="/about" className="text-slate-secondary hover:text-teal-primary transition-colors">
              About
            </Link>
          </nav>

          {/* CTA Button */}
          <Button variant="primary" size="sm" asChild>
            <Link href="/contact">Get In Touch</Link>
          </Button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 border-t border-teal-primary/10">
            <Link href="/practice-areas" className="block py-2 text-slate-secondary hover:text-teal-primary">
              Practice Areas
            </Link>
            <Link href="/team" className="block py-2 text-slate-secondary hover:text-teal-primary">
              Team
            </Link>
            <Link href="/blog" className="block py-2 text-slate-secondary hover:text-teal-primary">
              Blog
            </Link>
            <Link href="/offices" className="block py-2 text-slate-secondary hover:text-teal-primary">
              Offices
            </Link>
            <Link href="/about" className="block py-2 text-slate-secondary hover:text-teal-primary">
              About
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};
```

- [ ] **Step 3: Test Header renders with sticky positioning and mobile menu**

Verify sticky behavior, responsive navigation, hover states.

- [ ] **Step 4: Commit the redesigned Header**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: redesign Header with sticky positioning and new colors"
```

### Task 3.2: Redesign Footer Component

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Review current Footer.tsx**

Understand current structure and links.

- [ ] **Step 2: Rebuild Footer with 4-5 column grid, new colors**

```typescript
import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-slate-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-white mb-4">Chambers of Jeet Bhatt</h3>
            <p className="text-sm">Premium legal expertise with a modern approach to client success.</p>
          </div>

          {/* Practice Areas */}
          <div>
            <h4 className="font-semibold text-white mb-4">Practice Areas</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/practice-areas/corporate" className="hover:text-teal-primary transition-colors">Corporate Law</Link></li>
              <li><Link href="/practice-areas/litigation" className="hover:text-teal-primary transition-colors">Litigation</Link></li>
              <li><Link href="/practice-areas/ip" className="hover:text-teal-primary transition-colors">Intellectual Property</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-teal-primary transition-colors">Blog & Insights</Link></li>
              <li><Link href="/about" className="hover:text-teal-primary transition-colors">About Us</Link></li>
              <li><Link href="/team" className="hover:text-teal-primary transition-colors">Our Team</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="tel:+1234567890" className="hover:text-teal-primary transition-colors">+1 (234) 567-8900</a></li>
              <li><a href="mailto:info@chamberjb.com" className="hover:text-teal-primary transition-colors">info@chamberjb.com</a></li>
              <li><Link href="/offices" className="hover:text-teal-primary transition-colors">Office Locations</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-sm mb-4">Get legal insights delivered monthly.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 bg-slate-dark rounded text-white placeholder-slate-secondary text-sm focus:outline-none focus:ring-2 focus:ring-teal-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-teal-primary text-white rounded font-semibold text-sm hover:bg-teal-light transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-teal-primary/10 my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">© {currentYear} Chambers of Jeet Bhatt. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="hover:text-teal-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-teal-primary transition-colors">Terms</Link>
            <div className="flex gap-4">
              <a href="#" aria-label="LinkedIn" className="hover:text-teal-primary transition-colors">LinkedIn</a>
              <a href="#" aria-label="Twitter" className="hover:text-teal-primary transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
```

- [ ] **Step 3: Test Footer renders with all columns and links**

Verify grid layout, link hover states, newsletter form.

- [ ] **Step 4: Commit the redesigned Footer**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat: redesign Footer with 5-column grid and new styling"
```

### Task 3.3: Create Breadcrumbs Component

**Files:**
- Create: `src/components/layout/Breadcrumbs.tsx`

- [ ] **Step 1: Create Breadcrumbs component**

```typescript
import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex gap-2 text-sm text-slate-secondary mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <span>/</span>}
          {item.href ? (
            <Link href={item.href} className="text-teal-primary hover:text-teal-light transition-colors">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};
```

- [ ] **Step 2: Commit the Breadcrumbs component**

```bash
git add src/components/layout/Breadcrumbs.tsx
git commit -m "feat: create Breadcrumbs navigation component"
```

---

## Phase 4: Animation Components (Day 8)

### Task 4.1: Create ScrollReveal Component

**Files:**
- Create: `src/components/animations/ScrollReveal.tsx`

- [ ] **Step 1: Create ScrollReveal wrapper for GSAP ScrollTrigger**

```typescript
'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight';
  delay?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  animation = 'fadeIn',
  delay = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const animationConfigs = {
      fadeIn: { opacity: 0 },
      slideUp: { opacity: 0, y: 20 },
      slideLeft: { opacity: 0, x: -20 },
      slideRight: { opacity: 0, x: 20 },
    };

    gsap.fromTo(
      element,
      animationConfigs[animation],
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 0.6,
        delay,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'top 50%',
          scrub: false,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [animation, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
```

- [ ] **Step 2: Commit the ScrollReveal component**

```bash
git add src/components/animations/ScrollReveal.tsx
git commit -m "feat: create ScrollReveal component with GSAP ScrollTrigger"
```

### Task 4.2: Create FadeInOnScroll Component

**Files:**
- Create: `src/components/animations/FadeInOnScroll.tsx`

- [ ] **Step 1: Create FadeInOnScroll using Framer Motion**

```typescript
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface FadeInOnScrollProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export const FadeInOnScroll: React.FC<FadeInOnScrollProps> = ({
  children,
  className = '',
  duration = 0.6,
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
};
```

Note: This requires `react-intersection-observer` package (check if already installed).

- [ ] **Step 2: Commit the FadeInOnScroll component**

```bash
git add src/components/animations/FadeInOnScroll.tsx
git commit -m "feat: create FadeInOnScroll component with Framer Motion"
```

### Task 4.3: Create StaggerContainer Component

**Files:**
- Create: `src/components/animations/StaggerContainer.tsx`

- [ ] **Step 1: Create StaggerContainer for staggered children animations**

```typescript
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  staggerDelay = 0.1,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};
```

- [ ] **Step 2: Commit the StaggerContainer component**

```bash
git add src/components/animations/StaggerContainer.tsx
git commit -m "feat: create StaggerContainer for staggered animations"
```

---

## Phase 5: Homepage Modernization (Days 9-11)

### Task 5.1: Create Hero Section Component

**Files:**
- Create: `src/components/home/HeroSection.tsx`

- [ ] **Step 1: Create Hero with teal accent bar and animations**

```typescript
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[70vh] bg-charcoal flex items-center overflow-hidden">
      {/* Teal Accent Bar */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1 bg-teal-primary"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ originY: 0 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        {/* Headline */}
        <motion.h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          Premium Legal Expertise
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-lg sm:text-xl text-slate-secondary mb-8 max-w-2xl"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Chambers of Jeet Bhatt combines strategic legal advice with modern, client-focused solutions. We represent leaders and innovators across industries.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button variant="primary" size="lg" asChild>
            <Link href="/contact">Get In Touch</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Test Hero renders with animations on load**

Verify entrance animations work, teal bar scales, text slides in.

- [ ] **Step 3: Commit the Hero component**

```bash
git add src/components/home/HeroSection.tsx
git commit -m "feat: create Hero section with teal accent bar and animations"
```

### Task 5.2: Create Practice Areas Showcase

**Files:**
- Create: `src/components/home/PracticeAreasShowcase.tsx`

- [ ] **Step 1: Create Practice Areas grid with scroll animations**

```typescript
'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { StaggerContainer } from '@/components/animations/StaggerContainer';
import Link from 'next/link';

const practiceAreas = [
  {
    id: 1,
    title: 'Corporate Law',
    description: 'Strategic legal counsel for corporate transactions, governance, and M&A.',
    icon: '📋',
  },
  {
    id: 2,
    title: 'Litigation',
    description: 'Aggressive representation in complex commercial and civil disputes.',
    icon: '⚖️',
  },
  {
    id: 3,
    title: 'Intellectual Property',
    description: 'Protection and enforcement of patents, trademarks, and copyrights.',
    icon: '💡',
  },
];

export const PracticeAreasShowcase: React.FC = () => {
  return (
    <section className="py-20 bg-slate-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-charcoal mb-4 text-center">Practice Areas</h2>
        <p className="text-center text-slate-secondary mb-12 max-w-2xl mx-auto">
          Specialized expertise across key practice areas to serve our clients' evolving needs.
        </p>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {practiceAreas.map((area) => (
            <Link key={area.id} href={`/practice-areas/${area.id}`}>
              <Card className="h-full cursor-pointer group">
                <div className="text-4xl mb-4">{area.icon}</div>
                <h3 className="text-xl font-bold text-charcoal mb-3 group-hover:text-teal-primary transition-colors">
                  {area.title}
                </h3>
                <p className="text-slate-secondary mb-4">{area.description}</p>
                <span className="text-teal-primary font-semibold inline-block group-hover:underline">
                  Learn More →
                </span>
              </Card>
            </Link>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Test Practice Areas showcase renders with stagger animation**

Verify cards appear staggered on scroll, hover effects work.

- [ ] **Step 3: Commit the Practice Areas showcase**

```bash
git add src/components/home/PracticeAreasShowcase.tsx
git commit -m "feat: create Practice Areas showcase with staggered animations"
```

### Task 5.3: Create Team Preview Component

**Files:**
- Create: `src/components/home/TeamPreview.tsx`

- [ ] **Step 1: Create Team Preview with carousel/grid**

```typescript
'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

const teamMembers = [
  {
    id: 1,
    name: 'Jeet Bhatt',
    title: 'Founder & Senior Counsel',
    specialty: 'Corporate Law',
    image: '/images/team/jeet.jpg',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    title: 'Partner',
    specialty: 'Litigation',
    image: '/images/team/sarah.jpg',
  },
  {
    id: 3,
    name: 'Michael Chen',
    title: 'Partner',
    specialty: 'Intellectual Property',
    image: '/images/team/michael.jpg',
  },
  {
    id: 4,
    name: 'Emily Davis',
    title: 'Associate',
    specialty: 'Corporate Law',
    image: '/images/team/emily.jpg',
  },
];

export const TeamPreview: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="slideLeft" className="mb-12">
          <h2 className="text-4xl font-bold text-charcoal mb-4">Meet Our Team</h2>
          <p className="text-slate-secondary max-w-2xl">
            Expert legal professionals committed to your success.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <ScrollReveal
              key={member.id}
              animation="slideUp"
              delay={index * 0.1}
              className="group"
            >
              <Link href={`/team/${member.id}`}>
                <Card className="overflow-hidden h-full">
                  <div className="w-full h-48 bg-slate-light mb-4 rounded overflow-hidden">
                    {/* Image placeholder */}
                    <div className="w-full h-full bg-gradient-to-br from-teal-primary/20 to-charcoal/10 flex items-center justify-center">
                      <span className="text-4xl">👤</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-charcoal mb-1 group-hover:text-teal-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm text-slate-secondary mb-2">{member.title}</p>
                  <span className="inline-block text-xs bg-teal-primary/10 text-teal-primary px-2 py-1 rounded">
                    {member.specialty}
                  </span>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Test Team Preview renders with team members**

Verify cards render, hover effects work, scroll animations trigger.

- [ ] **Step 3: Commit the Team Preview**

```bash
git add src/components/home/TeamPreview.tsx
git commit -m "feat: create Team Preview section with scroll animations"
```

### Task 5.4: Create Offices Section

**Files:**
- Create: `src/components/home/OfficesSection.tsx`

- [ ] **Step 1: Create Offices Section**

```typescript
'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

const offices = [
  {
    id: 1,
    name: 'New York',
    address: '123 Park Ave, New York, NY 10022',
    phone: '+1 (212) 555-0100',
  },
  {
    id: 2,
    name: 'Los Angeles',
    address: '456 Wilshire Blvd, Los Angeles, CA 90010',
    phone: '+1 (310) 555-0200',
  },
];

export const OfficesSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="slideLeft" className="mb-12">
          <h2 className="text-4xl font-bold text-charcoal mb-4">Office Locations</h2>
          <p className="text-slate-secondary max-w-2xl">
            Conveniently located offices to serve your legal needs.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offices.map((office, index) => (
            <ScrollReveal
              key={office.id}
              animation="slideUp"
              delay={index * 0.1}
            >
              <Card>
                <h3 className="text-2xl font-bold text-charcoal mb-4">{office.name}</h3>
                <p className="text-slate-secondary mb-2">{office.address}</p>
                <p className="text-slate-secondary mb-6">{office.phone}</p>
                <Button variant="secondary" asChild>
                  <Link href={`/offices/${office.id}`}>View Details</Link>
                </Button>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Commit the Offices Section**

```bash
git add src/components/home/OfficesSection.tsx
git commit -m "feat: create Offices section with location cards"
```

### Task 5.5: Create CTA Section

**Files:**
- Create: `src/components/home/CTASection.tsx`

- [ ] **Step 1: Create full-width CTA section**

```typescript
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-charcoal to-slate-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Ready to Work Together?
        </motion.h2>

        <motion.p
          className="text-lg text-slate-secondary mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Let's discuss your legal needs and how we can help your organization succeed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button variant="primary" size="lg" asChild>
            <Link href="/contact">Schedule a Consultation</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Commit the CTA Section**

```bash
git add src/components/home/CTASection.tsx
git commit -m "feat: create CTA section with motion animations"
```

### Task 5.6: Update Homepage Layout

**Files:**
- Modify: `src/app/(frontend)/page.tsx`

- [ ] **Step 1: Update homepage to use new components**

```typescript
import { HeroSection } from '@/components/home/HeroSection';
import { PracticeAreasShowcase } from '@/components/home/PracticeAreasShowcase';
import { TeamPreview } from '@/components/home/TeamPreview';
import { OfficesSection } from '@/components/home/OfficesSection';
import { CTASection } from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <PracticeAreasShowcase />
      <TeamPreview />
      <OfficesSection />
      <CTASection />
    </>
  );
}
```

- [ ] **Step 2: Test homepage renders with all new components**

Navigate to `/` and verify all sections load, animations work, styling is correct.

- [ ] **Step 3: Commit the updated homepage**

```bash
git add src/app/(frontend)/page.tsx
git commit -m "feat: update homepage with new modern components"
```

---

## Phase 6: Practice Areas Pages (Days 12-13)

### Task 6.1: Create Practice Area Hero

**Files:**
- Create: `src/components/practice-areas/HeroSection.tsx`

- [ ] **Step 1: Create practice area hero component**

```typescript
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  title: string;
  description: string;
}

export const HeroSection: React.FC<HeroProps> = ({ title, description }) => {
  return (
    <section className="relative min-h-[50vh] bg-gradient-to-br from-charcoal to-slate-dark flex items-center overflow-hidden pt-20">
      {/* Teal Accent Bar */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1 bg-teal-primary"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ originY: 0 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <motion.h1
          className="text-5xl sm:text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="text-lg text-slate-secondary max-w-2xl"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Commit the practice area hero**

```bash
git add src/components/practice-areas/HeroSection.tsx
git commit -m "feat: create practice area hero component"
```

### Task 6.2: Create Content Block (Alternating Text/Image)

**Files:**
- Create: `src/components/practice-areas/ContentBlock.tsx`

- [ ] **Step 1: Create alternating content block**

```typescript
'use client';

import React from 'react';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

interface ContentBlockProps {
  title: string;
  description: string;
  imagePosition?: 'left' | 'right';
  imageSrc?: string;
}

export const ContentBlock: React.FC<ContentBlockProps> = ({
  title,
  description,
  imagePosition = 'right',
  imageSrc,
}) => {
  const textFirst = imagePosition === 'right';

  return (
    <div className="py-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <ScrollReveal
            animation={textFirst ? 'slideLeft' : 'slideRight'}
            className={textFirst ? '' : 'lg:order-2'}
          >
            <h2 className="text-4xl font-bold text-charcoal mb-6">{title}</h2>
            <p className="text-lg text-slate-secondary leading-relaxed">{description}</p>
          </ScrollReveal>

          {/* Image */}
          <ScrollReveal
            animation={!textFirst ? 'slideLeft' : 'slideRight'}
            className={!textFirst ? '' : 'lg:order-2'}
          >
            <div className="w-full h-80 bg-gradient-to-br from-teal-primary/20 to-charcoal/10 rounded-lg flex items-center justify-center">
              {imageSrc ? (
                <img src={imageSrc} alt={title} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-6xl">📄</span>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Commit the content block**

```bash
git add src/components/practice-areas/ContentBlock.tsx
git commit -m "feat: create alternating content block component"
```

### Task 6.3: Create Related Practice Areas

**Files:**
- Create: `src/components/practice-areas/RelatedAreas.tsx`

- [ ] **Step 1: Create related areas component**

```typescript
'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { StaggerContainer } from '@/components/animations/StaggerContainer';
import Link from 'next/link';

interface RelatedArea {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface RelatedAreasProps {
  areas: RelatedArea[];
}

export const RelatedAreas: React.FC<RelatedAreasProps> = ({ areas }) => {
  return (
    <section className="py-20 bg-slate-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-charcoal mb-4 text-center">Related Practice Areas</h2>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {areas.map((area) => (
            <Link key={area.id} href={`/practice-areas/${area.id}`}>
              <Card className="h-full cursor-pointer group">
                <div className="text-4xl mb-4">{area.icon}</div>
                <h3 className="text-xl font-bold text-charcoal mb-3 group-hover:text-teal-primary transition-colors">
                  {area.title}
                </h3>
                <p className="text-slate-secondary text-sm">{area.description}</p>
              </Card>
            </Link>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Commit the related areas component**

```bash
git add src/components/practice-areas/RelatedAreas.tsx
git commit -m "feat: create related practice areas component"
```

### Task 6.4: Update Practice Area Page Template

**Files:**
- Modify: `src/app/(frontend)/practice-areas/[slug]/page.tsx`

- [ ] **Step 1: Update practice area detail page to use new components**

```typescript
import { HeroSection } from '@/components/practice-areas/HeroSection';
import { ContentBlock } from '@/components/practice-areas/ContentBlock';
import { RelatedAreas } from '@/components/practice-areas/RelatedAreas';
import { CTASection } from '@/components/home/CTASection';

export default function PracticeAreaPage({ params }: { params: { slug: string } }) {
  // Fetch practice area data from Payload CMS based on slug
  const practiceArea = {
    title: 'Corporate Law',
    description: 'Strategic legal counsel for corporate transactions and governance.',
    content: [
      {
        title: 'Mergers & Acquisitions',
        description: 'We guide clients through complex M&A transactions, from initial negotiations to closing.',
      },
      {
        title: 'Corporate Governance',
        description: 'Expert advice on board composition, fiduciary duties, and shareholder relations.',
      },
    ],
    relatedAreas: [
      { id: '2', title: 'Litigation', description: 'Commercial dispute resolution', icon: '⚖️' },
      { id: '3', title: 'IP Law', description: 'Intellectual property protection', icon: '💡' },
    ],
  };

  return (
    <>
      <HeroSection title={practiceArea.title} description={practiceArea.description} />
      {practiceArea.content.map((block, index) => (
        <ContentBlock
          key={index}
          title={block.title}
          description={block.description}
          imagePosition={index % 2 === 0 ? 'right' : 'left'}
        />
      ))}
      <RelatedAreas areas={practiceArea.relatedAreas} />
      <CTASection />
    </>
  );
}
```

- [ ] **Step 2: Test practice area page renders**

Navigate to `/practice-areas/corporate` and verify all sections appear with correct animations.

- [ ] **Step 3: Commit the updated practice area page**

```bash
git add src/app/(frontend)/practice-areas/[slug]/page.tsx
git commit -m "feat: update practice area detail page with new components"
```

---

## Phase 7: Remaining Pages (Days 14-18)

Due to space constraints, the remaining phases follow the same pattern:

**Phase 7: Team Pages (Days 14-15)**
- Create `src/components/team/TeamGrid.tsx` — Team member grid with animations
- Create `src/components/team/TeamMemberProfile.tsx` — Individual profile layout
- Update `/team` and `/team/[id]` pages

**Phase 8: Blog Pages (Days 16-17)**
- Create `src/components/blog/BlogHero.tsx` — Blog section hero
- Create `src/components/blog/BlogGrid.tsx` — Blog card grid with scroll animations
- Create `src/components/blog/BlogPost.tsx` — Individual blog post layout
- Update `/blog` and `/blog/[slug]` pages

**Phase 9: Offices Pages (Day 18)**
- Create `src/components/offices/OfficesGrid.tsx` — Office locations grid
- Create `src/components/offices/OfficeDetail.tsx` — Individual office detail
- Update `/offices` and `/offices/[id]` pages

*For brevity, detailed step-by-step tasks omitted; follow same pattern as homepage and practice areas.*

---

## Phase 10: About Page & Final Pages (Days 19-20)

### Task 10.1: Create About Page Components

**Files:**
- Create: `src/components/about/AboutHero.tsx`
- Create: `src/components/about/ValuesSection.tsx`
- Create: `src/components/about/TimelineSection.tsx`
- Modify: `src/app/(frontend)/about/page.tsx`

*(Follow same component pattern as other pages)*

---

## Phase 11: Testing & QA (Days 21-28)

### Task 11.1: Cross-Browser Testing

- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on iOS Safari and Chrome Android
- [ ] Verify all animations run smoothly (60fps)

### Task 11.2: Accessibility Review

- [ ] Color contrast ratios meet WCAG AA
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader compatible (ARIA labels)
- [ ] Focus states visible on all interactive elements

### Task 11.3: Performance Optimization

- [ ] Lighthouse score >90
- [ ] Image optimization (lazy loading)
- [ ] Animation performance (no janky scrolling)
- [ ] Core Web Vitals: LCP, FID, CLS

### Task 11.4: Final Quality Assurance

- [ ] All internal links working (no 404s)
- [ ] CMS content renders correctly in new layouts
- [ ] Forms validate and submit
- [ ] Mobile responsiveness across breakpoints

---

## Success Criteria

✅ All pages use charcoal + teal design system  
✅ Smooth scroll and entrance animations on all sections  
✅ Mobile responsive (tested: 375px, 768px, 1024px, 1280px+)  
✅ Accessibility: WCAG 2.1 AA compliance  
✅ Performance: Lighthouse >90, animations 60fps  
✅ All CMS content integrated seamlessly  
✅ Complete visual brand system documentation  

---

## Deployment Checklist

- [ ] All changes committed to git
- [ ] Final build verification: `npm run build` succeeds
- [ ] No console errors or warnings
- [ ] Staging deployment successful
- [ ] Production deployment ready

---

**Total Estimated Duration:** 4 weeks (28 working days)  
**Tech Lead:** Review design decisions, animation performance  
**QA Lead:** Accessibility, cross-browser, mobile testing  

