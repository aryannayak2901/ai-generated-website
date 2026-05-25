"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Media } from "@/payload-types";

export interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  images?:
    | {
        image: string | Media;
        id?: string | null;
      }[]
    | null;
}

export function HeroSection({
  title = "Premium Legal Expertise",
  subtitle = "Trusted advisors delivering strategic legal solutions with precision, integrity, and unwavering commitment to justice.",
  ctaText = "Get In Touch",
  ctaLink = "/contact",
  images,
}: HeroSectionProps) {
  // Resolve image objects to pure URLs and alt texts
  const resolvedImages = React.useMemo(() => {
    if (!images || images.length === 0) return [];
    return images
      .map((item) => {
        if (!item || !item.image) return null;
        const url =
          typeof item.image === "object" && item.image.url
            ? item.image.url
            : typeof item.image === "string"
              ? item.image
              : "";
        const alt =
          typeof item.image === "object" && item.image.alt
            ? item.image.alt
            : "Chambers of Jeet Bhatt Banner";
        return { url, alt };
      })
      .filter(
        (item): item is { url: string; alt: string } => !!item && !!item.url,
      );
  }, [images]);

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0); // -1 for left, 1 for right

  const nextSlide = React.useCallback(() => {
    if (resolvedImages.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % resolvedImages.length);
  }, [resolvedImages]);

  const prevSlide = React.useCallback(() => {
    if (resolvedImages.length <= 1) return;
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + resolvedImages.length) % resolvedImages.length,
    );
  }, [resolvedImages]);

  // Autoplay functionality
  React.useEffect(() => {
    if (resolvedImages.length <= 1) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [resolvedImages, nextSlide]);

  const hasCarousel = resolvedImages.length > 0;

  return (
    <section className="relative w-full min-h-[70vh] lg:min-h-[85vh] flex items-center bg-primary overflow-hidden">
      {/* Background Images Carousel */}
      {hasCarousel ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <motion.div
                initial={{ scale: 1.08 }}
                animate={{ scale: 1.01 }}
                transition={{ duration: 6, ease: "easeOut" }}
                className="relative w-full h-full"
              >
                <Image
                  src={resolvedImages[currentIndex].url}
                  alt={resolvedImages[currentIndex].alt}
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="100vw"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
          {/* Refined gradient overlay for high contrast, legibility, and luxury aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/45 lg:from-primary/95 lg:via-primary/75 lg:to-transparent" />
          <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px]" />
        </div>
      ) : (
        /* Fallback: gradient background overlay */
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
      )}

      {/* Accent bar - left side */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent z-20" />

      {/* Content container */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-8 lg:px-12 py-24 lg:py-36 flex flex-col justify-center min-h-[70vh] lg:min-h-[85vh]">
        <div className="max-w-3xl">
          {/* Headline with slide from left animation */}
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight text-white mb-6 drop-shadow-sm"
          >
            {title}
          </motion.h1>

          {/* Subheading with slide from right animation */}
          <motion.p
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="text-base sm:text-lg lg:text-xl xl:text-2xl text-muted-foreground font-sans leading-relaxed mb-10 max-w-2xl drop-shadow-sm"
          >
            {subtitle}
          </motion.p>

          {/* CTA Button with scale up animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/85 text-accent-foreground font-semibold tracking-wider uppercase rounded-sm h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Premium Carousel Controls (Only show if multiple images exist) */}
      {resolvedImages.length > 1 && (
        <>
          {/* Left Arrow Button */}
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-white/20 bg-primary/20 backdrop-blur-md text-white/80 hover:text-white hover:bg-primary/45 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-white/20 bg-primary/20 backdrop-blur-md text-white/80 hover:text-white hover:bg-primary/45 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Line Indicators at Bottom */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
            {resolvedImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`relative h-1 rounded-full transition-all duration-500 overflow-hidden ${
                  idx === currentIndex ? "w-12 bg-accent" : "w-6 bg-white/30"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              >
                {/* Visual loading/progress effect inside active slide bar */}
                {idx === currentIndex && (
                  <motion.div
                    initial={{ left: "-100%" }}
                    animate={{ left: "0%" }}
                    transition={{ duration: 6, ease: "linear" }}
                    className="absolute inset-0 bg-white"
                  />
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Decorative element - subtle glow for non-carousel fallback */}
      {!hasCarousel && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      )}
    </section>
  );
}
