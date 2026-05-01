"use client";

import { motion } from "framer-motion";
import { Search, Compass } from "lucide-react";

export const MapSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background dark:bg-navy relative overflow-hidden transition-colors duration-500">
      {/* Decorative vertical lines */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-navy/5 dark:bg-white/5 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-navy/5 dark:bg-white/5 pointer-events-none" />

      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4"
          >
            <div className="flex items-center gap-5 mb-8">
              <div className="p-3 bg-gold/10 rounded-xl text-gold">
                <Compass size={32} strokeWidth={1.5} />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-navy dark:text-white">
                Find <span className="text-gold italic font-medium">Us</span>
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-sans text-lg mb-10 leading-relaxed">
              Our chambers are located in premium business districts, ensuring ease of access 
              and absolute confidentiality for all our distinguished clients.
            </p>
            <div className="space-y-5">
              {[
                "Reserved Client Parking Available",
                "Accessible Entry Points",
                "Strategic Business Hubs"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 text-slate-700 dark:text-slate-300 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8 relative aspect-video min-h-[450px] rounded-2xl overflow-hidden shadow-2xl border border-navy/5 dark:border-white/5 group"
          >
            {/* Interactive Map Placeholder */}
            <div className="absolute inset-0 bg-slate-50 dark:bg-[#0a0f1d] flex items-center justify-center overflow-hidden transition-colors duration-500">
              {/* Abstract Map Grid */}
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
              <div className="absolute inset-0" style={{ 
                backgroundImage: 'linear-gradient(rgba(212, 175, 55, 0.05) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(212, 175, 55, 0.05) 1.5px, transparent 1.5px)',
                backgroundSize: '50px 50px'
              }} />

              <div className="text-center relative z-10 px-6">
                <div className="w-28 h-28 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-10 relative group-hover:scale-110 transition-transform duration-700 shadow-2xl">
                  <div className="absolute inset-0 rounded-full animate-ping bg-gold/20" />
                  <Search size={44} strokeWidth={1.5} />
                </div>
                <h3 className="text-3xl font-serif text-navy dark:text-white mb-6 italic tracking-wide">Interactive Global View</h3>
                <p className="text-slate-500 dark:text-slate-500 font-sans max-w-sm mx-auto leading-relaxed text-sm font-medium">
                  Interactive precision markers for our Ahmedabad and Gandhinagar chambers. 
                  View individual locations above for specific directions.
                </p>
              </div>
            </div>
            
            {/* Glass corner accent */}
            <div className="absolute bottom-8 right-8 px-6 py-3 bg-white/80 dark:bg-navy/80 backdrop-blur-md border border-navy/5 dark:border-white/10 rounded-xl text-[10px] font-bold text-gold tracking-[0.25em] uppercase shadow-xl">
              GPS Verified
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
