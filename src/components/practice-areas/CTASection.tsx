"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CTASection({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "py-24 md:py-32 px-6 md:px-12 bg-navy dark:bg-navy/95 w-full relative overflow-hidden",
        className,
      )}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-30" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -mb-48 -mr-48 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center relative z-10"
      >
        <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs mb-6">
          Take the next step
        </span>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
          Ready to Discuss Your <br className="hidden md:block" /> 
          <span className="text-gold italic font-medium">Legal Strategy?</span>
        </h2>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 mx-auto font-sans leading-relaxed">
          Our experienced attorneys are ready to help you navigate your legal
          challenges. Contact us today for a strategic consultation focused on
          your success.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto">
          <Button
            asChild
            size="lg"
            className="bg-gold text-navy hover:bg-white transition-all duration-300 font-bold tracking-[0.1em] uppercase rounded-none h-14 px-10 shadow-[0_10px_30px_rgba(212,175,55,0.2)] group"
          >
            <Link href="/contact">
              Schedule Consultation
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-white border-white/20 hover:bg-white/10 transition-all duration-300 font-bold tracking-[0.1em] uppercase rounded-none h-14 px-10"
          >
            <a href="tel:+919876543210">
              <Phone className="mr-2 w-4 h-4" />
              Call Now
            </a>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
