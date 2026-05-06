"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export interface NewsletterProps {
  badge?: string | null;
  title?: string | null;
  subtitle?: string | null;
  disclaimer?: string | null;
}

export function Newsletter({ badge, title, subtitle, disclaimer }: NewsletterProps) {
  return (
    <section className="py-24 md:py-32 bg-navy dark:bg-navy/95 text-white relative overflow-hidden">
      {/* Decorative Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 relative z-10 text-center"
      >
        <div className="max-w-3xl mx-auto space-y-8">
          <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs">
            {badge || "Newsletter"}
          </span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight tracking-tight">
            {title ? title : (
              <>Stay Updated with <br />
              <span className="text-gold italic font-medium">Legal Insights</span></>
            )}
          </h2>
          <p className="text-lg md:text-xl text-slate-300 font-sans leading-relaxed max-w-2xl mx-auto">
            {subtitle || "Subscribe to our newsletter for the latest legal updates, case studies, and expert analysis delivered to your inbox."}
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 mt-12 max-w-xl mx-auto p-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl">
            <Input 
              type="email" 
              placeholder="Your email address" 
              aria-label="Email address for newsletter subscription"
              className="h-14 bg-transparent border-none text-white placeholder:text-slate-400 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 text-base px-6"
              required
            />
            <Button className="h-14 px-10 bg-gold hover:bg-white text-navy font-bold transition-all duration-300 shadow-xl rounded-xl uppercase tracking-widest text-xs">
              Subscribe
            </Button>
          </form>
          
          <p className="text-[10px] text-slate-500 pt-6 font-bold uppercase tracking-[0.2em]">
            {disclaimer || "* Your privacy is our priority. Unsubscribe at any time."}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
