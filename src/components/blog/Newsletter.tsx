"use client";

import React from 'react';
import { motion } from "framer-motion";

export interface NewsletterProps {
  badge?: string | null;
  title?: string | null;
  subtitle?: string | null;
  buttonText?: string | null;
  disclaimer?: string | null;
}

export function Newsletter({ badge, title, subtitle, buttonText, disclaimer }: NewsletterProps) {
  return (
    <section className="py-16 md:py-24 px-6 bg-primary overflow-hidden relative">
      {/* Decorative Accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[1280px] mx-auto px-6 relative z-10 text-center"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
            {badge || "Newsletter"}
          </span>
          
          <div className="w-24 h-0.5 bg-accent/50 mx-auto" />
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight">
            {title ? title : (
              <>Stay Updated with <span className="text-accent italic font-medium">Legal Insights</span></>
            )}
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed font-sans mb-10">
            {subtitle || "Subscribe to our newsletter for the latest legal updates, case studies, and expert analysis delivered to your inbox."}
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3 mt-10 max-w-xl mx-auto p-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-3 rounded-sm bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-accent/50 font-sans"
              required
            />
            <button type="submit" className="px-8 py-3 bg-accent hover:bg-accent/85 text-accent-foreground font-semibold uppercase tracking-wider text-sm rounded-sm transition-all duration-300 shadow-lg hover:shadow-accent/20 flex items-center gap-2">
              {buttonText || "Subscribe"}
            </button>
          </form>
          
          <p className="text-[10px] text-slate-500 pt-6 font-bold uppercase tracking-[0.2em]">
            {disclaimer || "* Your privacy is our priority. Unsubscribe at any time."}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
