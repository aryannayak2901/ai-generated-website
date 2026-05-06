import type { Block } from 'payload'

export const AboutTeam: Block = {
  slug: 'aboutTeam',
  fields: [
    {
      name: 'tag',
      type: 'text',
      required: true,
      defaultValue: 'Legal Experts',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Meet Our Team',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue: 'Our firm is comprised of highly specialized advocates with a deep understanding of complex legal frameworks.',
    },
    {
      name: 'teamMembers',
      type: 'relationship',
      relationTo: 'team',
      hasMany: true,
    }
  ],
}
