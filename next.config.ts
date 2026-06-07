import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from "next";
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const nextConfig: NextConfig = {
  serverExternalPackages: ['sharp', 'mongoose'],
  devIndicators: {
    position: 'bottom-right',
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  /* Allow the Payload admin to embed the site in an iframe for live preview */
  async headers() {
    return [
      {
        // All non-admin routes
        source: '/((?!admin).*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]
  },
  /* Disable reactCompiler to avoid Turbopack */
  // reactCompiler: true,
  /* Set outputFileTracingRoot to fix workspace root detection */
  outputFileTracingRoot: dirname,
  env: {
    // Expose for client-side BlocksBuilderField to build the preview URL
    NEXT_PUBLIC_PREVIEW_SECRET: process.env.PREVIEW_SECRET ?? '',
  },
};

export default withPayload(nextConfig);
