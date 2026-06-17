import type { CollectionConfig } from 'payload'

export const AIGenerations: CollectionConfig = {
  slug: 'ai-generations',
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => {
      if (user) {
        return {
          user: {
            equals: user.id,
          },
        }
      }
      return false
    },
    update: ({ req: { user } }) => {
      if (user) {
        return {
          user: {
            equals: user.id,
          },
        }
      }
      return false
    },
    delete: ({ req: { user } }) => {
      if (user) {
        return {
          user: {
            equals: user.id,
          },
        }
      }
      return false
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'prompt',
      type: 'text',
      required: true,
    },
    {
      name: 'mode',
      type: 'select',
      options: [
        { label: 'Block', value: 'block' },
        { label: 'Page', value: 'page' },
      ],
      required: false, // The description didn't explicitly say required, but let's make it optional if not specified
    },
    {
      name: 'provider',
      type: 'text',
    },
    {
      name: 'model',
      type: 'text',
    },
    {
      name: 'blocks',
      type: 'json',
      required: true,
    },
  ],
}
