"use client";

import { motion } from "framer-motion";
import { Compass, Check } from "lucide-react";

export interface MapSectionProps {
  title?: string | null;
  subtitle?: string | null;
  features?: { text: string }[] | null;
  mapOverlayTitle?: string | null;
  mapOverlayDescription?: string | null;
  mapUrl?: string | null;
}

export const MapSection = ({ 
  title, 
  subtitle, 
  features: payloadFeatures, 
  mapOverlayTitle, 
  mapOverlayDescription, 
  mapUrl 
}: MapSectionProps) => {
  const activeFeatures = payloadFeatures && payloadFeatures.length > 0 
    ? payloadFeatures.map(f => f.text) 
    : [
        "Reserved Client Parking Available",
        "Accessible Entry Points",
        "Strategic Business Hubs"
      ];
      
  const activeMapUrl = mapUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.697926017772!2d72.5222!3d23.0784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e833444444445%3A0x6b74ad4a4e63480e!2sSG+Business+Hub!5e0!3m2!1sen!2sin!4v1710450000000!5m2!1sen!2sin';

  return (
    <section className="py-24 md:py-32 px-6 bg-background w-full relative overflow-hidden border-t border-border/40">
      
      {/* Exquisite ambient background graphics */}
      <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1300px] mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Professional Context */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            {/* Header Badge with GPU rotating Compass */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/5 border border-accent/15 flex items-center justify-center text-accent shadow-[0_2px_8px_rgba(212,175,55,0.05)]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                  className="flex items-center justify-center"
                >
                  <Compass className="w-5 h-5 text-accent" />
                </motion.div>
              </div>
              <span className="text-accent font-bold tracking-[0.3em] uppercase text-[10px] sm:text-[11px] font-sans">
                Global Direction
              </span>
            </div>

            {/* Authoritative serif title */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight leading-[1.2]">
              {title || "Find Our Chambers"}
            </h2>
            
            {/* Sharp gold highlight bar */}
            <div className="w-16 h-[2px] bg-gradient-to-r from-accent to-accent/40 mb-8" />
            
            <p className="text-muted-foreground/95 text-base sm:text-lg leading-relaxed mb-10 font-sans font-light tracking-wide">
              {subtitle || "Our chambers are strategically established in premium commercial areas across major cities, providing convenient access and absolute security for confidential consulting."}
            </p>

            {/* Premium feature lists */}
            <div className="space-y-4">
              {activeFeatures.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="flex items-center gap-4 text-foreground font-sans group cursor-default"
                >
                  {/* Glowing gold circular check icon */}
                  <div className="w-6 h-6 rounded-full bg-accent/5 border border-accent/25 flex items-center justify-center text-accent shadow-[0_2px_5px_rgba(212,175,55,0.08)] group-hover:bg-accent/15 group-hover:border-accent/40 transition-all duration-300">
                    <Check size={12} className="stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-300 font-sans tracking-wide">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Map Frame with luxurious double borders */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden border border-border/60 shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] min-h-[380px] p-2 bg-background/50 dark:bg-card/20 backdrop-blur-sm"
          >
            {/* Inner Gold accent outline */}
            <div className="absolute inset-2 border border-accent/10 rounded-xl pointer-events-none z-20" />
            
            <div className="relative w-full h-full rounded-xl overflow-hidden z-10 border border-border/40">
              <iframe
                src={activeMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "contrast(1.05) saturate(0.9) grayscale(0.1)" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={title || "Map Location"}
                className="absolute inset-0 w-full h-full"
              />
              
              {/* Elegant vignette overlay */}
              <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10 dark:ring-white/10" />
            </div>

            {/* True premium Glassmorphic Map Overlay details */}
            {(mapOverlayTitle || mapOverlayDescription) && (
              <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-sm p-6 bg-background/80 dark:bg-primary/80 backdrop-blur-xl rounded-xl border border-accent/25 text-foreground shadow-[0_15px_40px_rgba(0,0,0,0.2)] pointer-events-none z-30 hidden md:block">
                {mapOverlayTitle && (
                  <h3 className="font-serif text-lg font-bold mb-2 text-accent tracking-wide">
                    {mapOverlayTitle}
                  </h3>
                )}
                {mapOverlayDescription && (
                  <p className="text-xs text-muted-foreground leading-relaxed font-sans font-light tracking-wide">
                    {mapOverlayDescription}
                  </p>
                )}
              </div>
            )}
          </motion.div>
          
        </div>
      </motion.div>
    </section>
  );
};
