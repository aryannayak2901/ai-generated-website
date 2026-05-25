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
    <section className="py-20 md:py-28 px-6 bg-secondary relative overflow-hidden">
      {/* Decorative subtle ambient circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1300px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            {title || "Select Your Jurisdiction"}
          </h2>
          <div className="w-16 h-[2px] bg-accent mx-auto mb-6" />
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-sans font-light">
            {subtitle || "Initiate contact with our respective chambers for specialized professional counsel tailored to your location."}
          </p>
        </div>

        {/* Office Navigation Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-16 max-w-lg mx-auto p-1.5 bg-background/50 backdrop-blur-md rounded-xl border border-border/40 shadow-sm">
          {activeOffices.map((office) => {
            const isActive = activeTabId === office.id;
            return (
              <button
                key={office.id}
                onClick={() => setSelectedTabId(office.id)}
                className={`relative flex-1 py-3 px-6 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeOfficeTab"
                    className="absolute inset-0 bg-accent rounded-lg shadow-md -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {office.label}
              </button>
            );
          })}
        </div>

        {/* Office Card with Staggered Visual Entrance */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {selectedOffice && (
              <motion.div
                key={selectedOffice.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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

