import type { Block } from 'payload'

export const PracticeAreasHero: Block = {
  slug: 'practiceAreasHero',
  fields: [
    {
      name: 'tag',
      type: 'text',
      required: true,
      defaultValue: 'Practice Areas',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Expertise Driven by Integrity',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue: 'Chambers of Jeet Bhatt offers specialized legal services across a diverse spectrum of practice areas, ensuring tailored solutions for complex legal challenges.',
    }
  ],
}

export const PracticeAreasGrid: Block = {
  slug: 'practiceAreasGrid',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Specialized Legal Solutions',
    },
    {
      name: 'subtitle',
      type: 'textarea',
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
          options: [
            { label: 'Briefcase', value: 'Briefcase' },
            { label: 'Gavel', value: 'Gavel' },
            { label: 'Building', value: 'Building2' },
            { label: 'Landmark', value: 'Landmark' },
            { label: 'Scale', value: 'Scale' },
            { label: 'Shield', value: 'Shield' },
            { label: 'File Text', value: 'FileText' },
            { label: 'Users', value: 'Users' },
            { label: 'Lightbulb', value: 'Lightbulb' },
            { label: 'Home', value: 'Home' },
            { label: 'Trending Down', value: 'TrendingDown' },
            { label: 'Map', value: 'Map' },
            { label: 'Message Square', value: 'MessageSquare' },
          ],
          defaultValue: 'Briefcase',
        },
        {
          name: 'services',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            }
          ]
        }
      ]
    }
  ],
}

export const PracticeAreasCta: Block = {
  slug: 'practiceAreasCta',
  fields: [
    {
      name: 'badge',
      type: 'text',
      defaultValue: 'Take the next step',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Ready to Discuss Your Legal Strategy?',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue: 'Our experienced attorneys are ready to help you navigate your legal challenges.',
    },
    {
      name: 'ctaText',
      type: 'text',
      defaultValue: 'Schedule Consultation',
    },
    {
      name: 'ctaLink',
      type: 'text',
      defaultValue: '/contact',
    },
    {
      name: 'phoneNumber',
      type: 'text',
      defaultValue: '+919876543210',
    }
  ],
}
