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
    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between py-8 border-b border-border">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-muted rounded-xl border border-border overflow-x-auto max-w-full no-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "px-5 py-2 rounded-lg text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 whitespace-nowrap",
              selectedCategory === category
                ? "bg-card text-foreground shadow-md ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {category === "All" ? "All Articles" : category}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative w-full lg:w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors duration-300" />
        <input
          type="text"
          placeholder="Search articles, topics or insights..."
          aria-label="Search articles, topics or insights"
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-5 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all duration-300 font-sans text-foreground placeholder:text-muted-foreground shadow-sm"
        />
      </div>
    </div>
  );
}
