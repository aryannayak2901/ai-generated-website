"use client";

import React from "react";
import { TeamMember } from "@/data/team";
import { BriefcaseBusiness } from "lucide-react";

export default function ExperienceTab({ member }: { member: TeamMember }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative border-l border-border ml-4 md:ml-6 space-y-12">
        {member.experience.map((exp, index) => (
          <div key={index} className="relative pl-8 md:pl-12">
            {/* Timeline Marker */}
            <div className="absolute -left-3 md:-left-4 top-1 w-6 h-6 md:w-8 md:h-8 rounded-full bg-background border border-border flex items-center justify-center">
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-accent" />
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-card-foreground mb-2">
                    {exp.title}
                  </h3>
                  <div className="flex items-center gap-2 text-accent font-medium uppercase tracking-wider text-sm">
                    <BriefcaseBusiness className="w-4 h-4" />
                    {exp.organization}
                  </div>
                </div>
                <div className="shrink-0 px-4 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-semibold tracking-wider uppercase border border-border">
                  {exp.period}
                </div>
              </div>

              <ul className="space-y-3 mt-6">
                {exp.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-border shrink-0" />
                    <span className="text-muted-foreground text-sm md:text-base leading-relaxed">
                      {resp}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
