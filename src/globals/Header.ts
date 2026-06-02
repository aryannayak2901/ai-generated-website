import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  fields: [
    {
      name: 'headerPreview',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/payload/HeaderPreview#HeaderPreview',
        },
      },
    },
    {
      name: 'headerStyle',
      type: 'select',
      defaultValue: 'classic',
      options: [
        { label: 'Classic', value: 'classic' },
        { label: 'Centered', value: 'centered' },
        { label: 'Glassmorphic', value: 'glassmorphic' },
        { label: 'Minimal', value: 'minimal' },
      ],
    },
    {
      name: 'sticky',
      type: 'checkbox',
      label: 'Sticky Header',
      defaultValue: true,
    },
    {
      name: 'showCTA',
      type: 'checkbox',
      label: 'Display Consult Button',
      defaultValue: false,
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA Button Label',
      admin: {
        condition: (data) => !!data?.showCTA,
      },
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'CTA Destination Link',
      admin: {
        condition: (data) => !!data?.showCTA,
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'navItems',
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
}

