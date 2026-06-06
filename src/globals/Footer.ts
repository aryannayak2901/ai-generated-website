import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  fields: [
    {
      name: 'footerPreview',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/payload/FooterPreview#FooterPreview',
        },
      },
    },
    {
      name: 'footerStyle',
      type: 'select',
      defaultValue: 'classic',
      options: [
        { label: 'Classic Luxury', value: 'classic' },
        { label: 'Minimalist', value: 'minimal' },
        { label: 'Newsletter Focus', value: 'newsletter' },
        { label: 'Split Modern', value: 'split' },
        { label: 'Grand Centered', value: 'grand' },
        { label: 'Corporate Grid', value: 'corporate' },
        { label: 'Creative Asymmetric', value: 'asymmetric' },
        { label: 'Location Focus', value: 'location' },
        { label: 'Stacked Elegant', value: 'stacked' },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      admin: {
        condition: (data) => data?.footerStyle === 'newsletter',
      },
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Subscribe to Our Insights' },
        { name: 'description', type: 'textarea', defaultValue: 'Get the latest legal updates and strategies delivered to your inbox.' },
        { name: 'placeholder', type: 'text', defaultValue: 'Enter your email address' },
        { name: 'buttonText', type: 'text', defaultValue: 'Subscribe' },
      ],
    },
    {
      name: 'companyInfo',
      type: 'group',
      fields: [
        {
          name: 'logoText',
          type: 'text',
          defaultValue: 'Chambers of Jeet Bhatt',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'Premium legal expertise with modern approach. Trusted advisors for complex legal matters.',
        },
      ],
    },
    {
      name: 'navColumns',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Contact',
        },
        {
          name: 'address',
          type: 'textarea',
          defaultValue: 'Gandhinagar, Gujarat\nIndia',
        },
        {
          name: 'phone',
          type: 'text',
          defaultValue: '+91 94082 82982',
        },
        {
          name: 'email',
          type: 'text',
          defaultValue: 'info@jeetbhatt.com',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Twitter/X', value: 'twitter' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'bottomSection',
      type: 'group',
      fields: [
        {
          name: 'copyrightText',
          type: 'text',
          defaultValue: '© {year} Chambers of Jeet Bhatt. All rights reserved.',
        },
        {
          name: 'legalLinks',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
