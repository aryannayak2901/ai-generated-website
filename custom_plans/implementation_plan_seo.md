# Chambers of Jeet Bhatt - Premium SEO, AEO, JSON-LD & GA4/GTAG Analytics Stack

This plan outlines the design and implementation of a state-of-the-art Search Engine Optimization (SEO), Answer Engine Optimization (AEO), and Analytics measurement system for **Chambers of Jeet Bhatt**. 

By integrating rich semantic schemas (Organization, LocalBusiness, LegalService, Person, Article, Breadcrumbs, FAQs), structured Open Graph metadata, native dynamic sitemap/robots routers, and multi-stage GA4 client tracking, this solution will establish an authoritative knowledge graph for Google and AI-powered search engines (ChatGPT, Perplexity, Claude, Gemini) while maximizing lead tracking and conversions.

---

## User Review Required

Please review the architectural decisions and features proposed for this system.

> [!IMPORTANT]
> **Dynamic Blog Routes for Search Crawlers (`/blog/[slug]`)**
> Currently, the website displays blog articles in modal windows. While this offers a smooth client interaction, search engines and AI engines cannot index modal states as distinct URLs. We propose creating a dedicated dynamic page route at `src/app/(frontend)/blog/[slug]/page.tsx`. This page will load the post content server-side, inject complete `Article` and `FAQ` schemas, and display the article with premium typography (Playfair Display/Public Sans) matching the site's high-end aesthetic. The main blog page will link to these routes for SEO crawling, ensuring zero-configuration fallback.

> [!TIP]
> **Unified JSON-LD `@graph` Structure**
> Instead of injecting multiple separate `<script>` blocks for schemas (which search engines parse in isolation), we implement a combined `@graph` structure in `src/components/SEO/StructuredData.tsx`. This allows search and AI engines to trace relations (e.g., this `Article` is written by a `Person` who works for this `Organization` located at this `LocalBusiness` address).

---

## Proposed Changes

We will introduce a clean, modular structure split between SEO libraries, structured components, tracking hooks, and dynamic router endpoints.

```mermaid
graph TD
    subgraph Metadata & Structured Data
        MG[metadata-generator.ts] --> Layout[layout.tsx]
        MG --> PageSlug[app/slug/page.tsx]
        SG[schema-generator.ts] --> SD[StructuredData.tsx]
        SD --> Layout
        SD --> TeamSlug[app/team/id/page.tsx]
        SD --> BlogSlug[app/blog/slug/page.tsx]
    end
    
    subgraph Analytics & Funnel Tracking
        AE[analytics/events.ts] --> ET[EnhancedTracker.tsx]
        ET --> Layout
        AE --> ClientForms[ContactForm / CTAs]
    end
    
    subgraph Crawlability & Indexing
        Sitemap[sitemap.ts] --> SitemapXML[/sitemap.xml]
        Robots[robots.ts] --> RobotsTXT[/robots.txt]
    end
```

---

### 1. SEO Core & Structured Data Component

This component structures metadata dynamically and translates database models from Payload CMS (e.g., Team, Posts, Pages) into standard Schema.org graphs.

#### [NEW] [metadata-generator.ts](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/lib/seo/metadata-generator.ts)
A centralized metadata builder producing standard and Open Graph tags.
- Configures title scales, action-focused descriptions, and responsive Open Graph cards (`og:type`, `og:image`, `twitter:card`).
- Supports canonical fallback and dynamic slug page mapping.

#### [NEW] [schema-generator.ts](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/lib/seo/schema-generator.ts)
Dynamic generator for schema markup:
- **Organization & LocalBusiness**: Maps Ahmedabad, Gandhinagar, and Vadodara offices with precise coords, geoids, contact phone, and operating hours.
- **Person**: Extends team member records to serialize dynamic lists of education, credentials, academic awards, publications, and worksFor relationship nodes.
- **LegalService**: Maps service pages (Corporate, Civil, Family, Criminal defense) with areaServed and serviceProvider nodes.
- **Article & FAQPage**: Combines article content and embedded FAQ questions inside structured nodes.

#### [NEW] [StructuredData.tsx](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/components/SEO/StructuredData.tsx)
Renders schema markup in dynamic `@graph` elements:
- Renders the structured schema objects using `<script type="application/ld+json">` on server-side rendering routes.
- Fully sanitized and formatted.

---

### 2. Crawlability & Indexing Architecture

Native dynamic routing for search engine bots.

#### [NEW] [sitemap.ts](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/app/sitemap.ts)
Generates dynamic XML sitemap at `/sitemap.xml` by compiling:
1. Static routes (`/`, `/about`, `/contact`, `/offices`, `/practice-areas`, `/blog`)
2. Catch-all dynamic database slugs from the `pages` collection.
3. Individual team member pages from the `team` collection.
4. Individual blog posts from the `posts` collection.
- Retrieves timestamps (`updatedAt`) from Payload DB to feed sitemap `lastModified` attributes.

#### [NEW] [robots.ts](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/app/robots.ts)
Generates robots directives at `/robots.txt`:
- Explicitly blocks admin areas (`/admin/`, `/admin/*`) and private preview pages.
- Permits all primary indexers (`*`) and lists sitemap locations.
- Structures bot access rules to welcome AI search crawlers (`GPTBot`, `ClaudeBot`, `PerplexityBot`) for citation authority while safeguarding server endpoints.

---

### 3. Analytics & Funnel Tracking

Centralizes visitor engagement tracking and structures multi-stage funnel triggers.

#### [NEW] [events.ts](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/lib/analytics/events.ts)
Event tracking interface:
- centralizes standard event functions: `trackCTAClick`, `trackFormSubmission`, `trackScrollDepth`, `trackTimerThreshold`.
- Prevents errors by ensuring execution only in client-side window contexts.

#### [NEW] [EnhancedTracker.tsx](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/components/Analytics/EnhancedTracker.tsx)
Client-side session wrapper injected into the root layout:
- Track scroll markers (25%, 50%, 75%) and record page engagement timers (3+ mins).
- Dynamic custom dimension extraction (e.g., `practice_area` based on path patterns, `user_tier` derived from user action frequency).

---

### 4. Layout, Page, and Route Modifications

Integrating dynamic SEO metadata, schemas, and analytics into existing code.

#### [MODIFY] [layout.tsx](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/app/(frontend)/layout.tsx)
- Embeds global `Organization` and `LocalBusiness` schemas.
- Injects our custom `EnhancedTracker` inside standard `ThemeProvider` bounds.
- Integrates centralized metadata hooks.

#### [MODIFY] [page.tsx](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/app/(frontend)/page.tsx)
- Injects homepage `LegalService` and `Organization` combined schema.

#### [MODIFY] [team/[id]/page.tsx](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/app/(frontend)/team/[id]/page.tsx)
- Pulls team member dynamic details to inject dynamic `Person` schema.
- Adds structured alumni, awards, and credentials parameters to schema.

#### [NEW] [[slug]/page.tsx](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/app/(frontend)/blog/[slug]/page.tsx)
- Dedicated dynamic route serving high-typography blog articles on direct crawlable page requests.
- Renders Breadcrumbs, author credits, dynamic contents, and injects `Article` + `FAQPage` schema models.

#### [MODIFY] [GoogleAnalyticsTracker.tsx](file:///Users/aryannayak/Documents/Portfolio/chambers-of-jeetbhatt/src/components/GoogleAnalyticsTracker.tsx)
- Updates script initialization scripts to initialize dimensions (`practice_area`, `content_type`, `user_tier`).

---

## Verification Plan

We will verify both SEO validity and analytics functionality to ensure complete correctness:

### 1. Automated Tests & Audits
- Run build processes using `npm run build` to verify Next.js static and dynamic route compilation.
- Utilize the website auditing tools (`squirrelscan CLI` via `audit-website` skill) to check local page speed, heading structure, and meta validations.

### 2. Manual & Inspector Verification
- **Structured Data Validations**: Copy rendered HTML source output into the [Google Rich Results Test](https://search.google.com/test/rich-results) and [Schema.org Validator](https://validator.schema.org/) to verify absolute correctness and zero warnings for Organization, Person, and Article schemas.
- **Analytics Event Fire Tests**: Use the Chrome DevTools console and network inspector to trace outbound GTAG network requests. Verify events (`page_view`, `content_engagement`, `contact_form_submit`) fire successfully on client interactions with correct custom dimensions (`practice_area`, `user_tier`).
- **Sitemap & Robots verification**: Manually inspect `http://localhost:3000/sitemap.xml` and `http://localhost:3000/robots.txt` in the dev browser to verify correct structure.
