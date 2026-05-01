"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const heroImages = [
  "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2000&auto=format&fit=crop",
];

export function HeroSection() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  );

  return (
    <section className="relative w-full min-h-[calc(100svh-115px)] lg:min-h-[min(80vh,800px)] py-16 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-24 flex items-center bg-navy text-white overflow-hidden z-0">
      {/* Background overlay for depth */}
      <div className="absolute inset-0 bg-navy/70 lg:bg-navy/40 mix-blend-multiply pointer-events-none z-10" />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center flex-1 z-20">
        <motion.div
          className="flex flex-col gap-6 sm:gap-8 max-w-2xl text-center lg:text-left mx-auto lg:mx-0 order-2 lg:order-1 relative z-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Where Precision Meets Justice.
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-white/90 lg:text-slate-gray max-w-xl font-sans leading-relaxed mx-auto lg:mx-0 drop-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            Premier counsel specialized in Corporate, Criminal, and Real Estate
            Law.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="pt-2 sm:pt-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-gold text-white hover:bg-gold/90 font-bold tracking-widest uppercase rounded-sm h-12 sm:h-14 px-6 sm:px-8 text-xs sm:text-sm w-full sm:w-auto"
            >
              <Link href="/contact">Request Consultation</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Right side cinematic image area - 50/50 split on desktop, full background on mobile */}
        <motion.div
          className="absolute inset-0 z-0 lg:relative lg:z-20 lg:order-2 lg:h-full lg:min-h-[600px] w-full lg:bg-slate-800 lg:rounded lg:mx-auto lg:overflow-hidden lg:shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        >
          {/* Subtle gradient overlay on the image place holder */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 via-transparent to-transparent z-10 pointer-events-none" />

          <Carousel
            plugins={[plugin.current]}
            className="absolute inset-0 w-full h-full [&_.overflow-hidden]:h-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{
              loop: true,
            }}
          >
            <CarouselContent className="h-full ml-0 cursor-grab active:cursor-grabbing">
              {heroImages.map((img, index) => (
                <CarouselItem key={index} className="pl-0 h-full relative">
                  <div className="w-full h-full relative flex items-center justify-center overflow-hidden group">
                    <Image
                      src={img}
                      alt={`Chambers of Jeet Bhatt - Cinematic View ${index + 1}`}
                      fill
                      priority={index === 0}
                      className="object-cover object-center grayscale opacity-80 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />

                    {/* Premium cinematic gradients for depth and text legibility */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-900/40 to-transparent transition-opacity duration-1000 group-hover:opacity-60 pointer-events-none" />
                    <div className="absolute inset-0 bg-primary/30 mix-blend-multiply transition-opacity duration-1000 group-hover:opacity-0 pointer-events-none" />

                    {/* Only show the cinematic text on desktop where it's a standalone card */}
                    <div className="hidden lg:block relative z-20 text-center px-6 pointer-events-none transform transition-transform duration-1000 group-hover:-translate-y-2">
                      <p className="text-white font-sans text-xs sm:text-sm tracking-[0.25em] uppercase mb-4 drop-shadow-lg font-medium">
                        Chambers of Jeet Bhatt
                      </p>
                      <div className="w-16 h-[2px] bg-gold mx-auto transition-all duration-1000 group-hover:w-24 group-hover:bg-gold shadow-[0_0_10px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.6)]" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </motion.div>
      </div>
      {/* Decorative scroll indicator line */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: 120 }}
        transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-gradient-to-b from-transparent via-gold/50 to-gold shadow-[0_0_15px_rgba(212,175,55,0.5)] z-30"
      />
    </section>
  );
}
