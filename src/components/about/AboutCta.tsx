"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export interface AboutCtaProps {
  className?: string;
  title?: string | null;
  subtitle?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  secondaryCtaText?: string | null;
  secondaryCtaLink?: string | null;
}

export function AboutCta({
  className,
  title,
  subtitle,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
}: AboutCtaProps) {
  return (
    <section className={`relative py-16 md:py-24 px-6 bg-primary overflow-hidden ${className || ""}`}>
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
      
      {/* Decorative element */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-[1280px] mx-auto text-center relative z-10"
      >
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          {title ? title : (
            <>Ready to Secure Your <span className="text-accent italic font-medium">Legal Future</span>?</>
          )}
        </h2>
        
        <div className="w-24 h-0.5 bg-accent/50 mx-auto mb-6" />
        
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto font-sans">
          {subtitle || "Our team of dedicated advocates is prepared to provide the strategic representation and expert counsel you deserve."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/85 text-white font-semibold tracking-wider uppercase rounded-sm h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <Link href={ctaLink || "/contact"}>
              {ctaText || "Schedule Consultation"}
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </Button>

          <Link
            href={secondaryCtaLink || "/practice-areas"}
            className="text-accent hover:text-accent/85 font-semibold tracking-wider uppercase text-sm border-b-2 border-accent/30 hover:border-accent transition-colors py-2"
          >
            {secondaryCtaText || "Explore Practice Areas"}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
