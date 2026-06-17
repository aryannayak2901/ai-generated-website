# Full Screen Preview Modal Design

## Overview
The "Preview & Push" modal used for AI generation should cover the full window screen without any margins, padding, or rounded corners. This maximizes the available space for code preview and editing.

## Architectural Changes
No architectural changes. This is purely a styling update to existing CSS classes.

## CSS Changes
1. **`.bb-modal-overlay--wide`**:
   - Ensure `padding: 0` is applied and taking precedence. This ensures the overlay reaches the screen edges.

2. **`.bb-modal-card--wide`**:
   - Set `width: 100vw` and `height: 100vh`.
   - Remove any `max-width` constraints (e.g., overriding `960px` in `GenerateView/styles.css`).
   - Remove `border-radius` (set to `0`).
   - Remove `border` (set to `none`).

## Files Affected
- `src/components/payload/GenerateView/styles.css`
- `src/components/payload/BlocksBuilder/styles.css`

## Testing Strategy
- Open the AI generation modal in the admin panel.
- Trigger a block generation to reach the Preview phase.
- Verify the modal touches all four edges of the screen, has square corners, and does not exhibit any scrolling issues.
