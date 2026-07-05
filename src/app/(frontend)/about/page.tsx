import React from "react";
import { Metadata } from "next";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutValues } from "@/components/about/AboutValues";
import { AboutTeam } from "@/components/about/AboutTeam";
import { AboutCta } from "@/components/about/AboutCta";
import { RenderBlocks } from "@/components/RenderBlocks";
import type { Page } from "@/payload-types";

export const metadata: Metadata = {
  title: "About | Chambers of Jeet Bhatt",
  description:
    "Learn about Chambers of Jeet Bhatt's legacy, our diverse team of legal experts, and our core values of Integrity, Excellence, and Client Focus.",
  alternates: {
    canonical: "/about",
  },
};

// Force dynamic rendering — ensures Payload content & theme changes are
// reflected immediately in production without requiring a redeploy.
export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const payload = await getPayload({ config: configPromise });
  const { docs } = await payload.find({
    collection: "pages",
    depth: 2,
    where: {
      slug: {
        equals: "about",
      },
    },
  });

  const page = docs[0] as unknown as Page;

  return (
    <div className="min-h-screen animate-in fade-in duration-500">
      {page?.layout && page.layout.length > 0 ? (
        <RenderBlocks blocks={page.layout} />
      ) : (
        <>
          <AboutHero />
          <AboutTeam />
          <AboutValues />
          <AboutCta />
        </>
      )}
    </div>
  );
}
