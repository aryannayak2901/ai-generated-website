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
