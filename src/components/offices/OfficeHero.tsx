"use client";

import { motion } from "framer-motion";

export interface OfficeHeroProps {
  tag?: string | null;
  title?: string | null;
  subtitle?: string | null;
}

export function OfficeHero({ tag, title, subtitle }: OfficeHeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <section className="relative min-h-[60vh] md:min-h-[65vh] flex items-center bg-primary overflow-hidden border-b border-border/10">
      {/* Luxury Radial Backlighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary via-primary/90 to-primary" />
      
      {/* Exquisite Architectural Mesh Overlay */}
      <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#d4af37_1px,transparent_1px),linear-gradient(to_bottom,#d4af37_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,white_70%,transparent_100%)]" />
      
      {/* Dynamic Cinematic Gold Leak Sphere */}
      <motion.div
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.18, 0.28, 0.18],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-16 -top-16 w-[550px] h-[550px] bg-accent/20 rounded-full blur-[120px] pointer-events-none"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.12, 0.22, 0.12],
          x: [0, -25, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-20 bottom-1/4 w-[450px] h-[450px] bg-accent/10 rounded-full blur-[100px] pointer-events-none"
      />

      {/* Elite Asymmetrical Left Gold Accent Bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-accent via-accent/40 to-transparent" />

      {/* Top and Bottom Horizontal Ambient Accents */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-accent/20 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/10 to-transparent" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-8 lg:px-12 pt-28 pb-16 sm:pt-36 sm:pb-24 md:pt-40 md:pb-28 lg:pt-48 lg:pb-36">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Tag Badge with Glassmorphism and Gold Borders */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3.5 mb-4 sm:mb-6">
            <span className="h-[1px] w-8 bg-accent/60" />
            <div className="flex items-center justify-center py-1 px-3 bg-accent/5 rounded-full border border-accent/20 backdrop-blur-sm shadow-[0_2px_10px_rgba(212,175,55,0.03)]">
              <span className="text-accent font-bold tracking-[0.3em] uppercase text-[10px] sm:text-[11px]">
                {tag || "Our Presence"}
              </span>
            </div>
            <span className="h-[1px] w-2 bg-accent/30" />
          </motion.div>
          
          {/* Authoritative Title in Playfair Display (font-serif) */}
          <motion.h1 
            variants={itemVariants} 
            className="font-serif text-3xl sm:text-4.5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-[1.15] sm:leading-[1.12] tracking-tight drop-shadow-md"
          >
            {title || "Strategic Locations"}
          </motion.h1>
          
          {/* Exquisite divider line */}
          <motion.div 
            variants={itemVariants}
            className="w-16 sm:w-20 h-[2px] bg-gradient-to-r from-accent via-accent/50 to-transparent mb-6 sm:mb-8"
          />
          
          {/* Subtitle / Descriptive Context */}
          <motion.p 
            variants={itemVariants} 
            className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground font-sans leading-relaxed max-w-2xl font-light tracking-wide"
          >
            {subtitle || "Serving clients with distinction and absolute confidentiality from premier chambers across Gujarat."}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
