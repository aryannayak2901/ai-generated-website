"use client";

import React from "react";
import { TeamMember } from "@/data/team";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Building2, TrendingUp, CheckCircle2 } from "lucide-react";

export default function OverviewTab({ member }: { member: TeamMember }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Bio Section */}
      <div className="mb-12 space-y-4 text-muted-foreground font-serif text-lg leading-relaxed">
        {member.bio.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Areas of Expertise */}
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Briefcase className="w-5 h-5 text-accent" />
              </div>
              <CardTitle className="font-serif text-xl">
                Areas of Expertise
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-3">
              {member.overview.expertise.map((item, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-150 transition-transform" />
                  <span className="text-card-foreground font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Clients */}
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Building2 className="w-5 h-5 text-accent" />
              </div>
              <CardTitle className="font-serif text-xl">Key Clients</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              {member.overview.clients.map((client, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted border border-border"
                >
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-card-foreground text-sm font-medium">
                    {client}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notable Cases */}
      <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <CardTitle className="font-serif text-xl">
              Notable Cases & Achievements
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {member.overview.cases.map((caseItem, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-xl bg-muted border border-border"
              >
                <div className="shrink-0 w-6 h-6 rounded-full bg-border flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                </div>
                <span className="text-card-foreground text-sm leading-relaxed">
                  {caseItem}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
