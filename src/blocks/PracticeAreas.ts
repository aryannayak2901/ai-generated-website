import type { Block } from 'payload'

export const PracticeAreas: Block = {
  slug: 'practiceAreas',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Practice Areas',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      required: true,
      defaultValue: 'Specialized legal expertise tailored to your specific needs with a commitment to excellence.',
    },
    {
      name: 'areas',
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
        },
        {
          name: 'icon',
          type: 'select',
          options: ['Briefcase', 'Gavel', 'Building2', 'Landmark'],
          defaultValue: 'Briefcase',
        },
        {
          name: 'link',
          type: 'text',
          defaultValue: '#',
        }
      ]
    }
  ],
}
