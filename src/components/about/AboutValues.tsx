"use client";

import { motion, useInView } from "framer-motion";
import { ShieldCheck, Award, Handshake, Scale, Gavel, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StaggerContainer, StaggerItem } from "@/components/animations";

const defaultValues = [
  {
    title: "Integrity",
    description: "Upholding the highest ethical standards in every action and decision we take on behalf of our clients.",
    icon: "ShieldCheck",
  },
  {
    title: "Excellence",
    description: "Delivering exceptional legal representation through continuous learning and strategic thinking.",
    icon: "Award",
  },
  {
    title: "Client Focus",
    description: "Prioritizing our clients' goals and providing personalized attention for the best outcomes.",
    icon: "Handshake",
  },
  {
    title: "Justice",
    description: "Committed to upholding justice and fighting for what is right in every case we handle.",
    icon: "Scale",
  },
];

const iconMap: Record<string, any> = {
  ShieldCheck: ShieldCheck,
  Award: Award,
  Handshake: Handshake,
  Scale: Scale,
  Gavel: Gavel,
  Building2: Building2,
};

export interface AboutValuesProps {
  className?: string;
  tag?: string | null;
  title?: string | null;
  subtitle?: string | null;
  values?:
    | {
        title: string;
        description?: string | null;
        icon?: string | null;
      }[]
    | null;
}

export function AboutValues({ className, tag, title, subtitle, values: payloadValues }: AboutValuesProps) {
  const activeValues = payloadValues && payloadValues.length > 0
    ? payloadValues.map((v) => ({
        title: v.title,
        description: v.description || "",
        icon: v.icon && iconMap[v.icon] ? v.icon : "ShieldCheck",
      }))
    : defaultValues;

  return (
    <section className={`relative py-16 md:py-24 px-6 bg-secondary ${className || ""}`}>
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-accent font-bold tracking-[0.3em] uppercase text-xs mb-4">
            {tag || "Our Values"}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {title || "Core Values"}
          </h2>
          <div className="w-24 h-0.5 bg-accent/50 mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-sans">
            {subtitle || "The principles that guide everything we do at Chambers of Jeet Bhatt."}
          </p>
        </div>

        {/* Values Grid */}
        <StaggerContainer
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {activeValues.map((value, index) => {
            const Icon = iconMap[value.icon] || ShieldCheck;
            return (
              <StaggerItem key={index} className="row-span-3 grid grid-rows-subgrid">
                <Card className="bg-card border-border row-span-3 grid grid-rows-subgrid hover:border-accent/30 hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6 md:p-8 text-center row-span-3 grid grid-rows-subgrid gap-y-4">
                    <div className="w-16 h-16 rounded-lg bg-accent/10 flex items-center justify-center mx-auto group-hover:bg-accent/20 transition-colors row-span-1">
                      <Icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-accent transition-colors row-span-1">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed font-sans row-span-1">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
