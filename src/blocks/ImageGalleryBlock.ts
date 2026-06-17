import type { Block } from 'payload'

export const ImageGallery: Block = {
  slug: 'imageGalleryBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Our Legal Chambers',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      required: true,
      defaultValue: 'A glimpse into our professional environment and distinguished cases',
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '1 Column', value: '1' },
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
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
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
  ],
}