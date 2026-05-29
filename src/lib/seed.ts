import { getPayload } from 'payload'
import config from '../payload.config'
import type { Post, Page } from '@/payload-types'

async function seed() {
  console.log('--- Starting Seeding ---')
  const payload = await getPayload({ config })

  // 1. Create Admin User if not exists
  console.log('Checking for admin user...')
  const users = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: 'admin@chambers.com',
      },
    },
  })

  if (users.totalDocs === 0) {
    console.log('Creating admin user...')
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@chambers.com',
        password: 'password123',
      },
    })
    console.log('Admin user created: admin@chambers.com / password123')
  } else {
    console.log('Admin user already exists.')
  }

  // 2. Seed Header Global
  console.log('Seeding Header global...')
  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        { label: 'Home', link: '/' },
        { label: 'About CJB', link: '/about' },
        { label: 'Practice Areas', link: '/practice-areas' },
        { label: 'Blog', link: '/blog' },
        { label: 'Media', link: '/media' },
        { label: 'Offices', link: '/offices' },
        { label: 'Contact', link: '/contact' },
      ],
    },
  })
  console.log('Header seeded.')

  // 3. Seed Sample Posts
  console.log('Seeding sample posts...')
  const postItems = [
    {
      title: 'The 47 Chief Justices of India (1950-2021)',
      slug: 'cji-legacy',
      category: 'General Legal' as const,
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'The Constitution of India 1950 mandated as by the Supreme Court of India (SCI) when it came into force on 26th January, 1950.',
                },
              ],
            },
          ],
        },
      },
      status: 'published' as const,
      publishedAt: '2024-01-15T00:00:00.000Z',
    },
    {
      title: 'Fifty Years of The Emergency',
      slug: 'emergency-50',
      category: 'General Legal' as const,
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'This article examines the constitutional crisis during the 1975-77 Emergency in India.',
                },
              ],
            },
          ],
        },
      },
      status: 'published' as const,
      publishedAt: '2024-02-10T00:00:00.000Z',
    },
  ]

  for (const post of postItems) {
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: post.slug } },
    })
    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'posts',
        data: post as unknown as Post,
      })
    }
  }
  console.log('Posts seeded.')

  // 4. Seed Team Members
  console.log('Seeding team members...')
  const teamMembersData = [
    {
      name: 'Jeet Jayant Bhatt',
      slug: 'jeet-bhatt',
      designation: 'Advocate, High Court of Gujarat & Senior Partner',
      subtitle: 'Leading Legal Expert in International Commercial Law & Arbitration',
      stats: {
        experience: '15+',
        cases: '2000+',
        publications: '10+',
        clients: '6+',
      },
      bio: [
        { paragraph: 'Jeet J. Bhatt is a seasoned Advocate with over 15 years of distinguished legal practice before the High Court of Gujarat and various forums across India.' }
      ],
      overview: {
        expertise: [{ item: 'International Commercial Arbitration' }, { item: 'Corporate Law' }],
        clients: [{ item: 'Gujarat Urja Vikas Nigam Ltd' }],
        cases: [{ item: 'Represented GUVNL in multiple High Court proceedings' }],
      }
    }
  ]

  const seededTeamMembers = []
  for (const member of teamMembersData) {
    const existing = await payload.find({
      collection: 'team',
      where: { slug: { equals: member.slug } },
    })
    
    let doc
    if (existing.totalDocs === 0) {
      // For seeding without actual image files, we'll skip image or use a placeholder if possible
      // In a real scenario, you'd upload a file to 'media' first
      doc = await payload.create({
        collection: 'team',
        data: member,
      })
      console.log(`Team member "${member.name}" created.`)
    } else {
      doc = existing.docs[0]
      console.log(`Team member "${member.name}" already exists.`)
    }
    seededTeamMembers.push(doc.id)
  }

  // 5. Seed Pages
  console.log('Seeding pages...')
  const pagesData = [
    {
      title: 'Home',
      slug: 'home',
      layout: [
        {
          blockType: 'homeHero',
          title: 'Where Precision Meets Justice.',
          subtitle: 'Premier counsel specialized in Corporate, Criminal, and Real Estate Law.',
          ctaText: 'Request Consultation',
          ctaLink: '/contact',
        },
        {
          blockType: 'practiceAreas',
          title: 'Practice Areas',
          subtitle: 'Specialized legal expertise tailored to your specific needs with a commitment to excellence.',
          areas: [
            {
              title: 'Corporate Law',
              description: 'Comprehensive legal solutions for businesses, from startups to established enterprises.',
              icon: 'Briefcase',
            },
            {
              title: 'Criminal Defense',
              description: 'Rigorous defense strategies and expert representation in criminal proceedings.',
              icon: 'Gavel',
            },
            {
              title: 'Real Estate',
              description: 'Strategic counsel for property transactions, development, and dispute resolution.',
              icon: 'Building2',
            },
            {
              title: 'Constitutional Law',
              description: 'Protecting fundamental rights and navigating complex regulatory landscapes.',
              icon: 'Landmark',
            },
          ],
        },
        {
          blockType: 'awardsMarquee',
          awards: [
            { title: 'Legal Excellence 2023', year: '2023', organization: 'Indian Bar' },
            { title: 'Top 10 Chambers', year: '2024', organization: 'Legal500' },
            { title: 'Best Corporate Firm', year: '2022', organization: 'Business Law Review' },
          ],
        },
      ],
    },
    {
      title: 'About',
      slug: 'about',
      layout: [
        {
          blockType: 'aboutHero',
          tag: 'Our Legacy',
          title: 'A Legacy of Excellence',
          subtitle: 'For over two decades, Chambers of Jeet Bhatt has been at the forefront of legal innovation.',
        },
        {
          blockType: 'aboutTeam',
          tag: 'Legal Experts',
          title: 'Our Leadership',
          subtitle: 'Guided by seasoned legal experts with a passion for justice.',
          teamMembers: seededTeamMembers,
        },
        {
          blockType: 'aboutValues',
          tag: 'Core Principles',
          title: 'Our Core Values',
          subtitle: 'The foundation of our practice is built on unwavering commitment and legal mastery.',
          values: [
            { title: 'Integrity', description: 'Upholding the highest ethical standards.', icon: 'Shield' },
            { title: 'Excellence', description: 'Delivering superior legal craftsmanship.', icon: 'Award' },
            { title: 'Client Focus', description: 'Putting our clients interests first.', icon: 'Handshake' },
          ],
        },
        {
          blockType: 'aboutCta',
          title: 'Ready to discuss your legal needs?',
          subtitle: 'Our team of dedicated advocates is prepared to provide the strategic representation and expert counsel you deserve.',
          ctaText: 'Schedule a Consultation',
          ctaLink: '/contact',
          secondaryCtaText: 'Explore Practice Areas',
          secondaryCtaLink: '/practice-areas',
        },
      ],
    },
    {
      title: 'Practice Areas',
      slug: 'practice-areas',
      layout: [
        {
          blockType: 'practiceAreasHero',
          tag: 'Practice Areas',
          title: 'Expertise Driven by Integrity',
          subtitle: 'Chambers of Jeet Bhatt offers specialized legal services across a diverse spectrum of practice areas.',
        },
        {
          blockType: 'practiceAreasGrid',
          title: 'Specialized Legal Solutions',
          subtitle: 'We provide tailored, strategic legal solutions designed to navigate the most complex legal landscapes.',
        },
        {
          blockType: 'practiceAreasCta',
          title: 'Expert Counsel is a Click Away',
          subtitle: 'Schedule a consultation with our experienced legal team to discuss your specific needs.',
          buttonText: 'Book a Session',
          buttonLink: '/contact',
        },
      ],
    },
    {
      title: 'Contact',
      slug: 'contact',
      layout: [
        {
          blockType: 'contactHero',
          tag: 'Get in Touch',
          title: 'Ready to Discuss Your Legal Strategy?',
          subtitle: 'Reach out to Chambers of Jeet Bhatt for expert legal guidance and consultations.',
          phone: '+91 94082 82982',
          email: 'info@jeetbhatt.com',
        },
        {
          blockType: 'contactInfo',
          title: 'Our Coordinates',
          subtitle: 'Find us at our primary locations for in-person consultations.',
        },
        {
          blockType: 'contactForm',
          title: 'Send a Message',
          subtitle: 'Use the form below to initiate a consultation request.',
        },
        {
          blockType: 'contactMap',
          title: 'Our Location',
          mapUrl: 'https://www.google.com/maps/embed?...',
        },
      ],
    },
    {
      title: 'Blog',
      slug: 'blog',
      layout: [
        {
          blockType: 'blogHero',
          tag: 'Insights & Updates',
          title: 'Deep Dives into Legal Excellence',
          subtitle: 'Stay updated with the latest legal perspectives, news, and analysis.',
        },
        {
          blockType: 'blogFilters',
          title: 'Filter by Category',
        },
        {
          blockType: 'newsletter',
          title: 'Stay Informed',
          subtitle: 'Subscribe to our newsletter for exclusive legal insights and firm updates.',
          buttonText: 'Subscribe',
        },
      ],
    },
    {
      title: 'Offices',
      slug: 'offices',
      layout: [
        {
          blockType: 'officeHero',
          tag: 'Our Presence',
          title: 'Strategic Locations Across Gujarat',
          subtitle: 'With offices in Ahmedabad and Vadodara, we are positioned to provide expert counsel.',
        },
        {
          blockType: 'officeSelector',
          title: 'Choose an Office',
          subtitle: 'Select a location to view details and contact information.',
        },
        {
          blockType: 'mapSection',
          title: 'Our Global Reach',
        },
        {
          blockType: 'officeCta',
          title: 'Visit Our Chambers',
          subtitle: 'Schedule a visit to one of our locations for a personal consultation.',
          ctaText: 'Schedule Visit',
          ctaLink: '/contact',
        },
      ],
    },
  ]

  for (const page of pagesData) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'pages',
        data: page as unknown as Page,
      })
      console.log(`Page "${page.title}" created.`)
    } else {
      await payload.update({
        collection: 'pages',
        id: existing.docs[0].id,
        data: page as unknown as Page,
      })
      console.log(`Page "${page.title}" updated.`)
    }
  }

  console.log('--- Seeding Completed Successfully ---')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
