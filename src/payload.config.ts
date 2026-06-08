import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { Pages } from "./collections/Pages";
import { Team } from "./collections/Team";
import { Header } from "./globals/Header";
import { Footer } from "./globals/Footer";
import { GA4Settings } from "./globals/GA4Settings";
import { ThemeSettings } from "./globals/ThemeSettings/config";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: "@/components/payload/Logo#Logo",
        Icon: "@/components/payload/Icon#Icon",
      },
      Nav: "@/components/payload/Nav#Nav",
      beforeLogin: ["@/components/payload/BeforeLogin#BeforeLogin"],
    },
  },

  collections: [Pages, Team, Users, Media, Posts],
  globals: [Header, Footer, GA4Settings, ThemeSettings],

  editor: lexicalEditor({}),

  secret: process.env.PAYLOAD_SECRET || "REPLACE_WITH_A_REAL_SECRET",

  db: mongooseAdapter({
    url: process.env.MONGODB_URI || "",
  }),

  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      clientUploads: true,
      addRandomSuffix: true,
    }),
  ],

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
