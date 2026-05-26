"use client";

import { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollReveal } from "@/components/animations";

interface PracticeAreaCardProps {
  title: string;
  description: string;
  icon: string | LucideIcon;
  services: string[];
  index: number;
  className?: string;
}

export function PracticeAreaCard({
  title,
  description,
  icon: Icon,
  services,
  index,
  className,
}: PracticeAreaCardProps) {
  return (
    <ScrollReveal
      delay={index * 0.1}
      direction="up"
      className="h-full"
    >
      <Card
        className={`group h-full flex flex-col bg-card border-border transition-all duration-300 hover:border-accent hover:shadow-lg hover:scale-[1.02] overflow-hidden relative ${className || ""}`}
      >
        {/* Decorative background icon */}
        <div className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-700 group-hover:scale-110 pointer-events-none">
          {typeof Icon === 'string' ? null : <Icon className="w-56 h-56 text-accent" />}
        </div>

        <CardHeader className="relative z-10 space-y-4 pt-6 px-6">
          <div className="p-3 w-fit bg-accent/10 rounded-lg text-accent group-hover:bg-accent/20 transition-colors duration-300">
            {typeof Icon === 'string' ? null : <Icon className="w-6 h-6" strokeWidth={1.5} />}
          </div>
          <CardTitle className="font-serif text-xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10 flex flex-col h-full space-y-6 px-6 pb-8">
          <CardDescription className="text-muted-foreground text-base leading-relaxed font-sans">
            {description}
          </CardDescription>

          {services && services.length > 0 && (
            <div className="pt-6 border-t border-border/50 mt-auto">
              <h4 className="font-sans font-semibold text-accent text-[10px] tracking-[0.25em] uppercase mb-4 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-accent/30" />
                Specialized Services
              </h4>
              <ul className="grid grid-cols-1 gap-y-2.5">
                {services.map((service, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 group/item">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/40 group-hover/item:bg-accent group-hover/item:scale-125 transition-all duration-300 shrink-0" />
                    <span className="text-foreground text-sm leading-tight font-sans group-hover/item:text-foreground/80 transition-colors duration-300">
                      {service}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </ScrollReveal>
  );
}
