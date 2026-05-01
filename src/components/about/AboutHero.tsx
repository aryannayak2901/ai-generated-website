"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AboutHero({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "relative w-full min-h-[70svh] flex items-center bg-navy text-white overflow-hidden z-0",
        className,
      )}
    >
      {/* Background overlay for depth */}
      <div className="absolute inset-0 bg-navy/60 lg:bg-navy/20 mix-blend-multiply pointer-events-none z-10" />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6 md:px-12 py-24 relative z-20">
        <motion.div
          className="flex flex-col gap-8 max-w-2xl text-center lg:text-left mx-auto lg:mx-0 order-2 lg:order-1"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-3 text-gold mb-2 justify-center lg:justify-start">
            <div className="w-8 h-[1px] bg-gold" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase">
              Our Legacy
            </span>
          </div>

          <motion.h1
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            A Tradition of <span className="text-gold">Legal Excellence</span>.
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-slate-300 max-w-xl font-sans leading-relaxed mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            Chambers of Jeet Bhatt combines decades of profound legal expertise
            with a modern, strategic approach. We are committed to upholding the
            highest standards of justice and integrity.
          </motion.p>
        </motion.div>

        {/* Right side cinematic image area */}
        <motion.div
          className="relative order-1 lg:order-2 h-[400px] lg:h-[600px] w-full bg-slate-900 rounded-lg overflow-hidden shadow-2xl border border-white/5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        >
          <Image
            src="/images/about-hero.png"
            alt="Chambers of Jeet Bhatt - Professional Office"
            fill
            className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-navy/60 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </div>

      {/* Decorative vertical gold line */}
      <motion.div
        initial={{ height: 0 }}
        whileInView={{ height: 100 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-gold/50 to-gold shadow-[0_0_10px_rgba(212,175,55,0.5)] z-30"
      />
    </section>
  );
}
