"use client";

import React from 'react';
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
}

export function BlogFilters({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  onSearchChange 
}: BlogFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center justify-between py-10 border-b border-navy/5 dark:border-white/5">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-x-auto max-w-full no-scrollbar shadow-inner">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "px-6 py-2.5 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 whitespace-nowrap",
              selectedCategory === category
                ? "bg-white dark:bg-gold text-navy dark:text-navy shadow-md ring-1 ring-black/5"
                : "text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white"
            )}
          >
            {category === "All" ? "All Articles" : category}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative w-full lg:w-96 group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-gold transition-colors duration-300" />
        <input
          type="text"
          placeholder="Search articles, topics or insights..."
          aria-label="Search articles, topics or insights"
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-5 py-4 bg-white dark:bg-navy/50 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all duration-300 font-sans text-navy dark:text-white placeholder:text-slate-400 shadow-sm"
        />
      </div>
    </div>
  );
}
