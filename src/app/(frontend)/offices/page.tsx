import { Metadata } from "next";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { OfficeHero } from "@/components/offices/OfficeHero";
import { OfficeSelector } from "@/components/offices/OfficeSelector";
import { MapSection } from "@/components/offices/MapSection";
import { OfficeCTA } from "@/components/offices/OfficeCTA";
import type { Page } from "@/payload-types";

export const metadata: Metadata = {
  title: "Office Locations | Chambers of Jeet Bhatt",
  description: "Visit our professional legal chambers in Ahmedabad and Gandhinagar. Providing expert legal guidance across Gujarat.",
  alternates: {
    canonical: "/offices",
    languages: {
      "en-US": "/en/offices",
    },
  },
};

// Force dynamic rendering — ensures Payload content & theme changes are
// reflected immediately in production without requiring a redeploy.
export const dynamic = 'force-dynamic';

interface OfficeHeroBlock {
  blockType: "officeHero";
  tag?: string | null;
  title?: string | null;
  subtitle?: string | null;
}

interface OfficeSelectorBlock {
  blockType: "officeSelector";
}

interface MapSectionBlock {
  blockType: "mapSection";
}

interface OfficeCtaBlock {
  blockType: "officeCta";
}

type LayoutBlock = OfficeHeroBlock | OfficeSelectorBlock | MapSectionBlock | OfficeCtaBlock;

export default async function OfficesPage() {
  const payload = await getPayload({ config: configPromise });
  const { docs } = await payload.find({
    collection: "pages",
    where: {
      slug: {
        equals: "offices",
      },
    },
    depth: 2,
  });

  const page = docs[0] as unknown as Page;

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {page?.layout?.map((block, index: number) => {
        const layoutBlock = block as LayoutBlock;
        if (layoutBlock.blockType === "officeHero") {
          const heroBlock = layoutBlock as OfficeHeroBlock;
          return (
            <OfficeHero
              key={index}
              tag={heroBlock.tag}
              title={heroBlock.title}
              subtitle={heroBlock.subtitle}
            />
          );
        }
        if (layoutBlock.blockType === "officeSelector") return <OfficeSelector key={index} />;
        if (layoutBlock.blockType === "mapSection") return <MapSection key={index} />;
        if (layoutBlock.blockType === "officeCta") return <OfficeCTA key={index} />;
        return null;
      })}

      {!page?.layout?.length && (
        <>
          <OfficeHero />
          <OfficeSelector />
          <MapSection />
          <OfficeCTA />
        </>
      )}
    </div>
  );
}
