import type { CollectionConfig } from 'payload'
import { HomeHero } from '../blocks/HomeHero'
import { PracticeAreas } from '../blocks/PracticeAreas'
import { AwardsMarquee } from '../blocks/AwardsMarquee'
import { AboutHero } from '../blocks/AboutHero'
import { AboutTeam } from '../blocks/AboutTeam'
import { AboutValues } from '../blocks/AboutValues'
import { AboutCta } from '../blocks/AboutCta'
import { PracticeAreasHero, PracticeAreasGrid, PracticeAreasCta } from '../blocks/PracticeAreasBlocks'
import { ContactHero, ContactInfo, ContactFormBlock, ContactMap } from '../blocks/ContactBlocks'
import { BlogHero, BlogFiltersBlock, Newsletter } from '../blocks/BlogBlocks'
import { OfficeHero, OfficeSelector, MapSection, OfficeCTA } from '../blocks/OfficeBlocks'
import { HeroBlock } from '../blocks/HeroBlock'
import { ProductList } from '../blocks/ProductList'
import { ImageGalleryBlock } from '../blocks/ImageGalleryBlock'

const formatSlug = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    components: {
      views: {
        list: {
          Component: '@/components/payload#PagesStudioView',
        },
      },
    },
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.title && !data.slug) {
          data.slug = formatSlug(data.title)
        } else if (data.slug) {
          data.slug = formatSlug(data.slug)
        }
        return data
      },
    ],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'The URL-friendly identifier for this page.',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        HeroBlock,
        HomeHero,
        PracticeAreas,
        AwardsMarquee,
        AboutHero,
        AboutTeam,
        AboutValues,
        AboutCta,
        PracticeAreasHero,
        PracticeAreasGrid,
        PracticeAreasCta,
        ContactHero,
        ContactInfo,
        ContactFormBlock,
        ContactMap,
        BlogHero,
        BlogFiltersBlock,
        Newsletter,
        OfficeHero,
        OfficeSelector,
        MapSection,
        OfficeCTA,
        ProductList,
        ImageGalleryBlock,
      ],
      admin: {
        components: {
          Field: '@/components/payload#BlocksBuilderField',
        },
      },
    },
  ],
  timestamps: true,
}
