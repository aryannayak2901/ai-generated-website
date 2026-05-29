import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export const dynamic = 'force-dynamic'

/**
 * Next.js Dynamic Sitemap Generator for Chambers of Jeet Bhatt.
 * Pulls static routes and dynamic records from Payload CMS (Pages, Team, and Posts),
 * mapping their last modified dates accurately and resolving SEO metadata structure.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jeetbhatt.com'

  // 1. Core static routes defined for the application
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/offices',
    '/practice-areas',
    '/blog',
    '/media',
  ]

  // Initialize the sitemap with static entries
  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }))

  try {
    const payload = await getPayload({ config: configPromise })

    // 2. Fetch Pages collection slugs
    const pagesRes = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 1000,
    })

    const pagesDocs = pagesRes.docs || []
    pagesDocs.forEach((page) => {
      if (!page.slug || page.slug === 'home') return

      const routePath = `/${page.slug}`
      // Safeguard against duplicate static routes
      if (staticRoutes.includes(routePath)) return

      sitemapEntries.push({
        url: `${siteUrl}/${page.slug}`,
        lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    })

    // 3. Fetch Team collection slugs (e.g. /team/advocate-slug)
    const teamRes = await payload.find({
      collection: 'team',
      depth: 0,
      limit: 1000,
    })

    const teamDocs = teamRes.docs || []
    teamDocs.forEach((member) => {
      if (!member.slug) return

      sitemapEntries.push({
        url: `${siteUrl}/team/${member.slug}`,
        lastModified: member.updatedAt ? new Date(member.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    })

    // 4. Fetch Published Posts collection slugs (e.g. /blog/post-slug)
    const postsRes = await payload.find({
      collection: 'posts',
      where: {
        status: {
          equals: 'published',
        },
      },
      depth: 0,
      limit: 1000,
    })

    const postsDocs = postsRes.docs || []
    postsDocs.forEach((post) => {
      if (!post.slug) return

      sitemapEntries.push({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
      })
    })
  } catch (error) {
    console.error('Error generating dynamic sitemap from Payload CMS:', error)
  }

  return sitemapEntries
}
