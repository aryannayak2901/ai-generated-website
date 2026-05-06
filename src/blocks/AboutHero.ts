import type { Block } from 'payload'

export const AboutHero: Block = {
  slug: 'aboutHero',
  fields: [
    {
      name: 'tag',
      type: 'text',
      required: true,
      defaultValue: 'Our Legacy',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'A Tradition of Legal Excellence.',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      required: true,
      defaultValue: 'Chambers of Jeet Bhatt combines decades of profound legal expertise with a modern, strategic approach. We are committed to upholding the highest standards of justice and integrity.',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    }
  ],
}
