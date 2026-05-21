import type { MetadataRoute } from 'next'

/**
 * Next.js Dynamic Robots Generator for Chambers of Jeet Bhatt.
 * Manages crawlability policies, explicitly welcoming reputable AI search bots
 * (GPTBot, ClaudeBot, PerplexityBot) for citation authority and AEO search readiness,
 * while strictly safeguarding private admin, preview, and server endpoints.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jeetbhatt.com'

  const commonDisallows = [
    '/admin/',
    '/admin/*',
    '/api/',
    '/preview',
    '/preview/*',
    '/api/draft',
    '/api/disable-draft',
  ]

  return {
    rules: [
      // Welcoming major AI and AEO crawlers for organic citation authority
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: commonDisallows,
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: commonDisallows,
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: commonDisallows,
      },
      // Standard search engine rules safeguarding application internal endpoints
      {
        userAgent: '*',
        allow: '/',
        disallow: commonDisallows,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
