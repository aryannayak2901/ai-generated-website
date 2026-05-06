import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { PracticeAreasHero } from "@/components/practice-areas/PracticeAreasHero";
import { PracticeAreasGrid } from "@/components/practice-areas/PracticeAreasGrid";
import { CTASection } from "@/components/practice-areas/CTASection";
import { RenderBlocks } from "@/components/RenderBlocks";
import type { Page } from "@/payload-types";

export const metadata = {
  title: "Practice Areas | Chambers of Jeet Bhatt",
  description:
    "Comprehensive corporate legal services, civil litigation, family law, criminal defense, intellectual property, and more.",
  alternates: {
    canonical: "/practice-areas",
  },
};

export default async function PracticeAreasPage() {
  const payload = await getPayload({ config: configPromise });
  const { docs } = await payload.find({
    collection: "pages",
    where: {
      slug: {
        equals: "practice-areas",
      },
    },
  });

  const page = docs[0] as unknown as Page;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center flex-1 w-full overflow-hidden">
      {page?.layout && page.layout.length > 0 ? (
        <RenderBlocks blocks={page.layout} />
      ) : (
        <>
          <PracticeAreasHero />
          <PracticeAreasGrid />
          <CTASection />
        </>
      )}
    </div>
  );
}
