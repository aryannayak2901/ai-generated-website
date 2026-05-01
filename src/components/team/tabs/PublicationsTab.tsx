"use client";

import React from "react";
import { TeamMember } from "@/data/team";
import { BookOpen, ExternalLink, CalendarDays } from "lucide-react";
import Link from "next/link";

export default function PublicationsTab({ member }: { member: TeamMember }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto">
        {member.publications.map((pub, index) => (
          <div
            key={index}
            className="bg-card border border-border p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4 md:gap-6 flex-1">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border">
                  <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-lg md:text-xl font-serif font-bold text-card-foreground leading-tight group-hover:text-accent transition-colors">
                    {pub.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider text-xs font-semibold text-accent/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {pub.publisher}
                    </span>
                    <span className="hidden md:inline text-muted-foreground/50">
                      •
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4" />
                      {pub.year}
                    </span>
                  </div>
                </div>
              </div>

              {pub.link && pub.link !== "#" && (
                <Link
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center justify-center w-full md:w-auto px-6 py-3 bg-background hover:bg-muted text-foreground text-sm font-bold uppercase tracking-wider rounded-xl transition-colors border border-border"
                >
                  Read Source <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
