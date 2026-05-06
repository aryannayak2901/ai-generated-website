"use client";
import Image from "next/image";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PhoneCall, CalendarCheck, ShieldCheck } from "lucide-react";

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
    <section className="py-24 md:py-32 bg-navy dark:bg-navy/95 relative overflow-hidden transition-colors duration-500">
      {/* Background with subtle legal texture/image */}
      <div className="absolute inset-0 z-0 opacity-15">
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-transparent to-navy z-10" />
        <Image 
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2000" 
          alt="Legal background" 
          fill
          className="object-cover grayscale"
          priority
          sizes="100vw"
        />
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-3 mb-10 text-gold">
            <ShieldCheck size={28} strokeWidth={1.5} />
            <span className="font-bold tracking-[0.4em] uppercase text-[10px]">{badge || "Trust & Excellence"}</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-10 leading-[1.1] tracking-tight">
            {title ? title : (
              <>Schedule a <br />
              <span className="text-gold italic font-medium">Private Consultation</span></>
            )}
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-300 font-sans mb-16 leading-relaxed max-w-3xl mx-auto font-light">
            {subtitle || "Each consultation is held with absolute discretion. Reach out to secure your appointment at our Ahmedabad or Gandhinagar chambers."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" onClick={() => ctaLink1 ? window.open(ctaLink1, "_self") : undefined} className="w-full sm:w-auto bg-gold hover:bg-white text-navy font-bold px-12 h-18 rounded-none text-sm tracking-[0.15em] shadow-2xl shadow-gold/20 transition-all duration-500 border-none uppercase">
                <CalendarCheck className="mr-3 h-5 w-5" />
                {ctaText1 || "Book An Appointment"}
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" size="lg" onClick={() => ctaLink2 ? window.open(ctaLink2, "_self") : undefined} className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 font-bold px-12 h-18 rounded-none text-sm tracking-[0.15em] transition-all duration-500 uppercase">
                <PhoneCall className="mr-3 h-5 w-5 text-gold" />
                {ctaText2 || "Call Direct"}
              </Button>
            </motion.div>
          </div>
          
          <div className="mt-20 text-slate-500 font-sans text-[10px] uppercase tracking-[0.5em] font-bold">
            {disclaimer || "Monday — Saturday • 24/7 Priority Support"}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
