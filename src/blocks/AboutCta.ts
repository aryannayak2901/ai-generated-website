import type { Block } from 'payload'

export const AboutCta: Block = {
  slug: 'aboutCta',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Ready to discuss your legal needs?',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue: 'Our team of dedicated advocates is prepared to provide the strategic representation and expert counsel you deserve. Schedule your consultation today.',
    },
    {
      name: 'ctaText',
      type: 'text',
      defaultValue: 'Schedule a Consultation',
    },
    {
      name: 'ctaLink',
      type: 'text',
      defaultValue: '/contact',
    },
    {
      name: 'secondaryCtaText',
      type: 'text',
      defaultValue: 'Explore Practice Areas',
    },
    {
      name: 'secondaryCtaLink',
      type: 'text',
      defaultValue: '/practice-areas',
    }
  ],
}
