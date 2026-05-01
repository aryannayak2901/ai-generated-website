"use client";

import { useState } from "react";
import { OfficeCard } from "./OfficeCard";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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

export const OfficeSelector = () => {
  const [activeTab, setActiveTab] = useState("ahmedabad");

  return (
    <section className="py-24 md:py-32 bg-background dark:bg-navy transition-colors duration-500 relative overflow-hidden">
      {/* Decorative radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col items-center mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs mb-6 block">
              Global Presence
            </span>
            <h2 className="text-4xl md:text-6xl font-serif text-navy dark:text-white mb-8">
              Select Your <span className="text-gold italic font-medium">Location</span>
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto rounded-full shadow-[0_0_10px_rgba(212,175,55,0.3)]" />
          </motion.div>

          {/* Premium Segmented Control */}
          <div className="relative p-1.5 bg-slate-100 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10 flex gap-2 w-full max-w-lg shadow-inner">
            {OFFICES.map((office) => (
              <button
                key={office.id}
                onClick={() => setActiveTab(office.id)}
                className={cn(
                  "relative z-10 flex-1 py-4 px-8 text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-500 rounded-xl",
                  activeTab === office.id 
                    ? "text-navy dark:text-navy" 
                    : "text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white"
                )}
              >
                {office.label}
                {activeTab === office.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gold rounded-xl -z-10 shadow-xl shadow-gold/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {OFFICES.map((office) => 
              activeTab === office.id ? (
                <motion.div
                  key={office.id}
                  initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <OfficeCard {...office} />
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
