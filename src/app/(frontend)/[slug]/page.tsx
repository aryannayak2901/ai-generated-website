import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { RenderBlocks } from '@/components/RenderBlocks'
import { LivePreviewProvider } from '@/components/LivePreviewProvider'
import { Metadata } from 'next'
import type { Page } from '@/payload-types'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    const page = docs[0] as unknown as Page

    if (!page) {
      return {
        title: 'Page Not Found',
      }
    }

    return {
      title: `${page.title} | Chambers of Jeet Bhatt`,
      description: `Expert legal services for ${page.title}.`,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: 'Chambers of Jeet Bhatt',
    }
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const { isEnabled: isDraft } = await draftMode()

  let page: Page | null = null

  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'pages',
      draft: isDraft,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    page = (docs[0] as unknown as Page) || null
  } catch (error) {
    console.error('Error fetching page:', error)
  }

  if (!page) {
    return notFound()
  }

  return (
    <div className="flex min-h-screen flex-col w-full">
      {isDraft ? (
        <LivePreviewProvider initialBlocks={page.layout || []} />
      ) : (
        <RenderBlocks blocks={page.layout || []} />
      )}
    </div>
  )
}

export async function generateStaticParams() {
  return []
}
