"use client";

import Image from "next/image";
import { YouTubeVideo } from "@/lib/youtube";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { motion } from "framer-motion";

interface MediaHeroProps {
  video: YouTubeVideo;
  onWatchNow: (video: YouTubeVideo) => void;
}

export function MediaHero({ video, onWatchNow }: MediaHeroProps) {
  return (
    <section className="relative w-full py-12 md:py-20 lg:py-24 overflow-hidden border-b border-slate-200 dark:border-white/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Featured Video
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-text-charcoal dark:text-white leading-[1.1]">
              {video.title}
            </h1>
            
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-xl">
              {video.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button
                size="lg"
                className="bg-accent text-primary hover:bg-accent/90 rounded-sm px-8 font-bold tracking-wide h-14"
                onClick={() => onWatchNow(video)}
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                WATCH FEATURED VIDEO
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative group cursor-pointer"
            onClick={() => onWatchNow(video)}
          >
            <div className="relative aspect-video rounded-sm overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl">
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-accent text-primary flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-500">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
              </div>
            </div>
            
            {/* Subtle glow effect */}
            <div className="absolute -inset-4 bg-accent/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
