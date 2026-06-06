"use client";

import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ContactHeroProps {
  tag?: string | null;
  title?: string | null;
  subtitle?: string | null;
  phone?: string | null;
  email?: string | null;
}

export default function ContactHero({
  tag,
  title,
  subtitle,
  phone,
  email,
}: ContactHeroProps) {
  return (
    <section className="relative pt-16 md:pt-24 pb-16 md:pb-24 overflow-hidden bg-primary">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />

      {/* Teal accent bar - left side */}
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
        className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12"
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 mb-8 text-[10px] font-bold tracking-[0.3em] uppercase rounded-full bg-accent/10 text-accent border border-accent/20 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {tag || "Contact Us"}
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[0.95] tracking-tight">
            {title || (
              <>
                Schedule Legal{" "}
                <span className="text-accent italic font-medium">
                  Consultation
                </span>
              </>
            )}
          </h1>

          <div className="w-24 h-0.5 bg-accent/50 mx-auto mb-8" />

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-sans mb-10">
            {subtitle ||
              "Whether you're facing a complex legal challenge or seeking strategic counsel, we provide unmatched expertise with absolute integrity."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-2xl mx-auto">
            <Button
              className="w-full sm:w-auto bg-accent hover:bg-accent/85 text-accent-foreground h-12 sm:h-14 px-8 sm:px-10 rounded-sm font-semibold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              onClick={() =>
                window.open(`tel:${phone || "+919408282982"}`, "_self")
              }
            >
              <Phone className="mr-3 h-5 w-5" />
              {phone || "+91 94082 82982"}
            </Button>
            <Button
              // variant="outline"
              className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 h-12 sm:h-14 px-8 sm:px-10 rounded-sm font-semibold uppercase tracking-wider transition-all duration-300"
              onClick={() =>
                window.open(`mailto:${email || "info@jeetbhatt.com"}`, "_self")
              }
            >
              <Mail className="mr-3 h-5 w-5" />
              {email || "info@jeetbhatt.com"}
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
