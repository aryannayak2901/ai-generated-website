"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const contactDetails = [
  {
    icon: Phone,
    title: "Phone",
    value: "+91 94082 82982",
    href: "tel:+919408282982",
  },
  {
    icon: Mail,
    title: "Email",
    value: "info@jeetbhatt.com",
    href: "mailto:info@jeetbhatt.com",
  },
  {
    icon: MapPin,
    title: "Address",
    value: "E-501, SG Business Hub,\nNear Gota Overbridge, Ahmedabad",
    href: "https://maps.app.goo.gl/DvbBvdqVzPXPYiZp9",
  },
  {
    icon: Clock,
    title: "Hours",
    value: "Mon-Fri: 10 AM - 7 PM\nSat: 10 AM - 3 PM",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
} as const;

export interface ContactInfoProps {
  infoItems?: {
    icon?: string | null;
    title: string;
    value: string;
    link?: string | null;
  }[] | null;
}

export default function ContactInfo({ infoItems: payloadItems }: ContactInfoProps) {
  const iconMap: Record<string, LucideIcon> = {
    Phone, Mail, MapPin, Clock
  };

  const activeItems = payloadItems && payloadItems.length > 0
    ? payloadItems.map(item => ({
        icon: item.icon && iconMap[item.icon] ? iconMap[item.icon] : Phone,
        title: item.title,
        value: item.value,
        href: item.link || undefined,
      }))
    : contactDetails;

  return (
    <section className="py-20 md:py-32 bg-background dark:bg-navy transition-colors duration-500 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      
      <div className="container mx-auto px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
        >
          {activeItems.map((detail, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full border-navy/5 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-xl hover:border-gold/30 dark:hover:border-gold/30 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden rounded-2xl">
                <CardContent className="p-10 flex flex-col items-center text-center">
                  <div className="mb-8 p-5 rounded-2xl bg-gold/10 text-gold group-hover:bg-gold group-hover:text-navy transition-all duration-500 shadow-lg shadow-gold/5">
                    <detail.icon className="h-8 w-8" strokeWidth={1.5} />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-navy dark:text-white mb-4">
                    {detail.title}
                  </h2>
                  {detail.href ? (
                    <a
                      href={detail.href}
                      className="text-slate-600 dark:text-slate-400 hover:text-gold dark:hover:text-gold font-medium leading-relaxed transition-colors whitespace-pre-line text-sm tracking-wide"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-line text-sm tracking-wide">
                      {detail.value}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
