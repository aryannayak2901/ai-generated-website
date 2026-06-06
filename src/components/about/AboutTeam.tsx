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
    profileUrl: "/team/jayant-p-bhatt",
  },
  {
    name: "Chetan P. Pandya",
    designation: "Advocate, Gujarat High Court",
    experience: "26+ years experience",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=500",
    profileUrl: "/team/chetan-p-pandya",
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
        
        let imageUrl = "";
        if (m.image) {
          if (typeof m.image === 'string') {
            imageUrl = m.image;
          } else if (typeof m.image === 'object') {
            if ('url' in m.image && typeof m.image.url === 'string') {
              imageUrl = m.image.url;
            }
          }
        }
        
        // Ensure imageUrl is a valid URL string starting with http, https, or /
        const isUrlValid = imageUrl && (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("/"));
        
        acc.push({
          name: m.name,
          designation: m.designation || "",
          experience: `${m.stats?.experience || "10+"} years experience`,
          image: isUrlValid ? imageUrl : "",
          profileUrl: `/team/${m.slug}`,
        });
        return acc;
      }, [])
    : defaultTeamMembers;

  return (
    <section className={`relative py-16 md:py-24 px-6 bg-background ${className || ""}`}>
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
            {tag || "Our Team"}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {title || "Meet Our Legal Experts"}
          </h2>
          <div className="w-24 h-0.5 bg-accent/50 mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-sans">
            {subtitle || "Our team brings together decades of combined experience across various legal domains."}
          </p>
        </div>

        {/* Team Grid */}
        <StaggerContainer
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activeMembers.map((member, index) => (
            <StaggerItem key={index} className="row-span-4 grid grid-rows-subgrid">
              <Card className="bg-card border-border row-span-4 grid grid-rows-subgrid hover:border-accent/30 hover:shadow-lg transition-all duration-300 group overflow-hidden">
                <CardContent className="p-0 row-span-4 grid grid-rows-subgrid">
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden row-span-1">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-primary/85 flex flex-col items-center justify-center border-b border-accent/20 group-hover:scale-105 transition-transform duration-500">
                        <div className="w-20 h-20 rounded-full border border-accent/30 bg-accent/5 flex items-center justify-center mb-2 shadow-inner">
                          <span className="font-serif text-3xl font-bold text-accent tracking-wider">
                            {member.name
                              .split(" ")
                              .filter(Boolean)
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 3)}
                          </span>
                        </div>
                        <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-muted-foreground/60 group-hover:text-accent transition-colors duration-300">
                          Chambers of Jeet Bhatt
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link
                        href={member.profileUrl}
                        className="bg-accent text-accent-foreground px-6 py-2 rounded-sm font-semibold uppercase tracking-wider text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 row-span-3 grid grid-rows-subgrid gap-y-2">
                    <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-accent transition-colors row-span-1">
                      {member.name}
                    </h3>
                    <p className="text-muted-foreground text-sm row-span-1">
                      {member.designation}
                    </p>
                    <div className="row-span-1 flex items-end">
                      <span className="inline-block text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                        {member.experience}
                      </span>
                    </div>
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
