"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export interface CTASectionProps {
  className?: string;
  badge?: string | null;
  title?: string | null;
  subtitle?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  phoneNumber?: string | null;
}

export function CTASection({
  className,
  badge,
  title,
  subtitle,
  ctaText,
  ctaLink,
  phoneNumber,
}: CTASectionProps) {
  return (
    <section
      className={`relative py-16 md:py-24 px-6 bg-charcoal-primary overflow-hidden w-full ${className || ""}`}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal-primary via-charcoal-primary to-slate-dark" />

      {/* Decorative element */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-teal-primary/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-[1280px] mx-auto text-center relative z-10"
      >
        <span className="text-teal-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
          {badge || "Take the next step"}
        </span>

        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
          {title ? (
            title
          ) : (
            <>
              Ready to Discuss Your <br className="hidden md:block" />
              <span className="text-teal-primary italic font-medium">
                Legal Strategy?
              </span>
            </>
          )}
        </h2>

        <p className="text-lg md:text-xl text-slate-secondary max-w-2xl mb-10 mx-auto font-sans leading-relaxed">
          {subtitle ||
            "Our experienced attorneys are ready to help you navigate your legal challenges. Contact us today for a strategic consultation focused on your success."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-teal-primary hover:bg-teal-light text-white font-semibold tracking-wider uppercase rounded-sm h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <Link href={ctaLink || "/contact"}>
              {ctaText || "Get In Touch"}
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white/10 font-semibold tracking-wider uppercase rounded-sm h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base transition-all duration-300"
          >
            <a href={`tel:${phoneNumber || "+919408282982"}`}>
              <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              Call Now
            </a>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
