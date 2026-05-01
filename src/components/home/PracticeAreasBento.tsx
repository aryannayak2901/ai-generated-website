import React from "react";
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
} from "lucide-react";

export function PracticeAreasBento() {
  return (
    <section className="py-24 px-6 bg-white dark:bg-navy relative overflow-hidden">
      {/* Optional subtle background gradient to enhance the glassmorphism feel of cards */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-slate-surface/50 dark:to-navy/50 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display font-semibold text-4xl md:text-5xl text-navy dark:text-slate-surface mb-4 tracking-tight">
            Practice Areas
          </h2>
          <p className="text-slate-gray dark:text-slate-gray/80 text-lg max-w-2xl mx-auto">
            Specialized legal expertise tailored to your specific needs with a
            commitment to excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)] md:auto-rows-[220px]">
          {/* Tile 1: Corporate Law (2 cols, 2 rows on lg, 2 cols 1 row on md) */}
          <Card className="col-span-1 md:col-span-2 lg:row-span-2 flex flex-col justify-between bg-slate-surface/80 dark:bg-navy/50 backdrop-blur-md border border-slate-200 dark:border-white/10 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] group overflow-hidden relative cursor-pointer">
            <CardHeader className="relative z-10 pb-2">
              <Briefcase
                className="w-10 h-10 text-navy dark:text-gold mb-4 group-hover:scale-110 transition-transform duration-300"
                strokeWidth={1.5}
              />
              <CardTitle className="text-2xl font-bold text-navy dark:text-white">
                Corporate Law
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 flex flex-col justify-between h-full pt-2">
              <CardDescription className="text-slate-gray dark:text-slate-gray/80 text-base leading-relaxed max-w-md">
                Comprehensive legal solutions for businesses, from startups to
                established enterprises. We handle mergers, acquisitions, and
                compliance with strategic precision.
              </CardDescription>
              <div className="mt-8 flex items-center text-gold font-semibold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                Learn More <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </CardContent>
            {/* Decorative abstract graphic bg */}
            <div className="absolute -right-12 -bottom-12 opacity-[0.02] dark:opacity-[0.05] group-hover:opacity-[0.04] dark:group-hover:opacity-[0.08] transition-opacity duration-300 pointer-events-none">
              <Briefcase className="w-64 h-64" />
            </div>
          </Card>

          {/* Tile 2: Criminal Defense */}
          <Card className="col-span-1 bg-slate-surface/80 dark:bg-navy/50 backdrop-blur-md border border-slate-200 dark:border-white/10 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] group flex flex-col items-center justify-center text-center p-6 cursor-pointer">
            <Gavel
              className="w-10 h-10 text-navy dark:text-gold mb-4 group-hover:scale-110 transition-transform duration-300"
              strokeWidth={1.5}
            />
            <CardTitle className="text-xl font-bold text-navy dark:text-white">
              Criminal Defense
            </CardTitle>
          </Card>

          {/* Tile 3: Real Estate */}
          <Card className="col-span-1 bg-slate-surface/80 dark:bg-navy/50 backdrop-blur-md border border-slate-200 dark:border-white/10 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] group flex flex-col items-center justify-center text-center p-6 cursor-pointer">
            <Building2
              className="w-10 h-10 text-navy dark:text-gold mb-4 group-hover:scale-110 transition-transform duration-300"
              strokeWidth={1.5}
            />
            <CardTitle className="text-xl font-bold text-navy dark:text-white">
              Real Estate
            </CardTitle>
          </Card>

          {/* Tile 4: Constitutional Law (2 cols wide on md/lg) */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-2 bg-slate-surface/80 dark:bg-navy/50 backdrop-blur-md border border-slate-200 dark:border-white/10 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] group flex flex-row items-center cursor-pointer overflow-hidden relative">
            <div className="p-8 flex items-center w-full gap-8 z-10 relative">
              <div className="shrink-0">
                <Landmark
                  className="w-12 h-12 text-navy dark:text-gold group-hover:scale-110 transition-transform duration-300"
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-navy dark:text-white mb-2">
                  Constitutional Law
                </CardTitle>
                <CardDescription className="text-slate-gray dark:text-slate-gray/80 text-sm md:text-base leading-relaxed line-clamp-2">
                  Protecting fundamental rights and navigating complex
                  regulatory landscapes across federal jurisdictions.
                </CardDescription>
              </div>
            </div>
            {/* Decorative background element */}
            <div className="absolute -right-8 -top-8 opacity-[0.02] dark:opacity-[0.05] group-hover:opacity-[0.04] dark:group-hover:opacity-[0.08] transition-opacity duration-300 pointer-events-none">
              <Landmark className="w-48 h-48" />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
