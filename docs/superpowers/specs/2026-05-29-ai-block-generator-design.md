# AI Block/Page Generator — Design Spec
**Date:** 2026-05-29  
**Feature:** AI-Powered TSX Block & Page Generation in Chambers Studio  
**Approach:** File-System Code Generation Pipeline (Approach A)

---

## 1. Overview

Admin users in the Payload CMS Studio can type a natural-language prompt (e.g. "Create a testimonials section with 3 gold-accent cards on a navy background") and the system will:

1. Call a configured AI provider (Gemini / OpenAI / Anthropic) with the prompt + design context
2. Receive structured TSX component code + Payload block config + blockMeta entry
3. Write the generated files to the project filesystem
4. Patch the necessary registration files automatically
5. Add the block to the canvas immediately (with a placeholder)
6. In dev mode: Next.js hot-reloads the component automatically
7. In prod mode: Admin clicks "Deploy to Vercel" to trigger a redeploy hook

---

## 2. User Flow

```
1. Admin opens Pages Studio
2. Clicks the floating ✨ AI button in the BlockLibraryPanel (left sidebar)
3. Modal opens:
   - AI Provider selector (Gemini | OpenAI | Anthropic)
   - Model input (e.g. gemini-2.0-flash, gpt-4o, claude-3-5-sonnet)
   - API Key input (stored in localStorage — never in DB)
   - Prompt textarea (multi-line)
   - Mode toggle: Single Block | Full Page
4. Admin clicks "✨ Generate"
5. Spinner + streaming status messages shown
6. On success:
   - Block(s) added to canvas immediately
   - Toast: "Block generated! Dev: auto-reloading | Prod: Deploy button"
   - In EditPanel, a new "Code" tab shows the generated TSX
7. Admin reviews, edits values via Fields tab, then saves page normally
8. In production: "🚀 Deploy to Vercel" button triggers redeploy hook
```

---

## 3. Architecture

### 3.1 New Files Created

| File | Purpose |
|------|---------|
| `src/app/api/ai-generate-block/route.ts` | Main generation API endpoint |
| `src/app/api/deploy/route.ts` | Vercel deploy hook trigger |
| `src/components/payload/BlocksBuilder/AIGeneratorModal.tsx` | Prompt input modal UI |
| `src/lib/ai/generateBlock.ts` | AI prompt construction + provider client |
| `src/lib/ai/fileWriter.ts` | File system write + patch logic |
| `src/lib/ai/providers/gemini.ts` | Gemini API adapter |
| `src/lib/ai/providers/openai.ts` | OpenAI API adapter |
| `src/lib/ai/providers/anthropic.ts` | Anthropic API adapter |

### 3.2 Modified Files

| File | Change |
|------|--------|
| `src/components/payload/BlocksBuilder/BlockLibraryPanel.tsx` | Add ✨ AI button + wire modal |
| `src/components/payload/BlocksBuilder/BlocksBuilderField.tsx` | Pass AI add-block callback |
| `src/components/payload/BlocksBuilder/EditPanel.tsx` | Add "Code" tab for AI blocks |
| `src/components/payload/BlocksBuilder/constants/blockMeta.ts` | Auto-patched by file writer |
| `src/components/RenderBlocks.tsx` | Auto-patched: import + case |
| `src/collections/Pages.ts` | Auto-patched: import + blocks array |

### 3.3 Environment Variables

```env
# Optional — only needed for Vercel deploy button
VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...

# NODE_ENV is already set by Next.js
```

---

## 4. API Design

### POST `/api/ai-generate-block`

**Request Body:**
```json
{
  "prompt": "Create a testimonials section with 3 cards...",
  "mode": "block" | "page",
  "provider": "gemini" | "openai" | "anthropic",
  "model": "gemini-2.0-flash",
  "apiKey": "user-provided-key"
}
```

**Response (success):**
```json
{
  "success": true,
  "blocks": [
    {
      "blockType": "testimonialsBlock",
      "defaultValues": { "blockType": "testimonialsBlock", "title": "What Our Clients Say" },
      "componentPath": "src/components/blocks/TestimonialsBlock.tsx",
      "configPath": "src/blocks/TestimonialsBlock.ts"
    }
  ]
}
```

**Response (error):**
```json
{
  "success": false,
  "error": "AI API returned invalid structure: missing componentCode field"
}
```

---

## 5. AI System Prompt Design

The system prompt sent to the AI must include:

1. **Role**: "You are an expert Next.js + TypeScript developer generating code for a legal firm website."
2. **Design Context**: Full contents of `DESIGN.md` (colors, fonts, tokens)
3. **Component Reference**: One existing component as style guide (e.g. `HomeHero.tsx`)
4. **Block Config Reference**: One existing Payload block config (e.g. `HomeHero.ts`)
5. **blockMeta Reference**: The `BlockMeta` interface definition
6. **Output Format**: Strict JSON schema the AI must follow

**Required AI Output JSON Schema:**
```json
{
  "blockType": "camelCaseBlockName",
  "componentName": "PascalCaseBlockName",
  "label": "Human Readable Label",
  "category": "Hero | Content | CTA / Forms",
  "icon": "🏆",
  "badgeLabel": "Short",
  "componentCode": "// Full TSX string with 'use client' directive...",
  "payloadConfigCode": "// Full Payload CollectionConfig TS string...",
  "blockMetaEntry": { /* BlockMeta object */ },
  "defaultValues": { /* default prop values */ }
}
```

---

## 6. File Writer Logic

The `fileWriter.ts` module performs these operations **in order** using `fs.promises`:

1. **Write component file**: `src/components/blocks/{ComponentName}.tsx`
2. **Write Payload block config**: `src/blocks/{ComponentName}.ts`
3. **Patch `blockMeta.ts`**: Append new entry before closing `}` of `blockMeta` object
4. **Patch `RenderBlocks.tsx`**: Add `import` at top + add `case` in render switch/map
5. **Patch `Pages.ts`**: Add `import` at top + add block to `blocks: [...]` array

All patches use **regex-based string insertion** — no AST manipulation (keeps it simple and fast). Each patch is idempotent (checks if already patched before writing).

---

## 7. UI Components

### AIGeneratorModal
- Premium glassmorphism modal matching Studio's Deep Navy / Gold design
- Three sections: Provider Settings, Prompt Input, Mode Toggle
- API key stored in `localStorage` under key `chambers_ai_settings`
- Streaming status messages during generation (e.g. "Calling AI...", "Writing files...", "Done!")
- Error display with retry option

### BlockLibraryPanel Changes
- Floating `✨ Generate with AI` button anchored at bottom of left panel
- Gold gradient, subtle glow animation on hover
- Opens `AIGeneratorModal`

### EditPanel Code Tab
- New tab alongside "Fields": `[ Fields ] [ Code ]`
- Shows syntax-highlighted TSX using `highlight.js` (lightweight, ~30KB)
- Copy-to-clipboard button
- Read-only for AI-generated blocks
- Only visible when `block._aiGenerated === true`

### Deploy Button (Production)
- Shown in Studio header when `NODE_ENV === 'production'` AND `VERCEL_DEPLOY_HOOK_URL` is set
- Gold `🚀 Deploy to Vercel` button
- Calls `POST /api/deploy`
- Shows deploy status: Pending → Deploying → Live

---

## 8. Security Considerations

- API key is NEVER stored in MongoDB — only in browser `localStorage`
- The `/api/ai-generate-block` route validates the AI key is present before calling any provider
- File writes are restricted to `src/` directory — no path traversal possible (validated)
- Block type names are sanitized: only alphanumeric + camelCase allowed
- Route is protected: only authenticated Payload admin users can call it (middleware check)

---

## 9. Dev vs Production Behaviour

| Scenario | Behaviour |
|----------|-----------|
| Dev + New Component | Next.js hot-reloads the TSX component automatically |
| Dev + New Payload Block | Requires Payload server restart to register block type in collection |
| Production | Deploy hook triggers Vercel rebuild; new block available after ~1-2 mins |
| Both | Block added to canvas immediately with current default values regardless |

**Note on dev Payload restart:** Since the new `blockType` string won't be in the Payload schema until restart, the block will still render on the canvas (via `blockMeta.ts` which is client-side). The Payload form field validation may show an unknown block warning until restart. This is acceptable for dev workflow.

---

## 10. Verification Plan

### Automated
- TypeScript compilation: `yarn tsc --noEmit` after generation
- ESLint: `yarn lint` on generated files
- File existence checks in API route

### Manual
1. Open Studio → Click ✨ AI button → Enter prompt → Verify modal UI
2. Generate a block → Verify files written to disk
3. Verify canvas shows new block immediately
4. Verify Code tab shows generated TSX
5. Verify blockMeta.ts patched correctly (new entry visible in library)
6. Verify RenderBlocks.tsx patched (frontend renders the block)
7. In dev: verify hot reload picks up component
8. Test "Deploy" button (prod only) — verify Vercel hook is called

---

## 11. Out of Scope

- AI image generation (separate feature)
- Version history / undo for AI-generated blocks
- Collaborative editing
- AI block editing via prompt (post-generation editing is manual via EditPanel)
