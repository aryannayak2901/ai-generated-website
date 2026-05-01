"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { practiceAreas } from "@/data/practice-areas";
import { PracticeAreaCard } from "./PracticeAreaCard";

export function PracticeAreasGrid({ className }: { className?: string }) {
  return (
    <section className={cn("py-24 px-6 md:px-12 bg-background dark:bg-navy w-full relative", className)}>
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {practiceAreas.map((area, index) => (
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
