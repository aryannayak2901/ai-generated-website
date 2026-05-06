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
  return {
    id: post.id,
    slug: post.slug || "",
    title: post.title,
    summary: post.excerpt || "",
    content: post.content as any, // BlogModal handles Lexical or string
    category: post.category,
    date: post.publishedAt 
      ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : "Recent Update",
    image: (post.featuredImage as Media)?.url || "/placeholder-blog.jpg",
    author: post.author || "Jeet Bhatt",
    readTime: post.readTime || "5 min read",
    externalLink: post.externalLink || undefined,
  };
};

export default async function BlogPage() {
  const payload = await getPayload({ config: configPromise });
  
  // Fetch page layout
  const pageRes = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'blog' } },
    depth: 2,
  });
  const pageData = pageRes.docs[0] as Page | undefined;

  // Fetch published posts
  const postsRes = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    depth: 1,
    limit: 100,
  });
  
  const cmsPosts = postsRes.docs ? postsRes.docs.map(normalizePayloadPost) : [];
  
  // Use CMS posts if available, fallback to static BLOG_POSTS
  const postsToDisplay = cmsPosts.length > 0 ? cmsPosts : BLOG_POSTS;

  // Extract unique categories
  const categories = Array.from(new Set(["All", ...new Set(postsToDisplay.map(post => post.category))]));

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
