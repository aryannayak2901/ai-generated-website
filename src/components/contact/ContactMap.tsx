"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function ContactMap() {
  return (
    <section className="h-[500px] md:h-[700px] w-full relative bg-background dark:bg-navy overflow-hidden transition-colors duration-500">
      {/* Google Maps Iframe with Premium Filters */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.697926017772!2d72.5222!3d23.0784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e833444444445%3A0x6b74ad4a4e63480e!2sSG+Business+Hub!5e0!3m2!1sen!2sin!4v1710450000000!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{ 
          border: 0, 
          filter: "grayscale(1) contrast(1.2) opacity(0.6) invert(0)",
          mixBlendMode: "luminosity"
        }}
        className="dark:invert dark:opacity-40"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Chambers of Jeet Bhatt Office Location"
      ></iframe>

      {/* Overlay for premium feel */}
      <div className="absolute inset-0 pointer-events-none border-y border-navy/5 dark:border-white/5 shadow-[inner_0_0_100px_rgba(0,0,0,0.1)]" />

      {/* Location Badge */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-navy/90 backdrop-blur-xl p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center gap-6 border border-navy/5 dark:border-white/10 max-w-md w-[90%] sm:w-auto"
      >
        <div className="w-16 h-16 rounded-2xl bg-gold flex items-center justify-center shadow-xl shadow-gold/20 shrink-0">
          <MapPin className="h-8 w-8 text-navy" strokeWidth={1.5} />
        </div>
        <div>
          <h4 className="font-serif text-2xl font-bold text-navy dark:text-white leading-tight mb-2 italic">Main Chamber</h4>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
            SG Business Hub, Sola, <br />
            SG Highway, Ahmedabad
          </p>
        </div>
      </motion.div>
    </section>
  );
}
