"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ShieldCheck, Award, Handshake } from "lucide-react";

const values = [
  {
    title: "Integrity",
    description:
      "Upholding the highest ethical standards in every action and decision we take on behalf of our clients.",
    icon: ShieldCheck,
    color: "gold",
  },
  {
    title: "Excellence",
    description:
      "Delivering exceptional legal representation through continuous learning, meticulous preparation, and strategic thinking.",
    icon: Award,
    color: "gold",
  },
  {
    title: "Client Focus",
    description:
      "Prioritizing our clients' goals and providing personalized attention to ensure the best possible outcomes.",
    icon: Handshake,
    color: "gold",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
} as const;

import { LucideIcon } from "lucide-react";

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

export function AboutValues({
  className,
  tag,
  title,
  subtitle,
  values: payloadValues,
}: AboutValuesProps) {
  const iconMap: Record<string, LucideIcon> = {
    Shield: ShieldCheck,
    Award: Award,
    Handshake: Handshake,
    Scale: ShieldCheck, // Fallback
    Target: Award, // Fallback
    Users: Handshake, // Fallback
  };

  const activeValues =
    payloadValues && payloadValues.length > 0
      ? payloadValues.map((v) => ({
          title: v.title,
          description: v.description || "",
          icon: v.icon && iconMap[v.icon] ? iconMap[v.icon] : ShieldCheck,
          color: "gold",
        }))
      : values;

  return (
    <section
      className={cn(
        "relative py-24 px-6 bg-secondary dark:bg-navy border-y border-border/50 overflow-hidden",
        className,
      )}
    >
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy/5 dark:bg-white/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Award className="w-12 h-12 text-gold mx-auto mb-6" />
          </motion.div>
          {tag && (
            <span className="text-gold text-xs font-bold tracking-[0.2em] uppercase mb-2 block">
              {tag}
            </span>
          )}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4"
          >
            {title || "Our Core Values"}
          </motion.h2>
          {subtitle && (
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              {subtitle}
            </p>
          )}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-gold mx-auto"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {activeValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative flex flex-col items-center text-center p-8 lg:p-10 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-border/50 hover:border-gold/30 transition-all duration-500 hover:shadow-2xl hover:shadow-gold/5"
              >
                <div className="absolute inset-0 bg-linear-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                <div className="relative w-20 h-20 rounded-full bg-navy/5 dark:bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-border/50 group-hover:border-gold/50 shadow-inner">
                  <Icon className="w-10 h-10 text-gold" />
                </div>

                <h3 className="relative text-2xl font-bold text-foreground mb-4 font-serif">
                  {value.title}
                </h3>
                <p className="relative text-muted-foreground font-sans leading-relaxed">
                  {value.description}
                </p>

                <div className="absolute bottom-4 right-4 text-gold/10 font-serif text-6xl font-bold select-none group-hover:text-gold/20 transition-colors">
                  0{index + 1}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
