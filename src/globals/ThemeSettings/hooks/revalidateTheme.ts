import type { GlobalAfterChangeHook } from "payload";

/**
 * Revalidates the Next.js router cache for all pages after theme settings change.
 * Ensures that changes to theme settings (colors, fonts, radius, mode) are reflected
 * immediately on every page of the website and admin panel in production.
 */
export const revalidateTheme: GlobalAfterChangeHook = async ({ doc, req: { payload } }) => {
  try {
    const { revalidatePath, revalidateTag } = await import("next/cache");

    // Revalidate data cache tags for Payload globals and theme settings
    try {
      revalidateTag("global_theme-settings");
      revalidateTag("theme-settings");
      revalidateTag("global");
    } catch (tagErr) {
      payload.logger.warn("Could not revalidate tags: " + tagErr);
    }

    // Revalidate the entire layout tree — this propagates to all pages
    // since theme is applied in the root (frontend) layout and admin layout
    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");

    // Also explicitly revalidate common pages to ensure full coverage
    const pagesToRevalidate = [
      "/",
      "/about",
      "/contact",
      "/blog",
      "/practice-areas",
      "/offices",
      "/team",
      "/admin",
    ];
    for (const page of pagesToRevalidate) {
      revalidatePath(page, "page");
    }

    payload.logger.info("⚡ Next.js full site cache revalidated after theme settings update");
  } catch (error) {
    payload.logger.error(
      `❌ Failed to revalidate Next.js cache: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
  return doc;
};
export default revalidateTheme;
