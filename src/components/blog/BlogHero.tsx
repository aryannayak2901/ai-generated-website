"use client";

import React from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Bookmark } from "lucide-react";
import type { Post, Media } from "@/payload-types";
import { BlogPost } from "@/lib/blog-data";
import { cn } from "@/lib/utils";

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
      date: featuredPost.publishedAt ? new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Archive 2024',
      excerpt: featuredPost.excerpt || "Explore our latest analysis on key legal developments affecting global enterprises and private clients."
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
    <section className="relative min-h-[70vh] lg:min-h-[85vh] flex items-center py-20 lg:py-0 overflow-hidden bg-[#0f1729] text-white">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(212,175,55,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(212,175,55,0.05)_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      {/* Floating Decorative Elements */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-20 right-[10%] w-64 h-64 bg-gold/10 rounded-full blur-[100px] pointer-events-none" 
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-20 left-[5%] w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" 
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className={cn(
          "grid grid-cols-1 gap-12 lg:gap-20 items-center",
          postData ? "lg:grid-cols-2" : "max-w-4xl"
        )}>
          {/* Left Side: Content */}
          <div className="relative">
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-[1px] w-12 bg-gold/50" />
                  <span className="text-gold font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs">
                    {tag || "Chambers Journal"}
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-8xl font-serif font-bold mb-10 leading-[1.1] tracking-tight">
                  {title ? title : (
                    <>
                      <span className="block">Legal Insights</span>
                      <span className="text-gold italic font-medium relative inline-block">
                        & Perspectives
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="absolute -bottom-2 left-0 h-1 bg-gold/30 rounded-full"
                        />
                      </span>
                    </>
                  )}
                </h1>
                
                <p className="text-lg md:text-xl text-slate-400 font-sans leading-relaxed max-w-xl mb-12 border-l-2 border-gold/20 pl-6">
                  {subtitle || "Authoritative analysis and updates on evolving legal landscapes, designed for strategists and decision-makers."}
                </p>
              </div>

              <div className="flex items-center gap-8">
                <Link 
                  href="#latest-posts" 
                  aria-label="Explore the latest journal articles"
                  className="group flex items-center gap-3 text-white font-bold tracking-widest uppercase text-xs hover:text-gold transition-colors"
                >
                  Explore Journal 
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <div className="hidden sm:block h-10 w-[1px] bg-white/10" />
                <div className="hidden sm:flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-navy bg-slate-800 overflow-hidden">
                        <Image 
                          src={`https://i.pravatar.cc/100?img=${i+10}`} 
                          alt={`Contributor ${i}`} 
                          width={32} 
                          height={32} 
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Expert Contributors</span>
                </div>
              </div>
          </div>

          {/* Right Side: Featured Post Card */}
          {postData && (
            <div className="relative group animate-scale-in">
              <Link 
                href={postData.slug ? `/blog/${postData.slug}` : "#"} 
                className="block relative z-20"
                aria-label={`Read featured article: ${postData.title}`}
              >
                <div className="relative overflow-hidden rounded-2xl bg-[#1e293b]/40 border border-white/5 backdrop-blur-xl hover:border-gold/20 transition-all duration-700 shadow-2xl hover:shadow-gold/5 group">
                  {/* Image Container */}
                  <div className="aspect-[16/9] relative overflow-hidden">
                    {postData.image ? (
                      <Image
                        src={postData.image}
                        alt=""
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-navy to-slate-900 flex items-center justify-center p-8">
                         <span className="text-gold/20 font-serif italic text-3xl tracking-tighter uppercase text-center leading-none">
                           Chambers<br/>Journal
                         </span>
                      </div>
                    )}
                    
                    {/* Glass Overlay on Image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1729] via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute top-4 left-4 flex items-center gap-3">
                      <div className="px-2.5 py-1 bg-gold text-navy text-[10px] font-black uppercase tracking-[0.2em] rounded shadow-lg">
                        Featured
                      </div>
                      <div className="p-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white shadow-lg">
                        <Bookmark className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-8 lg:p-10">
                    <div className="flex items-center gap-4 text-gold font-bold text-[10px] tracking-[0.3em] uppercase mb-4">
                      <Calendar className="w-3.5 h-3.5" />
                      {postData.date}
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-4 group-hover:text-gold transition-colors duration-500 leading-tight line-clamp-2">
                      {postData.title}
                    </h2>
                    <p className="text-slate-400 text-sm lg:text-base leading-relaxed mb-8 line-clamp-2 font-sans font-light">
                      {postData.excerpt}
                    </p>
                    
                    <div className="inline-flex items-center gap-3 py-2.5 px-5 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-bold tracking-widest uppercase group-hover:bg-gold group-hover:text-navy group-hover:border-gold transition-all duration-500">
                      Read Article
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Advanced Shadow & Glow */}
              <div className="absolute -z-10 -inset-4 bg-gold/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[3rem]" />
              <div className="absolute -z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Cinematic Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0f1729] to-transparent z-0" />
      
      {/* Decorative scroll indicator line */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: 100 }}
        transition={{ delay: 1.5, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-gold/30 to-gold shadow-[0_0_20px_rgba(212,175,55,0.4)] z-20"
      />
    </section>
  );
}
