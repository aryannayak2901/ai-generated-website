import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { HeroSection } from "@/components/home/HeroSection";
import { PracticeAreasBento } from "@/components/home/PracticeAreasBento";
import { AwardsMarquee } from "@/components/home/AwardsMarquee";
import { RenderBlocks } from "@/components/RenderBlocks";
import type { Page } from "@/payload-types";

export default async function Home() {
  const payload = await getPayload({ config: configPromise });
  const { docs } = await payload.find({
    collection: "pages",
    where: {
      slug: {
        equals: "home",
      },
    },
  });

  const page = docs[0] as unknown as Page;

  return (
    <div className="flex min-h-screen flex-col w-full">
      {page?.layout && page.layout.length > 0 ? (
        <RenderBlocks blocks={page.layout} />
      ) : (
        <>
          <HeroSection />
          <PracticeAreasBento />
          <AwardsMarquee />
        </>
      )}
    </div>
  );
}
