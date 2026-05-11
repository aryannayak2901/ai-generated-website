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

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
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
        position: 'sidebar',
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
      ]
    }
  ],
  timestamps: true,
}
