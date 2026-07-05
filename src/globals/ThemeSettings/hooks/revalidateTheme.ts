import type { GlobalAfterChangeHook } from "payload";

/**
 * Revalidates the Next.js router cache for all pages after theme settings change.
 * Ensures that changes to theme settings (colors, fonts, radius, mode) are reflected
 * immediately on every page of the website and admin panel in production.
 *
 * NOTE: Since (frontend)/layout.tsx and all pages now export `dynamic = 'force-dynamic'`,
 * this hook serves as a belt-and-suspenders safety net for any pages that may be
 * statically rendered in the future, or to bust the ISR data cache layer.
 */
export const revalidateTheme: GlobalAfterChangeHook = async ({ doc, req: { payload } }) => {
  try {
    const { revalidatePath, revalidateTag } = await import("next/cache");

    // 1. Revalidate all Payload global data cache tags
    //    These tags are automatically set by Payload's Next.js plugin on cached fetches.
    const tagsToRevalidate = [
      "global_theme-settings",
      "theme-settings",
      "global",
      "payload-global",
      "payload",
    ];

    for (const tag of tagsToRevalidate) {
      try {
        revalidateTag(tag);
      } catch {
        // Non-fatal: tag may not exist in all environments
      }
    }

    // 2. Revalidate the root layout segment — this cascades through the entire
    //    Next.js layout tree, including (frontend)/layout.tsx and all nested pages.
    //    This is the most important call for ensuring theme changes propagate.
    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");

    // 3. Explicitly revalidate each route as a page-level cache bust.
    //    This covers both the "page" and "layout" segment caches.
    const routesToRevalidate = [
      "/",
      "/about",
      "/contact",
      "/blog",
      "/practice-areas",
      "/offices",
      "/team",
    ];

    for (const route of routesToRevalidate) {
      try {
        revalidatePath(route, "page");
      } catch {
        // Non-fatal per route
      }
    }

    payload.logger.info(
      "⚡ Theme settings updated — full site Next.js cache revalidated successfully."
    );
  } catch (error) {
    payload.logger.error(
      `❌ Failed to revalidate Next.js cache after theme update: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }

  return doc;
};

export default revalidateTheme;
