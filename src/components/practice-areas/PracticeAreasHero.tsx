"use client";

import { motion } from "framer-motion";

export interface PracticeAreasHeroProps {
  className?: string;
  tag?: string | null;
  title?: string | null;
  subtitle?: string | null;
}

export function PracticeAreasHero({ className, tag, title, subtitle }: PracticeAreasHeroProps) {
  return (
    <section
      className={`relative min-h-[60vh] flex items-center bg-charcoal-primary overflow-hidden ${className || ""}`}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal-primary via-charcoal-primary to-slate-dark" />
      
      {/* Teal accent bar - left side */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-primary" />
      
      {/* Decorative glow */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-teal-primary/5 rounded-full blur-3xl pointer-events-none" 
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12 py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-3xl"
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.3em] uppercase text-teal-primary bg-teal-primary/10 rounded-full border border-teal-primary/20 backdrop-blur-sm">
            {tag || "Expertise & Excellence"}
          </span>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            {title ? title : (
              <>Practice <span className="text-teal-primary italic font-medium">Areas</span></>
            )}
          </h1>
          
          <div className="w-24 h-0.5 bg-teal-primary/50 mb-10" />
          
          <p className="text-lg md:text-xl text-slate-secondary max-w-2xl leading-relaxed font-sans">
            {subtitle || "Comprehensive consulting, advisory, and litigation services across multiple legal domains. We provide tailored, strategic legal solutions designed to navigate the most complex legal landscapes."}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
