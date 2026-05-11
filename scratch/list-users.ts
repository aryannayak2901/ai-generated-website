import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config })
  const users = await payload.find({
    collection: 'users',
  })
  console.log('Users found:', users.docs.map(u => u.email))
  process.exit(0)
}

run()
