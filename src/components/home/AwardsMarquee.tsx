"use client";

import { ArrowRight } from "lucide-react";
import React from "react";
import Image from "next/image";
import { ScrollReveal } from "@/components/animations";

type AwardItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  yearBadge: string;
};

const awards: AwardItem[] = [
  {
    id: "tata-exim",
    title: "Panel Advocate",
    subtitle: "Tata Services Ltd, EXIM Bank",
    description:
      "Empaneled with premier institutions for legal advisory and representation",
    image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
    yearBadge: "2020-Present",
  },
  {
    id: "qmul",
    title: "Alumni Network",
    subtitle: "Queen Mary University",
    description: "Proud alumni of the prestigious London institution",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    yearBadge: "Class of 2015",
  },
  {
    id: "scba",
    title: "Active Member",
    subtitle: "Supreme Court Bar Association",
    description: "Recognized standing at the highest judicial forum",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800",
    yearBadge: "Since 2018",
  },
  {
    id: "legal-500",
    title: "Recommended",
    subtitle: "The Legal 500",
    description: "Top tier rating for corporate advisory and litigation",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
    yearBadge: "2023-2024",
  },
];

export interface AwardsMarqueeProps {
  awards?: {
    title: string;
    year?: string | null;
    organization?: string | null;
    description?: string | null;
    image?: any;
  }[] | null;
}

const AwardCard = ({ award }: { award: AwardItem }) => {
  return (
    <ScrollReveal
      className="w-[340px] h-full flex flex-col bg-card border border-border shadow-sm overflow-hidden group hover:shadow-lg hover:border-accent transition-all duration-300 shrink-0 mx-3"
      direction="up"
    >
      {/* Top Half (Image) */}
      <div className="relative h-52 w-full overflow-hidden bg-secondary shrink-0">
        <Image
          src={award.image}
          alt={award.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="340px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
        {/* Teal/Gold Floating Badge */}
        {award.yearBadge && (
          <div className="absolute bottom-4 right-4 bg-accent/90 backdrop-blur-sm px-3 py-1.5 rounded shadow-lg z-10 border border-accent/20">
            <span className="text-accent-foreground text-[10px] uppercase tracking-widest font-bold">
              {award.yearBadge}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Half (Content) */}
      <div className="p-6 flex flex-col flex-1 bg-card relative z-20">
        <h3 
          className="font-serif text-lg md:text-xl text-foreground mb-1.5 leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-300" 
          title={award.title}
        >
          {award.title}
        </h3>
        
        {award.subtitle && (
          <p 
            className="font-sans font-semibold text-accent/80 text-xs md:text-sm mb-3 line-clamp-2"
            title={award.subtitle}
          >
            {award.subtitle}
          </p>
        )}
        
        <p 
          className="font-sans text-muted-foreground text-xs md:text-sm leading-relaxed line-clamp-3"
          title={award.description}
        >
          {award.description}
        </p>

        <div className="mt-auto pt-5 border-t border-border/50 flex justify-between items-center group-hover:border-accent/30 transition-colors">
          <span className="text-accent text-[11px] tracking-wider font-bold flex items-center gap-1.5 cursor-pointer group-hover:translate-x-1 transition-transform duration-300">
            VIEW DETAILS <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </ScrollReveal>
  );
};

export const AwardsMarquee = ({ awards: payloadAwards }: AwardsMarqueeProps) => {
  // If payload awards exist, map them to the AwardItem shape, otherwise use default awards
  const activeAwards = payloadAwards && payloadAwards.length > 0 
    ? payloadAwards.map((a, i) => ({
        id: `payload-${i}`,
        title: a.title,
        subtitle: a.organization || "",
        description: a.description || "",
        image: (a.image && typeof a.image === 'object' && 'url' in a.image && typeof a.image.url === 'string' && (a.image.url.startsWith("/") || a.image.url.startsWith("http"))) 
          ? a.image.url 
          : (typeof a.image === 'string' && (a.image.startsWith("/") || a.image.startsWith("http")) ? a.image : awards[i % awards.length].image),
        yearBadge: a.year || "",
      }))
    : awards;

  return (
    <section className="py-16 md:py-24 border-t border-border bg-secondary overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12 mb-12">
        <div className="text-center">
          <h3 className="text-muted-foreground text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Recognitions & Accolades
          </h3>
          <div className="w-12 h-0.5 bg-accent/30 mx-auto"></div>
        </div>
      </div>

      <div className="relative flex overflow-hidden -mx-3 pause-on-hover">
        {/* Fading gradients at edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-secondary to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-secondary to-transparent z-10 pointer-events-none"></div>

        {/* Marquee Track using CSS Animation for pause-on-hover support */}
        <div className="flex py-4 items-stretch animate-marquee">
          {/* Render 2 sets for seamless loop */}
          {[...activeAwards, ...activeAwards].map((award, index) => (
            <AwardCard key={`${award.id}-${index}`} award={award} />
          ))}
        </div>
      </div>
    </section>
  );
};
