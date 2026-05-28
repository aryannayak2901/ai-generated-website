import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Briefcase,
  Gavel,
  Building2,
  Landmark,
  ArrowRight,
  Scale,
  FileText,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/animations";

export interface PracticeAreasBentoProps {
  title?: string | null;
  subtitle?: string | null;
  areas?:
    | {
        title: string;
        description?: string | null;
        icon?: string | null;
        link?: string | null;
      }[]
    | null;
}

const defaultAreas = [
  {
    title: "Corporate Law",
    description:
      "Comprehensive legal solutions for businesses, from startups to established enterprises. We handle mergers, acquisitions, and compliance with strategic precision.",
    icon: "Briefcase" as const,
  },
  {
    title: "Criminal Defense",
    description:
      "Aggressive defense strategies protecting your rights and freedom with unwavering commitment to justice.",
    icon: "Gavel" as const,
  },
  {
    title: "Real Estate",
    description:
      "Navigate complex property transactions, disputes, and regulatory compliance with expert guidance.",
    icon: "Building2" as const,
  },
  {
    title: "Constitutional Law",
    description:
      "Protecting fundamental rights and navigating complex regulatory landscapes across federal jurisdictions.",
    icon: "Landmark" as const,
  },
  {
    title: "Civil Litigation",
    description:
      "Strategic representation in civil disputes, ensuring your interests are protected at every stage.",
    icon: "Scale" as const,
  },
  {
    title: "Legal Consultation",
    description:
      "Expert advisory services to help you make informed decisions and mitigate legal risks.",
    icon: "FileText" as const,
  },
];

const iconMap = {
  Briefcase,
  Gavel,
  Building2,
  Landmark,
  Scale,
  FileText,
};

export function PracticeAreasBento({
  title = "Practice Areas",
  subtitle = "Specialized legal expertise tailored to your specific needs with a commitment to excellence.",
  areas,
}: PracticeAreasBentoProps) {
  const activeAreas = areas && areas.length > 0 ? areas : defaultAreas;

  return (
    <section className="py-16 md:py-24 px-6 bg-secondary">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Practice Areas Grid with Staggered Scroll Animations */}
        <StaggerContainer
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activeAreas.map((area, index) => {
            const IconComponent =
              area.icon && iconMap[area.icon as keyof typeof iconMap]
                ? iconMap[area.icon as keyof typeof iconMap]
                : iconMap.Briefcase;

            return (
              <StaggerItem key={index}>
                <Card
                  className="h-full bg-card border border-border transition-all duration-300 ease-out hover:scale-[1.02] hover:border-accent hover:shadow-lg group cursor-pointer overflow-hidden"
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                      <IconComponent
                        className="w-6 h-6 text-accent group-hover:scale-110 transition-transform duration-300"
                        strokeWidth={1.5}
                      />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">
                      {area.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {area.description && (
                      <CardDescription className="text-muted-foreground text-base leading-relaxed mb-4">
                        {area.description}
                      </CardDescription>
                    )}
                    <Link
                      href="/practice-areas"
                      className="inline-flex items-center text-accent font-semibold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300"
                    >
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
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
