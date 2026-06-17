# Generate Studio Deep Glassmorphism Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the UI of the Generate Studio to use a premium "Deep Glassmorphism" aesthetic with ambient depth, translucent panels, and gold-accented interactions.

**Architecture:** Pure CSS redesign targeting `src/components/payload/GenerateView/styles.css`. We will introduce new animated classes for background orbs, apply `backdrop-filter` and `rgba` backgrounds to panels, and upgrade form inputs and buttons with glassmorphic styling and richer hover/focus states.

**Tech Stack:** CSS, Payload CMS, React

---

### Task 1: Background & Ambient Orbs

**Files:**
- Modify: `src/components/payload/GenerateView/styles.css`

- [ ] **Step 1: Add Orb Styles**
Add CSS for the missing `.bb-generate-orb` classes to create floating background lights. Add these to the Aurora Background section.

```css
.bb-generate-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
  opacity: 0.6;
  animation: float 20s infinite ease-in-out alternate;
}

.bb-generate-orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%);
  top: -10%;
  right: -5%;
}

.bb-generate-orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
  bottom: -20%;
  left: 10%;
  animation-delay: -10s;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-30px, 20px) scale(1.1); }
  100% { transform: translate(20px, -40px) scale(0.9); }
}
```

### Task 2: Glassmorphic Panels

**Files:**
- Modify: `src/components/payload/GenerateView/styles.css`

- [ ] **Step 1: Update Panel Styles**
Replace `.bb-generate-panel` and `.bb-generate-history-card` styles to use translucency, blur, and subtle borders.

```css
/* Update .bb-generate-panel */
.bb-generate-panel {
  background-color: rgba(10, 25, 47, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border-radius: var(--bb-radius);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Update .bb-generate-panel-header */
.bb-generate-panel-header {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-weight: 600;
  color: var(--bb-gold-light);
  background: rgba(255, 255, 255, 0.02);
}

/* Update .bb-generate-history-card */
.bb-generate-history-card {
  background-color: rgba(10, 25, 47, 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--bb-radius);
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* Update .bb-generate-history-card:hover */
.bb-generate-history-card:hover {
  background-color: rgba(10, 25, 47, 0.5);
  border-color: rgba(212, 175, 55, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}
```

### Task 3: Interactive Elements & Form Polish

**Files:**
- Modify: `src/components/payload/GenerateView/styles.css`

- [ ] **Step 1: Input and Textarea Glassmorphism**
Update inputs to match the panel styling.

```css
/* Update .bb-generate-input, .bb-generate-select, .bb-generate-textarea */
.bb-generate-input,
.bb-generate-select,
.bb-generate-textarea {
  width: 100%;
  padding: 0.75rem;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--bb-radius);
  color: var(--bb-white);
  font-family: var(--bb-font);
  transition: all 0.2s ease;
}

/* Update Focus States */
.bb-generate-input:focus,
.bb-generate-select:focus,
.bb-generate-textarea:focus {
  outline: none;
  border-color: var(--bb-gold);
  background-color: rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

- [ ] **Step 2: Premium Generate Button**
Upgrade the button gradient and shimmer.

```css
/* Update .bb-generate-button */
.bb-generate-button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #E6C875 0%, #D4AF37 50%, #B8860B 100%);
  color: var(--bb-navy);
  border: none;
  border-radius: var(--bb-radius);
  font-family: var(--bb-font);
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(212, 175, 55, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Update .bb-generate-button:hover */
.bb-generate-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(212, 175, 55, 0.4);
}
```

- [ ] **Step 3: Mode Toggle Button Polish**
```css
/* Update .bb-generate-mode-toggle */
.bb-generate-mode-toggle {
  display: flex;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 9999px;
  padding: 0.25rem;
  margin-bottom: 1rem;
  align-self: flex-start;
}

/* Update .bb-generate-suggestion-chip */
.bb-generate-suggestion-chip {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  color: var(--bb-muted);
  cursor: pointer;
  transition: all 0.2s;
}

/* Update .bb-generate-suggestion-chip:hover */
.bb-generate-suggestion-chip:hover {
  background-color: rgba(212, 175, 55, 0.1);
  color: var(--bb-gold-light);
  border-color: rgba(212, 175, 55, 0.3);
}
```

- [ ] **Step 4: Commit**
```bash
git add src/components/payload/GenerateView/styles.css
git commit -m "style: apply deep glassmorphism to generate studio ui"
```
