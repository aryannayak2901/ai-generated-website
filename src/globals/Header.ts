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
        { label: 'Split Luxury', value: 'split' },
        { label: 'Sidebar / App Style', value: 'sidebar' },
        { label: 'Top Bar Corporate', value: 'corporate' },
        { label: 'Floating Island', value: 'island' },
        { label: 'Mega-Nav Portal', value: 'mega' },
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
      admin: {
        condition: (data) => ['classic', 'centered', 'glassmorphic', 'minimal', 'island', 'corporate'].includes(data?.headerStyle || 'classic'),
      },
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
    {
      name: 'splitSettings',
      type: 'group',
      admin: {
        condition: (data) => data?.headerStyle === 'split',
      },
      fields: [
        {
          name: 'leftNavItems',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'link', type: 'text', required: true },
          ],
        },
        {
          name: 'rightNavItems',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'link', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'corporateSettings',
      type: 'group',
      admin: {
        condition: (data) => data?.headerStyle === 'corporate',
      },
      fields: [
        { name: 'contactEmail', type: 'text' },
        { name: 'contactPhone', type: 'text' },
      ],
    },
    {
      name: 'sidebarSettings',
      type: 'group',
      admin: {
        condition: (data) => data?.headerStyle === 'sidebar',
      },
      fields: [
        {
          name: 'drawerPosition',
          type: 'radio',
          options: [
            { label: 'Right Side', value: 'right' },
            { label: 'Left Side', value: 'left' },
          ],
          defaultValue: 'right',
          admin: {
            layout: 'horizontal',
          },
        },
        { name: 'menuLabel', type: 'text', defaultValue: 'MENU' },
        {
          name: 'navItems',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'link', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'megaNavSettings',
      type: 'group',
      admin: {
        condition: (data) => data?.headerStyle === 'mega',
      },
      fields: [
        {
          name: 'megaNavItems',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'link', type: 'text', required: true },
            {
              name: 'dropdownColumns',
              type: 'array',
              fields: [
                { name: 'columnTitle', type: 'text' },
                {
                  name: 'subLinks',
                  type: 'array',
                  fields: [
                    { name: 'label', type: 'text', required: true },
                    { name: 'link', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

