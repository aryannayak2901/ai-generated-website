"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";
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
    <div className="relative py-8 md:py-16">
      <div className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-6 lg:gap-0 bg-background/40 backdrop-blur-md rounded-2xl overflow-hidden border border-border/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
          {/* Image Container with premium parallax style zoom */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative z-10 group overflow-hidden min-h-[350px] sm:min-h-[450px]"
          >
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
            />
            {/* Elegant vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent opacity-40" />

            {/* Subtle floating branding watermark */}
            <div className="absolute bottom-6 left-6 z-20">
              <span className="text-[10px] font-bold text-accent tracking-[0.3em] uppercase block mb-1">Chambers Premium</span>
              <h4 className="text-white font-serif text-lg font-semibold tracking-wide">{name.split(" - ").pop()}</h4>
            </div>
            
            {/* Ambient Gold corner border on hover */}
            <div className="absolute inset-4 border border-accent/0 group-hover:border-accent/20 transition-all duration-700 pointer-events-none rounded-lg" />
          </motion.div>

          {/* Content Area with sophisticated typography and detailed layout */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-card/60 relative"
          >
            {/* Ambient glow in content panel */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              {/* Category Label */}
              <div className="flex items-center gap-4 mb-6">
                <span className="w-10 h-[1px] bg-accent/60" />
                <span className="text-accent font-bold tracking-[0.25em] uppercase text-[10px]">
                  Establishment Details
                </span>
              </div>

              {/* Office Title */}
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground mb-8 leading-[1.2] tracking-tight">
                {name}
              </h3>

              {/* Specifications List */}
              <div className="space-y-6 mb-10">
                {/* Address Item */}
                <div className="flex gap-4 group/item">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/5 border border-accent/10 flex items-center justify-center text-accent transition-all duration-300 group-hover/item:bg-accent/10 group-hover/item:border-accent/30 shadow-sm">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-1">
                      Chambers Location
                    </h5>
                    <p className="text-foreground/90 font-sans text-sm sm:text-base leading-relaxed">
                      {address}
                    </p>
                  </div>
                </div>

                {/* Grid for Contact Info and Office Hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-border/40">
                  {/* Contact Details */}
                  <div className="flex gap-4 group/item">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/5 border border-accent/10 flex items-center justify-center text-accent transition-all duration-300 group-hover/item:bg-accent/10 group-hover/item:border-accent/30 shadow-sm">
                      <Phone size={18} />
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-1.5">
                        Inquiries & Support
                      </h5>
                      {phone.map((p, idx) => (
                        <p key={idx} className="text-foreground/90 font-sans text-xs sm:text-sm hover:text-accent transition-colors">
                          <a href={`tel:${p.replace(/\s+/g, '')}`}>{p}</a>
                        </p>
                      ))}
                      {email && (
                        <p className="text-foreground/90 font-sans text-xs sm:text-sm hover:text-accent transition-colors mt-0.5 break-all">
                          <a href={`mailto:${email}`}>{email}</a>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Operational Hours */}
                  <div className="flex gap-4 group/item">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/5 border border-accent/10 flex items-center justify-center text-accent transition-all duration-300 group-hover/item:bg-accent/10 group-hover/item:border-accent/30 shadow-sm">
                      <Clock size={18} />
                    </div>
                    <div className="w-full">
                      <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-1.5">
                        Consultation Hours
                      </h5>
                      <div className="space-y-1">
                        {hours.map((h, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs text-foreground/90 font-sans">
                            <span className="font-medium text-muted-foreground">{h.day}</span>
                            <span className="font-light">{h.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA action button */}
            <Button
              asChild
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold tracking-widest uppercase rounded-md h-12 transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.15)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-xs"
            >
              <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                View Strategic Map <MapPin className="ml-2 w-4 h-4 text-white/90" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

