"use client";

import { motion } from "framer-motion";
import { ArrowRight, Verified, Gavel, Award } from "lucide-react";
import Image from "next/image";

type AwardItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  yearBadge: string;
  icon: React.ElementType;
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
    icon: Verified,
  },
  {
    id: "qmul",
    title: "Alumni Network",
    subtitle: "Queen Mary University",
    description: "Proud alumni of the prestigious London institution",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    yearBadge: "Class of 2015",
    icon: Award,
  },
  {
    id: "scba",
    title: "Active Member",
    subtitle: "Supreme Court Bar Association",
    description: "Recognized standing at the highest judicial forum",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800",
    yearBadge: "Since 2018",
    icon: Gavel,
  },
  {
    id: "legal-500",
    title: "Recommended",
    subtitle: "The Legal 500",
    description: "Top tier rating for corporate advisory and litigation",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
    yearBadge: "2023-2024",
    icon: Award,
  },
];

const AwardCard = ({ award }: { award: AwardItem }) => {
  const Icon = award.icon;
  return (
    <div className="w-[320px] bg-white dark:bg-navy rounded-xl border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 shrink-0 mx-4">
      {/* Top Half (Image) */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-surface dark:bg-navy/80">
        <Image
          src={award.image}
          alt={award.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="320px"
        />
        {/* Floating Badge */}
        <div className="absolute bottom-3 right-3 bg-gold px-3 py-1 rounded shadow-md z-10">
          <span className="text-white text-[10px] uppercase tracking-widest font-bold">
            {award.yearBadge}
          </span>
        </div>
      </div>

      {/* Bottom Half (Content) */}
      <div className="p-6">
        <h3 className="font-serif text-2xl text-navy dark:text-white mb-2 leading-tight">
          {award.title}
        </h3>
        <p className="font-sans font-medium text-charcoal dark:text-slate-surface text-sm mb-1">
          {award.subtitle}
        </p>
        <p className="font-sans text-slate-gray dark:text-slate-gray/80 text-xs leading-relaxed min-h-[40px]">
          {award.description}
        </p>

        <div className="mt-6 pt-4 border-t border-slate-50 dark:border-white/5 flex justify-between items-center group-hover/btn:border-gold transition-colors">
          <span className="text-navy dark:text-gold text-xs font-bold flex items-center gap-1 cursor-pointer group-hover:text-gold transition-all">
            VIEW DETAILS{" "}
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
          <Icon className="w-5 h-5 text-slate-gray/30 dark:text-slate-gray/50 group-hover:text-gold transition-colors" />
        </div>
      </div>
    </div>
  );
};

export const AwardsMarquee = () => {
  return (
    <section className="py-24 border-y border-slate-100 dark:border-white/5 bg-slate-surface dark:bg-navy overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-slate-gray dark:text-slate-gray/80 text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Recognitions & Accolades
          </h3>
          <div className="w-12 h-0.5 bg-gold/30 mx-auto"></div>
        </div>

        <div className="relative flex overflow-hidden -mx-4 pause-on-hover">
          {/* Fading gradients at edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-slate-surface dark:from-navy to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-slate-surface dark:from-navy to-transparent z-10 pointer-events-none"></div>

          {/* Marquee Track using CSS Animation for pause-on-hover support */}
          <div className="flex py-4 items-center animate-marquee">
            {/* Render 2 sets for seamless loop */}
            {[...awards, ...awards].map((award, index) => (
              <AwardCard key={`${award.id}-${index}`} award={award} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
