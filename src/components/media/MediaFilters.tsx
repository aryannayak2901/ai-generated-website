"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface MediaFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  videoCounts?: Record<string, number>;
}

export function MediaFilters({
  categories,
  selectedCategory,
  onCategorySelect,
  searchQuery,
  onSearchChange,
  videoCounts,
}: MediaFiltersProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategorySelect(category)}
              className="focus:outline-none"
            >
              <Badge
                variant={selectedCategory === category ? "default" : "outline"}
                className={`px-4 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all duration-300 rounded-sm cursor-pointer ${
                  selectedCategory === category
                    ? "bg-accent text-primary border-accent hover:bg-accent/90"
                    : "bg-transparent text-slate-500 hover:text-accent hover:border-accent/40 dark:text-slate-400 dark:border-white/10"
                }`}
              >
                {category}
                {videoCounts && videoCounts[category] !== undefined && (
                  <span className="ml-1.5 opacity-60 text-[10px]">
                    ({videoCounts[category]})
                  </span>
                )}
              </Badge>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent transition-colors duration-300" />
          <Input
            placeholder="Search legal insights..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 bg-surface dark:bg-primary/40 border-slate-200 dark:border-white/10 focus:ring-accent focus:border-accent transition-all duration-300 rounded-sm"
          />
        </div>
      </div>
    </div>
  );
}
