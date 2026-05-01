"use client";

import React from "react";
import { TeamMember } from "@/data/team";
import { GraduationCap, Landmark } from "lucide-react";

export default function EducationTab({ member }: { member: TeamMember }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
        {member.education.map((edu, index) => (
          <div
            key={index}
            className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors -mr-16 -mt-16" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>

              <h3 className="text-xl font-serif font-bold text-card-foreground mb-2 pr-8 leading-tight">
                {edu.degree}
              </h3>

              <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-6">
                <Landmark className="w-4 h-4 text-muted-foreground" />
                {edu.institution}
              </div>

              <div className="mt-auto">
                <div className="inline-block px-3 py-1 bg-muted text-muted-foreground rounded-lg text-xs font-bold tracking-wider uppercase mb-4 border border-border">
                  {edu.period}
                </div>

                {edu.specialization && (
                  <div className="pt-4 border-t border-border/50">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                      Specialization
                    </div>
                    <div className="text-sm font-medium text-card-foreground leading-relaxed">
                      {edu.specialization}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
