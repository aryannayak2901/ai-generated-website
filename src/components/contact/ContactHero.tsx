"use client";

import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactHero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-40 md:pb-32 overflow-hidden bg-navy dark:bg-navy transition-colors duration-500">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-gold/20 rounded-full blur-[140px] mix-blend-screen pointer-events-none" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-slate-gray/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none" 
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mx-auto text-center flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 mb-10 text-[10px] font-bold tracking-[0.3em] uppercase rounded-full bg-gold/10 text-gold border border-gold/20 backdrop-blur-md shadow-lg shadow-gold/5"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            Contact Chambers of Jeet Bhatt
          </motion.div>

          <h1 className="font-serif text-5xl md:text-8xl lg:text-9xl font-bold text-white mb-10 leading-[0.95] tracking-tight">
            Schedule Legal <span className="text-gold italic font-medium">Consultation</span>
          </h1>

          <p className="text-xl md:text-3xl text-slate-300 font-sans leading-relaxed max-w-3xl mx-auto mb-16 font-light">
            Whether you&apos;re facing a complex legal challenge or seeking strategic counsel,
            we provide <span className="text-white font-medium">unmatched expertise</span> with absolute integrity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 w-full max-w-2xl mx-auto">
            <Button
              className="w-full sm:w-auto bg-gold hover:bg-white text-navy h-16 md:h-18 px-12 rounded-none font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl shadow-gold/20 hover:shadow-white/20 text-xs"
              onClick={() => window.open("tel:+919408282982", "_self")}
            >
              <Phone className="mr-3 h-5 w-5" />
              +91 94082 82982
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 h-16 md:h-18 px-12 rounded-none font-bold uppercase tracking-[0.2em] transition-all duration-500 text-xs"
              onClick={() => window.open("mailto:info@jeetbhatt.com", "_self")}
            >
              <Mail className="mr-3 h-5 w-5 text-gold" />
              info@jeetbhatt.com
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Decorative scroll indicator line */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: 140 }}
        transition={{ delay: 1.2, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-gradient-to-b from-transparent via-gold/50 to-gold shadow-[0_0_15px_rgba(212,175,55,0.5)] z-10"
      />
    </section>
  );
}
