import type { Block } from 'payload'

export const HomeHero: Block = {
  slug: 'homeHero',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Where Precision Meets Justice.',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      required: true,
      defaultValue: 'Premier counsel specialized in Corporate, Criminal, and Real Estate Law.',
    },
    {
      name: 'ctaText',
      type: 'text',
      required: true,
      defaultValue: 'Request Consultation',
    },
    {
      name: 'ctaLink',
      type: 'text',
      required: true,
      defaultValue: '/contact',
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        }
      ]
    }
  ],
}
