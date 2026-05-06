"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRightCircle } from "lucide-react";

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
    <section
      className={cn("relative py-24 px-6 bg-navy overflow-hidden", className)}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            {title ? (
              title
            ) : (
              <>
                Ready to Secure Your{" "}
                <span className="text-gold">Legal Future</span>?
              </>
            )}
          </h2>
          <p className="text-lg md:text-xl text-slate-300 mb-12 font-sans max-w-2xl mx-auto leading-relaxed">
            {subtitle ||
              "Our team of dedicated advocates is prepared to provide the strategic representation and expert counsel you deserve. Schedule your consultation today."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              asChild
              size="lg"
              className="bg-gold text-navy hover:bg-gold/90 font-bold tracking-widest uppercase rounded-sm h-16 px-10 group"
            >
              <Link
                href={ctaLink || "/contact"}
                className="flex items-center gap-2"
              >
                {ctaText || "Schedule a Consultation"}
                <ArrowRightCircle className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Link
              href={secondaryCtaLink || "/practice-areas"}
              className="text-white font-bold tracking-widest uppercase text-sm border-b border-white/20 hover:border-gold transition-colors py-2"
            >
              {secondaryCtaText || "Explore Practice Areas"}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
