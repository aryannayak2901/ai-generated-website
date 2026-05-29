"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, User, Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import { BlogPost } from "@/lib/blog-data";
import { Badge } from "@/components/ui/badge";

interface BlogModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}

interface LexicalNode {
  type: string;
  tag?: string;
  format?: number;
  text?: string;
  children?: LexicalNode[];
}

interface LexicalContent {
  root: {
    children: LexicalNode[];
  };
}

export function BlogModal({ post, isOpen, onClose }: BlogModalProps) {
  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!post) return null;

  const content = post.content as string | LexicalContent;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-primary/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden bg-card border border-accent/20 rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-[110] p-2 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-all duration-300 text-foreground"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Image Section */}
              <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              {/* Content Section */}
              <div className="flex-1 p-8 md:p-10 overflow-y-auto">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="teal">{post.category}</Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                </div>

                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {post.title}
                </h2>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  {post.summary}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{post.author}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-accent hover:text-accent/85 font-semibold text-sm transition-colors"
                  >
                    Close
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
