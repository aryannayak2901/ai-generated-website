"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export interface OfficeHeroProps {
  tag?: string | null;
  title?: string | null;
  subtitle?: string | null;
}

export function OfficeHero({ tag, title, subtitle }: OfficeHeroProps) {
  return (
    <section className="relative min-h-[50vh] flex items-center bg-primary overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
      
      {/* Accent bar - left side */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
      
      {/* Decorative glow */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12 py-20 lg:py-32 text-center"
      >
        <div className="max-w-3xl mx-auto">
          <Badge className="mb-6 bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 transition-colors uppercase tracking-wider text-xs font-semibold">
            {tag || "Our Locations"}
          </Badge>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            {title || "Our Offices"}
          </h1>
          
          <div className="w-24 h-0.5 bg-accent/50 mx-auto mb-8" />
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-sans">
            {subtitle || "Strategically located to serve clients across Gujarat with excellence and accessibility."}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
