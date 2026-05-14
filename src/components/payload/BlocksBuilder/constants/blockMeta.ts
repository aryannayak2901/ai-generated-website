export interface BlockMeta {
  label: string;
  category: 'Hero' | 'Content' | 'CTA / Forms';
  icon: string;
  badgeLabel: string;
  defaultValues: any;
}

export const blockMeta: Record<string, BlockMeta> = {
  dynamicHero: {
    label: 'Dynamic Hero',
    category: 'Hero',
    icon: '⚡',
    badgeLabel: 'Hero',
    defaultValues: {
      blockType: 'dynamicHero',
      layoutType: 'centered',
      heading: 'New Hero Heading',
      subheading: 'New Hero Subheading',
      ctas: []
    }
  },
  homeHero: {
    label: 'Home Hero',
    category: 'Hero',
    icon: '🏠',
    badgeLabel: 'Home',
    defaultValues: {
      blockType: 'homeHero',
      title: 'Where Precision Meets Justice.',
      subtitle: 'Premier counsel specialized in Corporate, Criminal, and Real Estate Law.',
      ctaText: 'Request Consultation',
      ctaLink: '/contact',
      images: []
    }
  },
  aboutHero: {
    label: 'About Hero',
    category: 'Hero',
    icon: '👤',
    badgeLabel: 'About',
    defaultValues: {
      blockType: 'aboutHero',
      tag: 'Our Legacy',
      title: 'A Tradition of Legal Excellence.',
      subtitle: 'Chambers of Jeet Bhatt combines decades of profound legal expertise with a modern, strategic approach. We are committed to upholding the highest standards of justice and integrity.'
    }
  },
  practiceAreasHero: {
    label: 'Practice Areas Hero',
    category: 'Hero',
    icon: '⚖️',
    badgeLabel: 'Areas',
    defaultValues: {
      blockType: 'practiceAreasHero',
      tag: 'Practice Areas',
      title: 'Expertise Driven by Integrity',
      subtitle: 'Chambers of Jeet Bhatt offers specialized legal services across a diverse spectrum of practice areas, ensuring tailored solutions for complex legal challenges.'
    }
  },
  contactHero: {
    label: 'Contact Hero',
    category: 'Hero',
    icon: '📞',
    badgeLabel: 'Contact',
    defaultValues: {
      blockType: 'contactHero',
      tag: 'Get in Touch',
      title: 'Ready to Discuss Your Legal Strategy?',
      subtitle: 'Reach out to Chambers of Jeet Bhatt for expert legal guidance and consultations.',
      phone: '+91 94082 82982',
      email: 'info@jeetbhatt.com'
    }
  },
  blogHero: {
    label: 'Blog Hero',
    category: 'Hero',
    icon: '📝',
    badgeLabel: 'Blog',
    defaultValues: {
      blockType: 'blogHero',
      tag: 'Insights',
      title: 'Legal Insights & Updates',
      subtitle: 'Stay informed with the latest legal developments and expert analysis from our team.'
    }
  },
  officeHero: {
    label: 'Office Hero',
    category: 'Hero',
    icon: '🏢',
    badgeLabel: 'Office',
    defaultValues: {
      blockType: 'officeHero',
      tag: 'Our Presence',
      title: 'Strategic Locations Across Gujarat',
      subtitle: 'With offices in Ahmedabad and Vadodara, Chambers of Jeet Bhatt is positioned to provide expert legal counsel across the state.'
    }
  },
  practiceAreas: {
    label: 'Practice Areas',
    category: 'Content',
    icon: '📋',
    badgeLabel: 'Areas',
    defaultValues: {
      blockType: 'practiceAreas',
      title: 'Our Practice Areas',
      subtitle: 'Comprehensive legal expertise across multiple domains',
      areas: []
    }
  },
  practiceAreasGrid: {
    label: 'Practice Areas Grid',
    category: 'Content',
    icon: '⚡',
    badgeLabel: 'Grid',
    defaultValues: {
      blockType: 'practiceAreasGrid',
      title: 'Specialized Legal Solutions',
      subtitle: 'Explore our comprehensive range of legal services',
      areas: []
    }
  },
  awardsMarquee: {
    label: 'Awards Marquee',
    category: 'Content',
    icon: '🏆',
    badgeLabel: 'Awards',
    defaultValues: {
      blockType: 'awardsMarquee',
      awards: []
    }
  },
  aboutTeam: {
    label: 'About Team',
    category: 'Content',
    icon: '👥',
    badgeLabel: 'Team',
    defaultValues: {
      blockType: 'aboutTeam',
      title: 'Our Legal Team',
      subtitle: 'Meet our experienced attorneys and legal professionals',
      members: []
    }
  },
  aboutValues: {
    label: 'About Values',
    category: 'Content',
    icon: '💎',
    badgeLabel: 'Values',
    defaultValues: {
      blockType: 'aboutValues',
      title: 'Our Core Values',
      subtitle: 'The principles that guide our practice',
      values: []
    }
  },
  officeSelector: {
    label: 'Office Selector',
    category: 'Content',
    icon: '📍',
    badgeLabel: 'Selector',
    defaultValues: {
      blockType: 'officeSelector',
      title: 'Choose an Office',
      subtitle: 'Select the most convenient location for your needs',
      offices: []
    }
  },
  mapSection: {
    label: 'Map Section',
    category: 'Content',
    icon: '🗺️',
    badgeLabel: 'Map',
    defaultValues: {
      blockType: 'mapSection',
      title: 'Find Us',
      subtitle: 'Locate our offices across Gujarat',
      offices: []
    }
  },
  blogFilters: {
    label: 'Blog Filters',
    category: 'Content',
    icon: '🔍',
    badgeLabel: 'Filters',
    defaultValues: {
      blockType: 'blogFilters',
      title: 'Filter Articles',
      subtitle: 'Find the content that matters to you',
      categories: []
    }
  },
  aboutCta: {
    label: 'About CTA',
    category: 'CTA / Forms',
    icon: '🎯',
    badgeLabel: 'CTA',
    defaultValues: {
      blockType: 'aboutCta',
      badge: 'Ready to help',
      title: 'Need Expert Legal Counsel?',
      subtitle: 'Contact us today to discuss your legal needs',
      primaryText: 'Get in Touch',
      primaryLink: '/contact',
      secondaryText: 'Learn More',
      secondaryLink: '/services'
    }
  },
  practiceAreasCta: {
    label: 'Practice Areas CTA',
    category: 'CTA / Forms',
    icon: '🚀',
    badgeLabel: 'CTA',
    defaultValues: {
      blockType: 'practiceAreasCta',
      badge: 'Take the next step',
      title: 'Ready to Discuss Your Legal Strategy?',
      subtitle: 'Contact our team to explore how we can assist with your legal matters',
      primaryText: 'Schedule Consultation',
      primaryLink: '/contact',
      secondaryText: 'View All Services',
      secondaryLink: '/practice-areas'
    }
  },
  officeCta: {
    label: 'Office CTA',
    category: 'CTA / Forms',
    icon: '🏢',
    badgeLabel: 'CTA',
    defaultValues: {
      blockType: 'officeCta',
      badge: 'Visit us',
      title: 'Ready to Meet in Person?',
      subtitle: 'Schedule a consultation at one of our convenient office locations',
      primaryText: 'Book Appointment',
      primaryLink: '/contact',
      secondaryText: 'View Locations',
      secondaryLink: '/offices'
    }
  },
  contactForm: {
    label: 'Contact Form',
    category: 'CTA / Forms',
    icon: '📝',
    badgeLabel: 'Form',
    defaultValues: {
      blockType: 'contactForm',
      badge: 'Direct Inquiry',
      title: 'Send a Message',
      subtitle: 'Have a complex legal question? Fill out the form and our specialist team will reach out with a strategic roadmap.',
      features: []
    }
  },
  contactInfo: {
    label: 'Contact Info',
    category: 'CTA / Forms',
    icon: '📋',
    badgeLabel: 'Info',
    defaultValues: {
      blockType: 'contactInfo',
      infoItems: []
    }
  },
  contactMap: {
    label: 'Contact Map',
    category: 'CTA / Forms',
    icon: '🗺️',
    badgeLabel: 'Map',
    defaultValues: {
      blockType: 'contactMap',
      title: 'Find Our Office',
      subtitle: 'Visit us at our convenient location',
      address: 'Ahmedabad, Gujarat',
      mapEmbedUrl: ''
    }
  },
  newsletter: {
    label: 'Newsletter',
    category: 'CTA / Forms',
    icon: '📧',
    badgeLabel: 'News',
    defaultValues: {
      blockType: 'newsletter',
      title: 'Stay Updated',
      subtitle: 'Subscribe to our newsletter for legal insights and updates',
      placeholder: 'Enter your email address',
      buttonText: 'Subscribe'
    }
  }
};

export type BlockCategory = 'Hero' | 'Content' | 'CTA / Forms';

export const blockCategories: Record<BlockCategory, BlockCategory> = {
  Hero: 'Hero',
  Content: 'Content',
  'CTA / Forms': 'CTA / Forms'
};

export const blockCategoryOrder: BlockCategory[] = ['Hero', 'Content', 'CTA / Forms'];