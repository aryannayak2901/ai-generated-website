"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Mail, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface OfficeCardProps {
  name: string;
  address: string;
  phone: string[];
  email: string;
  hours: { day: string; time: string }[];
  mapUrl: string;
  imageUrl: string;
}

export function OfficeCard({
  name,
  address,
  phone,
  email,
  hours,
  mapUrl,
  imageUrl,
}: OfficeCardProps) {
  return (
    <div className="relative py-4 md:py-8">
      <div className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-0 bg-background/50 dark:bg-card/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-border/60 shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
          
          {/* Left Panel: Luxury Image Area with dynamic overlays & borders */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative z-10 group overflow-hidden min-h-[380px] sm:min-h-[480px] lg:min-h-full"
          >
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
            />
            {/* Exquisite double vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-transparent to-transparent opacity-50" />
            
            {/* Subtle premium warm color wash */}
            <div className="absolute inset-0 bg-accent/5 mix-blend-color-dodge opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />

            {/* Inner architectural gold border frame that illuminates and shrinks slightly on card hover */}
            <div className="absolute inset-5 border border-accent/15 group-hover:border-accent/40 group-hover:inset-4 transition-all duration-700 pointer-events-none rounded-xl">
              {/* Corner highlights */}
              <span className="absolute -top-[1.5px] -left-[1.5px] w-2.5 h-2.5 border-t-2 border-l-2 border-accent" />
              <span className="absolute -top-[1.5px] -right-[1.5px] w-2.5 h-2.5 border-t-2 border-r-2 border-accent" />
              <span className="absolute -bottom-[1.5px] -left-[1.5px] w-2.5 h-2.5 border-b-2 border-l-2 border-accent" />
              <span className="absolute -bottom-[1.5px] -right-[1.5px] w-2.5 h-2.5 border-b-2 border-r-2 border-accent" />
            </div>

            {/* Floating branding watermark */}
            <div className="absolute bottom-8 left-8 z-20">
              <div className="inline-flex items-center gap-2 py-0.5 px-2 bg-accent/10 backdrop-blur-md rounded border border-accent/25 mb-2">
                <span className="text-[9px] font-bold text-accent tracking-[0.25em] uppercase">Chambers Registry</span>
              </div>
              <h4 className="text-white font-serif text-xl sm:text-2xl font-bold tracking-wide leading-tight">
                {name.includes("-") ? name.split(" - ").pop() : name}
              </h4>
            </div>
          </motion.div>

          {/* Right Panel: Content Area with sleek typography, cards, and layouts */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-background/20 dark:bg-card/20 relative"
          >
            {/* Ambient leak inside card */}
            <div className="absolute right-0 top-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Gold Bar Category Label */}
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-[1px] bg-accent/70" />
                <span className="text-accent font-bold tracking-[0.3em] uppercase text-[9px] sm:text-[10px]">
                  Establishment Details
                </span>
              </div>

              {/* Office Title in Playfair display */}
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground mb-8 leading-[1.25] tracking-tight">
                {name}
              </h3>

              {/* Specifications Glass Cards Layout */}
              <div className="space-y-6 mb-10">
                
                {/* Full-width Address Card */}
                <div className="flex gap-4 p-4 rounded-xl bg-secondary/40 dark:bg-secondary/20 border border-border/40 group/item transition-all duration-300 hover:border-accent/20">
                  <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-accent/5 border border-accent/15 flex items-center justify-center text-accent transition-all duration-300 group-hover/item:bg-accent/10 group-hover/item:border-accent/30 shadow-[0_2px_8px_rgba(212,175,55,0.05)]">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h5 className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1 font-sans">
                      Chambers Location
                    </h5>
                    <p className="text-foreground/90 font-sans text-sm sm:text-base leading-relaxed font-light">
                      {address}
                    </p>
                  </div>
                </div>

                {/* Sub-grid for Inquiries and Operating Hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Contact details Card */}
                  <div className="flex flex-col justify-between p-4 rounded-xl bg-secondary/40 dark:bg-secondary/20 border border-border/40 group/item transition-all duration-300 hover:border-accent/20">
                    <div className="flex gap-3 items-start mb-4">
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-accent/5 border border-accent/15 flex items-center justify-center text-accent transition-all duration-300 group-hover/item:bg-accent/10 group-hover/item:border-accent/30 shadow-[0_2px_8px_rgba(212,175,55,0.05)]">
                        <Phone size={15} />
                      </div>
                      <div>
                        <h5 className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-0.5 font-sans">
                          Inquiries & Support
                        </h5>
                        <span className="text-[10px] text-accent font-medium uppercase tracking-wider font-sans">Direct Lines</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5 pt-2 border-t border-border/30">
                      {phone.map((p, idx) => (
                        <p key={idx} className="text-foreground/80 hover:text-accent font-sans text-xs transition-colors duration-200">
                          <a href={`tel:${p.replace(/\s+/g, '')}`} className="flex items-center gap-1.5 font-medium">
                            <span className="w-1 h-1 rounded-full bg-accent/60" />
                            {p}
                          </a>
                        </p>
                      ))}
                      {email && (
                        <p className="text-foreground/80 hover:text-accent font-sans text-xs transition-colors duration-200 break-all mt-1">
                          <a href={`mailto:${email}`} className="flex items-center gap-1.5 font-medium">
                            <Mail size={11} className="text-accent/80" />
                            {email}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Consultation Hours Card */}
                  <div className="flex flex-col justify-between p-4 rounded-xl bg-secondary/40 dark:bg-secondary/20 border border-border/40 group/item transition-all duration-300 hover:border-accent/20">
                    <div className="flex gap-3 items-start mb-4">
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-accent/5 border border-accent/15 flex items-center justify-center text-accent transition-all duration-300 group-hover/item:bg-accent/10 group-hover/item:border-accent/30 shadow-[0_2px_8px_rgba(212,175,55,0.05)]">
                        <Clock size={15} />
                      </div>
                      <div>
                        <h5 className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-0.5 font-sans">
                          Consultation Hours
                        </h5>
                        <span className="text-[10px] text-accent font-medium uppercase tracking-wider font-sans">Regular Schedule</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-border/30 w-full">
                      {hours.map((h, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs text-foreground/80 font-sans">
                          <span className="font-light text-muted-foreground">{h.day}</span>
                          <span className="font-medium">{h.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Exclusive CTA Button: Subtle Gold-to-Brass Gradient */}
            <Button
              asChild
              className="w-full bg-gradient-to-r from-accent to-accent/85 hover:from-accent/95 hover:to-accent/90 text-accent-foreground font-bold tracking-[0.25em] uppercase rounded-lg h-13 transition-all duration-300 shadow-[0_4px_25px_rgba(212,175,55,0.18)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.35)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-xs"
            >
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5">
                View Strategic Map 
                <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
