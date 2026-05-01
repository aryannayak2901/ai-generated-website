"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function PracticeAreasHero({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "relative py-24 md:py-32 px-6 md:px-12 w-full text-center bg-navy overflow-hidden",
        className,
      )}
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -top-24 -right-24 w-96 h-96 bg-gold/10 rounded-full blur-[100px] pointer-events-none" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        className="absolute -bottom-24 -left-24 w-80 h-80 bg-gold/5 rounded-full blur-[80px] pointer-events-none" 
      />

      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center pt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.3em] uppercase text-gold bg-gold/10 rounded-full border border-gold/20 backdrop-blur-sm">
            Expertise & Excellence
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Practice <span className="text-gold italic font-medium">Areas</span>
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto mb-10 shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans"
        >
          Comprehensive consulting, advisory, and litigation services across
          multiple legal domains. We provide tailored, strategic legal solutions
          designed to navigate the most complex legal landscapes.
        </motion.p>
      </div>

      {/* Decorative scroll indicator line */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: 120 }}
        transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-gradient-to-b from-transparent via-gold/50 to-gold shadow-[0_0_15px_rgba(212,175,55,0.5)] z-10"
      />
    </section>
  );
}
