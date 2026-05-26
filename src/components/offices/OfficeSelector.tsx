"use client";

import { useState } from "react";
import { OfficeCard } from "./OfficeCard";
import { motion, AnimatePresence } from "framer-motion";
import type { Media } from "@/payload-types";

const OFFICES = [
  {
    id: "ahmedabad",
    label: "Ahmedabad",
    name: "Chambers of Jeet Bhatt - Ahmedabad",
    address: "E-501, 5th Floor, SG Business Hub, Sola, Near Gota Overbridge SG Highway, Ahmedabad, GJ 380001",
    phone: ["+91 9408282982", "+91 7935732455"],
    email: "jeetbhatt@gmail.com",
    mapUrl: "https://maps.app.goo.gl/DvbBvdqVzPXPYiZp9",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
    hours: [
      { day: "Mon - Fri", time: "10:00 AM - 6:00 PM" },
      { day: "Saturday", time: "10:00 AM - 3:00 PM" },
      { day: "Sunday", time: "Closed" },
    ],
  },
  {
    id: "gandhinagar",
    label: "Gandhinagar",
    name: "Chambers of Jeet Bhatt - Gandhinagar",
    address: "Plot no 754, nr. Maharashtra Samaj Bhavan, Vastunirman Society, Sector 21, Gandhinagar, Gujarat 382021",
    phone: ["+91 9408282982"],
    email: "jeetbhatt@gmail.com",
    mapUrl: "https://maps.app.goo.gl/some-gandhinagar-link",
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200",
    hours: [
      { day: "Mon - Fri", time: "9:00 AM - 7:00 PM" },
      { day: "Saturday", time: "10:00 AM - 4:00 PM" },
      { day: "Sunday", time: "By Appointment" },
    ],
  },
];

export interface OfficeSelectorProps {
  title?: string | null;
  subtitle?: string | null;
  offices?:
    | {
        id: string;
        label: string;
        name: string;
        address: string;
        phone?: { number: string }[] | null;
        email?: string | null;
        mapUrl?: string | null;
        image?: string | Media | null;
        hours?: { day: string; time: string }[] | null;
      }[]
    | null;
}

export const OfficeSelector = ({
  title,
  subtitle,
  offices: payloadOffices,
}: OfficeSelectorProps) => {
  const activeOffices =
    payloadOffices && payloadOffices.length > 0
      ? payloadOffices.map((o) => ({
          id: o.id,
          label: o.label,
          name: o.name,
          address: o.address,
          phone: o.phone?.map((p) => p.number) || [],
          email: o.email || "",
          mapUrl: o.mapUrl || "",
          imageUrl:
            (typeof o.image === 'object' ? o.image?.url : o.image) ||
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
          hours: o.hours || [],
        }))
      : OFFICES;

  const [selectedTabId, setSelectedTabId] = useState<string | null>(null);

  const activeTabId =
    selectedTabId && activeOffices.find((o) => o.id === selectedTabId)
      ? selectedTabId
      : activeOffices[0]?.id;

  const selectedOffice = activeOffices.find((o) => o.id === activeTabId);

  return (
    <section className="py-24 md:py-32 px-6 bg-secondary relative overflow-hidden">
      {/* Premium background mesh overlay */}
      <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* Exquisite warm amber/gold ambient leak */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-[1300px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-bold text-accent tracking-[0.35em] uppercase font-sans">
              Exclusive Jurisdictions
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          </div>
          
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            {title || "Select Your Jurisdiction"}
          </h2>
          
          <div className="w-20 h-[1px] bg-accent/40 mx-auto mb-6" />
          
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-sans font-light">
            {subtitle || "Initiate contact with our respective chambers for specialized professional counsel tailored to your location."}
          </p>
        </div>

        {/* Office Navigation Tabs - Luxurious Segment Bar */}
        <div className="flex flex-wrap sm:flex-nowrap justify-center items-center gap-1.5 mb-16 max-w-md mx-auto p-1.5 bg-background/60 dark:bg-card/60 backdrop-blur-xl rounded-xl border border-border/40 shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          {activeOffices.map((office) => {
            const isActive = activeTabId === office.id;
            return (
              <button
                key={office.id}
                onClick={() => setSelectedTabId(office.id)}
                className={`relative flex-1 py-3 px-6 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "text-[#0f1729] dark:text-[#0f1729]" // strictly dark navy text for AA gold background contrast
                    : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeOfficeTab"
                    className="absolute inset-0 bg-accent rounded-lg shadow-[0_4px_15px_rgba(212,175,55,0.25)] -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                {office.label}
              </button>
            );
          })}
        </div>

        {/* Office Card with custom smooth content entrance */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {selectedOffice && (
              <motion.div
                key={selectedOffice.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <OfficeCard
                  name={selectedOffice.name}
                  address={selectedOffice.address}
                  phone={selectedOffice.phone}
                  email={selectedOffice.email}
                  hours={selectedOffice.hours}
                  mapUrl={selectedOffice.mapUrl}
                  imageUrl={selectedOffice.imageUrl}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
