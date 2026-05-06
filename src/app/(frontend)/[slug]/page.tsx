import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/components/RenderBlocks'
import { Metadata } from 'next'
import type { Page } from '@/payload-types'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
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
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
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
    return notFound()
  }

  return (
    <div className="flex min-h-screen flex-col w-full">
      <RenderBlocks blocks={page.layout || []} />
    </div>
  )
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'pages',
    limit: 100,
  })

  return docs.map((doc) => ({
    slug: doc.slug,
  }))
}
