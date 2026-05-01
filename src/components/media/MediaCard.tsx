"use client";

import Image from "next/image";
import { YouTubeVideo } from "@/lib/youtube";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Calendar, Eye, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

interface MediaCardProps {
  video: YouTubeVideo;
  onClick?: (video: YouTubeVideo) => void;
}

export function MediaCard({ video, onClick }: MediaCardProps) {
  const formattedDate = new Date(video.publishedAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="cursor-pointer group"
      onClick={() => onClick?.(video)}
    >
      <Card className="overflow-hidden bg-surface dark:bg-primary/40 border-slate-200 dark:border-white/10 hover:border-accent/40 dark:hover:border-accent/40 transition-all duration-300">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-primary transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <Play className="fill-current w-5 h-5 ml-1" />
            </div>
          </div>
          {video.category && (
            <Badge className="absolute top-3 left-3 bg-accent text-primary hover:bg-accent font-semibold text-[10px] uppercase tracking-wider rounded-sm border-none">
              {video.category}
            </Badge>
          )}
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
          </div>
          <h3 className="font-display font-bold text-lg leading-snug text-text-charcoal dark:text-white line-clamp-2 min-h-12 transition-colors duration-300">
            {video.title}
          </h3>
          <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-semibold border-t border-slate-100 dark:border-white/5 pt-3">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3 h-3 text-accent" />
              {video.viewCount} Views
            </span>
            <span className="flex items-center gap-1.5">
              <ThumbsUp className="w-3 h-3 text-accent" />
              {video.likeCount} Likes
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
