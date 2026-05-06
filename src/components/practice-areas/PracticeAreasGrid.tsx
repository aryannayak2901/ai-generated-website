"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { practiceAreas as fallbackAreas } from "@/data/practice-areas";
import { PracticeAreaCard } from "./PracticeAreaCard";
import { 
  Briefcase, 
  Gavel, 
  Building2, 
  Landmark, 
  Scale, 
  Shield, 
  FileText, 
  Users,
  Lightbulb,
  Home,
  TrendingDown,
  Map,
  MessageSquare,
  LucideIcon
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Gavel,
  Building2,
  Landmark,
  Scale,
  Shield,
  FileText,
  Users,
  Lightbulb,
  Home,
  TrendingDown,
  Map,
  MessageSquare
};

export interface PracticeAreasGridProps {
  className?: string;
  title?: string | null;
  subtitle?: string | null;
  areas?: {
    title: string;
    description?: string | null;
    icon?: string | null;
    services?: {
      name: string;
    }[] | null;
  }[] | null;
}

export function PracticeAreasGrid({ className, title, subtitle, areas: payloadAreas }: PracticeAreasGridProps) {
  // Map payload areas to the format expected by PracticeAreaCard
  const activeAreas = payloadAreas && payloadAreas.length > 0
    ? payloadAreas.map((area, index) => {
        const IconComponent = area.icon && iconMap[area.icon] ? iconMap[area.icon] : Briefcase;
        return {
          id: `payload-area-${index}`,
          title: area.title,
          description: area.description || "",
          icon: IconComponent as LucideIcon,
          services: area.services ? area.services.map(s => s.name) : []
        };
      })
    : fallbackAreas.map((area) => ({
        ...area,
        // Ensure fallback icons are valid Lucide components
        icon: (typeof area.icon === 'string' && iconMap[area.icon] ? iconMap[area.icon] : area.icon) as LucideIcon
      }));

  return (
    <section className={cn("py-24 px-6 md:px-12 bg-background dark:bg-navy w-full relative", className)}>
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {(title || subtitle) && (
          <div className="text-center mb-20">
            {title && (
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-navy dark:text-white mb-6">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans">
                {subtitle}
              </p>
            )}
            <div className="w-20 h-1 bg-gold mx-auto mt-8" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {activeAreas.map((area, index) => (
            <PracticeAreaCard
              key={area.id}
              index={index}
              title={area.title}
              description={area.description}
              icon={area.icon}
              services={area.services}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
