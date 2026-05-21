"use client";

import { motion } from "framer-motion";
import { Compass, MapPin } from "lucide-react";

export interface MapSectionProps {
  title?: string | null;
  subtitle?: string | null;
  features?: { text: string }[] | null;
  mapOverlayTitle?: string | null;
  mapOverlayDescription?: string | null;
}

export const MapSection = ({ title, subtitle, features: payloadFeatures, mapOverlayTitle, mapOverlayDescription }: MapSectionProps) => {
  const activeFeatures = payloadFeatures && payloadFeatures.length > 0 
    ? payloadFeatures.map(f => f.text) 
    : [
        "Reserved Client Parking Available",
        "Accessible Entry Points",
        "Strategic Business Hubs"
      ];

  return (
    <section className="py-16 md:py-24 px-6 bg-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-[1280px] mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-4"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-teal-primary/10 flex items-center justify-center">
                <Compass className="w-6 h-6 text-teal-primary" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-primary">
                {title || "Find Us"}
              </h2>
            </div>
            
            <div className="w-24 h-0.5 bg-teal-primary/50 mb-6" />
            
            <p className="text-slate-secondary text-lg leading-relaxed mb-8 font-sans">
              {subtitle || "Our chambers are located in premium business districts, ensuring ease of access and absolute confidentiality."}
            </p>

            <div className="space-y-4">
              {activeFeatures.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-slate-primary">
                  <div className="w-2 h-2 rounded-full bg-teal-primary" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-8 relative aspect-video rounded-xl overflow-hidden shadow-lg border border-slate-200"
          >
            <div className="absolute inset-0 bg-gray-light flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-teal-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-teal-primary" />
                </div>
                <p className="text-slate-primary font-semibold mb-2">Interactive Map</p>
                <p className="text-slate-secondary text-sm">Gujarat, India</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
