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

export const OfficeCTA = ({ 
  badge, 
  title, 
  subtitle, 
  ctaText1, 
  ctaLink1, 
  ctaText2, 
  ctaLink2, 
  disclaimer 
}: OfficeCTAProps) => {
  return (
    <section className="relative py-28 md:py-36 px-6 bg-primary overflow-hidden border-t border-border/10">
      
      {/* Premium dark mesh radial background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-primary/95 to-primary" />
      <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#d4af37_1px,transparent_1px),linear-gradient(to_bottom,#d4af37_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* Drifting warm golden spotlight sphere animations */}
      <motion.div 
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.18, 0.28, 0.18],
          x: [0, 20, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/3 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-accent/15 rounded-full blur-[130px] pointer-events-none" 
      />
      
      <motion.div 
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-1/4 bottom-1/4 w-[450px] h-[450px] bg-accent/10 rounded-full blur-[110px] pointer-events-none" 
      />

      {/* Elite asymmetrical side gold accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-accent via-accent/30 to-transparent" />

      {/* Whisper thin horizontal dividers */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-accent/15 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/10 to-transparent" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1300px] mx-auto text-center relative z-10"
      >
        {/* Luxury Tag Badge with custom borders */}
        <div className="inline-flex items-center gap-3.5 mb-8">
          <span className="h-[1px] w-6 bg-accent/50" />
          <div className="py-0.5 px-3 bg-accent/5 rounded-full border border-accent/20 backdrop-blur-sm">
            <span className="text-accent font-bold tracking-[0.35em] uppercase text-[10px] font-sans">
              {badge || "Exclusive Advocacy"}
            </span>
          </div>
          <span className="h-[1px] w-6 bg-accent/50" />
        </div>
        
        {/* Playfair Display Title */}
        <h2 className="font-serif text-3.5xl sm:text-4xl md:text-5xl lg:text-6.5xl font-bold text-white mb-8 leading-[1.18] tracking-tight max-w-4xl mx-auto drop-shadow-md">
          {title ? title : (
            <>Arrange a <span className="text-accent italic font-serif font-light">Confidential Consultation</span></>
          )}
        </h2>
        
        {/* Sleek divider line */}
        <div className="w-16 h-[1px] bg-accent/40 mx-auto mb-8" />
        
        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground/80 leading-relaxed mb-12 max-w-2xl mx-auto font-sans font-light tracking-wide">
          {subtitle || "Every engagement is managed with absolute privilege and discretion. Secure your session at our administrative chambers."}
        </p>

        {/* High-end interactive CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 max-w-md sm:max-w-none mx-auto">
          
          {/* Primary CTA: Elegant Gold-to-Brass Gradient */}
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-accent to-accent/85 hover:from-accent/95 hover:to-accent/90 text-accent-foreground font-bold tracking-[0.2em] uppercase rounded-lg h-14 px-8 sm:px-10 text-xs transition-all duration-300 shadow-[0_4px_25px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.45)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer group"
            onClick={() => window.open(ctaLink1 || "/contact", "_self")}
          >
            <CalendarCheck className="mr-2 w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
            {ctaText1 || "Schedule Appointment"}
          </Button>
          
          {/* Secondary CTA: Transparent Glass button with thin borders */}
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-white/10 text-white bg-white/5 hover:bg-white/10 hover:border-accent/45 font-bold tracking-[0.2em] uppercase rounded-lg h-14 px-8 sm:px-10 text-xs transition-all duration-300 cursor-pointer backdrop-blur-sm group"
            onClick={() => window.open(ctaLink2 || "tel:+919408282982", "_self")}
          >
            <PhoneCall className="mr-2 w-4 h-4 sm:w-5 sm:h-5 text-accent transition-transform duration-300 group-hover:scale-105" />
            {ctaText2 || "Direct Contact"}
          </Button>
        </div>
        
        {/* Footnote Disclaimer */}
        <div className="mt-14 text-muted-foreground/45 font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.45em] font-semibold">
          {disclaimer || "Monday — Saturday • 24/7 Priority Advocacy Registry"}
        </div>
      </motion.div>
    </section>
  );
}
