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
    <section className="py-16 md:py-24 bg-primary text-white relative overflow-hidden">
      {/* Decorative Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[1280px] mx-auto px-6 relative z-10 text-center"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs block">
            {badge || "Newsletter"}
          </span>
          
          <div className="w-24 h-0.5 bg-accent/50 mx-auto" />
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight">
            {title ? title : (
              <>Stay Updated with <span className="text-accent italic font-medium">Legal Insights</span></>
            )}
          </h2>
          
          <p className="text-lg text-muted-foreground font-sans leading-relaxed max-w-2xl mx-auto">
            {subtitle || "Subscribe to our newsletter for the latest legal updates, case studies, and expert analysis delivered to your inbox."}
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3 mt-10 max-w-xl mx-auto p-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md">
            <Input 
              type="email" 
              placeholder="Your email address" 
              aria-label="Email address for newsletter subscription"
              className="h-12 bg-transparent border-none text-white placeholder:text-slate-400 focus-visible:ring-accent/20 text-base px-6"
              required
            />
            <Button 
              type="submit"
              className="h-12 px-8 bg-accent hover:bg-accent/85 text-white font-semibold transition-all duration-300 rounded-md uppercase tracking-wider text-xs"
            >
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
