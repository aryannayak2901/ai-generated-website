import type { Block } from 'payload';

export const ProductList: Block = {
  slug: 'productList',
  labels: {
    singular: 'Product List',
    plural: 'Product Lists',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      required: true,
      defaultValue: 'Our Legal Services',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Section Subtitle',
      required: true,
      defaultValue: 'Comprehensive legal solutions tailored to your unique needs',
    },
    {
      name: 'products',
      type: 'array',
      label: 'Products',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Product Image',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Product Title',
          required: true,
          defaultValue: 'Service Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Product Description',
          required: true,
          defaultValue: 'Brief description of the legal service offered.',
        },
        {
          name: 'ctaText',
          type: 'text',
          label: 'CTA Button Text',
          defaultValue: 'Learn More',
        },
        {
          name: 'ctaLink',
          type: 'text',
          label: 'CTA Link',
          defaultValue: '#',
        },
      ],
    },
  ],
};
