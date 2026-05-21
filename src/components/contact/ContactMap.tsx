"use client";

import { motion } from "framer-motion";

export default function ContactMap() {
  return (
    <section className="py-16 md:py-24 px-6 bg-secondary">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-[1280px] mx-auto"
      >
        <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200">
          {/* Map Placeholder - In production, use Google Maps or similar */}
          <div className="relative h-[400px] bg-slate-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <svg 
                  className="w-8 h-8 text-accent" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 20l-5.5-5.5a1.5 1.5 0 010-2l11-11a1.5 1.5 0 012 2L11 18.5 4.5 12" 
                  />
                </svg>
              </div>
              <p className="text-foreground font-semibold mb-2">Interactive Map</p>
              <p className="text-muted-foreground text-sm">
                Gandhinagar, Gujarat, India
              </p>
              <a 
                href="https://maps.google.com/?q=Gandhinagar,Gujarat,India" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-accent hover:text-accent/85 transition-colors font-semibold text-sm"
              >
                Open in Google Maps
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
