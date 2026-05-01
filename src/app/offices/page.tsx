import { Metadata } from "next";
import { OfficeHero } from "@/components/offices/OfficeHero";
import { OfficeSelector } from "@/components/offices/OfficeSelector";
import { MapSection } from "@/components/offices/MapSection";
import { OfficeCTA } from "@/components/offices/OfficeCTA";

export const metadata: Metadata = {
  title: "Office Locations | Chambers of Jeet Bhatt",
  description: "Visit our professional legal chambers in Ahmedabad and Gandhinagar. Providing expert legal guidance across Gujarat.",
};

export default function OfficesPage() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <OfficeHero />
      <OfficeSelector />
      <MapSection />
      <OfficeCTA />
    </div>
  );
}
