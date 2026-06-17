import React from 'react'
import { HeroBlockRenderer } from '@/components/blocks/HeroBlockRenderer'
import { HeroSection } from '@/components/home/HeroSection'
import { PracticeAreasBento } from '@/components/home/PracticeAreasBento'
import { AwardsMarquee } from '@/components/home/AwardsMarquee'
import { AboutHero } from '@/components/about/AboutHero'
import { AboutTeam } from '@/components/about/AboutTeam'
import { AboutValues } from '@/components/about/AboutValues'
import { AboutCta } from '@/components/about/AboutCta'
import { PracticeAreasHero } from '@/components/practice-areas/PracticeAreasHero'
import { PracticeAreasGrid } from '@/components/practice-areas/PracticeAreasGrid'
import { CTASection as PracticeAreasCta } from '@/components/practice-areas/CTASection'
import ContactHero from '@/components/contact/ContactHero'
import ContactInfo from '@/components/contact/ContactInfo'
import ContactForm from '@/components/contact/ContactForm'
import ContactMap from '@/components/contact/ContactMap'
import { BlogHero } from '@/components/blog/BlogHero'
import { BlogFilters } from '@/components/blog/BlogFilters'
import { Newsletter } from '@/components/blog/Newsletter'
import { OfficeHero } from '@/components/offices/OfficeHero'
import { OfficeSelector } from '@/components/offices/OfficeSelector'
import { MapSection } from '@/components/offices/MapSection'
import { OfficeCTA } from '@/components/offices/OfficeCTA'

import type { Page } from '@/payload-types'
import { ProductList } from '@/components/blocks/ProductList'
import { ImageGalleryBlock } from '@/components/blocks/ImageGalleryBlock'

const blockComponents: Record<string, React.ComponentType<any>> = {
  dynamicHero: HeroBlockRenderer,
  homeHero: HeroSection,
  practiceAreas: PracticeAreasBento,
  awardsMarquee: AwardsMarquee,
  aboutHero: AboutHero,
  aboutTeam: AboutTeam,
  aboutValues: AboutValues,
  aboutCta: AboutCta,
  practiceAreasHero: PracticeAreasHero,
  practiceAreasGrid: PracticeAreasGrid,
  practiceAreasCta: PracticeAreasCta,
  contactHero: ContactHero as any,
  contactInfo: ContactInfo as any,
  contactForm: ContactForm as any,
  contactMap: ContactMap as any,
  blogHero: BlogHero,
  blogFilters: BlogFilters,
  newsletter: Newsletter,
  officeHero: OfficeHero,
  officeSelector: OfficeSelector,
  mapSection: MapSection,
  officeCta: OfficeCTA,
  productList: ProductList,
  imageGalleryBlock: ImageGalleryBlock,
}

export const RenderBlocks: React.FC<{ blocks: NonNullable<Page['layout']> }> = ({ blocks }) => {
  if (!blocks) return null

  return (
    <>
      {blocks.map((block, index) => {
        const { blockType } = block
        if (blockType && blockType in blockComponents) {
          const Block = blockComponents[blockType]
          return <Block key={index} {...block} />
        }
        return null
      })}
    </>
  )
}
