# Spec: Dynamic Block Components and Advanced Studio Form Editor

**Date:** 2026-05-22
**Author:** Antigravity (Elite Frontend Engineer & UI/UX Designer)
**Status:** Approved by User

---

## 1. Goal Description

Currently, the custom `PagesStudioView` block builder editor allows adding and reordering block components, but the block components are not fully dynamic.
1. **Uneditable Array Fields:** Array fields (e.g., list of practice areas, core values, team members, awards) display an *"Array editing coming soon"* message inside the `EditPanel.tsx` form.
2. **Hardcoded Fallbacks:** Because these fields could not be populated dynamically through the Studio, block components on the frontend are either relying on hardcoded static data or showing partial information.
3. **Configuration Alignment:** There are field name mismatches between default values in `blockMeta.ts` and the actual Payload CMS block configuration files (e.g., `members` vs `teamMembers`).

This specification designs a **Schema-Driven Form Generation Engine** for `EditPanel.tsx` that enables collapsible card editing for list items, media selection from `/api/media`, and relationship selection from `/api/team`. It also aligns all data models between Payload configurations and the custom Studio builder.

---

## 2. Proposed System Architecture

### A. Schema Definitions in `blockMeta.ts`
We will introduce a `fields` property to each block defined in `blockMeta.ts` (located at `src/components/payload/BlocksBuilder/constants/blockMeta.ts`).

The structure of a `FieldSchema` is defined as:
```typescript
export interface FieldSchema {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'boolean' | 'array' | 'upload' | 'relationship';
  relationTo?: 'media' | 'team';
  options?: { label: string; value: string }[];
  defaultValue?: any;
  fields?: FieldSchema[]; // For nested fields (like items in an array)
}
```

#### Example Block Schema (Practice Areas):
```typescript
practiceAreas: {
  label: 'Practice Areas',
  category: 'Content',
  icon: '📋',
  badgeLabel: 'Areas',
  defaultValues: {
    blockType: 'practiceAreas',
    title: 'Our Practice Areas',
    subtitle: 'Comprehensive legal expertise across multiple domains',
    areas: []
  },
  fields: [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
    {
      name: 'areas',
      label: 'Areas List',
      type: 'array',
      fields: [
        { name: 'title', label: 'Area Name', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        {
          name: 'icon',
          label: 'Icon Type',
          type: 'select',
          options: [
            { label: 'Briefcase', value: 'Briefcase' },
            { label: 'Gavel', value: 'Gavel' },
            { label: 'Building', value: 'Building2' },
            { label: 'Landmark', value: 'Landmark' },
            { label: 'Scale', value: 'Scale' },
            { label: 'File Text', value: 'FileText' }
          ]
        },
        { name: 'link', label: 'Link URL', type: 'text', defaultValue: '#' }
      ]
    }
  ]
}
```

---

### B. Recursive Form Generation in `EditPanel.tsx`
We will replace the flat `Object.entries(formData)` mapping in `EditPanel.tsx` with a recursive schema renderer that matches the defined `fields` array for the current block.

#### 1. Array Field Rendering (Collapsible Cards)
When `type === 'array'` is encountered:
*   Show a section header with an **"Add Item"** button.
*   Render a list of active items using styled, gently rounded cards with a premium glassmorphic feel (`bg-white/5 border border-white/10 hover:border-accent/40 shadow-sm`).
*   Each card features:
    *   An index and an inferred title (e.g., `item.title` or `item.name` or `item.label` or `"Item #"`) for the collapsed state.
    *   A **"Delete" (Trash icon)** button to immediately remove the item from the local array.
    *   A chevron or layout toggle to expand/collapse.
*   *Expansion:* Clicking the card toggles open a nested form, recursively rendering all inputs specified in the sub-fields configuration list of the schema.

#### 2. Relationship and Media Upload Handling
To make images and relational fields fully editable:
*   **Media Uploads (`type === 'upload'`):**
    *   Display a dual-mode control:
        1. A **Text Input** for pasting external direct links (e.g., Unsplash).
        2. A **Media Dropdown** that queries `/api/media` in the background and populates a dropdown of uploaded filenames or thumbnail previews.
*   **Collection Relationships (`type === 'relationship'`):**
    *   When the schema specifies `relationTo: 'team'`, the panel will fetch all items from `/api/team` on load.
    *   Render a multi-select checkbox list or a select dropdown containing all available team members, allowing quick and dynamic assignment to a block.

---

### C. Aligned Data Fields & Mismatches
We will review and fix the following mismatches to ensure seamless mapping between Payload schemas (`src/blocks/`) and the custom Studio builder:
*   `aboutTeam`: Rename `members: []` to `teamMembers: []` in default values to align with `src/blocks/AboutTeam.ts`.
*   `blogFilters`: Remove array placeholder if unused, or properly define field mapping.
*   `awardsMarquee`: Map correctly to `awards` array fields.

---

## 3. Implementation Plan & Spec Review

1. **Verify schemas:** Map out complete schemas for all 12 block components.
2. **Update `blockMeta.ts`:** Append `fields` definitions to each block in `blockMeta.ts` to implement full Approach 1 metadata.
3. **Build `EditPanel.tsx` form engine:**
    *   Implement recursive field rendering.
    *   Implement collapsible lists for array fields with dynamic additions/deletions.
    *   Implement `/api/media` and `/api/team` asynchronously loaded lists.
4. **Test & Verify:** Perform functional checks inside the custom studio editor and confirm page layout compiles.
