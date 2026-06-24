import type { Metadata } from "next";
import { Public_Sans, Playfair_Display } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { getPayload } from "payload";
import config from "@/payload.config";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sandbox Preview",
  robots: "noindex, nofollow",
};

export default async function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let themeMode: "system" | "light" | "dark" = "system";

  try {
    const payload = await getPayload({ config });
    const theme = await payload.findGlobal({
      slug: "theme-settings",
      depth: 0,
    });
    if (theme?.mode && ["system", "light", "dark"].includes(theme.mode)) {
      themeMode = theme.mode as "system" | "light" | "dark";
    }
  } catch (error) {
    // Ignore db errors for preview
  }

  const forcedTheme = themeMode === "system" ? undefined : themeMode;

  return (
    <html lang="en" suppressHydrationWarning>
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
