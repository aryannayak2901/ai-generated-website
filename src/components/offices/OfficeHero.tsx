"use client";

import { motion } from "framer-motion";

export interface OfficeHeroProps {
  tag?: string | null;
  title?: string | null;
  subtitle?: string | null;
}

export const OfficeHero = ({ tag, title, subtitle }: OfficeHeroProps) => {
  return (
    <section className="relative h-[75vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-navy dark:bg-navy transition-colors duration-500">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-gold/15 rounded-full blur-[140px] mix-blend-screen pointer-events-none" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-slate-gray/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" 
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mx-auto text-center flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 mb-10 text-[10px] font-bold tracking-[0.3em] uppercase rounded-full bg-gold/10 text-gold border border-gold/20 backdrop-blur-md shadow-lg shadow-gold/5"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            {tag || "Distinguished Chambers"}
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white mb-10 leading-[0.95] tracking-tight">
            {title ? title : (
              <>Our <span className="relative inline-block">
                <span className="text-gold italic font-medium">Chambers</span>
              <motion.svg 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
                className="absolute -bottom-4 left-0 w-full h-4 text-gold/40" 
                viewBox="0 0 100 10" 
                preserveAspectRatio="none"
              >
                <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
              </motion.svg>
            </span></>
            )}
          </h1>
          
          <p className="text-xl md:text-3xl text-slate-300 font-sans leading-relaxed max-w-3xl font-light mx-auto">
            {subtitle ? subtitle : (
              <>Strategically located at the heart of Gujarat&apos;s legal landscape, providing <span className="text-white font-medium"> unmatched expertise</span> and accessibility.</>
            )}
          </p>
        </motion.div>
      </div>
      
      {/* Decorative scroll indicator line */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: 120 }}
        transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-gradient-to-b from-transparent via-gold/50 to-gold shadow-[0_0_15px_rgba(212,175,55,0.5)]"
      />
    </section>
  );
};
