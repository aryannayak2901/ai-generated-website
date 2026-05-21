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
import fs from "fs/promises";
import path from "path";
import { generateThemeCSS } from "@/globals/ThemeSettings/hooks/generateThemeCSS";
import { generateAdminCSS } from "@/globals/ThemeSettings/hooks/generateAdminCSS";

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

  try {
    const payload = await getPayload({ config });
    const [ga4, theme] = await Promise.all([
      payload.findGlobal({
        slug: "ga4",
        depth: 0,
      }),
      payload.findGlobal({
        slug: "theme-settings",
        depth: 0,
      }),
    ]);

    if (ga4?.measurementId) {
      measurementId = ga4.measurementId;
    }
    if (theme?.headingFont) {
      headingFont = theme.headingFont;
    }
    if (theme?.bodyFont) {
      bodyFont = theme.bodyFont;
    }
  } catch (error) {
    console.error("Failed to load settings from DB:", error);
  }

  // Ensure static CSS assets exist under public dir to prevent FOUC or 404s
  try {
    const publicDir = path.join(process.cwd(), "public");
    const themeOverridesPath = path.join(publicDir, "theme-overrides.css");
    const adminThemePath = path.join(publicDir, "admin-theme.css");

    let themeExists = false;
    try {
      await fs.access(themeOverridesPath);
      themeExists = true;
    } catch {
      themeExists = false;
    }

    if (!themeExists) {
      const payload = await getPayload({ config });
      const theme = await payload.findGlobal({
        slug: "theme-settings",
        depth: 0,
      });
      const themeCss = generateThemeCSS(theme || {});
      const adminCss = generateAdminCSS(theme || {});
      await fs.mkdir(publicDir, { recursive: true });
      await Promise.all([
        fs.writeFile(themeOverridesPath, themeCss, "utf-8"),
        fs.writeFile(adminThemePath, adminCss, "utf-8"),
      ]);
    }
  } catch (err) {
    console.error("Failed to pre-generate dynamic CSS theme overrides:", err);
  }

  const headingFontSafe = headingFont.replace(/ /g, "+");
  const bodyFontSafe = bodyFont.replace(/ /g, "+");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=${bodyFontSafe}:wght@300;400;500;600;700&family=${headingFontSafe}:wght@300;400;500;600;700;800&display=swap`}
        />
        <link rel="stylesheet" href="/theme-overrides.css" />
      </head>
      <body
        className={`${publicSans.variable} ${playfairDisplay.variable} antialiased min-h-screen flex flex-col font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <GoogleAnalyticsTracker measurementId={measurementId} />
            <EnhancedTracker />
          </Suspense>
          <StructuredData schema={generateGeneralPageSchema()} />
          <DisclaimerModal />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
