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
            className="fixed inset-0 z-[100] bg-navy/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden bg-white dark:bg-navy border border-gold/20 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-[110] p-2 rounded-full bg-navy/10 dark:bg-white/10 hover:bg-gold hover:text-navy transition-all duration-300 text-navy dark:text-white"
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
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent md:bg-gradient-to-r" />
                <div className="absolute bottom-6 left-6 z-10 md:hidden">
                  <Badge className="bg-gold text-navy font-bold uppercase tracking-wider">
                    {post.category}
                  </Badge>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12 lg:p-16 custom-scrollbar">
                <div className="hidden md:block mb-6">
                  <Badge className="bg-gold text-navy font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                    {post.category}
                  </Badge>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-navy dark:text-white leading-tight">
                      {post.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400 font-medium border-b border-navy/5 dark:border-white/5 pb-8">
                      <span className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gold" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gold" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gold" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>

                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <div className="text-lg md:text-xl text-navy/80 dark:text-white/80 leading-relaxed font-sans whitespace-pre-line">
                      {typeof content === 'string' ? (
                        content
                      ) : (
                        // Basic Lexical rendering: extract text from paragraphs
                        content?.root?.children?.map((node: LexicalNode, idx: number) => {
                          if (node.type === 'paragraph') {
                            return (
                              <p key={idx} className="mb-4">
                                {node.children?.map((child: LexicalNode, cIdx: number) => (
                                  <span key={cIdx} style={{ 
                                    fontWeight: (child.format ?? 0) & 1 ? 'bold' : 'normal',
                                    fontStyle: (child.format ?? 0) & 2 ? 'italic' : 'normal',
                                  }}>
                                    {child.text}
                                  </span>
                                ))}
                              </p>
                            );
                          }
                          if (node.type === 'heading') {
                            const Tag = (node.tag || 'h3') as keyof React.JSX.IntrinsicElements;
                            return (
                              <Tag key={idx} className="font-bold mb-4">
                                {node.children?.map((child: LexicalNode) => child.text).join('')}
                              </Tag>
                            );
                          }
                          return null;
                        })
                      )}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-navy/5 dark:border-white/5">
                    <button
                      onClick={onClose}
                      className="inline-flex items-center gap-3 text-sm font-bold text-navy dark:text-gold uppercase tracking-[0.2em] group"
                    >
                      Return to Blog
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
