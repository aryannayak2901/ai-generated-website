import type { Block } from 'payload'

export const OfficeHero: Block = {
  slug: 'officeHero',
  fields: [
    {
      name: 'tag',
      type: 'text',
      required: true,
      defaultValue: 'Our Presence',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Strategic Locations Across Gujarat',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue: 'With offices in Ahmedabad and Vadodara, Chambers of Jeet Bhatt is positioned to provide expert legal counsel across the state.',
    }
  ],
}

export const OfficeSelector: Block = {
  slug: 'officeSelector',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Choose an Office',
    },
    {
      name: 'subtitle',
      type: 'textarea',
    },
    {
      name: 'offices',
      type: 'array',
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'address',
          type: 'textarea',
          required: true,
        },
        {
          name: 'phone',
          type: 'array',
          fields: [
            {
              name: 'number',
              type: 'text',
              required: true,
            }
          ]
        },
        {
          name: 'email',
          type: 'text',
        },
        {
          name: 'mapUrl',
          type: 'text',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'hours',
          type: 'array',
          fields: [
            {
              name: 'day',
              type: 'text',
              required: true,
            },
            {
              name: 'time',
              type: 'text',
              required: true,
            }
          ]
        }
      ]
    }
  ],
}

export const MapSection: Block = {
  slug: 'mapSection',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Our Global Reach',
    },
    {
      name: 'subtitle',
      type: 'textarea',
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        }
      ]
    },
    {
      name: 'mapOverlayTitle',
      type: 'text',
    },
    {
      name: 'mapOverlayDescription',
      type: 'textarea',
    },
    {
      name: 'mapUrl',
      type: 'text',
      defaultValue: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.697926017772!2d72.5222!3d23.0784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e833444444445%3A0x6b74ad4a4e63480e!2sSG+Business+Hub!5e0!3m2!1sen!2sin!4v1710450000000!5m2!1sen!2sin',
    }
  ],
}

export const OfficeCTA: Block = {
  slug: 'officeCta',
  fields: [
    {
      name: 'badge',
      type: 'text',
      defaultValue: 'Trust & Excellence',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Visit Our Chambers',
    },
    {
      name: 'subtitle',
      type: 'textarea',
    },
    {
      name: 'ctaText1',
      type: 'text',
      defaultValue: 'Book An Appointment',
    },
    {
      name: 'ctaLink1',
      type: 'text',
      defaultValue: '/contact',
    },
    {
      name: 'ctaText2',
      type: 'text',
      defaultValue: 'Call Direct',
    },
    {
      name: 'ctaLink2',
      type: 'text',
    },
    {
      name: 'disclaimer',
      type: 'text',
      defaultValue: 'Monday — Saturday • 24/7 Priority Support',
    }
  ],
}
