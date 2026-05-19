import type { Metadata } from "next";
import { Public_Sans, Playfair_Display } from "next/font/google";
import "../globals.css";
import { DisclaimerModal } from "@/components/DisclaimerModal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { getPayload } from "payload";
import config from "@/payload.config";
import { GoogleAnalyticsTracker } from "@/components/GoogleAnalyticsTracker";
import { Suspense } from "react";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jeetbhatt.com"),
  title: "Chambers of Jeet Bhatt",
  description: "Premium Law Firm in Gandhinagar, Gujarat",
  alternates: {
    canonical: "/",
  },
};

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
  try {
    const payload = await getPayload({ config });
    const ga4 = await payload.findGlobal({
      slug: "ga4",
      depth: 0,
    });
    if (ga4?.measurementId) {
      measurementId = ga4.measurementId;
    }
  } catch (error) {
    console.error("Failed to load GA4 measurementId from DB:", error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${publicSans.variable} ${playfairDisplay.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <GoogleAnalyticsTracker measurementId={measurementId} />
          </Suspense>
          <DisclaimerModal />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
