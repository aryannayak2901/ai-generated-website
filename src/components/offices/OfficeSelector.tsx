"use client";

import { useState } from "react";
import { OfficeCard } from "./OfficeCard";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
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
    <section className="py-16 md:py-24 px-6 bg-gray-light relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-slate-primary mb-4">
            {title || "Our Offices"}
          </h2>
          <div className="w-24 h-0.5 bg-teal-primary/50 mx-auto mb-6" />
          <p className="text-lg text-slate-secondary max-w-2xl mx-auto leading-relaxed font-sans">
            {subtitle || "Visit us at our conveniently located offices across Gujarat."}
          </p>
        </div>

        {/* Office Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {activeOffices.map((office) => (
            <Button
              key={office.id}
              variant={activeTabId === office.id ? "default" : "outline"}
              onClick={() => setSelectedTabId(office.id)}
              className={
                activeTabId === office.id
                  ? "bg-teal-primary hover:bg-teal-light text-white font-semibold tracking-wider uppercase text-xs"
                  : "border-slate-200 text-slate-primary hover:border-teal-primary/30 hover:text-teal-primary font-semibold tracking-wider uppercase text-xs"
              }
            >
              {office.label}
            </Button>
          ))}
        </div>

        {/* Office Card with Animation */}
        <AnimatePresence mode="wait">
          {selectedOffice && (
            <motion.div
              key={selectedOffice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
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
    </section>
  );
};
