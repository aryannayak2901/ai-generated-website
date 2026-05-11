import type { Block } from 'payload'

export const AboutValues: Block = {
  slug: 'aboutValues',
  fields: [
    {
      name: 'tag',
      type: 'text',
      required: true,
      defaultValue: 'Our Values',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Core Values',
    },
    {
      name: 'subtitle',
      type: 'textarea',
    },
    {
      name: 'values',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          options: ['Scale', 'Shield', 'Target', 'Users', 'Award', 'Handshake'],
          defaultValue: 'Shield',
        }
      ]
    }
  ],
}
