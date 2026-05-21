"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, ArrowUpRight } from "lucide-react";
import { BlogPost } from "@/lib/blog-data";
import Link from "next/link";

interface BlogCardProps {
  post: BlogPost;
  onClick?: (post: BlogPost) => void;
  onHover?: (post: BlogPost) => void;
  priority?: boolean;
}

export function BlogCard({ post, onClick, onHover, priority = false }: BlogCardProps) {
  const isExternal = !!post.externalLink;

  const handleClick = (e: React.MouseEvent) => {
    if (isExternal && post.externalLink) {
      // Allow standard link navigation for external posts
    } else if (onClick) {
      e.preventDefault();
      onClick(post);
    }
  };

  return (
    <Link
      href={isExternal ? (post.externalLink || '#') : `/blog/${post.slug}`}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={handleClick}
      className="block no-underline"
    >
      <Card 
        onMouseEnter={() => onHover?.(post)}
        className="group overflow-hidden border-slate-200 bg-white hover:border-accent/30 hover:shadow-lg transition-all duration-300 rounded-xl relative flex flex-col h-[450px] cursor-pointer p-0 py-0 gap-0"
        aria-label={`Read article: ${post.title}`}
      >
      <div className="relative h-full w-full overflow-hidden">
        {/* Overlay for aesthetic and title readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700 z-10" />
        
        <Image
          src={post.image}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        
        <div className="absolute top-5 left-5 z-20 flex gap-2">
          <Badge className="bg-accent text-white font-bold text-[10px] px-4 py-1.5 rounded-full shadow-lg border-none uppercase tracking-wider">
            {post.category}
          </Badge>
          {isExternal && (
            <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 font-bold text-[10px] px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1.5">
              <ArrowUpRight className="w-3 h-3" />
              External
            </Badge>
          )}
        </div>

        {/* Title Overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <h3 className="text-xl md:text-2xl font-serif font-bold text-white leading-tight group-hover:text-accent transition-colors duration-300 flex-1">
            {post.title}
          </h3>
          <div className="w-0 h-0.5 bg-accent mt-4 group-hover:w-16 transition-all duration-500" />
          
          <div className="mt-4 flex items-center gap-4 text-white/60 text-xs font-sans opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {post.author}
            </span>
          </div>
        </div>
      </div>
      </Card>
    </Link>
  );
}
