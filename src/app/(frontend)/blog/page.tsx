import React from 'react';
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { BlogHero } from "@/components/blog/BlogHero";
import { Newsletter } from "@/components/blog/Newsletter";
import { BlogList } from "@/components/blog/BlogList";
import { BLOG_POSTS, BlogPost } from "@/lib/blog-data";
import { Page, Post, Media } from "@/payload-types";

// Helper to normalize Payload Post to BlogPost interface
const normalizePayloadPost = (post: Post): BlogPost => {
  const generatedSlug = post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'blog-post';
  return {
    id: post.id,
    slug: generatedSlug,
    title: post.title,
    summary: (post as any).excerpt || "",
    content: post.content as any, // BlogModal handles Lexical or string
    category: (post as any).category || "General Legal",
    date: (post as any).publishedAt 
      ? new Date((post as any).publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    image: ((post as any).featuredImage as Media)?.url || "/blog/cji-legacy.jpg",
    author: (post as any).author || "Jeet Bhatt",
    readTime: (post as any).readTime || "5 min read",
    externalLink: (post as any).externalLink || undefined,
  };
};

export default async function BlogPage() {
  let postsToDisplay: BlogPost[] = BLOG_POSTS;
  let categories = Array.from(new Set(["All", ...BLOG_POSTS.map(post => post.category)]));
  let pageData: Page | undefined = undefined;

  try {
    const payload = await getPayload({ config: configPromise });
  
    // Fetch page layout
    const pageRes = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'blog' } },
      depth: 2,
    });
    pageData = pageRes.docs[0] as unknown as Page | undefined;

    // Fetch posts (both published and drafts)
    const postsRes = await payload.find({
      collection: 'posts',
      sort: '-createdAt',
      depth: 1,
      limit: 100,
    });
  
    const cmsPosts = postsRes.docs && Array.isArray(postsRes.docs) ? postsRes.docs.map(normalizePayloadPost) : [];
  
    // Use CMS posts if available, fallback to static BLOG_POSTS
    if (cmsPosts.length > 0) {
      postsToDisplay = cmsPosts;
      categories = Array.from(new Set(["All", ...cmsPosts.map(post => post.category)]));
    }
  } catch (error) {
    console.error("Error fetching from Payload:", error);
    // Use static data as fallback
  }

  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-500">
      <h2 className="sr-only">Latest Legal Insights and Articles</h2>
      {pageData?.layout?.map((block, index: number) => {
        if ('blockType' in block && block.blockType === "blogHero") return <BlogHero key={index} {...block as any} />;
        if ('blockType' in block && block.blockType === "blogFilters") {
          return (
            <BlogList 
              key={index}
              posts={postsToDisplay} 
              categories={categories} 
              {...block as any} 
            />
          );
        }
        if ('blockType' in block && block.blockType === "newsletter") return <Newsletter key={index} {...block as any} />;
        return null;
      })}

      {!pageData?.layout?.length && (
        <>
          <BlogHero />
          <BlogList posts={postsToDisplay} categories={categories} />
          <Newsletter />
        </>
      )}
    </div>
  );
}
