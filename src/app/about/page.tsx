import React from "react";
import { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutValues } from "@/components/about/AboutValues";
import { AboutTeam } from "@/components/about/AboutTeam";
import { AboutCta } from "@/components/about/AboutCta";

export const metadata: Metadata = {
  title: "About | Chambers of Jeet Bhatt",
  description:
    "Learn about Chambers of Jeet Bhatt's legacy, our diverse team of legal experts, and our core values of Integrity, Excellence, and Client Focus.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen animate-in fade-in duration-500">
      <AboutHero />
      <AboutTeam />
      <AboutValues />
      <AboutCta />
    </main>
  );
}
