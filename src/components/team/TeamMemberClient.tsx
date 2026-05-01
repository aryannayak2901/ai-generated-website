"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Scale } from "lucide-react";
import { TeamMember } from "@/data/team";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OverviewTab from "./tabs/OverviewTab";
import ExperienceTab from "./tabs/ExperienceTab";
import EducationTab from "./tabs/EducationTab";
import AwardsTab from "./tabs/AwardsTab";
import PublicationsTab from "./tabs/PublicationsTab";

interface Props {
  member: TeamMember;
}

export default function TeamMemberClient({ member }: Props) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Hero Section */}
      <section className="bg-background-dark text-white relative py-16 px-6 md:px-12 border-b border-white/10">
        <div className="absolute inset-0 bg-linear-to-br from-background-dark to-slate-950 -z-10" />

        <div className="max-w-6xl mx-auto">
          {/* Back Navigation */}
          <Link
            href="/about"
            className="inline-flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium mb-12"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Team
          </Link>

          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
            {/* Portrait Image */}
            <div className="relative shrink-0 w-64 h-80 rounded-[2rem] overflow-hidden border-4 border-slate-800 shadow-2xl bg-slate-800 flex items-center justify-center">
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                  sizes="256px"
                />
              ) : (
                <Scale className="w-24 h-24 text-slate-600" />
              )}
            </div>

            {/* Basic Info */}
            <div className="flex flex-col text-center md:text-left pt-4">
              <Badge
                variant="outline"
                className="w-fit mx-auto md:mx-0 border-accent/50 text-accent mb-6 px-4 py-1 text-xs uppercase tracking-wider bg-accent/10"
              >
                {member.designation}
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4">
                {member.name}
              </h1>

              <h2 className="text-xl md:text-2xl text-slate-300 font-serif max-w-2xl mb-8">
                {member.subtitle}
              </h2>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-3xl">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold text-accent mb-1">
                    {member.stats.experience}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">
                    Years Experience
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold text-accent mb-1">
                    {member.stats.cases}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">
                    Cases Handled
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold text-accent mb-1">
                    {member.stats.publications}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">
                    Publications
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold text-accent mb-1">
                    {member.stats.clients}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">
                    Major Clients
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="flex-1 py-16 px-6 md:px-12 bg-background">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
          {/* Main Column */}
          <div className="lg:w-2/3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 mb-8 overflow-x-auto flex-nowrap hide-scrollbar">
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:bg-primary px-6 py-4 text-sm font-semibold uppercase tracking-wider whitespace-nowrap"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:bg-primary px-6 py-4 text-sm font-semibold uppercase tracking-wider whitespace-nowrap"
                >
                  Experience
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:bg-primary px-6 py-4 text-sm font-semibold uppercase tracking-wider whitespace-nowrap"
                >
                  Education
                </TabsTrigger>
                <TabsTrigger
                  value="awards"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:bg-primary px-6 py-4 text-sm font-semibold uppercase tracking-wider whitespace-nowrap"
                >
                  Awards
                </TabsTrigger>
                <TabsTrigger
                  value="publications"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:bg-primary px-6 py-4 text-sm font-semibold uppercase tracking-wider whitespace-nowrap"
                >
                  Publications
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="overview"
                className="focus-visible:outline-none"
              >
                <OverviewTab member={member} />
              </TabsContent>

              <TabsContent
                value="experience"
                className="focus-visible:outline-none"
              >
                <ExperienceTab member={member} />
              </TabsContent>

              <TabsContent
                value="education"
                className="focus-visible:outline-none"
              >
                <EducationTab member={member} />
              </TabsContent>

              <TabsContent
                value="awards"
                className="focus-visible:outline-none"
              >
                <AwardsTab member={member} />
              </TabsContent>

              <TabsContent
                value="publications"
                className="focus-visible:outline-none"
              >
                <PublicationsTab member={member} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 lg:sticky lg:top-32 lg:self-start space-y-8">
            <Card className="bg-card border-none shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 rounded-2xl overflow-hidden py-0">
              <CardHeader className="bg-background-dark p-6 pt-8 pb-8 text-center border-b border-white/10">
                <Scale className="w-12 h-12 text-accent mx-auto mb-4 opacity-80" />
                <CardTitle className="text-2xl font-serif text-white mb-2">
                  Engage Chambers
                </CardTitle>
                <p className="text-slate-400 text-sm">
                  For consultation & legal representation
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <Link
                  href="/#contact"
                  className="flex items-center justify-center w-full px-8 py-4 bg-accent hover:bg-accent/90 text-slate-900 font-bold uppercase tracking-wider rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-accent/20"
                >
                  Schedule Consultation
                </Link>

                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                        Direct Line
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        +91 9408282982
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                        Email Protocol
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        jeetbhatt@gmail.com
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
