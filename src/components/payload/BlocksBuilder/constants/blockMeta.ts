export type BlockCategory = 'Hero' | 'Content' | 'CTA / Forms'

export interface BlockMeta {
  label: string
  category: BlockCategory
  icon: string
  badgeLabel: string
  defaultValues: Record<string, unknown>
}

/**
 * Metadata for every block type registered in the Pages collection.
 * blockType keys must exactly match the `slug` of the Payload Block config.
 */
export const blockMeta: Record<string, BlockMeta> = {
  // ─── Hero ────────────────────────────────────────────────────────────
  dynamicHero: {
    label: 'Dynamic Hero',
    category: 'Hero',
    icon: '✨',
    badgeLabel: 'DH',
    defaultValues: {
      blockType: 'dynamicHero',
      heading: 'Trusted Legal Excellence',
      subheading: 'Decades of expertise across corporate, litigation, and compliance law.',
      ctaText: 'Schedule a Consultation',
      ctaLink: '/contact',
    },
  },
  homeHero: {
    label: 'Home Hero',
    category: 'Hero',
    icon: '🏠',
    badgeLabel: 'Hero',
    defaultValues: {
      blockType: 'homeHero',
      heading: 'Chambers of Jeet Bhatt',
      subheading: 'Premier Legal Services',
      ctaText: 'Get in Touch',
      ctaLink: '/contact',
    },
  },
  aboutHero: {
    label: 'About Hero',
    category: 'Hero',
    icon: '👤',
    badgeLabel: 'AHro',
    defaultValues: {
      blockType: 'aboutHero',
      heading: 'About Our Chambers',
      subheading: 'A legacy of legal excellence spanning decades.',
    },
  },
  practiceAreasHero: {
    label: 'Practice Areas Hero',
    category: 'Hero',
    icon: '⚖️',
    badgeLabel: 'PAHr',
    defaultValues: {
      blockType: 'practiceAreasHero',
      heading: 'Our Practice Areas',
      subheading: 'Comprehensive legal expertise across multiple domains.',
    },
  },
  contactHero: {
    label: 'Contact Hero',
    category: 'Hero',
    icon: '📞',
    badgeLabel: 'CHro',
    defaultValues: {
      blockType: 'contactHero',
      heading: 'Contact Us',
      subheading: 'We are here to help. Reach out to us today.',
    },
  },
  blogHero: {
    label: 'Blog Hero',
    category: 'Hero',
    icon: '📝',
    badgeLabel: 'BHro',
    defaultValues: {
      blockType: 'blogHero',
      heading: 'Legal Insights',
      subheading: 'Expert commentary on the latest developments in law.',
    },
  },
  officeHero: {
    label: 'Office Hero',
    category: 'Hero',
    icon: '🏢',
    badgeLabel: 'OHro',
    defaultValues: {
      blockType: 'officeHero',
      heading: 'Our Offices',
      subheading: 'Find us across multiple locations.',
    },
  },

  // ─── Content ─────────────────────────────────────────────────────────
  practiceAreas: {
    label: 'Practice Areas Bento',
    category: 'Content',
    icon: '🗂️',
    badgeLabel: 'PA',
    defaultValues: {
      blockType: 'practiceAreas',
      heading: 'Areas of Practice',
    },
  },
  practiceAreasGrid: {
    label: 'Practice Areas Grid',
    category: 'Content',
    icon: '📋',
    badgeLabel: 'Grid',
    defaultValues: {
      blockType: 'practiceAreasGrid',
      heading: 'Explore Our Practice Areas',
    },
  },
  awardsMarquee: {
    label: 'Awards Marquee',
    category: 'Content',
    icon: '🏆',
    badgeLabel: 'Mq',
    defaultValues: {
      blockType: 'awardsMarquee',
    },
  },
  aboutTeam: {
    label: 'About Team',
    category: 'Content',
    icon: '👥',
    badgeLabel: 'Team',
    defaultValues: {
      blockType: 'aboutTeam',
      heading: 'Meet Our Team',
    },
  },
  aboutValues: {
    label: 'About Values',
    category: 'Content',
    icon: '💎',
    badgeLabel: 'Val',
    defaultValues: {
      blockType: 'aboutValues',
      heading: 'Our Core Values',
    },
  },
  officeSelector: {
    label: 'Office Selector',
    category: 'Content',
    icon: '📍',
    badgeLabel: 'OffS',
    defaultValues: {
      blockType: 'officeSelector',
      heading: 'Select an Office',
    },
  },
  mapSection: {
    label: 'Map Section',
    category: 'Content',
    icon: '🗺️',
    badgeLabel: 'Map',
    defaultValues: {
      blockType: 'mapSection',
    },
  },
  blogFilters: {
    label: 'Blog Filters',
    category: 'Content',
    icon: '🔍',
    badgeLabel: 'BFlt',
    defaultValues: {
      blockType: 'blogFilters',
      heading: 'Browse Articles',
    },
  },

  // ─── CTA / Forms ─────────────────────────────────────────────────────
  aboutCta: {
    label: 'About CTA',
    category: 'CTA / Forms',
    icon: '📢',
    badgeLabel: 'ACTA',
    defaultValues: {
      blockType: 'aboutCta',
      heading: 'Work With Us',
      ctaText: 'Contact Our Team',
      ctaLink: '/contact',
    },
  },
  practiceAreasCta: {
    label: 'Practice Areas CTA',
    category: 'CTA / Forms',
    icon: '📣',
    badgeLabel: 'PCTA',
    defaultValues: {
      blockType: 'practiceAreasCta',
      heading: 'Ready to Get Started?',
      ctaText: 'Schedule a Consultation',
      ctaLink: '/contact',
    },
  },
  officeCta: {
    label: 'Office CTA',
    category: 'CTA / Forms',
    icon: '🏢',
    badgeLabel: 'OCTA',
    defaultValues: {
      blockType: 'officeCta',
      heading: 'Visit Our Office',
      ctaText: 'Get Directions',
    },
  },
  contactForm: {
    label: 'Contact Form',
    category: 'CTA / Forms',
    icon: '📋',
    badgeLabel: 'Form',
    defaultValues: {
      blockType: 'contactForm',
      heading: 'Send Us a Message',
    },
  },
  contactInfo: {
    label: 'Contact Info',
    category: 'CTA / Forms',
    icon: '📇',
    badgeLabel: 'Info',
    defaultValues: {
      blockType: 'contactInfo',
      heading: 'Get in Touch',
    },
  },
  contactMap: {
    label: 'Contact Map',
    category: 'CTA / Forms',
    icon: '🗺️',
    badgeLabel: 'CMap',
    defaultValues: {
      blockType: 'contactMap',
    },
  },
  newsletter: {
    label: 'Newsletter',
    category: 'CTA / Forms',
    icon: '📧',
    badgeLabel: 'News',
    defaultValues: {
      blockType: 'newsletter',
      heading: 'Stay Informed',
      subheading: 'Subscribe to our legal insights newsletter.',
      ctaText: 'Subscribe',
    },
  },
}

/** Ordered list of categories for the Block Library panel */
export const BLOCK_CATEGORIES: BlockCategory[] = ['Hero', 'Content', 'CTA / Forms']
