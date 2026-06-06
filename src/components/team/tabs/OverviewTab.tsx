"use client";

import React from "react";
import { TeamMember } from "@/data/team";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Building2, TrendingUp, CheckCircle2 } from "lucide-react";
import { RichText } from "@payloadcms/richtext-lexical/react";

export default function OverviewTab({ member }: { member: TeamMember }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Bio Section */}
      <div className="mb-12 text-muted-foreground font-serif text-lg leading-relaxed [&_p]:mb-6 last:[&_p]:mb-0 [&_p]:whitespace-pre-wrap [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_li]:mb-2 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-accent/80">
        {Array.isArray(member.bio) ? (
          <div className="space-y-6">
            {member.bio.map((paragraph: string, index: number) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : member.bio ? (
          <RichText data={member.bio} />
        ) : null}
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
