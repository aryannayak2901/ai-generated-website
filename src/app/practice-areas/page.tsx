import { PracticeAreasHero } from "@/components/practice-areas/PracticeAreasHero";
import { PracticeAreasGrid } from "@/components/practice-areas/PracticeAreasGrid";
import { CTASection } from "@/components/practice-areas/CTASection";

export const metadata = {
  title: "Practice Areas | Chambers of Jeet Bhatt",
  description:
    "Comprehensive corporate legal services, civil litigation, family law, criminal defense, intellectual property, and more.",
};

export default function PracticeAreasPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center flex-1 w-full overflow-hidden">
      <PracticeAreasHero />
      <PracticeAreasGrid />
      <CTASection />
    </main>
  );
}
