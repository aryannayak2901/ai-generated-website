import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Pages } from './collections/Pages'
import { Header } from './globals/Header'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

import { Team } from './collections/Team'

export default buildConfig({
  // Force refresh for Pages Studio view
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: '@/components/payload/Logo#Logo',
        Icon: '@/components/payload/Icon#Icon',
      },
      beforeLogin: ['@/components/payload/BeforeLogin#BeforeLogin'],
    },
  },
  collections: [Pages, Team, Users, Media, Posts],
  globals: [Header],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'REPLACE_WITH_A_REAL_SECRET',
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
