# Payload CMS Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize the Payload CMS admin interface with the brand's Deep Navy, Subtle Gold, and Playfair Display typography by injecting custom CSS overrides and modifying existing custom React components.

**Architecture:** Global CSS theme override in Next.js + Payload 3 by targeting Payload's native CSS variables and replacing targeted React components in the admin interface.

**Tech Stack:** Next.js, React, CSS/Tailwind CSS, Payload CMS.

---

### Task 1: Refine Global CSS Theme Overrides

**Files:**
- Modify: `src/app/(payload)/custom-admin.css`

- [ ] **Step 1: Update CSS Variables and Theme Overrides**
Modify the CSS to fully cover Payload's standard UI variables (like Sidebar, Navigation, Login, and Forms) to achieve the Premium Editorial Dashboard look.

```css
/* src/app/(payload)/custom-admin.css */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap');

/* Set base theme variables for Payload */
html[data-theme='dark'], html[data-theme='light'] {
  --theme-bg: #0A1128 !important; /* Deep Navy from DESIGN.md */
  --theme-elevation-50: #0E1736 !important;
  --theme-elevation-100: #121D44 !important;
  --theme-elevation-150: #162452 !important;
  --theme-elevation-200: #1A2B60 !important;
  
  --theme-text: #FFFFFF !important;
  --theme-success-400: #C5A059 !important; /* Gold accent */
  --theme-error-400: #EF4444 !important;
  
  --font-body: 'Public Sans', sans-serif !important;
  --font-heading: 'Playfair Display', serif !important;
  
  --style-radius-s: 4px;
  --style-radius-m: 8px;
  --style-radius-l: 12px;
}

body, .payload-admin {
  font-family: var(--font-body);
  background-color: var(--theme-bg);
  color: var(--theme-text);
}

/* Typography Overrides */
h1, h2, h3, h4, h5, h6, .payload-admin__page-title, .nav-group__title {
  font-family: var(--font-heading) !important;
}

/* Button Styling (Gold Accent) */
.btn--style-primary {
  background-color: #C5A059 !important;
  color: #0A1128 !important;
  border: none !important;
  border-radius: var(--style-radius-m) !important;
  font-weight: 600 !important;
  transition: all 0.2s ease;
}

.btn--style-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(197, 160, 89, 0.3) !important;
}

/* Input Fields */
.field-type input, .field-type textarea, .react-select__control {
  background-color: var(--theme-elevation-100) !important;
  border: 1px solid var(--theme-elevation-200) !important;
  color: var(--theme-text) !important;
  border-radius: var(--style-radius-m) !important;
}

.field-type input:focus, .field-type textarea:focus, .react-select__control--is-focused {
  border-color: #C5A059 !important;
  box-shadow: 0 0 0 1px #C5A059 !important;
  outline: none;
}

/* Sidebar overrides */
.nav {
  background-color: var(--theme-elevation-50) !important;
  border-right: 1px solid var(--theme-elevation-150) !important;
}
```

- [ ] **Step 2: Commit the CSS updates**

```bash
git add src/app/\(payload\)/custom-admin.css
git commit -m "style: refine Payload CMS global CSS theme variables"
```

---

### Task 2: Redesign BeforeLogin Component

**Files:**
- Modify: `src/components/payload/BeforeLogin.tsx`

- [ ] **Step 1: Replace the `BeforeLogin.tsx` implementation**
Update the login component to display a premium greeting. Since this component renders above the login form, we will use it to add a welcoming header and a subtitle.

```tsx
import React from 'react'

const BeforeLogin: React.FC = () => {
  return (
    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
      <h1 
        style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: '2.5rem', 
          color: '#FFFFFF',
          marginBottom: '0.5rem',
          fontWeight: 600
        }}
      >
        Welcome Back
      </h1>
      <p 
        style={{ 
          fontFamily: "'Public Sans', sans-serif", 
          color: '#A0ABC0',
          fontSize: '1rem'
        }}
      >
        Sign in to manage the Chambers of Jeet Bhatt portfolio.
      </p>
    </div>
  )
}

export default BeforeLogin
```

- [ ] **Step 2: Commit the component**

```bash
git add src/components/payload/BeforeLogin.tsx
git commit -m "feat: redesign BeforeLogin component for Payload CMS"
```

---

### Task 3: Update Logo and Icon Components

**Files:**
- Modify: `src/components/payload/Logo.tsx`
- Modify: `src/components/payload/Icon.tsx`

- [ ] **Step 1: Update Logo.tsx**
Ensure the logo scales correctly and matches the premium feel in the sidebar header.

```tsx
import React from 'react'
import Image from 'next/image'

export const Logo: React.FC = () => {
  return (
    <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div 
        style={{ 
          width: '40px', 
          height: '40px', 
          backgroundColor: '#C5A059', 
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0A1128',
          fontWeight: 'bold',
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.2rem'
        }}
      >
        JB
      </div>
      <span 
        style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: '1.1rem', 
          fontWeight: 600,
          color: '#FFFFFF',
          letterSpacing: '0.5px'
        }}
      >
        Chambers of<br/>Jeet Bhatt
      </span>
    </div>
  )
}

export default Logo
```

- [ ] **Step 2: Update Icon.tsx**
The icon is used as a favicon or small representation (e.g., collapsed sidebar).

```tsx
import React from 'react'

export const Icon: React.FC = () => {
  return (
    <div 
      style={{ 
        width: '32px', 
        height: '32px', 
        backgroundColor: '#C5A059', 
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#0A1128',
        fontWeight: 'bold',
        fontFamily: "'Playfair Display', serif",
        fontSize: '1rem'
      }}
    >
      JB
    </div>
  )
}

export default Icon
```

- [ ] **Step 3: Commit the components**

```bash
git add src/components/payload/Logo.tsx src/components/payload/Icon.tsx
git commit -m "feat: update Logo and Icon components for Payload CMS admin"
```
