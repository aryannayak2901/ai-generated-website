import type { Block } from 'payload'

export const BlogHero: Block = {
  slug: 'blogHero',
  fields: [
    {
      name: 'tag',
      type: 'text',
      required: true,
      defaultValue: 'Insights & Updates',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Deep Dives into Legal Excellence',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue: 'Stay updated with the latest legal perspectives, news, and analysis from Chambers of Jeet Bhatt.',
    },
    {
      name: 'featuredPost',
      type: 'relationship',
      relationTo: 'posts',
      required: false,
    }
  ],
}

export const BlogFiltersBlock: Block = {
  slug: 'blogFilters',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Filter by Category',
    }
  ],
}

export const Newsletter: Block = {
  slug: 'newsletter',
  fields: [
    {
      name: 'badge',
      type: 'text',
      defaultValue: 'Newsletter',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Stay Informed',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue: 'Subscribe to our newsletter for exclusive legal insights and firm updates delivered directly to your inbox.',
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: 'Subscribe',
    },
    {
      name: 'disclaimer',
      type: 'text',
      defaultValue: '* Your privacy is our priority. Unsubscribe at any time.',
    }
  ],
}
