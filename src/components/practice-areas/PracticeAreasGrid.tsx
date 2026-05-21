"use client";

import { PracticeAreaCard } from "./PracticeAreaCard";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { Briefcase, Gavel, Building2, Landmark, Scale, Shield, FileText, Users, Lightbulb, Home, TrendingDown, Map, MessageSquare, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Briefcase, Gavel, Building2, Landmark, Scale, Shield, FileText, Users, Lightbulb, Home, TrendingDown, Map, MessageSquare
};

export interface PracticeAreasGridProps {
  className?: string;
  title?: string | null;
  subtitle?: string | null;
  areas?: {
    title: string;
    description?: string | null;
    icon?: string | null;
    services?: {
      name: string;
    }[] | null;
  }[] | null;
}

const defaultAreas = [
  { id: "corporate", title: "Corporate Law", description: "Comprehensive legal solutions for businesses.", icon: "Briefcase", services: ["Mergers & Acquisitions", "Compliance", "Contract Drafting"] },
  { id: "criminal", title: "Criminal Defense", description: "Aggressive defense strategies.", icon: "Gavel", services: ["Trial Defense", "Appeals", "Bail Applications"] },
  { id: "realestate", title: "Real Estate", description: "Property transactions and disputes.", icon: "Building2", services: ["Property Disputes", "Title Verification", "RE Contracts"] },
  { id: "constitutional", title: "Constitutional Law", description: "Protecting fundamental rights.", icon: "Landmark", services: ["Rights Litigation", "Writ Petitions", "Public Interest"] },
  { id: "civil", title: "Civil Litigation", description: "Strategic representation in civil disputes.", icon: "Scale", services: ["Civil Suits", "Injunctions", "Arbitration"] },
  { id: "consultation", title: "Legal Consultation", description: "Expert advisory services.", icon: "FileText", services: ["Legal Opinion", "Risk Assessment", "Advisory"] },
];

export function PracticeAreasGrid({ className, title, subtitle, areas: payloadAreas }: PracticeAreasGridProps) {
  // Map payload areas to the format expected by PracticeAreaCard
  const activeAreas = payloadAreas && payloadAreas.length > 0
    ? payloadAreas.map((area, index) => ({
        id: `payload-area-${index}`,
        title: area.title,
        description: area.description || "",
        icon: area.icon && iconMap[area.icon] ? area.icon : "Briefcase",
        services: area.services ? area.services.map(s => s.name) : []
      }))
    : defaultAreas;

  return (
    <section className={`py-16 md:py-24 px-6 bg-gray-light w-full ${className || ""}`}>
      <div className="max-w-[1280px] mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-12 md:mb-16">
            {title && (
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-slate-primary mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-slate-secondary max-w-2xl mx-auto font-sans leading-relaxed">
                {subtitle}
              </p>
            )}
            <div className="w-20 h-0.5 bg-teal-primary/50 mx-auto mt-8" />
          </div>
        )}

        {/* Grid with staggered scroll animations */}
        <StaggerContainer
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activeAreas.map((area, index) => (
            <StaggerItem key={area.id}>
              <PracticeAreaCard
                index={index}
                title={area.title}
                description={area.description}
                icon={area.icon}
                services={area.services}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
