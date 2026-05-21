"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Bookmark } from "lucide-react";
import type { Post, Media } from "@/payload-types";
import { BlogPost } from "@/lib/blog-data";

export interface BlogHeroProps {
  tag?: string | null;
  title?: string | null;
  subtitle?: string | null;
  featuredPost?: Post | BlogPost | string | null;
}

export function BlogHero({ tag, title, subtitle, featuredPost }: BlogHeroProps) {
  const isPayloadPost = (p: unknown): p is Post => !!p && typeof p === 'object' && 'id' in p && !('image' in p);
  const isStaticPost = (p: unknown): p is BlogPost => !!p && typeof p === 'object' && 'image' in p;

  let postData: {
    slug: string;
    title: string;
    image: string;
    date: string;
    excerpt: string;
  } | null = null;

  if (isPayloadPost(featuredPost)) {
    postData = {
      slug: featuredPost.slug || "",
      title: featuredPost.title,
      image: (featuredPost.featuredImage as Media)?.url || "",
      date: featuredPost.publishedAt ? new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent',
      excerpt: featuredPost.excerpt || "Explore our latest analysis on key legal developments."
    };
  } else if (isStaticPost(featuredPost)) {
    postData = {
      slug: featuredPost.slug,
      title: featuredPost.title,
      image: featuredPost.image,
      date: featuredPost.date,
      excerpt: featuredPost.summary
    };
  }

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);

  return (
    <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center bg-primary overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
      
      {/* Teal accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
      
      {/* Decorative glow */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-20 right-[10%] w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" 
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-20 left-[5%] w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" 
      />

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12 py-20 lg:py-32 relative z-10">
        <div className={`grid grid-cols-1 gap-12 ${postData ? 'lg:grid-cols-2 lg:gap-20' : 'max-w-3xl'}`}>
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-12 bg-accent/50" />
              <span className="text-accent font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs">
                {tag || "Chambers Journal"}
              </span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              {title ? title : (
                <>
                  <span className="block">Legal Insights</span>
                  <span className="text-accent italic font-medium relative inline-block">
                    & Perspectives
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="absolute -bottom-2 left-0 h-0.5 bg-accent/30 rounded-full"
                    />
                  </span>
                </>
              )}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground font-sans leading-relaxed max-w-xl mb-8">
              {subtitle || "Authoritative analysis and updates on evolving legal landscapes, designed for strategists and decision-makers."}
            </p>

            <div className="flex items-center gap-8">
              <Link 
                href="#latest-posts" 
                aria-label="Explore the latest journal articles"
                className="group flex items-center gap-3 text-white font-bold tracking-widest uppercase text-xs hover:text-accent transition-colors"
              >
                Explore Journal 
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Right Side: Featured Post Card */}
          {postData && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative group"
            >
              <Link 
                href={postData.slug ? `/blog/${postData.slug}` : "#"} 
                className="block relative z-20"
                aria-label={`Read featured article: ${postData.title}`}
              >
                <div className="relative overflow-hidden rounded-xl bg-primary/80 border border-white/10 backdrop-blur-xl hover:border-accent/20 transition-all duration-700 shadow-2xl hover:shadow-accent/5">
                  {/* Image Container */}
                  <div className="aspect-[16/9] relative overflow-hidden">
                    {postData.image ? (
                      <Image
                        src={postData.image}
                        alt=""
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-8">
                         <span className="text-accent/20 font-serif italic text-3xl tracking-tighter uppercase text-center leading-none">
                           Chambers<br/>Journal
                         </span>
                      </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute top-4 left-4 flex items-center gap-3">
                      <div className="px-2.5 py-1 bg-accent text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded shadow-lg">
                        Featured
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-4 text-accent font-bold text-[10px] tracking-[0.3em] uppercase mb-4">
                      <Calendar className="w-3.5 h-3.5" />
                      {postData.date}
                    </div>
                    <h2 className="text-xl lg:text-2xl font-serif font-bold text-white mb-4 group-hover:text-accent transition-colors duration-500 leading-tight line-clamp-2">
                      {postData.title}
                    </h2>
                    <p className="text-muted-foreground text-sm lg:text-base leading-relaxed mb-6 line-clamp-2 font-sans">
                      {postData.excerpt}
                    </p>
                    
                    <div className="inline-flex items-center gap-3 py-2.5 px-5 bg-accent/10 border border-accent/20 rounded-full text-accent text-[10px] font-bold tracking-widest uppercase group-hover:bg-accent group-hover:text-white transition-all duration-500">
                      Read Article
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Glow Effect */}
              <div className="absolute -z-10 -inset-4 bg-accent/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[3rem]" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
