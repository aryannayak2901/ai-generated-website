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
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <section className="relative min-h-[60vh] flex items-center bg-primary overflow-hidden border-b border-border/10">
      {/* Dynamic Background Grid & Ambient Highlights */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary via-primary to-primary/95" />
      
      {/* Luxury Mesh/Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Animated Premium Light leak / Blur Spotlights */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-20 top-1/4 w-[450px] h-[450px] bg-accent/15 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.18, 0.1],
          x: [0, -30, 0],
          y: [0, 45, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-20 bottom-1/4 w-[450px] h-[450px] bg-accent/10 rounded-full blur-[100px] pointer-events-none"
      />

      {/* Exquisite side gold border accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent/80 via-accent/30 to-transparent" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-8 lg:px-12 py-24 lg:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Badge Tag */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3.5 mb-6">
            <span className="h-[1px] w-8 bg-accent/60" />
            <span className="text-accent font-bold tracking-[0.3em] uppercase text-[11px]">
              {tag || "Our Presence"}
            </span>
            <span className="h-[1px] w-2 bg-accent/40" />
          </motion.div>
          
          {/* Title */}
          <motion.h1 
            variants={itemVariants} 
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.12] tracking-tight"
          >
            {title || "Strategic Locations"}
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            variants={itemVariants} 
            className="text-base sm:text-lg md:text-xl text-muted-foreground/80 leading-relaxed font-sans max-w-2xl font-light"
          >
            {subtitle || "Serving clients with distinction and absolute confidentiality from premier chambers across Gujarat."}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

