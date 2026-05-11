"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TeamMember } from "@/data/team";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Hero Section - Charcoal background with teal accents */}
      <section className="bg-charcoal-primary text-white relative py-16 md:py-24 px-6 md:px-8 lg:px-12">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-primary via-charcoal-primary to-slate-dark" />
        
        {/* Teal accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-primary" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-[1280px] mx-auto relative z-10"
        >
          {/* Back Navigation */}
          <Link
            href="/team"
            className="inline-flex items-center text-slate-secondary hover:text-teal-primary transition-colors text-sm font-medium mb-8"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Team
          </Link>

          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-start">
            {/* Portrait Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative shrink-0 w-64 h-80 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl bg-slate-dark flex items-center justify-center"
            >
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                  sizes="256px"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-teal-primary/20 flex items-center justify-center">
                  <span className="text-4xl font-bold text-teal-primary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Basic Info */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col text-center md:text-left pt-4"
            >
              <Badge
                variant="outline"
                className="w-fit mx-auto md:mx-0 border-teal-primary/50 text-teal-primary mb-4 px-4 py-1 text-xs uppercase tracking-wider bg-teal-primary/10"
              >
                {member.designation}
              </Badge>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-3">
                {member.name}
              </h1>

              <h2 className="text-lg md:text-xl text-slate-secondary font-serif mb-6">
                {member.subtitle}
              </h2>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-3xl">
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg backdrop-blur-sm hover:border-teal-primary/30 transition-colors">
                  <div className="text-2xl font-bold text-teal-primary mb-1">
                    {member.stats.experience}
                  </div>
                  <div className="text-xs text-slate-secondary uppercase tracking-wider">
                    Years Exp.
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg backdrop-blur-sm hover:border-teal-primary/30 transition-colors">
                  <div className="text-2xl font-bold text-teal-primary mb-1">
                    {member.stats.cases}
                  </div>
                  <div className="text-xs text-slate-secondary uppercase tracking-wider">
                    Cases
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg backdrop-blur-sm hover:border-teal-primary/30 transition-colors">
                  <div className="text-2xl font-bold text-teal-primary mb-1">
                    {member.stats.publications}
                  </div>
                  <div className="text-xs text-slate-secondary uppercase tracking-wider">
                    Publications
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg backdrop-blur-sm hover:border-teal-primary/30 transition-colors">
                  <div className="text-2xl font-bold text-teal-primary mb-1">
                    {member.stats.clients}
                  </div>
                  <div className="text-xs text-slate-secondary uppercase tracking-wider">
                    Clients
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Main Content Area */}
      <section className="flex-1 py-16 px-6 md:px-8 lg:px-12 bg-white">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main Column */}
          <div className="lg:w-2/3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-transparent border-b border-slate-200 w-full justify-start rounded-none h-auto p-0 mb-8 overflow-x-auto flex-nowrap hide-scrollbar">
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-primary data-[state=active]:text-teal-primary data-[state=active]:bg-teal-primary/5 px-6 py-4 text-sm font-semibold uppercase tracking-wider whitespace-nowrap"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-primary data-[state=active]:text-teal-primary data-[state=active]:bg-teal-primary/5 px-6 py-4 text-sm font-semibold uppercase tracking-wider whitespace-nowrap"
                >
                  Experience
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-primary data-[state=active]:text-teal-primary data-[state=active]:bg-teal-primary/5 px-6 py-4 text-sm font-semibold uppercase tracking-wider whitespace-nowrap"
                >
                  Education
                </TabsTrigger>
                <TabsTrigger
                  value="awards"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-primary data-[state=active]:text-teal-primary data-[state=active]:bg-teal-primary/5 px-6 py-4 text-sm font-semibold uppercase tracking-wider whitespace-nowrap"
                >
                  Awards
                </TabsTrigger>
                <TabsTrigger
                  value="publications"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-primary data-[state=active]:text-teal-primary data-[state=active]:bg-teal-primary/5 px-6 py-4 text-sm font-semibold uppercase tracking-wider whitespace-nowrap"
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
          <div className="lg:w-1/3 lg:sticky lg:top-32 lg:self-start space-y-6">
            <Card className="bg-white border-slate-200 shadow-lg rounded-xl overflow-hidden py-0">
              <CardHeader className="bg-charcoal-primary p-6 pt-8 pb-6 text-center border-b border-white/10">
                <div className="w-12 h-12 bg-teal-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-teal-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.9 5.03M6 7l-3-1m3 1l3 1M3 6l3-1m0 0l3 1"
                    />
                  </svg>
                </div>
                <CardTitle className="text-2xl font-serif text-white mb-2">
                  Engage Chambers
                </CardTitle>
                <p className="text-slate-secondary text-sm">
                  For consultation & legal representation
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <Button
                  asChild
                  className="w-full bg-teal-primary hover:bg-teal-light text-white font-semibold tracking-wider uppercase rounded-sm h-12 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Link href="/contact">
                    Get In Touch
                  </Link>
                </Button>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-light">
                    <div className="w-10 h-10 rounded-full bg-teal-primary/10 flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5 text-teal-primary"
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
                      <div className="text-xs text-slate-secondary uppercase tracking-wider font-semibold mb-1">
                        Direct Line
                      </div>
                      <div className="text-sm font-medium text-slate-primary">
                        +91 94082 82982
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-light">
                    <div className="w-10 h-10 rounded-full bg-teal-primary/10 flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5 text-teal-primary"
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
                      <div className="text-xs text-slate-secondary uppercase tracking-wider font-semibold mb-1">
                        Email
                      </div>
                      <div className="text-sm font-medium text-slate-primary">
                        info@jeetbhatt.com
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
