"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface ContactInfoProps {
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  hours?: string | null;
}

export default function ContactInfo({ address, phone, email, hours }: ContactInfoProps) {
  return (
    <section className="py-16 md:py-24 px-6 bg-secondary">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-[1280px] mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Address Card */}
          <Card className="border-slate-200 hover:border-accent/30 transition-colors bg-white">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Office Address
                  </h3>
                  <p className="text-foreground font-sans">
                    {address || "Gandhinagar, Gujarat, India"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phone Card */}
          <Card className="border-slate-200 hover:border-accent/30 transition-colors bg-white">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Contact Number
                  </h3>
                  <p className="text-foreground font-sans">
                    {phone || "+91 94082 82982"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Card */}
          <Card className="border-slate-200 hover:border-accent/30 transition-colors bg-white">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Email Address
                  </h3>
                  <p className="text-foreground font-sans">
                    {email || "info@jeetbhatt.com"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </section>
  );
}
