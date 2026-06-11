# GitOps AI Block Generator — Design Spec
_Date: 2026-06-11_

## Problem

The existing AI Block Generator works locally (`npm run dev`) because it uses `fs.writeFile()` to write generated React/TypeScript files directly to disk. In production on Vercel, the serverless filesystem is read-only — writes silently fail, so no block is ever persisted.

## Goal

Make the AI block/page generator fully operational in production by replacing filesystem writes with the **GitHub REST API (Octokit)**. Generated blocks are previewed in-browser via Sandpack, edited if needed, then pushed to a feature branch and turned into a GitHub Pull Request. Merging the PR triggers a Vercel rebuild that makes the block live.

---

## Architecture Overview

```
Admin UI (Payload CMS)
  └─▶ AIGeneratorModal (Phase 1: Generate)
        └─▶ POST /api/ai-generate-block  [MODIFIED — no fs.writeFile in prod]
              └─▶ AI Provider (Gemini / OpenAI / Anthropic / etc.)
                    └─▶ Returns raw GeneratedBlock JSON to client
  └─▶ AIPreviewPanel (Phase 2: Preview & Edit)  [NEW]
        ├─ Sandpack editor (editable TSX)
        ├─ Sandpack live preview
        └─▶ POST /api/ai-push-github  [NEW]
              └─▶ Octokit (GitHub REST API)
                    ├─ Creates feature branch: ai/block-{blockType}-{timestamp}
                    ├─ Commits 4 files in one atomic commit
                    └─ Opens Pull Request → returns PR URL
  └─▶ Dev reviews & merges PR on GitHub
        └─▶ Vercel auto-rebuilds → Block is live
```

---

## Environment Split

| Environment | Behavior |
|---|---|
| `npm run dev` (local) | `fileWriter.ts` still writes to disk — unchanged, instant local DX |
| Production (Vercel) | `fileWriter.ts` bypassed; GitOps path taken via `/api/ai-push-github` |

Detection: `process.env.NODE_ENV === 'production'` in the generate API route.

---

## New Files

### 1. `src/app/api/ai-push-github/route.ts`
Server-side API route. Accepts the generated code strings, uses `@octokit/rest` to:
1. Fetch `main` branch HEAD SHA
2. Create 4 blobs (component TSX, block schema TS, patched `RenderBlocks.tsx`, patched `Pages.ts`)
3. Build a new Git tree
4. Create a commit on a new feature branch `ai/block-{blockType}-{timestamp}`
5. Open a GitHub Pull Request
6. Return `{ prUrl, branchName }` to the client

### 2. `src/components/payload/BlocksBuilder/AIPreviewPanel.tsx`
Client component. Shown after Phase 1 generation succeeds. Contains:
- **Two-tab code editor:** "Component TSX" and "Block Schema" — both backed by `@codesandbox/sandpack-react`
- **Live Sandpack preview iframe** — renders the component in isolation
- **PR metadata row:** block name, category, auto-computed branch name
- **"Open Pull Request"** button → calls `/api/ai-push-github` → shows PR URL on success
- **"← Back / Regenerate"** button → resets to Phase 1

### 3. `src/lib/ai/githubPatcher.ts`
Pure string-manipulation module (no filesystem I/O). Exports:
- `patchRenderBlocksString(content, block)` — same logic as old `patchRenderBlocks()` but operates on a string
- `patchPagesString(content, block)` — same as old `patchPages()` but on a string

---

## Modified Files

### `src/app/api/ai-generate-block/route.ts`
- Add env check: if `NODE_ENV === 'production'`, skip `writeGeneratedBlock()` and instead return full code strings to the client
- If local dev, keep calling `writeGeneratedBlock()` as before

### `src/components/payload/BlocksBuilder/AIGeneratorModal.tsx`
- Add Phase 2 state: after generation, instead of calling `onBlocksGenerated()` + closing, transition to `AIPreviewPanel`
- `AIPreviewPanel` receives the raw `GeneratedBlock` data

### `src/lib/ai/fileWriter.ts`
- Extract `patchRenderBlocks` and `patchPages` logic into `githubPatcher.ts` (reused by both fileWriter for local and the GitHub API route for prod)
- Keep existing file-write functions for local dev

---

## Environment Variables

| Variable | Value | Where |
|---|---|---|
| `GITHUB_PAT` | GitHub Personal Access Token (repo scope: contents + pull-requests) | Vercel Dashboard → Environment Variables |
| `GITHUB_OWNER` | `aryannayak2901` | Vercel env vars |
| `GITHUB_REPO` | `chambers-of-jeetbhatt` | Vercel env vars |
| `VERCEL_DEPLOY_HOOK_URL` | Already present | Already present |

---

## Dependencies to Install

```bash
yarn add @octokit/rest @codesandbox/sandpack-react @codesandbox/sandpack-client
```

---

## Failure Handling

| Failure | Response |
|---|---|
| AI generates invalid TSX | Client edits in Sandpack before pushing |
| Sandpack can't render | Error in preview pane; client fixes in editor |
| GitHub PAT missing/invalid | 400/401 from `/api/ai-push-github` → modal shows actionable error |
| Octokit rate limit | 429 → modal shows retry message |
| `RenderBlocks.tsx` patch fails | API still commits raw component + schema files; dev manually registers |
| PR merge causes Vercel build fail | PR branch stays open; dev pushes a fix commit to the same branch |

---

## PR Commit Structure

Every "Push to GitHub" creates **one atomic commit** on a new branch containing:

```
src/
  components/
    blocks/
      {ComponentName}.tsx         ← AI-generated component
  blocks/
    {ComponentName}.ts            ← Payload block schema
  components/
    RenderBlocks.tsx              ← Patched (import + blockComponents entry)
  collections/
    Pages.ts                      ← Patched (import + blocks[] entry)
```

PR title format: `✨ AI Block: {ComponentName}`
PR body: includes prompt used, provider/model, timestamp, and preview note.

---

## Verification Plan

1. **Local:** Run `npm run dev`, generate a block, verify `fileWriter.ts` still writes to disk
2. **Production sim:** Set `NODE_ENV=production` locally, generate a block, verify the API returns code strings (no disk write)
3. **GitHub API:** With a real PAT, call `/api/ai-push-github` manually with fixture data, verify PR is created on GitHub
4. **Sandpack preview:** Open the admin, generate a block, verify the Sandpack panel renders the TSX
5. **Edit flow:** Edit the TSX in the Sandpack editor, push → verify the edited code (not the original) appears in the PR
6. **End-to-end prod:** Deploy to Vercel, generate a block, push PR, merge, verify Vercel builds successfully with the new block
