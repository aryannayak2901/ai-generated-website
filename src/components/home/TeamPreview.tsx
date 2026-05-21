"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations";
import { Users, ArrowRight } from "lucide-react";

const teamMembers = [
  {
    id: "jeet-bhatt",
    name: "Jeet Bhatt",
    title: "Founding Partner",
    specialty: "Corporate & Constitutional Law",
    initials: "JB",
  },
  {
    id: "partner-2",
    name: "Senior Associate",
    title: "Partner",
    specialty: "Criminal Defense",
    initials: "SA",
  },
  {
    id: "partner-3",
    name: "Associate",
    title: "Partner",
    specialty: "Real Estate Law",
    initials: "AP",
  },
  {
    id: "partner-4",
    name: "Junior Associate",
    title: "Partner",
    specialty: "Civil Litigation",
    initials: "JA",
  },
];

export function TeamPreview() {
  return (
    <section className="py-16 md:py-24 px-6 bg-white">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <ScrollReveal>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Our Legal Team
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Experienced professionals dedicated to delivering exceptional legal services
            </p>
          </ScrollReveal>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {teamMembers.map((member, index) => (
            <ScrollReveal
              key={member.id}
              delay={index * 0.1}
              direction="up"
            >
              <div className="group bg-secondary rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                {/* Profile Image Placeholder */}
                <div className="relative h-64 bg-gradient-to-br from-primary to-primary flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors duration-300">
                    <span className="text-3xl font-bold text-accent">
                      {member.initials}
                    </span>
                  </div>
                  {/* Hover overlay with bio snippet */}
                  <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                    <div className="text-center">
                      <p className="text-white text-sm mb-4">
                        Specializing in {member.specialty.toLowerCase()} with years of experience.
                      </p>
                      <Link
                        href={`/team/${member.id}`}
                        className="inline-flex items-center text-accent text-sm font-semibold uppercase tracking-wider hover:text-accent/85 transition-colors"
                      >
                        View Profile <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    {member.title}
                  </p>
                  <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                    {member.specialty}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA to Team Page */}
        <div className="text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-accent text-accent hover:bg-accent hover:text-white font-semibold tracking-wider uppercase rounded-sm h-12 px-8 transition-all duration-300"
          >
            <Link href="/team">
              View Full Team <Users className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
