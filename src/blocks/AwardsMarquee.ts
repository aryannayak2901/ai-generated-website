import type { Block } from 'payload'

export const AwardsMarquee: Block = {
  slug: 'awardsMarquee',
  fields: [
    {
      name: 'awards',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'year',
          type: 'text',
        },
        {
          name: 'organization',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        }
      ]
    }
  ],
}
