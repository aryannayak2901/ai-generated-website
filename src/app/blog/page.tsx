"use client";

import React, { useState, useMemo } from 'react';
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { BlogCard } from "@/components/blog/BlogCard";
import { Newsletter } from "@/components/blog/Newsletter";
import { BLOG_POSTS } from "@/lib/blog-data";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = BLOG_POSTS.map(post => post.category);
    return Array.from(new Set(["All", ...new Set(cats)]));
  }, []);

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <main className="flex flex-col min-h-screen bg-background transition-colors duration-500">
      <BlogHero />
      
      <section className="py-20 flex-1 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

        <div className="container mx-auto px-6 relative z-10">
          <BlogFilters 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchQuery}
          />
          
          <motion.div 
            layout
            className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24"
          >
            <AnimatePresence mode="popLayout">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <BlogCard post={post} />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-32 text-center space-y-6"
                >
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
      
      <Newsletter />
    </main>
  );
}
