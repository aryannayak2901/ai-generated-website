import { getPayload } from "payload";
import config from "@/payload.config";
import { generateAdminCSS } from "@/globals/ThemeSettings/hooks/generateAdminCSS";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await getPayload({ config });
    const themeDoc = await payload.findGlobal({
      slug: "theme-settings",
      depth: 0,
    });
    const css = generateAdminCSS(themeDoc || {});
    return new NextResponse(css, {
      headers: {
        "Content-Type": "text/css; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Failed to serve admin-theme.css dynamically:", error);
    return new NextResponse("/* Failed to load admin theme */", {
      status: 500,
      headers: { "Content-Type": "text/css; charset=utf-8" },
    });
  }
}
