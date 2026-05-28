"use client";

import { motion } from "framer-motion";

export interface ContactMapProps {
  mapUrl?: string | null;
  locationTitle?: string | null;
  locationAddress?: string | null;
}

export default function ContactMap({ mapUrl, locationTitle, locationAddress }: ContactMapProps) {
  const activeMapUrl = mapUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.697926017772!2d72.5222!3d23.0784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e833444444445%3A0x6b74ad4a4e63480e!2sSG+Business+Hub!5e0!3m2!1sen!2sin!4v1710450000000!5m2!1sen!2sin';
  const activeTitle = locationTitle || 'Main Chamber';
  const activeAddress = locationAddress || 'SG Business Hub, Sola, SG Highway, Ahmedabad';

  return (
    <section className="py-16 md:py-24 px-6 bg-secondary w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-[1280px] mx-auto"
      >
        <div className="bg-card rounded-xl overflow-hidden shadow-lg border border-border grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Map Iframe */}
          <div className="lg:col-span-8 relative h-[450px] bg-muted">
            <iframe
              src={activeMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={activeTitle}
              className="absolute inset-0 w-full h-full"
            />
          </div>
          
          {/* Map Info Box */}
          <div className="lg:col-span-4 p-8 md:p-12 flex flex-col justify-center bg-card space-y-6">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <svg 
                className="w-6 h-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
            </div>
            
            <div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-3 leading-tight">
                {activeTitle}
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed font-sans whitespace-pre-line">
                {activeAddress}
              </p>
            </div>
            
            <div className="pt-4 border-t border-border">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeAddress)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent hover:text-accent/85 transition-colors font-semibold text-sm uppercase tracking-wider"
              >
                Get Directions
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
