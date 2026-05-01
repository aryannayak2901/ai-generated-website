import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import ContactMap from "@/components/contact/ContactMap";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Contact Us | Chambers of Jeet Bhatt",
  description: "Schedule a legal consultation with Chambers of Jeet Bhatt. Reach out to our expert advocates and legal strategists in Gandhinagar, Gujarat.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background transition-colors duration-500">
      <ContactHero />
      <ContactInfo />
      <ContactForm />
      <ContactMap />
      <Toaster position="top-center" richColors />
    </main>
  );
}
