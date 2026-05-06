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
        if ('blockType' in block && block.blockType === "officeHero") return (
          <div key={index} className="max-w-5xl mx-auto text-center flex flex-col items-center animate-fade-in-up">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 mb-10 text-[10px] font-bold tracking-[0.3em] uppercase rounded-full bg-gold/10 text-gold border border-gold/20 backdrop-blur-md shadow-lg shadow-gold/5 animate-scale-in [animation-delay:200ms]">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              {(block as any).tag || "Distinguished Chambers"}
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white mb-10 leading-[0.95] tracking-tight animate-fade-in-up [animation-delay:400ms]">
              {(block as any).title ? (block as any).title : (
                <>Our <span className="relative inline-block">
                  <span className="text-gold italic font-medium">Chambers</span>
                <svg 
                  className="absolute -bottom-4 left-0 w-full h-4 text-gold/40 animate-fade-in [animation-delay:1000ms]" 
                  viewBox="0 0 100 10" 
                  preserveAspectRatio="none"
                >
                  <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span></>
              )}
            </h1>
            
            <p className="text-xl md:text-3xl text-slate-300 font-sans leading-relaxed max-w-3xl font-light mx-auto animate-fade-in-up [animation-delay:600ms]">
              {(block as any).subtitle ? (block as any).subtitle : (
                <>Strategically located at the heart of Gujarat&apos;s legal landscape, providing <span className="text-white font-medium"> unmatched expertise</span> and accessibility.</>
              )}
            </p>
          </div>
        );
        if ('blockType' in block && block.blockType === "officeSelector") return <OfficeSelector key={index} {...block as any} />;
        if ('blockType' in block && block.blockType === "mapSection") return <MapSection key={index} {...block as any} />;
        if ('blockType' in block && block.blockType === "officeCta") return <OfficeCTA key={index} {...block as any} />;
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
