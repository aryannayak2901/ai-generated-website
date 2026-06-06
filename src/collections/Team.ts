import type { CollectionConfig } from 'payload'

export const Team: CollectionConfig = {
  slug: 'team',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'designation', 'slug'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'email',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'designation',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'stats',
      type: 'group',
      fields: [
        {
          name: 'experience',
          type: 'text',
          defaultValue: '10+',
        },
        {
          name: 'cases',
          type: 'text',
          defaultValue: '500+',
        },
        {
          name: 'publications',
          type: 'text',
          defaultValue: '5+',
        },
        {
          name: 'clients',
          type: 'text',
          defaultValue: '20+',
        },
      ],
    },
    {
      name: 'bio',
      type: 'richText',
    },
    {
      name: 'overview',
      type: 'group',
      fields: [
        {
          name: 'expertise',
          type: 'array',
          fields: [{ name: 'item', type: 'text' }]
        },
        {
          name: 'clients',
          type: 'array',
          fields: [{ name: 'item', type: 'text' }]
        },
        {
          name: 'cases',
          type: 'array',
          fields: [{ name: 'item', type: 'text' }]
        }
      ]
    },
    {
      name: 'experience',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'organization',
          type: 'text',
          required: true,
        },
        {
          name: 'period',
          type: 'text',
        },
        {
          name: 'responsibilities',
          type: 'array',
          fields: [{ name: 'item', type: 'text' }]
        }
      ]
    },
    {
      name: 'education',
      type: 'array',
      fields: [
        {
          name: 'degree',
          type: 'text',
          required: true,
        },
        {
          name: 'institution',
          type: 'text',
          required: true,
        },
        {
          name: 'period',
          type: 'text',
        },
        {
          name: 'specialization',
          type: 'text',
        }
      ]
    },
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
          name: 'description',
          type: 'textarea',
        }
      ]
    },
    {
      name: 'publications',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'publisher',
          type: 'text',
        },
        {
          name: 'year',
          type: 'text',
        },
        {
          name: 'link',
          type: 'text',
        }
      ]
    }
  ],
  timestamps: true,
}
