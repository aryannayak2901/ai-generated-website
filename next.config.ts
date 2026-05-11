import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from "next";
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  /* Disable reactCompiler to avoid Turbopack */
  // reactCompiler: true,
  /* Set outputFileTracingRoot to fix workspace root detection */
  outputFileTracingRoot: dirname,
};

export default withPayload(nextConfig);
