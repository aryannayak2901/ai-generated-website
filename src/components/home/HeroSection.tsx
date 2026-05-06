"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import type { Media } from "@/payload-types";

export interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  images?: { image: string | Media; id?: string | null }[] | null;
}

const defaultHeroImages = [
  "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2000&auto=format&fit=crop",
];

export function HeroSection({
  title = "Where Precision Meets Justice.",
  subtitle = "Premier counsel specialized in Corporate, Criminal, and Real Estate Law.",
  ctaText = "Request Consultation",
  ctaLink = "/contact",
  images,
}: HeroSectionProps) {
  const plugin = React.useMemo(
    () => Autoplay({ delay: 5000, stopOnInteraction: true }),
    []
  );

  const heroImages = images && images.length > 0 
    ? images.map(img => typeof img.image === 'object' && img.image?.url ? img.image.url : defaultHeroImages[0])
    : defaultHeroImages;

  return (
    <section className="relative w-full min-h-[calc(100svh-115px)] lg:min-h-[min(80vh,800px)] py-16 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-24 flex items-center bg-navy text-white overflow-hidden z-0">
      {/* Background overlay for depth */}
      <div className="absolute inset-0 bg-navy/70 lg:bg-navy/40 mix-blend-multiply pointer-events-none z-10" />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center flex-1 z-20">
        <div
          className="flex flex-col gap-6 sm:gap-8 max-w-2xl text-center lg:text-left mx-auto lg:mx-0 order-2 lg:order-1 relative z-20 animate-fade-in-up"
        >
          <h1
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white drop-shadow-md animate-fade-in-up [animation-delay:200ms]"
          >
            {title}
          </h1>

          <p
            className="text-base sm:text-lg md:text-xl text-white/90 lg:text-slate-gray max-w-xl font-sans leading-relaxed mx-auto lg:mx-0 drop-shadow animate-fade-in-up [animation-delay:400ms]"
          >
            {subtitle}
          </p>

          <div
            className="pt-2 sm:pt-4 animate-fade-in-up [animation-delay:600ms]"
          >
            <Button
              asChild
              size="lg"
              className="bg-gold text-white hover:bg-gold/90 font-bold tracking-widest uppercase rounded-sm h-12 sm:h-14 px-6 sm:px-8 text-xs sm:text-sm w-full sm:w-auto"
            >
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
          </div>
        </div>

        {/* Right side cinematic image area - 50/50 split on desktop, full background on mobile */}
        <div
          className="absolute inset-0 z-0 lg:relative lg:z-20 lg:order-2 lg:h-full lg:min-h-[600px] w-full lg:bg-slate-800 lg:rounded lg:mx-auto lg:overflow-hidden lg:shadow-2xl animate-scale-in [animation-delay:400ms]"
        >
          {/* Subtle gradient overlay on the image place holder */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 via-transparent to-transparent z-10 pointer-events-none" />

          <Carousel
            plugins={[plugin]}
            className="absolute inset-0 w-full h-full [&_.overflow-hidden]:h-full"
            onMouseEnter={plugin.stop}
            onMouseLeave={plugin.reset}
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
                      fetchPriority={index === 0 ? "high" : "auto"}
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
        </div>
      </div>
      {/* Decorative scroll indicator line */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1.5px] h-[120px] bg-gradient-to-b from-transparent via-gold/50 to-gold shadow-[0_0_15px_rgba(212,175,55,0.5)] z-30 animate-fade-in [animation-delay:1000ms]"
      />
    </section>
  );
}
