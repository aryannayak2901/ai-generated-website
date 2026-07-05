import { getPayload } from "payload";
import configPromise from "@/payload.config";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import ContactMap from "@/components/contact/ContactMap";
import { Toaster } from "@/components/ui/sonner";
import { RenderBlocks } from "@/components/RenderBlocks";
import type { Page } from "@/payload-types";

export const metadata = {
  title: "Contact Us | Chambers of Jeet Bhatt",
  description: "Schedule a legal consultation with Chambers of Jeet Bhatt. Reach out to our expert advocates and legal strategists in Gandhinagar, Gujarat.",
  alternates: {
    canonical: "/contact",
  },
};

// Force dynamic rendering — ensures Payload content & theme changes are
// reflected immediately in production without requiring a redeploy.
export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const payload = await getPayload({ config: configPromise });
  const { docs } = await payload.find({
    collection: "pages",
    where: {
      slug: {
        equals: "contact",
      },
    },
    depth: 2,
  });

  const page = docs[0] as unknown as Page;

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      {page?.layout && page.layout.length > 0 ? (
        <RenderBlocks blocks={page.layout} />
      ) : (
        <>
          <ContactHero />
          <ContactInfo />
          <ContactForm />
          <ContactMap />
        </>
      )}
      <Toaster position="top-center" richColors />
    </div>
  );
}
