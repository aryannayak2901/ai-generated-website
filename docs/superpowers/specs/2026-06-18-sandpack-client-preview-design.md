# Client-Side Sandpack Preview Architecture

## Purpose
The current AI Block Generator preview relies on dynamically creating `.tsx` files in the local filesystem (`src/components/blocks/_preview`) and compiling them via a Next.js API route and dynamic imports. This architecture works locally but is incompatible with production serverless environments (like Vercel) due to read-only filesystems and build-time compilation requirements.

This design transitions the preview architecture entirely to the client-side using `@codesandbox/sandpack-react`, ensuring the AI Block Generator preview functions flawlessly in production deployments.

## Scope
- Refactoring `AIPreviewPanel.tsx` to utilize native `SandpackPreview`.
- Deleting the legacy file-system-based preview infrastructure (`previewStore.ts`, API routes, Next.js preview page).
- Ensuring the existing `transformForSandpack` utility seamlessly pipes into the new client-side preview canvas.

## Architecture & Data Flow

1. **AI Generation:** The AI continues to return the raw React component code and payload configuration. No changes are required here.
2. **Code Transformation:** The raw React code is passed into the existing `transformForSandpack` utility. This utility strips TypeScript, polyfills Next.js imports (`next/image`, `next/link`), and generates a Sandpack-compatible `React` template payload.
3. **Client-Side Rendering:** The `AIPreviewPanel.tsx` component is updated. Instead of using an iframe pointing to a Next.js dynamic route, we will use the `<SandpackPreview />` component from `@codesandbox/sandpack-react`. This component takes the files from the `SandpackProvider` and compiles them entirely in the browser.

## Component Changes

### `src/components/payload/BlocksBuilder/AIPreviewPanel.tsx`
- **Remove:** The custom `NextJsPreview` component.
- **Remove:** The `PreviewRefresher` component.
- **Add:** Import `SandpackPreview` from `@codesandbox/sandpack-react`.
- **Modify:** Replace the iframe implementation inside `<div className="aip-canvas__frame">` with `<SandpackPreview />`. Adjust CSS/styling to ensure it fits the viewport properly.

### Code Cleanup (Deletions)
The following files and directories will be deleted as they are no longer required for the preview flow:
- `src/lib/previewStore.ts`
- `src/app/api/ai-preview/route.ts`
- `src/app/preview/sandbox/[token]/page.tsx`
- The `src/components/blocks/_preview` directory (if it exists).

## Trade-offs
- **Pros:** 100% production-ready. No server-side file writing. Secure client-side sandbox execution. Ephemeral previews that clean up automatically when the modal closes.
- **Cons:** Sandpack requires downloading its bundler payload on the client, which adds a slight initial load overhead when the preview modal first opens (already mitigated by the fact that `SandpackProvider` is already loaded for the code editor).

## Verification
- Run local development server (`npm run dev`).
- Generate a new block using the AI block generator.
- Verify the code editor correctly displays the code.
- Verify the preview panel correctly renders the component without hitting the `/api/ai-preview` endpoint.
- Verify hot-reloading works when editing code in the Sandpack code editor pane.
