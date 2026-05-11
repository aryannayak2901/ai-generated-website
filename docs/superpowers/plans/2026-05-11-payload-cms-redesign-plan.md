# Payload CMS Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Payload CMS Admin interface with a custom CSS theme and React component overrides to match the firm's premium brand without modifying core functionality.

**Architecture:** We will create a dedicated CSS file for overriding native Payload variables and structural styling. We will build custom React Server Components (Logo, Icon, BeforeLogin) and inject them into `payload.config.ts` using the Payload 3.0 `admin.components` and `admin.css` hooks.

**Tech Stack:** Next.js 15, Payload CMS 3.24, React 19, CSS

---

### Task 1: Set up Global CSS Overrides

**Files:**
- Create: `src/app/(payload)/custom-admin.css`

- [ ] **Step 1: Write the custom CSS overrides**

Create the CSS file that maps Payload's native CSS variables to our design system tokens.

```css
/* src/app/(payload)/custom-admin.css */

/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap');

:root {
  /* Colors */
  --theme-bg: #0f1729; /* Deep Navy */
  --theme-elevation-150: #162032; /* Slightly lighter navy for cards */
  --theme-elevation-200: #1e293b; 
  --theme-text: #ffffff; /* Stark White */
  --theme-error-400: #ef4444;
  --theme-success-400: #10b981;
  --theme-warning-400: #f59e0b;

  /* Typography */
  --font-body: 'Public Sans', sans-serif;
  --font-heading: 'Playfair Display', serif;

  /* Structural */
  --style-radius-s: 4px;
  --style-radius-m: 6px;
  --style-radius-l: 8px;
}

body, .payload-admin {
  font-family: var(--font-body);
  background-color: var(--theme-bg);
  color: var(--theme-text);
}

h1, h2, h3, h4, h5, h6, .payload-admin__page-title {
  font-family: var(--font-heading) !important;
  font-weight: 600;
}

/* Custom Overrides for inputs and buttons to match frontend aesthetics */
.btn--style-primary {
  background-color: #d4af37 !important; /* Subtle Gold */
  color: #0f1729 !important;
  border: none !important;
  border-radius: var(--style-radius-m) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn--style-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.field-type {
  border-radius: var(--style-radius-m);
}

.field-type input, .field-type textarea {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--theme-text);
  border-radius: var(--style-radius-m);
}

.field-type input:focus, .field-type textarea:focus {
  border-color: #d4af37 !important;
  outline: none;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(payload\)/custom-admin.css
git commit -m "feat: add global css overrides for payload admin"
```

### Task 2: Create Custom Graphics Components

**Files:**
- Create: `src/components/payload/Logo.tsx`
- Create: `src/components/payload/Icon.tsx`

- [ ] **Step 1: Implement the Logo Component**

```tsx
// src/components/payload/Logo.tsx
import React from 'react'

export const Logo: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div 
        style={{ 
          width: '32px', 
          height: '32px', 
          backgroundColor: '#d4af37', 
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0f1729',
          fontWeight: 'bold',
          fontFamily: "'Playfair Display', serif"
        }}
      >
        JB
      </div>
      <span 
        style={{ 
          fontSize: '1.25rem', 
          fontWeight: 600, 
          fontFamily: "'Playfair Display', serif",
          color: '#ffffff',
          letterSpacing: '0.05em'
        }}
      >
        Chambers of Jeet Bhatt
      </span>
    </div>
  )
}
```

- [ ] **Step 2: Implement the Icon Component**

```tsx
// src/components/payload/Icon.tsx
import React from 'react'

export const Icon: React.FC = () => {
  return (
    <div 
      style={{ 
        width: '28px', 
        height: '28px', 
        backgroundColor: '#d4af37', 
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#0f1729',
        fontWeight: 'bold',
        fontFamily: "'Playfair Display', serif",
        fontSize: '14px'
      }}
    >
      JB
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/payload/Logo.tsx src/components/payload/Icon.tsx
git commit -m "feat: add custom logo and icon components for payload"
```

### Task 3: Create Custom Auth Welcome Component

**Files:**
- Create: `src/components/payload/BeforeLogin.tsx`

- [ ] **Step 1: Implement the BeforeLogin Component**

```tsx
// src/components/payload/BeforeLogin.tsx
import React from 'react'

export const BeforeLogin: React.FC = () => {
  return (
    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
      <h1 
        style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: '2rem', 
          color: '#ffffff',
          marginBottom: '0.5rem'
        }}
      >
        Welcome Back
      </h1>
      <p 
        style={{ 
          fontFamily: "'Public Sans', sans-serif", 
          color: '#94a3b8', /* Slate 400 */
          fontSize: '1rem'
        }}
      >
        Sign in to manage chambers content and configurations.
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/payload/BeforeLogin.tsx
git commit -m "feat: add before login component for payload auth screen"
```

### Task 4: Inject Customizations into Payload Config

**Files:**
- Modify: `src/payload.config.ts:18-35`

- [ ] **Step 1: Import and inject CSS and components**

Modify `src/payload.config.ts` to include the `admin.css` and `admin.components` settings.

```ts
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Pages } from './collections/Pages'
import { Team } from './collections/Team'
import { Header } from './globals/Header'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: '@/components/payload/Logo#Logo',
        Icon: '@/components/payload/Icon#Icon',
      },
      beforeLogin: ['@/components/payload/BeforeLogin#BeforeLogin'],
    },
  },
  collections: [Pages, Team, Users, Media, Posts],
  globals: [Header],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'REPLACE_WITH_A_REAL_SECRET',
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

- [ ] **Step 2: Import CSS in `src/app/(payload)/layout.tsx` or handle it natively**

Wait, in Payload 3.x, if `admin.css` is not natively supported as a config option (it might be deprecated in favor of Next.js imports), we just need to import our `custom-admin.css` inside the Payload layout.
Let's check if `src/app/(payload)/layout.tsx` exists and import the CSS there.

Let's modify the step to import the CSS in `src/app/(payload)/layout.tsx`. If `layout.tsx` doesn't exist, we create it.

```tsx
// src/app/(payload)/layout.tsx
/* eslint-disable import/no-relative-packages */
import configPromise from '@payload-config'
import { RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import './custom-admin.css'

type Args = {
  children: React.ReactNode
}

const Layout = ({ children }: Args) => (
  <RootLayout config={configPromise}>{children}</RootLayout>
)

export default Layout
```

- [ ] **Step 3: Commit**

```bash
git add src/payload.config.ts src/app/\(payload\)/layout.tsx
git commit -m "feat: inject custom components and css into payload config"
```
