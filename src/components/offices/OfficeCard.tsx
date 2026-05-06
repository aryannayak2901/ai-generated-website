"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock, ArrowUpRight } from "lucide-react";
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

export const OfficeCard = ({
  name,
  address,
  phone,
  email,
  hours,
  mapUrl,
  imageUrl,
}: OfficeCardProps) => {
  return (
    <div className="relative py-12 lg:py-24">
      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-0">
          {/* Image Container with Overlap */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 relative z-10"
          >
            <div className="relative h-full min-h-[450px] lg:min-h-full rounded-2xl lg:rounded-l-2xl lg:rounded-r-none overflow-hidden shadow-2xl border border-navy/5 dark:border-white/5 group">
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-60 dark:opacity-80" />

              {/* Corner Accent */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-gold -translate-x-3 -translate-y-3 opacity-50" />
            </div>

            {/* Background Decorative element */}
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-gold/10 rounded-full blur-3xl -z-10" />
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-6 mt-12 lg:mt-0 relative"
          >
            <div className="relative z-10 bg-white/70 dark:bg-navy/60 backdrop-blur-xl border border-navy/5 dark:border-white/5 p-8 md:p-16 rounded-2xl lg:rounded-r-2xl lg:rounded-l-none shadow-2xl h-full flex flex-col justify-center transition-colors duration-500">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-16 h-[1.5px] bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                <span className="text-gold font-bold tracking-[0.25em] uppercase text-[10px]">
                  Primary Chamber
                </span>
              </div>

              <h3 className="text-4xl md:text-6xl font-serif text-navy dark:text-white mb-10 leading-tight">
                {name}
              </h3>

              <div className="space-y-10 mb-14">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gold/10 dark:bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shadow-lg shadow-gold/5">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2.5">
                      Location
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 font-sans text-xl leading-relaxed">
                      {address}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gold/10 dark:bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shadow-lg shadow-gold/5">
                      <Phone size={22} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2.5">
                        Contact
                      </p>
                      {phone.map((p, idx) => (
                        <a
                          key={idx}
                          href={`tel:${p}`}
                          className="block text-slate-700 dark:text-slate-300 hover:text-gold dark:hover:text-gold transition-colors text-lg font-medium"
                        >
                          {p}
                        </a>
                      ))}
                      <a
                        href={`mailto:${email}`}
                        className="block text-slate-500 hover:text-gold transition-colors mt-3 text-sm italic underline decoration-gold/30 underline-offset-4"
                      >
                        {email}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gold/10 dark:bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shadow-lg shadow-gold/5">
                      <Clock size={22} />
                    </div>
                    <div className="w-full">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2.5">
                        Availability
                      </p>
                      <div className="space-y-3">
                        {hours.map((h, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm items-center"
                          >
                            <span className="text-slate-500 dark:text-slate-400 font-medium">{h.day}</span>
                            <span className="text-navy dark:text-slate-200 font-bold text-xs uppercase tracking-wider bg-gold/5 px-2 py-1 rounded-md">
                              {h.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-navy/5 dark:border-white/5 flex flex-wrap gap-6">
                <Button
                  asChild
                  size="lg"
                  className="bg-gold text-navy hover:bg-navy hover:text-white dark:hover:bg-white dark:hover:text-navy font-bold px-12 h-16 rounded-none transition-all shadow-xl shadow-gold/10 uppercase tracking-widest text-xs"
                >
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3"
                  >
                    Get Directions <ArrowUpRight size={20} />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-navy/10 dark:border-white/10 text-navy dark:text-white hover:bg-navy/5 dark:hover:bg-white/5 font-bold px-12 h-16 rounded-none transition-all hover:border-gold/50 uppercase tracking-widest text-xs"
                >
                  Schedule Visit
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
