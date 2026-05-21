import React from "react";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import Image from "next/image";
import Link from "next/link";
import { Clock, User, Calendar, ArrowLeft, ChevronRight, Share2, BookOpen } from "lucide-react";
import type { Post, Media } from "@/payload-types";
import { LexicalRenderer } from "@/components/blog/LexicalRenderer";
import { generateSeoMetadata } from "@/lib/seo/metadata-generator";
import { generateBlogPageSchema } from "@/lib/seo/schema-generator";
import StructuredData from "@/components/SEO/StructuredData";
import { Button } from "@/components/ui/button";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

/**
 * Generate SEO Metadata dynamically for the blog post
 */
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  try {
    const payload = await getPayload({ config: configPromise });
    const { docs } = await payload.find({
      collection: "posts",
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    const post = docs[0] as unknown as Post;

    if (!post) {
      return generateSeoMetadata({
        titleConfig: { type: "custom", title: "Article Not Found" },
        slug: `blog/${slug}`,
      });
    }

    const featuredImage = (post.featuredImage as Media)?.url || undefined;

    return generateSeoMetadata({
      titleConfig: {
        type: "blog",
        name: post.title,
      },
      descriptionConfig: {
        type: "blog",
        excerpt: post.excerpt || undefined,
        specialty: post.category || "General Legal",
      },
      slug: `blog/${slug}`,
      image: featuredImage,
      type: "article",
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt,
      author: post.author || "Jeet Bhatt",
      category: post.category || "General Legal",
    });
  } catch (error) {
    console.error("Error generating metadata for blog post:", error);
    return generateSeoMetadata({
      titleConfig: { type: "custom", title: "Legal Insights | Chambers of Jeet Bhatt" },
      slug: `blog/${slug}`,
    });
  }
}

/**
 * Returns highly relevant, search-optimized FAQ items based on the post category.
 */
function getContextualFAQs(category?: string, postTitle?: string) {
  const faqs = [
    {
      question: "How can I schedule a legal consultation regarding this topic?",
      answer: "You can schedule a premium legal consultation with our advocates by using our secure online inquiry form or calling our offices at +91 94082 82982.",
    }
  ];

  if (category === "Criminal Defense") {
    faqs.unshift({
      question: "What immediate action should I take if contacted by law enforcement?",
      answer: "You should immediately exercise your constitutional right to remain silent and request legal representation. Contact Chambers of Jeet Bhatt prior to answering any questions to secure your legal rights.",
    });
  } else if (category === "Corporate Law") {
    faqs.unshift({
      question: "How does Chambers of Jeet Bhatt support corporate governance and risk management?",
      answer: "Our corporate practice provides comprehensive support, including structural setup, regulatory compliance, contract drafting, dispute resolution, and international commercial arbitration management.",
    });
  } else {
    faqs.unshift({
      question: `How does Chambers of Jeet Bhatt keep clients updated on changes to ${postTitle || "legal regulations"}?`,
      answer: "We offer ongoing regulatory monitoring and alert clients proactively of legal shifts that impact their operations, combined with dedicated corporate legal audits.",
    });
  }

  return faqs;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  let post: Post | null = null;

  try {
    const payload = await getPayload({ config: configPromise });
    const { docs } = await payload.find({
      collection: "posts",
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    post = (docs[0] as unknown as Post) || null;
  } catch (error) {
    console.error("Error fetching blog post:", error);
  }

  if (!post) {
    notFound();
  }

  const featuredImage = (post.featuredImage as Media)?.url || "/placeholder-blog.jpg";
  const dateFormatted = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  const faqs = getContextualFAQs(post.category || undefined, post.title);

  return (
    <>
      {/* Schema graph injection */}
      <StructuredData schema={generateBlogPageSchema(post, faqs)} />

      <article className="min-h-screen bg-slate-50 text-foreground flex flex-col items-center">
        {/* Dynamic Premium Header Block */}
        <div className="w-full bg-[#0f1729] text-white py-16 md:py-24 px-6 md:px-12 flex flex-col items-center relative overflow-hidden border-b border-gold-accent/20">
          {/* Subtle design element */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1e293b] via-[#0f1729] to-[#0a0f1d] opacity-90 z-0" />
          
          <div className="max-w-[1000px] w-full relative z-10 flex flex-col">
            {/* Breadcrumbs Navigation for SEO & UX */}
            <nav className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-slate-400 mb-8 self-start">
              <Link href="/" className="hover:text-gold-accent transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-slate-500" />
              <Link href="/blog" className="hover:text-gold-accent transition-colors">Blog</Link>
              <ChevronRight className="w-3 h-3 text-slate-500" />
              <span className="text-gold-accent truncate max-w-[200px] md:max-w-xs">{post.title}</span>
            </nav>

            {/* Category Tag */}
            <div className="self-start mb-6">
              <span className="bg-[#d4af37]/10 text-gold-accent border border-[#d4af37]/30 font-semibold text-[11px] px-4 py-1.5 rounded-sm uppercase tracking-wider">
                {post.category || "General Legal"}
              </span>
            </div>

            {/* Authoritative Title */}
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 text-white tracking-tight">
              {post.title}
            </h1>

            {/* Subheading meta fields */}
            <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm font-sans pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gold-accent/15 flex items-center justify-center border border-gold-accent/30">
                  <User className="w-4 h-4 text-gold-accent" />
                </div>
                <span>By <strong className="text-white font-medium">{post.author || "Jeet Jayant Bhatt"}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold-accent" />
                <span>Published on {dateFormatted}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-accent" />
                <span>{post.readTime || "10 min read"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic glassmorphic image preview */}
        <div className="w-full max-w-[1000px] px-6 -mt-10 md:-mt-16 z-20 relative">
          <div className="relative aspect-[21/9] w-full rounded-lg overflow-hidden shadow-2xl border border-white/10 bg-slate-900">
            <Image
              src={featuredImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1000px"
            />
          </div>
        </div>

        {/* Central Article Column */}
        <div className="w-full max-w-[1000px] px-6 md:px-12 py-16 flex flex-col md:flex-row gap-12 relative z-10">
          {/* Main content body */}
          <div className="flex-1 max-w-[700px] bg-white rounded-lg border border-slate-200/60 p-8 md:p-12 shadow-sm font-sans">
            {post.excerpt && (
              <p className="text-xl font-serif text-[#1e293b]/90 leading-relaxed italic border-l-4 border-gold-accent pl-6 mb-10 text-slate-700 bg-slate-50/50 py-4 pr-4 rounded-r">
                {post.excerpt}
              </p>
            )}

            {/* Render dynamic Lexical content recursively */}
            <LexicalRenderer content={post.content} />
            
            {/* Contextual SEO FAQ Blocks (AEO Optimized) */}
            {faqs.length > 0 && (
              <div className="mt-16 pt-12 border-t border-slate-100">
                <h3 className="font-serif text-2xl font-bold text-navy-primary mb-6 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-gold-accent" />
                  Key Legal FAQs
                </h3>
                <div className="space-y-6">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="bg-slate-50 p-6 rounded-lg border border-slate-100 hover:border-gold-accent/20 transition-all duration-300">
                      <h4 className="font-serif font-bold text-lg text-navy-primary mb-2">Q: {faq.question}</h4>
                      <p className="text-slate-600 leading-relaxed font-sans text-sm">A: {faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Quick consultation */}
          <aside className="w-full md:w-[260px] shrink-0 space-y-8">
            {/* Consultation CTA Block */}
            <div className="bg-[#0f1729] text-white p-6 rounded-lg border border-gold-accent/30 shadow-md relative overflow-hidden flex flex-col text-center">
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#1e293b] to-[#0f1729] opacity-90 z-0" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gold-accent/15 border border-gold-accent/30 flex items-center justify-center mb-4">
                  <User className="w-5 h-5 text-gold-accent" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">Need Expert Legal Counsel?</h3>
                <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                  Our elite advocates specialize in complex litigation, arbitration, & corporate advisory. Contact us for direct guidance.
                </p>
                <Link href="/contact" className="w-full">
                  <Button className="w-full bg-[#d4af37] hover:bg-[#c29c2b] text-[#0f1729] font-bold uppercase tracking-wider text-xs rounded-sm h-10 transition-all shadow-md">
                    Consultation
                  </Button>
                </Link>
              </div>
            </div>

            {/* Back button */}
            <div className="flex flex-col gap-3">
              <Link href="/blog">
                <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:border-gold-accent hover:text-[#0f1729] font-sans flex items-center justify-center gap-2 text-xs">
                  <ArrowLeft className="w-4 h-4" />
                  All Legal Insights
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}

/**
 * Enable Next.js static generation params for performance
 */
export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise });
    const { docs } = await payload.find({
      collection: "posts",
      where: {
        status: {
          equals: "published",
        },
      },
      limit: 100,
      depth: 0,
    });

    return docs.map((doc: any) => ({
      slug: doc.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for blog posts:", error);
    return [];
  }
}
