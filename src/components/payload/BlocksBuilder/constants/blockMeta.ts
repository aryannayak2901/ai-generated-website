export interface FieldSchema {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'boolean' | 'array' | 'upload' | 'relationship';
  relationTo?: 'media' | 'team' | 'posts';
  options?: { label: string; value: string }[] | string[];
  defaultValue?: any;
  fields?: FieldSchema[]; // For nested fields inside arrays
}

export interface BlockMeta {
  label: string;
  category: 'Hero' | 'Content' | 'CTA / Forms';
  icon: string;
  badgeLabel: string;
  defaultValues: any;
  fields?: FieldSchema[];
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
    },
    fields: [
      {
        name: 'layoutType',
        label: 'Layout Type',
        type: 'select',
        options: [
          { label: 'Centered Typographic', value: 'centered' },
          { label: 'Split Layout', value: 'split' },
          { label: 'Asymmetric Glassmorphism', value: 'asymmetric' }
        ],
        defaultValue: 'centered'
      },
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'subheading', label: 'Subheading', type: 'textarea' },
      { name: 'media', label: 'Background Image', type: 'upload', relationTo: 'media' },
      {
        name: 'ctas',
        label: 'Call to Actions',
        type: 'array',
        fields: [
          { name: 'label', label: 'Button Label', type: 'text' },
          { name: 'link', label: 'Button Link', type: 'text' },
          {
            name: 'style',
            label: 'Style',
            type: 'select',
            options: [
              { label: 'Primary Gold', value: 'primary' },
              { label: 'Secondary Navy', value: 'secondary' },
              { label: 'Ghost White', value: 'ghost' }
            ],
            defaultValue: 'primary'
          }
        ]
      }
    ]
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
    },
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'ctaText', label: 'CTA Button Text', type: 'text' },
      { name: 'ctaLink', label: 'CTA Button Link', type: 'text' },
      {
        name: 'images',
        label: 'Carousel Images',
        type: 'array',
        fields: [
          { name: 'image', label: 'Image Upload', type: 'upload', relationTo: 'media' }
        ]
      }
    ]
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
      subtitle: 'Chambers of Jeet Bhatt combines decades of profound legal expertise with a modern, strategic approach. We are committed to upholding the highest standards of justice and integrity.',
      image: ''
    },
    fields: [
      { name: 'tag', label: 'Tagline', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'image', label: 'Hero Image', type: 'upload', relationTo: 'media' }
    ]
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
    },
    fields: [
      { name: 'tag', label: 'Tagline', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' }
    ]
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
    },
    fields: [
      { name: 'tag', label: 'Tagline', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'phone', label: 'Chamber Phone', type: 'text' },
      { name: 'email', label: 'Chamber Email', type: 'text' }
    ]
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
      subtitle: 'Stay informed with the latest legal developments and expert analysis from our team.',
      featuredPost: ''
    },
    fields: [
      { name: 'tag', label: 'Tagline', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'featuredPost', label: 'Featured Article (Relationship)', type: 'relationship', relationTo: 'posts' }
    ]
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
    },
    fields: [
      { name: 'tag', label: 'Tagline', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' }
    ]
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
    },
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      {
        name: 'areas',
        label: 'Practice Areas List',
        type: 'array',
        fields: [
          { name: 'title', label: 'Area Name', type: 'text' },
          { name: 'description', label: 'Description', type: 'textarea' },
          {
            name: 'icon',
            label: 'Icon Type',
            type: 'select',
            options: [
              { label: 'Briefcase (Corporate)', value: 'Briefcase' },
              { label: 'Gavel (Criminal)', value: 'Gavel' },
              { label: 'Building (Real Estate)', value: 'Building2' },
              { label: 'Landmark (Constitutional)', value: 'Landmark' },
              { label: 'Scale (Civil)', value: 'Scale' },
              { label: 'File Text (Advisory)', value: 'FileText' }
            ],
            defaultValue: 'Briefcase'
          },
          { name: 'link', label: 'Link URL', type: 'text', defaultValue: '#' }
        ]
      }
    ]
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
    },
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      {
        name: 'areas',
        label: 'Specialized Grid Areas',
        type: 'array',
        fields: [
          { name: 'title', label: 'Area Name', type: 'text' },
          { name: 'description', label: 'Description', type: 'textarea' },
          {
            name: 'icon',
            label: 'Icon',
            type: 'select',
            options: [
              { label: 'Briefcase', value: 'Briefcase' },
              { label: 'Gavel', value: 'Gavel' },
              { label: 'Building', value: 'Building2' },
              { label: 'Landmark', value: 'Landmark' },
              { label: 'Scale', value: 'Scale' },
              { label: 'Shield', value: 'Shield' },
              { label: 'File Text', value: 'FileText' },
              { label: 'Users', value: 'Users' },
              { label: 'Lightbulb', value: 'Lightbulb' },
              { label: 'Home', value: 'Home' },
              { label: 'Trending Down', value: 'TrendingDown' },
              { label: 'Map', value: 'Map' },
              { label: 'Message Square', value: 'MessageSquare' }
            ],
            defaultValue: 'Briefcase'
          },
          {
            name: 'services',
            label: 'Sub-Services',
            type: 'array',
            fields: [
              { name: 'name', label: 'Service Name', type: 'text' }
            ]
          }
        ]
      }
    ]
  },
  awardsMarquee: {
    label: 'Awards Marquee',
    category: 'Content',
    icon: '🏆',
    badgeLabel: 'Awards',
    defaultValues: {
      blockType: 'awardsMarquee',
      awards: []
    },
    fields: [
      {
        name: 'awards',
        label: 'Recognitions & Awards',
        type: 'array',
        fields: [
          { name: 'title', label: 'Award Title', type: 'text' },
          { name: 'year', label: 'Year/Period', type: 'text' },
          { name: 'organization', label: 'Organization/Authority', type: 'text' },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'image', label: 'Award/Logo Image', type: 'upload', relationTo: 'media' }
        ]
      }
    ]
  },
  aboutTeam: {
    label: 'About Team',
    category: 'Content',
    icon: '👥',
    badgeLabel: 'Team',
    defaultValues: {
      blockType: 'aboutTeam',
      tag: 'Legal Experts',
      title: 'Meet Our Team',
      subtitle: 'Our firm is comprised of highly specialized advocates with a deep understanding of complex legal frameworks.',
      teamMembers: []
    },
    fields: [
      { name: 'tag', label: 'Tagline', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      {
        name: 'teamMembers',
        label: 'Select Team Members (Relationship)',
        type: 'relationship',
        relationTo: 'team'
      }
    ]
  },
  aboutValues: {
    label: 'About Values',
    category: 'Content',
    icon: '💎',
    badgeLabel: 'Values',
    defaultValues: {
      blockType: 'aboutValues',
      tag: 'Our Values',
      title: 'Core Values',
      subtitle: 'The principles that guide our practice',
      values: []
    },
    fields: [
      { name: 'tag', label: 'Tagline', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      {
        name: 'values',
        label: 'Values List',
        type: 'array',
        fields: [
          { name: 'title', label: 'Value Title', type: 'text' },
          { name: 'description', label: 'Description', type: 'textarea' },
          {
            name: 'icon',
            label: 'Icon Type',
            type: 'select',
            options: [
              { label: 'Shield Check', value: 'ShieldCheck' },
              { label: 'Scale', value: 'Scale' },
              { label: 'Award', value: 'Award' },
              { label: 'Handshake', value: 'Handshake' },
              { label: 'Gavel', value: 'Gavel' },
              { label: 'Building', value: 'Building2' }
            ],
            defaultValue: 'ShieldCheck'
          }
        ]
      }
    ]
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
    },
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      {
        name: 'offices',
        label: 'Office Chambers List',
        type: 'array',
        fields: [
          { name: 'id', label: 'Unique ID (e.g., ahmedabad)', type: 'text' },
          { name: 'label', label: 'Selector Label', type: 'text' },
          { name: 'name', label: 'Full Chamber Name', type: 'text' },
          { name: 'address', label: 'Physical Address', type: 'textarea' },
          { name: 'email', label: 'Chamber Email', type: 'text' },
          { name: 'mapUrl', label: 'Google Maps Link', type: 'text' },
          { name: 'image', label: 'Chamber Image', type: 'upload', relationTo: 'media' },
          {
            name: 'phone',
            label: 'Phone Numbers',
            type: 'array',
            fields: [
              { name: 'number', label: 'Number', type: 'text' }
            ]
          },
          {
            name: 'hours',
            label: 'Business Hours',
            type: 'array',
            fields: [
              { name: 'day', label: 'Day Range (e.g., Mon - Fri)', type: 'text' },
              { name: 'time', label: 'Time (e.g., 10:00 AM - 6:00 PM)', type: 'text' }
            ]
          }
        ]
      }
    ]
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
      features: [],
      mapOverlayTitle: '',
      mapOverlayDescription: '',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.697926017772!2d72.5222!3d23.0784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e833444444445%3A0x6b74ad4a4e63480e!2sSG+Business+Hub!5e0!3m2!1sen!2sin!4v1710450000000!5m2!1sen!2sin'
    },
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      {
        name: 'features',
        label: 'Amenity Features List',
        type: 'array',
        fields: [
          { name: 'text', label: 'Feature Description', type: 'text' }
        ]
      },
      { name: 'mapOverlayTitle', label: 'Map Overlay Title', type: 'text' },
      { name: 'mapOverlayDescription', label: 'Map Overlay Description', type: 'textarea' },
      { name: 'mapUrl', label: 'Google Maps Embed Iframe URL', type: 'text' }
    ]
  },
  aboutCta: {
    label: 'About CTA',
    category: 'CTA / Forms',
    icon: '🎯',
    badgeLabel: 'CTA',
    defaultValues: {
      blockType: 'aboutCta',
      title: 'Ready to discuss your legal needs?',
      subtitle: 'Our team of dedicated advocates is prepared to provide the strategic representation and expert counsel you deserve. Schedule your consultation today.',
      ctaText: 'Schedule a Consultation',
      ctaLink: '/contact',
      secondaryCtaText: 'Explore Practice Areas',
      secondaryCtaLink: '/practice-areas'
    },
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'ctaText', label: 'Primary Button Text', type: 'text' },
      { name: 'ctaLink', label: 'Primary Button Link', type: 'text' },
      { name: 'secondaryCtaText', label: 'Secondary Button Text', type: 'text' },
      { name: 'secondaryCtaLink', label: 'Secondary Button Link', type: 'text' }
    ]
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
      subtitle: 'Our experienced attorneys are ready to help you navigate your legal challenges.',
      ctaText: 'Schedule Consultation',
      ctaLink: '/contact',
      phoneNumber: '+91 94082 82982'
    },
    fields: [
      { name: 'badge', label: 'Badge Label', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'ctaText', label: 'CTA Button Text', type: 'text' },
      { name: 'ctaLink', label: 'CTA Button Link', type: 'text' },
      { name: 'phoneNumber', label: 'Contact Phone Number', type: 'text' }
    ]
  },
  officeCta: {
    label: 'Office CTA',
    category: 'CTA / Forms',
    icon: '🏢',
    badgeLabel: 'CTA',
    defaultValues: {
      blockType: 'officeCta',
      badge: 'Trust & Excellence',
      title: 'Visit Our Chambers',
      subtitle: 'Schedule a consultation at one of our convenient office locations.',
      ctaText1: 'Book An Appointment',
      ctaLink1: '/contact',
      ctaText2: 'Call Direct',
      ctaLink2: 'tel:+919408282982',
      disclaimer: 'Monday — Saturday • 24/7 Priority Support'
    },
    fields: [
      { name: 'badge', label: 'Badge', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'ctaText1', label: 'Button 1 Text', type: 'text' },
      { name: 'ctaLink1', label: 'Button 1 Link', type: 'text' },
      { name: 'ctaText2', label: 'Button 2 Text', type: 'text' },
      { name: 'ctaLink2', label: 'Button 2 Link', type: 'text' },
      { name: 'disclaimer', label: 'Disclaimer Footer Text', type: 'text' }
    ]
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
    },
    fields: [
      { name: 'badge', label: 'Badge', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      {
        name: 'features',
        label: 'Feature Bullet Points',
        type: 'array',
        fields: [
          {
            name: 'icon',
            label: 'Icon',
            type: 'select',
            options: [
              { label: 'Shield Check', value: 'ShieldCheck' },
              { label: 'Clock', value: 'Clock' },
              { label: 'Users', value: 'Users' }
            ],
            defaultValue: 'ShieldCheck'
          },
          { name: 'title', label: 'Feature Title', type: 'text' },
          { name: 'description', label: 'Short Description', type: 'textarea' }
        ]
      }
    ]
  },
  contactInfo: {
    label: 'Contact Info',
    category: 'CTA / Forms',
    icon: '📋',
    badgeLabel: 'Info',
    defaultValues: {
      blockType: 'contactInfo',
      infoItems: []
    },
    fields: [
      {
        name: 'infoItems',
        label: 'Contact Details Cards',
        type: 'array',
        fields: [
          {
            name: 'icon',
            label: 'Icon Type',
            type: 'select',
            options: [
              { label: 'Phone', value: 'Phone' },
              { label: 'Mail', value: 'Mail' },
              { label: 'Map Pin', value: 'MapPin' },
              { label: 'Clock', value: 'Clock' }
            ],
            defaultValue: 'Phone'
          },
          { name: 'title', label: 'Card Title', type: 'text' },
          { name: 'value', label: 'Detail Text/Value', type: 'textarea' },
          { name: 'link', label: 'Anchor Action Link (Optional)', type: 'text' }
        ]
      }
    ]
  },
  contactMap: {
    label: 'Contact Map',
    category: 'CTA / Forms',
    icon: '🗺️',
    badgeLabel: 'Map',
    defaultValues: {
      blockType: 'contactMap',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.697926017772!2d72.5222!3d23.0784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e833444444445%3A0x6b74ad4a4e63480e!2sSG+Business+Hub!5e0!3m2!1sen!2sin!4v1710450000000!5m2!1sen!2sin',
      locationTitle: 'Main Chamber',
      locationAddress: 'SG Business Hub, Sola,\nSG Highway, Ahmedabad'
    },
    fields: [
      { name: 'mapUrl', label: 'Google Maps Iframe URL', type: 'text' },
      { name: 'locationTitle', label: 'Chamber Location Name', type: 'text' },
      { name: 'locationAddress', label: 'Full Physical Address', type: 'textarea' }
    ]
  },
  newsletter: {
    label: 'Newsletter',
    category: 'CTA / Forms',
    icon: '📧',
    badgeLabel: 'News',
    defaultValues: {
      blockType: 'newsletter',
      badge: 'Newsletter',
      title: 'Stay Informed',
      subtitle: 'Subscribe to our newsletter for exclusive legal insights and firm updates delivered directly to your inbox.',
      buttonText: 'Subscribe',
      disclaimer: '* Your privacy is our priority. Unsubscribe at any time.'
    },
    fields: [
      { name: 'badge', label: 'Badge', type: 'text' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'buttonText', label: 'Button Text', type: 'text' },
      { name: 'disclaimer', label: 'Privacy Disclaimer Text', type: 'text' }
    ]
  }
};

export type BlockCategory = 'Hero' | 'Content' | 'CTA / Forms';

export const blockCategories: Record<BlockCategory, BlockCategory> = {
  Hero: 'Hero',
  Content: 'Content',
  'CTA / Forms': 'CTA / Forms'
};

export const blockCategoryOrder: BlockCategory[] = ['Hero', 'Content', 'CTA / Forms'];