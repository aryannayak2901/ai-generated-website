"use client";

import React from "react";
import { TeamMember } from "@/data/team";
import { Trophy, Award } from "lucide-react";

export default function AwardsTab({ member }: { member: TeamMember }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto">
        {member.awards.map((award, index) => (
          <div
            key={index}
            className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors -mr-12 -mt-12" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors -ml-16 -mb-16" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div className="px-3 py-1 bg-background border border-border rounded-lg text-xs font-bold text-muted-foreground tracking-wider">
                  {award.year}
                </div>
              </div>

              <h3 className="text-xl font-serif font-bold text-card-foreground mb-3 leading-tight">
                {award.title}
              </h3>

              <div className="mt-auto pt-4 border-t border-border/50 flex items-start gap-3">
                <Award className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                  {award.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
