import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { draftMode } from "next/headers";
import { LivePreviewProvider } from "@/components/LivePreviewProvider";
import { HeroSection } from "@/components/home/HeroSection";
import { PracticeAreasBento } from "@/components/home/PracticeAreasBento";
import { TeamPreview } from "@/components/home/TeamPreview";
import { CTASection } from "@/components/home/CTASection";
import { AwardsMarquee } from "@/components/home/AwardsMarquee";
import { RenderBlocks } from "@/components/RenderBlocks";
import type { Page } from "@/payload-types";

export default async function Home() {
  const { isEnabled: isDraft } = await draftMode();
  const payload = await getPayload({ config: configPromise });
  const { docs } = await payload.find({
    collection: "pages",
    depth: 2,
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
        isDraft ? (
          <LivePreviewProvider initialBlocks={page.layout} />
        ) : (
          <RenderBlocks blocks={page.layout} />
        )
      ) : (
        <>
          <HeroSection />
          <PracticeAreasBento />
          <TeamPreview />
          <CTASection />
          <AwardsMarquee />
        </>
      )}
    </div>
  );
}
