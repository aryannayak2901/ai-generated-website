import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jeetbhatt.com";

export interface TitleConfig {
  type: 'home' | 'service' | 'team' | 'blog' | 'custom';
  name?: string;      // Service name, team member name, or blog post title
  specialty?: string; // Specialty (e.g., Corporate Law, Criminal Defense)
  title?: string;     // For designation or general custom titles
}

export interface DescriptionConfig {
  type: 'home' | 'service' | 'team' | 'blog' | 'custom';
  name?: string;       // Name of person/service/etc
  specialty?: string;  // Specialty or topic
  yearsOfExp?: string; // Years of experience for team members
  credential?: string; // Credential for team members
  excerpt?: string;    // Excerpt/summary for blog
  description?: string; // Custom description fallback
}

export interface SeoMetadataInput {
  titleConfig?: TitleConfig;
  descriptionConfig?: DescriptionConfig;
  title?: string;        // Simple string fallback for title
  description?: string;  // Simple string fallback for description
  slug?: string;         // Page slug (e.g., 'about', 'blog/cji-legacy')
  image?: string;        // Page-specific OG image
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
  author?: string;       // Author name for articles
  noIndex?: boolean;
}

export function buildTitle(config?: TitleConfig, fallbackTitle?: string): string {
  if (!config) {
    if (fallbackTitle) {
      return fallbackTitle.includes("Chambers of Jeet Bhatt")
        ? fallbackTitle
        : `${fallbackTitle} | Chambers of Jeet Bhatt`;
    }
    return "Chambers of Jeet Bhatt | Premium Legal Services | Global Advocates";
  }

  const { type, name, specialty, title } = config;

  switch (type) {
    case 'home':
      return "Chambers of Jeet Bhatt | Premium Legal Services | Global Advocates";
    case 'service':
      return `${name || "Expert"} | Expert ${specialty || name || "Premium"} Legal Services | Chambers of Jeet Bhatt`;
    case 'team':
      return `${name || "Team Member"}${title ? ` - ${title}` : ''} | ${specialty || "Advocate"} | Chambers of Jeet Bhatt`;
    case 'blog':
      return `${name || "Legal Insights"} | Legal Insights | Chambers of Jeet Bhatt`;
    case 'custom':
      if (title) return title.includes("Chambers of Jeet Bhatt") ? title : `${title} | Chambers of Jeet Bhatt`;
      return "Chambers of Jeet Bhatt";
    default:
      return "Chambers of Jeet Bhatt";
  }
}

export function buildDescription(config?: DescriptionConfig, fallbackDescription?: string): string {
  if (!config) {
    return fallbackDescription || "Award-winning law firm specializing in corporate law, criminal defense, & international arbitration. Global reach with local expertise from Gujarat.";
  }

  const { type, name, specialty, yearsOfExp, credential, excerpt, description } = config;

  switch (type) {
    case 'home':
      return "Award-winning law firm specializing in corporate law, criminal defense, & international arbitration. Global reach with local expertise from Gujarat.";
    case 'service':
      return `Expert ${name || "legal"} advice from experienced advocates. Proven track record in ${specialty || name || "high-end legal counsel"}. Schedule your consultation today.`;
    case 'team':
      const expText = yearsOfExp ? ` brings ${yearsOfExp} of expertise in ` : ' specializes in ';
      const credText = credential ? `. ${credential}` : '';
      return `${name || "Our advocate"}${expText}${specialty || "complex litigation"}${credText}. Available for consultations.`;
    case 'blog':
      if (excerpt) {
        return excerpt.length > 155 ? `${excerpt.substring(0, 152)}...` : excerpt;
      }
      return `Read our latest legal insights on ${specialty || "important legal topics"}. Stay informed with Chambers of Jeet Bhatt.`;
    case 'custom':
      return description || fallbackDescription || "Premium legal services at Chambers of Jeet Bhatt.";
    default:
      return fallbackDescription || "Chambers of Jeet Bhatt Legal Chambers.";
  }
}

/**
 * Centered SEO Metadata generator for Chambers of Jeet Bhatt.
 * Builds metadata conformant with Next.js conventions and optimizes
 * for high-end professional legal credibility on search engines and AI interfaces.
 */
export function generateSeoMetadata(input: SeoMetadataInput = {}): Metadata {
  const title = buildTitle(input.titleConfig, input.title);
  const description = buildDescription(input.descriptionConfig, input.description);
  
  // Clean dynamic slug to map clean URLs
  const path = input.slug
    ? input.slug.startsWith('/')
      ? input.slug
      : `/${input.slug}`
    : '/';
  
  const canonicalUrl = `${SITE_URL}${path}`;
  const ogImageUrl = input.image
    ? input.image.startsWith('http')
      ? input.image
      : `${SITE_URL}${input.image.startsWith('/') ? '' : '/'}${input.image}`
    : `${SITE_URL}/jeet-bhatt.png`; // default fallback image (established in public folder)

  const metadata: Metadata = {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Chambers of Jeet Bhatt",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_IN",
      type: input.type || "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };

  if (input.type === 'article' && metadata.openGraph) {
    const articleMeta: any = {
      type: 'article',
    };
    if (input.publishedTime) articleMeta.publishedTime = input.publishedTime;
    if (input.modifiedTime) articleMeta.modifiedTime = input.modifiedTime;
    if (input.author) articleMeta.authors = [input.author];
    if (input.category) articleMeta.section = input.category;
    
    metadata.openGraph = {
      ...metadata.openGraph,
      ...articleMeta,
    };
  }

  if (input.noIndex) {
    metadata.robots = {
      index: false,
      follow: true,
      nocache: true,
      googleBot: {
        index: false,
        follow: true,
        noimageindex: true,
      },
    };
  }

  return metadata;
}
