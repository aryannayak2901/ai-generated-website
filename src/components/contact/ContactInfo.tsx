"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const iconMap: Record<string, LucideIcon> = {
  Phone: Phone,
  Mail: Mail,
  MapPin: MapPin,
  Clock: Clock,
};

export interface ContactInfoProps {
  infoItems?: {
    icon: string;
    title: string;
    value: string;
    link?: string | null;
  }[] | null;
}

const defaultInfoItems = [
  {
    icon: "MapPin",
    title: "Office Address",
    value: "Gandhinagar, Gujarat, India",
    link: "https://maps.google.com/?q=Gandhinagar,Gujarat,India",
  },
  {
    icon: "Phone",
    title: "Contact Number",
    value: "+91 94082 82982",
    link: "tel:+919408282982",
  },
  {
    icon: "Mail",
    title: "Email Address",
    value: "info@jeetbhatt.com",
    link: "mailto:info@jeetbhatt.com",
  },
];

export default function ContactInfo({ infoItems }: ContactInfoProps) {
  const activeInfoItems = infoItems && infoItems.length > 0 ? infoItems : defaultInfoItems;

  return (
    <section className="py-16 md:py-24 px-6 bg-secondary w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-[1280px] mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeInfoItems.map((item, index) => {
            const Icon = iconMap[item.icon] || MapPin;
            const content = (
              <>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 text-accent">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    {item.title}
                  </h3>
                  <p className="text-foreground font-sans whitespace-pre-line leading-relaxed">
                    {item.value}
                  </p>
                </div>
              </>
            );

            return (
              <Card key={index} className="border-border hover:border-accent/30 transition-all duration-300 bg-card h-full hover:shadow-lg">
                <CardContent className="p-6 md:p-8 h-full">
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 h-full w-full">
                      {content}
                    </a>
                  ) : (
                    <div className="flex items-start gap-4 h-full w-full">
                      {content}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
