"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function HeroSection({
  title = "Premium Legal Expertise",
  subtitle = "Trusted advisors delivering strategic legal solutions with precision, integrity, and unwavering commitment to justice.",
  ctaText = "Get In Touch",
  ctaLink = "/contact",
}: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-[60vh] lg:min-h-[70vh] flex items-center bg-primary overflow-hidden">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />

      {/* Accent bar - left side */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />

      {/* Content container */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12 py-20 lg:py-32">
        <div className="max-w-3xl">
          {/* Headline with slide from left animation */}
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight text-white mb-6"
          >
            {title}
          </motion.h1>

          {/* Subheading with slide from right animation */}
          <motion.p
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-lg sm:text-xl lg:text-2xl text-muted-foreground font-sans leading-relaxed mb-10 max-w-2xl"
          >
            {subtitle}
          </motion.p>

          {/* CTA Button with scale up animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/85 text-white font-semibold tracking-wider uppercase rounded-sm h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Decorative element - subtle pattern or glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
