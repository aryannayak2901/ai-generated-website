"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CalendarCheck, PhoneCall } from "lucide-react";

export interface OfficeCTAProps {
  badge?: string | null;
  title?: string | null;
  subtitle?: string | null;
  ctaText1?: string | null;
  ctaLink1?: string | null;
  ctaText2?: string | null;
  ctaLink2?: string | null;
  disclaimer?: string | null;
}

export const OfficeCTA = ({ badge, title, subtitle, ctaText1, ctaLink1, ctaText2, ctaLink2, disclaimer }: OfficeCTAProps) => {
  return (
    <section className="relative py-24 md:py-32 px-6 bg-primary overflow-hidden border-t border-border/10">
      {/* Premium dark mesh background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-primary to-primary/95" />
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Refined ambient gold leaks */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" 
      />

      {/* Exquisite side gold accent border */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent via-accent/40 to-transparent" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1300px] mx-auto text-center relative z-10"
      >
        {/* Luxury Tag Badge */}
        <div className="inline-flex items-center gap-3.5 mb-8">
          <span className="h-[1px] w-6 bg-accent/60" />
          <span className="text-accent font-bold tracking-[0.35em] uppercase text-[10px]">
            {badge || "Exclusive Advocacy"}
          </span>
          <span className="h-[1px] w-6 bg-accent/60" />
        </div>
        
        {/* Playfair Display Title */}
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-[1.15] tracking-tight max-w-4xl mx-auto">
          {title ? title : (
            <>Arrange a <span className="text-accent italic font-serif font-light">Confidential Consultation</span></>
          )}
        </h2>
        
        <div className="w-16 h-[1.5px] bg-accent/50 mx-auto mb-8" />
        
        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground/80 leading-relaxed mb-12 max-w-2xl mx-auto font-sans font-light">
          {subtitle || "Every engagement is managed with absolute privilege and discretion. Secure your session at our administrative chambers."}
        </p>

        {/* High-end interactive CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 max-w-md sm:max-w-none mx-auto">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white font-semibold tracking-widest uppercase rounded-md h-13 sm:h-14 px-8 sm:px-10 text-xs transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            onClick={() => window.open(ctaLink1 || "/contact", "_self")}
          >
            <CalendarCheck className="mr-2 w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
            {ctaText1 || "Schedule Appointment"}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-white/20 text-white hover:bg-white/5 font-semibold tracking-widest uppercase rounded-md h-13 sm:h-14 px-8 sm:px-10 text-xs transition-all duration-300 cursor-pointer backdrop-blur-sm"
            onClick={() => window.open(ctaLink2 || "tel:+919408282982", "_self")}
          >
            <PhoneCall className="mr-2 w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            {ctaText2 || "Direct Contact"}
          </Button>
        </div>
        
        {/* Footnote Disclaimer */}
        <div className="mt-12 text-muted-foreground/50 font-sans text-[9px] uppercase tracking-[0.45em] font-semibold">
          {disclaimer || "Monday — Saturday • 24/7 Priority Advocacy Registry"}
        </div>
      </motion.div>
    </section>
  );
}

