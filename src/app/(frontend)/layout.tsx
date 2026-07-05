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
import { EnhancedTracker } from "@/components/Analytics/EnhancedTracker";
import { Suspense } from "react";
import { generateThemeCSS } from "@/globals/ThemeSettings/hooks/generateThemeCSS";

import { generateSeoMetadata } from "@/lib/seo/metadata-generator";
import StructuredData from "@/components/SEO/StructuredData";
import { generateGeneralPageSchema } from "@/lib/seo/schema-generator";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = generateSeoMetadata({
  titleConfig: { type: "home" },
  descriptionConfig: { type: "home" },
  slug: "/",
});

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
  let headingFont = "Playfair Display";
  let bodyFont = "Public Sans";
  // "system" | "light" | "dark"
  let themeMode: "system" | "light" | "dark" = "system";
  let headerData = null;
  let footerData = null;
  let themeDoc: any = null;

  try {
    const payload = await getPayload({ config });
    const [ga4, theme, header, footer] = await Promise.all([
      payload.findGlobal({
        slug: "ga4",
        depth: 0,
      }),
      payload.findGlobal({
        slug: "theme-settings",
        depth: 0,
      }),
      payload.findGlobal({
        slug: "header",
        depth: 1,
      }),
      payload.findGlobal({
        slug: "footer",
        depth: 1,
      }),
    ]);

    if (theme) {
      themeDoc = theme;
    }
    if (ga4?.measurementId) {
      measurementId = ga4.measurementId;
    }
    if (theme?.headingFont) {
      headingFont = theme.headingFont;
    }
    if (theme?.bodyFont) {
      bodyFont = theme.bodyFont;
    }
    if (theme?.mode && ["system", "light", "dark"].includes(theme.mode)) {
      themeMode = theme.mode as "system" | "light" | "dark";
    }
    if (header) {
      headerData = header;
    }
    if (footer) {
      footerData = footer;
    }
  } catch (error) {
    console.error("Failed to load settings from DB:", error);
  }

  const headingFontSafe = headingFont.replace(/ /g, "+");
  const bodyFontSafe = bodyFont.replace(/ /g, "+");

  // Map Payload mode to next-themes props
  // When "light" or "dark" is forced, we use forcedTheme to lock it globally.
  const forcedTheme = themeMode === "system" ? undefined : themeMode;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=${bodyFontSafe}:wght@300;400;500;600;700&family=${headingFontSafe}:wght@300;400;500;600;700;800&display=swap`}
        />
        {/* Inline CSS Theme Overrides directly from Payload settings to ensure instant updates and bypass browser caching */}
        <style
          id="payload-theme-overrides"
          dangerouslySetInnerHTML={{
            __html: generateThemeCSS(themeDoc || {}),
          }}
        />
      </head>
      <body
        className={`${publicSans.variable} ${playfairDisplay.variable} antialiased min-h-screen flex flex-col font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme={themeMode}
          forcedTheme={forcedTheme}
          enableSystem={themeMode === "system"}
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <GoogleAnalyticsTracker measurementId={measurementId} />
            <EnhancedTracker />
          </Suspense>
          <StructuredData schema={generateGeneralPageSchema()} />
          <DisclaimerModal />
          <Navbar headerData={headerData} />
          <main className="flex-1">{children}</main>
          <Footer footerData={footerData} />
        </ThemeProvider>
      </body>
    </html>
  );
}
