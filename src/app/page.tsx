import { HeroSection } from "@/components/home/HeroSection";
import { PracticeAreasBento } from "@/components/home/PracticeAreasBento";
import { AwardsMarquee } from "@/components/home/AwardsMarquee";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full">
      <HeroSection />
      <PracticeAreasBento />
      <AwardsMarquee />
    </main>
  );
}
