"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const teamMembers = [
  {
    name: "Jeet Jayant Bhatt",
    designation: "Advocate, High Court of Gujarat & Senior Partner",
    experience: "15+ years experience",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=500",
    profileUrl: "/team/jeet-bhatt",
  },
  {
    name: "Jayant P. Bhatt",
    designation: "Senior Advocate, High Court of Gujarat",
    experience: "40+ years experience",
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=500",
    profileUrl: "/team/jayant-bhatt",
  },
  {
    name: "Chetan P. Pandya",
    designation: "Advocate, Gujarat High Court",
    experience: "26+ years experience",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=500",
    profileUrl: "/team/chetan-pandya",
  },
  {
    name: "Tarun S. Rajput",
    designation: "Advocate, Gujarat High Court",
    experience: "2+ years experience",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=500",
    profileUrl: "/team/tarun-rajput",
  },
  {
    name: "Aman Kadri",
    designation: "Advocate, Gujarat High Court | LLM Penn State",
    experience: "1+ years experience",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=500",
    profileUrl: "/team/aman-kadri",
  },
  {
    name: "Haresh Shah",
    designation: "Senior Associate",
    experience: "Since 2018",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500",
    profileUrl: "/team/haresh-shah",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
} as const;

import type { Team } from "@/payload-types";

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
  const activeMembers =
    payloadMembers && payloadMembers.length > 0
      ? payloadMembers.map((m) => {
          // Handle relationship data which could be an object if populated
          const member = typeof m === 'object' ? m : null;
          if (!member) return null;

          return {
            name: member.name,
            designation: member.designation,
            experience: member.subtitle || "",
            image:
              (typeof member.image === 'object' && member.image?.url) ? member.image.url : 
              (typeof member.image === 'string' ? member.image : "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=500"),
            profileUrl: `/team/${member.slug}`,
          };
        }).filter((m): m is NonNullable<typeof m> => !!m)
      : teamMembers;

  return (
    <section
      className={cn("py-24 px-6 bg-background overflow-hidden", className)}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-gold">
              <Users className="w-6 h-6" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase">
                {tag || "Legal Experts"}
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">
              {title || "Meet Our Team"}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md font-sans">
            {subtitle ||
              "Our firm is comprised of highly specialized advocates with a deep understanding of complex legal frameworks."}
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {activeMembers.map((member, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Link href={member.profileUrl} className="block group">
                <Card className="flex flex-col h-full rounded-2xl bg-white dark:bg-navy border-border/50 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gold/10 hover:-translate-y-2 border-b-4 hover:border-b-gold">
                  <div className="aspect-[4/5] relative bg-muted overflow-hidden">
                    <Image
                      src={member.image}
                      alt={`Portrait of ${member.name}`}
                      fill
                      className="object-cover object-center grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-colors duration-700" />

                    {/* Floating LinkedIn Icon on Hover */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                        <Linkedin className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-8 flex flex-col grow relative">
                    <h3 className="text-2xl font-bold mb-2 font-serif group-hover:text-gold transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-gold text-xs font-bold uppercase tracking-widest mb-4">
                      {member.designation}
                    </p>
                    <p className="text-muted-foreground text-sm grow font-sans leading-relaxed">
                      {member.experience}
                    </p>
                    <div className="flex items-center gap-2 text-foreground font-bold text-sm mt-8 group-hover:text-gold transition-colors">
                      <span>View Full Profile</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
