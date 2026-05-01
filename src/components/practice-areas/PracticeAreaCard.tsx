"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface PracticeAreaCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="h-full"
    >
      <Card
        className={cn(
          "group h-full flex flex-col bg-white/50 dark:bg-navy/40 backdrop-blur-md border-border/50 dark:border-white/5 transition-all duration-500 hover:border-gold/50 dark:hover:border-gold/50 hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] hover:-translate-y-2 overflow-hidden relative",
          className,
        )}
      >
        {/* Decorative background icon */}
        <div className="absolute -right-10 -bottom-10 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.08] dark:group-hover:opacity-[0.1] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
          <Icon className="w-56 h-56 text-gold" />
        </div>

        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <CardHeader className="relative z-10 space-y-5 pt-8 px-8">
          <div className="p-3.5 w-fit bg-gold/10 dark:bg-gold/10 rounded-xl text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-sm">
            <Icon className="w-7 h-7" strokeWidth={1.5} />
          </div>
          <CardTitle className="font-serif text-2xl font-bold text-navy dark:text-white tracking-tight group-hover:text-gold transition-colors duration-300">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10 flex flex-col h-full space-y-8 px-8 pb-10">
          <CardDescription className="text-slate-600 dark:text-slate-400 text-base leading-relaxed font-sans">
            {description}
          </CardDescription>

          <div className="pt-6 border-t border-navy/5 dark:border-white/5 mt-auto">
            <h4 className="font-sans font-bold text-gold/90 text-[10px] tracking-[0.25em] uppercase mb-5 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-gold/30" />
              Specialized Services
            </h4>
            <ul className="grid grid-cols-1 gap-y-3.5">
              {services.map((service, idx) => (
                <li key={idx} className="flex items-start gap-3 group/item">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold/40 group-hover/item:bg-gold group-hover/item:scale-125 transition-all duration-300 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm leading-tight font-sans group-hover/item:text-navy dark:group-hover/item:text-white transition-colors duration-300">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
