"use client";

import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Clock, User } from "lucide-react";
import { BlogPost } from "@/lib/blog-data";
import { motion } from "framer-motion";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="group overflow-hidden border-navy/5 dark:border-white/5 bg-white dark:bg-navy/40 hover:border-gold/30 dark:hover:border-gold/30 hover:shadow-[0_20px_50px_rgba(212,175,55,0.12)] transition-all duration-500 rounded-2xl relative flex flex-col h-full">
      <div className="relative h-60 w-full overflow-hidden">
        {/* Overlay for better text readability and aesthetic */}
        <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-all duration-700 z-10" />
        
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        
        <div className="absolute top-5 left-5 z-20">
          <Badge className="bg-gold text-navy hover:bg-white transition-colors duration-300 text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg border-none uppercase tracking-wider">
            {post.category}
          </Badge>
        </div>
      </div>

      <CardHeader className="pt-8 pb-4 px-8 space-y-4">
        <div className="flex items-center gap-5 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em]">
          <span className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-gold" />
            {post.author}
          </span>
          <span className="w-1 h-1 rounded-full bg-gold/30" />
          <span className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-gold" />
            {post.readTime}
          </span>
        </div>
        <h3 className="text-xl md:text-2xl font-serif font-bold text-navy dark:text-white leading-snug group-hover:text-gold transition-colors duration-300 line-clamp-2">
          {post.title}
        </h3>
      </CardHeader>

      <CardContent className="pb-8 px-8 flex-1">
        <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed font-sans line-clamp-3">
          {post.summary}
        </p>
      </CardContent>

      <CardFooter className="pt-0 pb-8 px-8 flex items-center justify-between border-t border-navy/5 dark:border-white/5 mt-auto pt-6">
        <a
          href="#"
          className="inline-flex items-center gap-3 text-xs font-bold text-navy dark:text-gold group/link relative uppercase tracking-widest"
        >
          <span className="relative">
            Read Insights
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover/link:w-full transition-all duration-300" />
          </span>
          <ArrowUpRight className="h-4 w-4 transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300" />
        </a>
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10">
          {post.date}
        </span>
      </CardFooter>
    </Card>
  );
}
