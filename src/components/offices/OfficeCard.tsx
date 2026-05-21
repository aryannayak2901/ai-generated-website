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
    <div className="relative py-12 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-0">
          {/* Image Container */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 relative z-10"
          >
            <div className="relative h-full min-h-[450px] lg:min-h-full rounded-xl lg:rounded-l-xl overflow-hidden shadow-2xl border border-slate-200">
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60" />

              {/* Corner Accent */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-accent -translate-x-3 -translate-y-3 opacity-50" />
            </div>

            {/* Background Decorative element */}
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-accent/10 rounded-full blur-3xl -z-10" />
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-6 mt-12 lg:mt-0 relative"
          >
            <div className="relative z-10 bg-white border border-slate-200 shadow-lg rounded-xl lg:rounded-r-xl lg:rounded-l-none h-full flex flex-col justify-center p-8 md:p-16">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-[1.5px] bg-accent shadow-md shadow-accent/30" />
                <span className="text-accent font-bold tracking-[0.25em] uppercase text-[10px]">
                  Office Location
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8 leading-tight">
                {name}
              </h3>

              <div className="space-y-8 mb-10">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent shadow-lg">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2.5">
                      Location
                    </p>
                    <p className="text-foreground font-sans text-lg leading-relaxed">
                      {address}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent shadow-lg">
                      <Phone size={22} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2.5">
                        Contact
                      </p>
                      {phone.map((p, idx) => (
                        <p key={idx} className="text-foreground font-sans">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent shadow-lg">
                      <Clock size={22} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2.5">
                        Office Hours
                      </p>
                      {hours.map((h, idx) => (
                        <p key={idx} className="text-foreground font-sans text-sm">
                          {h.day}: {h.time}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                asChild
                className="w-full bg-accent hover:bg-accent/85 text-white font-semibold tracking-wider uppercase rounded-sm h-12 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                  View on Map <MapPin className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
