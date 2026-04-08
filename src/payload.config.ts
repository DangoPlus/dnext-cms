import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { createAutomationPostEndpoint } from './endpoints/automation/createPost'
import { getAllowedOrigins } from './lib/config/allowedOrigins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const allowedOrigins = getAllowedOrigins()

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- DNext CMS',
    },
    components: {
      graphics: {
        Logo: '/components/Logo#Logo',
        Icon: '/components/Icon#Icon',
      },
    },
  },
  ...(allowedOrigins.length > 0
    ? {
        cors: allowedOrigins,
        csrf: allowedOrigins,
      }
    : {}),
  collections: [Users, Media, Posts, Categories, Tags],
  editor: lexicalEditor(),
  endpoints: [createAutomationPostEndpoint],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_MONGODB_URI || '',
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      // Allow local development to run without cloud storage credentials.
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      // Specify which collections should use Vercel Blob
      collections: {
        [Media.slug]: true,
      },
      // Token for interacting with Vercel Blob
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
