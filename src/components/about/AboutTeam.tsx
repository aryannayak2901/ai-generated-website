"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Linkedin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import type { Team } from "@/payload-types";

interface TeamMember {
  name: string;
  designation: string;
  experience: string;
  image: string;
  profileUrl: string;
  linkedIn?: string;
}

const defaultTeamMembers = [
  {
    name: "Jeet Jayant Bhatt",
    designation: "Advocate, High Court of Gujarat & Senior Partner",
    experience: "15+ years experience",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=500",
    profileUrl: "/team/jeet-bhatt",
    linkedIn: "https://linkedin.com",
  },
  {
    name: "Jayant P. Bhatt",
    designation: "Senior Advocate, High Court of Gujarat",
    experience: "40+ years experience",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=500",
    profileUrl: "/team/jayant-bhatt",
  },
  {
    name: "Chetan P. Pandya",
    designation: "Advocate, Gujarat High Court",
    experience: "26+ years experience",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=500",
    profileUrl: "/team/chetan-pandya",
  },
];

export interface AboutTeamProps {
  className?: string;
  tag?: string | null;
  title?: string | null;
  subtitle?: string | null;
  teamMembers?: (string | Team)[] | null;
}

export function AboutTeam({
  className,
  tag,
  title,
  subtitle,
  teamMembers: payloadMembers,
}: AboutTeamProps) {
  const activeMembers = payloadMembers && payloadMembers.length > 0
    ? payloadMembers.reduce<TeamMember[]>((acc, m) => {
        if (typeof m === 'string') return acc;
        acc.push({
          name: m.name,
          designation: m.designation || "",
          experience: `${m.stats?.experience || "10+"} years experience`,
          image: (m.image as any)?.url || "",
          profileUrl: `/team/${m.slug}`,
        });
        return acc;
      }, [])
    : defaultTeamMembers;

  return (
    <section className={`relative py-16 md:py-24 px-6 bg-white ${className || ""}`}>
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-teal-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
            {tag || "Our Team"}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-slate-primary mb-4">
            {title || "Meet Our Legal Experts"}
          </h2>
          <div className="w-24 h-0.5 bg-teal-primary/50 mx-auto mb-6" />
          <p className="text-lg text-slate-secondary max-w-2xl mx-auto leading-relaxed font-sans">
            {subtitle || "Our team brings together decades of combined experience across various legal domains."}
          </p>
        </div>

        {/* Team Grid */}
        <StaggerContainer
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activeMembers.map((member, index) => (
            <StaggerItem key={index}>
              <Card className="bg-white border-slate-200 h-full hover:border-teal-primary/30 hover:shadow-lg transition-all duration-300 group overflow-hidden">
                <CardContent className="p-0">
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link
                        href={member.profileUrl}
                        className="bg-teal-primary text-white px-6 py-2 rounded-sm font-semibold uppercase tracking-wider text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold text-slate-primary mb-1 group-hover:text-teal-primary transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-slate-secondary text-sm mb-2">
                      {member.designation}
                    </p>
                    <span className="inline-block text-xs font-semibold text-teal-primary bg-teal-primary/10 px-3 py-1 rounded-full">
                      {member.experience}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
