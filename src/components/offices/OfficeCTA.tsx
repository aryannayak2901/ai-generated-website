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
    <section className="relative py-16 md:py-24 px-6 bg-primary overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
      
      {/* Teal accent bar - left side */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
      
      {/* Decorative glow */}
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
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0115 3z" />
            </svg>
          </div>
          <span className="text-accent font-bold tracking-[0.4em] uppercase text-[10px]">
            {badge || "Trust & Excellence"}
          </span>
        </div>
        
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          {title ? title : (
            <>Schedule a <span className="text-accent italic font-medium">Private Consultation</span></>
          )}
        </h2>
        
        <div className="w-24 h-0.5 bg-accent/50 mx-auto mb-6" />
        
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto font-sans">
          {subtitle || "Each consultation is held with absolute discretion. Reach out to secure your appointment at our offices."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-accent hover:bg-accent/85 text-white font-semibold tracking-wider uppercase rounded-sm h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => window.open(ctaLink1 || "/contact", "_self")}
          >
            <CalendarCheck className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            {ctaText1 || "Book An Appointment"}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 font-semibold tracking-wider uppercase rounded-sm h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base transition-all duration-300"
            onClick={() => window.open(ctaLink2 || "tel:+919408282982", "_self")}
          >
            <PhoneCall className="mr-2 w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            {ctaText2 || "Call Direct"}
          </Button>
        </div>
        
        <div className="mt-8 text-muted-foreground font-sans text-[10px] uppercase tracking-[0.5em] font-bold">
          {disclaimer || "Monday — Saturday • 24/7 Priority Support"}
        </div>
      </motion.div>
    </section>
  );
}
