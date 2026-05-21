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
            <div key={index} className="max-w-5xl mx-auto text-center flex flex-col items-center">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 mb-10 text-[10px] font-bold tracking-[0.3em] uppercase rounded-full bg-teal-primary/10 text-teal-primary border border-teal-primary/20 backdrop-blur-md shadow-lg shadow-teal-primary/5">
                <span className="w-2 h-2 rounded-full bg-teal-primary animate-pulse" />
                {heroBlock.tag || "Distinguished Chambers"}
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-slate-primary mb-10 leading-[0.95] tracking-tight">
                {heroBlock.title ? heroBlock.title : (
                  <>Our <span className="relative inline-block">
                    <span className="text-teal-primary italic font-medium">Chambers</span>
                  </span></>
                )}
              </h1>
              
              <p className="text-lg md:text-xl text-slate-secondary font-sans leading-relaxed max-w-3xl mx-auto">
                {heroBlock.subtitle ? heroBlock.subtitle : (
                  <>Strategically located at the heart of Gujarat&apos;s legal landscape, providing <span className="text-slate-primary font-medium"> unmatched expertise</span> and accessibility.</>
                )}
              </p>
            </div>
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
