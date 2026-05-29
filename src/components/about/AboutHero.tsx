"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import type { Media } from "@/payload-types";

export interface AboutHeroProps {
  className?: string;
  tag?: string | null;
  title?: string | null;
  subtitle?: string | null;
  image?: string | Media | null;
}

export function AboutHero({ className, tag, title, subtitle, image }: AboutHeroProps) {
  let imageUrl = "/images/about-hero.png";
  if (image) {
    if (typeof image === 'string') {
      imageUrl = image;
    } else if (typeof image === 'object' && 'url' in image && typeof image.url === 'string') {
      imageUrl = image.url;
    }
  }
  
  // Ensure imageUrl is a valid URL starting with http, https, or /
  const isUrlValid = imageUrl && (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("/"));
  if (!isUrlValid) {
    imageUrl = "/images/about-hero.png";
  }
  
  return (
    <section className={`relative w-full min-h-[60vh] flex items-center bg-primary overflow-hidden ${className || ""}`}>
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
      
      {/* Teal accent bar - left side */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
      
      {/* Decorative glow */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" 
      />

      <div className="w-full max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6 md:px-8 lg:px-12 py-20 lg:py-32 relative z-10">
        {/* Left: Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col gap-6 text-center lg:text-left mx-auto lg:mx-0 order-2 lg:order-1"
        >
          <div className="inline-flex items-center gap-3 mx-auto lg:mx-0 mb-3">
            <div className="h-[1px] w-12 bg-accent/50" />
            <span className="text-accent font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs">
              {tag || "Our Legacy"}
            </span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
            {title || (
              <>A Tradition of <span className="text-accent">Legal Excellence</span>.</>
            )}
          </h1>
          
          <div className="w-24 h-0.5 bg-accent/50 mx-auto lg:mx-0 mb-4" />

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-sans">
            {subtitle || "Chambers of Jeet Bhatt combines decades of profound legal expertise with a modern, strategic approach. We are committed to upholding the highest standards of justice and integrity."}
          </p>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative h-[400px] lg:h-[600px] w-full rounded-xl overflow-hidden shadow-2xl order-1 lg:order-2"
        >
          <Image
            src={imageUrl}
            alt="Chambers of Jeet Bhatt - Professional Office"
            fill
            priority
            className="object-cover object-center hover:scale-105 transition-transform duration-1000"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
