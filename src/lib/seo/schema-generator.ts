import type { Team, Post, Media } from "@/payload-types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jeetbhatt.com";

// Helper to safely extract dynamic image URLs
function getImageUrl(image: any): string | undefined {
  if (!image) return undefined;
  if (typeof image === "string") return image;
  const media = image as Media;
  if (media && media.url) {
    return media.url.startsWith("http") ? media.url : `${SITE_URL}${media.url}`;
  }
  return undefined;
}

/**
 * 1. Global Organization Schema
 * This defines the main firm identity and is linked via ID throughout other schemas.
 */
export function generateOrganizationSchema(): Record<string, any> {
  return {
    "@type": "LegalService",
    "@id": `${SITE_URL}/#organization`,
    "name": "Chambers of Jeet Bhatt",
    "url": SITE_URL,
    "logo": {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      "url": `${SITE_URL}/jeet-bhatt.png`,
      "caption": "Chambers of Jeet Bhatt",
      "width": {
        "@type": "QuantitativeValue",
        "value": 512
      },
      "height": {
        "@type": "QuantitativeValue",
        "value": 512
      }
    },
    "image": {
      "@id": `${SITE_URL}/#logo`
    },
    "description": "Award-winning premium law firm specializing in corporate law, criminal defense, and international commercial arbitration. Global reach with local expertise from Gujarat.",
    "telephone": "+91 94082 82982",
    "email": "info@jeetbhatt.com",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Chambers House, Sector 11",
      "addressLocality": "Gandhinagar",
      "addressRegion": "Gujarat",
      "postalCode": "382011",
      "addressCountry": "IN"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "India"
      },
      {
        "@type": "Country",
        "name": "United States"
      },
      {
        "@type": "Country",
        "name": "United Kingdom"
      }
    ],
    "sameAs": [
      "https://www.linkedin.com/in/jeetbhatt",
      "https://twitter.com/chambersofjeetbhatt"
    ]
  };
}

/**
 * 2. LocalBusiness Schemas
 * Ahmedabad, Gandhinagar, and Vadodara offices with precise coordinates, phones, and hours.
 */
export function generateLocalBusinessSchema(officeKey: 'ahmedabad' | 'gandhinagar' | 'vadodara' | 'all'): Record<string, any> | Record<string, any>[] {
  const offices = {
    ahmedabad: {
      "@type": "LegalService",
      "@id": `${SITE_URL}/offices#ahmedabad`,
      "name": "Chambers of Jeet Bhatt - Ahmedabad Office",
      "parentOrganization": {
        "@id": `${SITE_URL}/#organization`
      },
      "url": `${SITE_URL}/offices`,
      "telephone": "+91 94082 82982",
      "email": "info@jeetbhatt.com",
      "priceRange": "$$$",
      "image": `${SITE_URL}/images/about-hero.png`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "A-501, Westgate, Near YMCA Club, S.G. Highway",
        "addressLocality": "Ahmedabad",
        "addressRegion": "Gujarat",
        "postalCode": "380015",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 23.0135,
        "longitude": 72.5085
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "10:00",
          "closes": "19:00"
        }
      ]
    },
    gandhinagar: {
      "@type": "LegalService",
      "@id": `${SITE_URL}/offices#gandhinagar`,
      "name": "Chambers of Jeet Bhatt - Gandhinagar Office (Main Headquarters)",
      "parentOrganization": {
        "@id": `${SITE_URL}/#organization`
      },
      "url": `${SITE_URL}/offices`,
      "telephone": "+91 94082 82982",
      "email": "info@jeetbhatt.com",
      "priceRange": "$$$",
      "image": `${SITE_URL}/jeet-bhatt.png`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Chambers House, Sector 11",
        "addressLocality": "Gandhinagar",
        "addressRegion": "Gujarat",
        "postalCode": "382011",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 23.2244,
        "longitude": 72.6434
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "09:30",
          "closes": "18:30"
        }
      ]
    },
    vadodara: {
      "@type": "LegalService",
      "@id": `${SITE_URL}/offices#vadodara`,
      "name": "Chambers of Jeet Bhatt - Vadodara Office",
      "parentOrganization": {
        "@id": `${SITE_URL}/#organization`
      },
      "url": `${SITE_URL}/offices`,
      "telephone": "+91 94082 82982",
      "email": "info@jeetbhatt.com",
      "priceRange": "$$$",
      "image": `${SITE_URL}/images/about-hero.png`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "402, Samanvay Silver, Akota",
        "addressLocality": "Vadodara",
        "addressRegion": "Gujarat",
        "postalCode": "390020",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 22.2961,
        "longitude": 73.1812
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "10:00",
          "closes": "19:00"
         }
       ]
    }
  };

  if (officeKey === 'all') {
    return [offices.gandhinagar, offices.ahmedabad, offices.vadodara];
  }
  return offices[officeKey];
}

/**
 * 3. Person Schema
 * Custom generator for individual team members. Serializes education, academic awards,
 * credentials, and publications, linking them back to the Organization.
 */
export function generatePersonSchema(member: Team): Record<string, any> {
  const personId = `${SITE_URL}/team/${member.slug}#person`;
  const imageUrl = getImageUrl(member.image);

  // Safely extract knowsAbout fields
  const knowsAbout = member.overview?.expertise?.map(e => e.item).filter(Boolean) || [];

  // Map education records
  const educationList = member.education?.map(edu => ({
    "@type": "EducationalOrganization",
    "name": edu.institution,
    "award": edu.degree + (edu.specialization ? ` in ${edu.specialization}` : "")
  })) || [];

  // Map awards to standard lists
  const awardsList = member.awards?.map(aw => `${aw.title} (${aw.year || ''})`).filter(Boolean) || [];

  // Map publications
  const publicationsList = member.publications?.map(pub => ({
    "@type": "CreativeWork",
    "name": pub.title,
    "publisher": {
      "@type": "Organization",
      "name": pub.publisher
    },
    "datePublished": pub.year,
    "url": pub.link
  })) || [];

  return {
    "@type": "Person",
    "@id": personId,
    "name": member.name,
    "jobTitle": member.designation,
    "description": member.subtitle || (member.bio && member.bio[0]?.paragraph) || undefined,
    "image": imageUrl,
    "url": `${SITE_URL}/team/${member.slug}`,
    "worksFor": {
      "@id": `${SITE_URL}/#organization`
    },
    "knowsAbout": knowsAbout,
    "alumniOf": educationList,
    "award": awardsList,
    "publishingPrinciples": publicationsList
  };
}

/**
 * 4. LegalService Schema
 * Practice/Service detail pages mapping standard LegalService attributes.
 */
export function generateLegalServiceSchema(practiceArea: { name: string; description: string; slug: string; specialty?: string }): Record<string, any> {
  return {
    "@type": "LegalService",
    "@id": `${SITE_URL}/practice-areas/${practiceArea.slug}#service`,
    "name": practiceArea.name,
    "description": practiceArea.description,
    "url": `${SITE_URL}/practice-areas/${practiceArea.slug}`,
    "provider": {
      "@id": `${SITE_URL}/#organization`
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "India"
      },
      {
        "@type": "Country",
        "name": "United States"
      },
      {
        "@type": "Country",
        "name": "United Kingdom"
      }
    ],
    "knowsAbout": [practiceArea.specialty || practiceArea.name]
  };
}

/**
 * 5. Article & FAQPage Schema
 * Maps database Post objects into structured BlogPosting objects.
 */
export function generateArticleSchema(post: Post): Record<string, any> {
  const articleId = `${SITE_URL}/blog/${post.slug}#article`;
  const imageUrl = getImageUrl(post.featuredImage);
  const authorName = post.author || "Jeet Jayant Bhatt";
  const authorSlug = authorName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return {
    "@type": "BlogPosting",
    "@id": articleId,
    "headline": post.title,
    "description": post.excerpt || undefined,
    "image": imageUrl || `${SITE_URL}/jeet-bhatt.png`,
    "datePublished": post.publishedAt || post.createdAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "@id": `${SITE_URL}/team/${authorSlug}#person`,
      "name": authorName,
      "url": `${SITE_URL}/team/${authorSlug}`
    },
    "publisher": {
      "@id": `${SITE_URL}/#organization`
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`
    },
    "articleSection": post.category || "General Legal"
  };
}

/**
 * 6. FAQ Schema
 * Structures custom embedded FAQs into rich elements.
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]): Record<string, any> {
  return {
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * 7. Unified Graph Builder
 * Combines single schemas into a single, fully trace-related JSON-LD array.
 */
export function generateCombinedGraph(parts: Record<string, any>[]): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@graph": parts
  };
}

/**
 * Helper to build a comprehensive dynamic Homepage or general page schema.
 */
export function generateGeneralPageSchema(): Record<string, any> {
  const org = generateOrganizationSchema();
  const offices = generateLocalBusinessSchema('all') as Record<string, any>[];
  return generateCombinedGraph([org, ...offices]);
}

/**
 * Helper to build a unified Team Member schema linking them to the Organization.
 */
export function generateTeamPageSchema(member: Team): Record<string, any> {
  const org = generateOrganizationSchema();
  const person = generatePersonSchema(member);
  return generateCombinedGraph([org, person]);
}

/**
 * Helper to build a Practice Area schema linking the service details to the Organization.
 */
export function generatePracticeAreaPageSchema(practiceArea: { name: string; description: string; slug: string; specialty?: string }): Record<string, any> {
  const org = generateOrganizationSchema();
  const service = generateLegalServiceSchema(practiceArea);
  return generateCombinedGraph([org, service]);
}

/**
 * Helper to build a unified dynamic Article schema (with author context & FAQ nodes).
 */
export function generateBlogPageSchema(post: Post, faqs?: { question: string; answer: string }[]): Record<string, any> {
  const org = generateOrganizationSchema();
  const article = generateArticleSchema(post);

  // Override article nodes to refer exactly to our shared Organization @id
  article.publisher = { "@id": org["@id"] };

  const graph: Record<string, any>[] = [org, article];

  // If there is an author, we link them to our main organization
  if (article.author && article.author["@id"]) {
    const authorNode = {
      "@type": "Person",
      "@id": article.author["@id"],
      "name": article.author.name,
      "url": article.author.url,
      "worksFor": {
        "@id": org["@id"]
      }
    };
    graph.push(authorNode);
  }

  // If FAQs are included, we attach the FAQPage node to the graph and cross-link it
  if (faqs && faqs.length > 0) {
    const faqPage = generateFAQSchema(faqs);
    faqPage["@id"] = `${SITE_URL}/blog/${post.slug || 'post'}#faq`;
    article.mainEntityOfPage = {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
      "significantLink": faqPage["@id"]
    };
    graph.push(faqPage);
  }

  return generateCombinedGraph(graph);
}
