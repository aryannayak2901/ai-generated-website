"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { BlogFilters } from "@/components/blog/BlogFilters";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogModal } from "@/components/blog/BlogModal";
import { BlogPost } from "@/lib/blog-data";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlogListProps {
  posts: BlogPost[];
  categories: string[];
  className?: string;
}

export function BlogList({ posts, categories, className, ...props }: BlogListProps & any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handlePostClick = useCallback((post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // Optional: clear post after animation finishes
    setTimeout(() => setSelectedPost(null), 300);
  }, []);

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return posts.filter((post: BlogPost) => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  return (
    <>
      <section className={cn("py-20 flex-1 relative overflow-hidden", className)} aria-labelledby="blog-list-title" {...props}>
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto px-6 relative z-10">
          <BlogFilters 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchQuery}
          />
          <motion.div layout className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
            <AnimatePresence mode="popLayout">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post: BlogPost, postIndex: number) => (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: postIndex * 0.05 }}
                  >
                    {/* Prioritize the first 6 images for better LCP/LCP sequence */}
                    <BlogCard post={post} onClick={handlePostClick} priority={postIndex < 6} />
                  </motion.div>
                ))
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-32 text-center space-y-6">
                  <div className="text-6xl grayscale opacity-50">📂</div>
                  <h3 className="text-3xl font-serif font-bold text-navy dark:text-white">No articles found</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto font-sans">
                    We couldn&apos;t find any articles matching your criteria. Try adjusting your search or switching categories.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      <BlogModal post={selectedPost} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
