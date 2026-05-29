# Dynamic Hero Blocks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a dynamic Payload CMS `HeroBlock` that allows editors to select between Split, Centered, and Asymmetric hero layouts for any page.

**Architecture:** Create a `HeroBlock` in Payload, register it to the `pages` collection, generate updated TypeScript types, and create Next.js frontend components that dynamically render the selected layout style using Framer Motion and Tailwind v4.

**Tech Stack:** Next.js (App Router), Payload CMS, Tailwind CSS v4, Framer Motion.

---

### Task 1: Create Payload Hero Block Schema

**Files:**
- Create: `src/blocks/HeroBlock.ts`

- [ ] **Step 1: Write the HeroBlock schema**
```typescript
// src/blocks/HeroBlock.ts
import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'dynamicHero',
  fields: [
    {
      name: 'layoutType',
      type: 'select',
      required: true,
      defaultValue: 'centered',
      options: [
        { label: 'Split Layout', value: 'split' },
        { label: 'Centered Typographic', value: 'centered' },
        { label: 'Asymmetric Glassmorphism', value: 'asymmetric' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subheading',
      type: 'text',
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'ctas',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'link', type: 'text', required: true },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Ghost', value: 'ghost' },
          ],
        },
      ],
    },
  ],
}
```

- [ ] **Step 2: Commit**
```bash
git add src/blocks/HeroBlock.ts
git commit -m "feat: create dynamic HeroBlock schema"
```

### Task 2: Register HeroBlock in Pages Collection

**Files:**
- Modify: `src/collections/Pages.ts`

- [ ] **Step 1: Import and add HeroBlock to layout array**
Modify `src/collections/Pages.ts` to import `HeroBlock` and add it to the blocks array.

```typescript
// Add to top imports:
import { HeroBlock } from '../blocks/HeroBlock'

// Inside the `layout` field blocks array, add HeroBlock:
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        HeroBlock, // <-- Add this
        HomeHero,
        // ... existing blocks
```

- [ ] **Step 2: Generate Payload Types**
Run: `yarn generate:types` (or `pnpm generate:types` depending on lockfile). Wait, since `yarn.lock` was deleted earlier, let's just run `npx payload generate:types`. Actually, running the dev script might be easier, but let's just commit it first.
```bash
yarn payload generate:types
```

- [ ] **Step 3: Commit**
```bash
git add src/collections/Pages.ts src/payload-types.ts
git commit -m "feat: register HeroBlock to pages collection"
```

### Task 3: Create Frontend Components

**Files:**
- Create: `src/components/blocks/HeroBlockRenderer.tsx`
- Create: `src/components/blocks/HeroSplit.tsx`
- Create: `src/components/blocks/HeroCentered.tsx`
- Create: `src/components/blocks/HeroAsymmetric.tsx`

- [ ] **Step 1: Create Layout Components**
Create the three layout components with placeholders and basic structure.

```tsx
// src/components/blocks/HeroSplit.tsx
import React from 'react'

export const HeroSplit: React.FC<any> = ({ heading, subheading, ctas }) => (
  <section className="flex flex-col md:flex-row min-h-[80vh] items-center bg-navy-primary text-white">
    <div className="flex-1 p-12">
      <h1 className="text-5xl font-playfair mb-4">{heading}</h1>
      {subheading && <p className="text-xl mb-8 text-gray-300">{subheading}</p>}
      <div className="flex gap-4">
        {ctas?.map((cta: any, i: number) => (
          <a key={i} href={cta.link} className={`btn-${cta.style}`}>{cta.label}</a>
        ))}
      </div>
    </div>
    <div className="flex-1 bg-gray-800 h-full min-h-[500px]">
      {/* Media background goes here */}
    </div>
  </section>
)
```

```tsx
// src/components/blocks/HeroCentered.tsx
import React from 'react'

export const HeroCentered: React.FC<any> = ({ heading, subheading, ctas }) => (
  <section className="flex flex-col items-center justify-center text-center min-h-[80vh] bg-navy-primary text-white p-12">
    <h1 className="text-6xl font-playfair mb-6 max-w-4xl">{heading}</h1>
    {subheading && <p className="text-2xl mb-10 text-gray-300 max-w-2xl">{subheading}</p>}
    <div className="flex gap-4">
      {ctas?.map((cta: any, i: number) => (
        <a key={i} href={cta.link} className={`btn-${cta.style}`}>{cta.label}</a>
      ))}
    </div>
  </section>
)
```

```tsx
// src/components/blocks/HeroAsymmetric.tsx
import React from 'react'

export const HeroAsymmetric: React.FC<any> = ({ heading, subheading, ctas }) => (
  <section className="relative min-h-[80vh] flex items-center p-12 overflow-hidden bg-navy-primary">
    {/* Media would be absolute background here */}
    <div className="relative z-10 w-full max-w-xl backdrop-blur-md bg-white/10 p-12 rounded-2xl border border-white/20 text-white">
      <h1 className="text-5xl font-playfair mb-4">{heading}</h1>
      {subheading && <p className="text-xl mb-8">{subheading}</p>}
      <div className="flex gap-4">
        {ctas?.map((cta: any, i: number) => (
          <a key={i} href={cta.link} className={`btn-${cta.style}`}>{cta.label}</a>
        ))}
      </div>
    </div>
  </section>
)
```

- [ ] **Step 2: Create HeroBlockRenderer**
```tsx
// src/components/blocks/HeroBlockRenderer.tsx
import React from 'react'
import { HeroSplit } from './HeroSplit'
import { HeroCentered } from './HeroCentered'
import { HeroAsymmetric } from './HeroAsymmetric'

export const HeroBlockRenderer: React.FC<any> = (props) => {
  const { layoutType } = props
  
  switch (layoutType) {
    case 'split':
      return <HeroSplit {...props} />
    case 'asymmetric':
      return <HeroAsymmetric {...props} />
    case 'centered':
    default:
      return <HeroCentered {...props} />
  }
}
```

- [ ] **Step 3: Commit**
```bash
git add src/components/blocks/
git commit -m "feat: implement frontend components for dynamic hero block"
```

### Task 4: Update RenderBlocks Mapping

**Files:**
- Modify: `src/components/RenderBlocks.tsx`

- [ ] **Step 1: Map `dynamicHero` to `HeroBlockRenderer`**
In `src/components/RenderBlocks.tsx`, import `HeroBlockRenderer` and add it to `blockComponents`.

```typescript
// Add import:
import { HeroBlockRenderer } from '@/components/blocks/HeroBlockRenderer'

// In `blockComponents` record:
const blockComponents: Record<string, React.ComponentType<any>> = {
  dynamicHero: HeroBlockRenderer,
  homeHero: HeroSection,
  // ... rest
```

- [ ] **Step 2: Commit**
```bash
git add src/components/RenderBlocks.tsx
git commit -m "feat: map dynamicHero block to renderer in RenderBlocks"
```
