import type { GlobalAfterChangeHook } from "payload";

/**
 * Revalidates the Next.js router cache for the root layout.
 * Ensures that changes to theme settings are fetched and displayed instantly on the frontend.
 */
export const revalidateTheme: GlobalAfterChangeHook = async ({ doc, req: { payload } }) => {
  try {
    const { revalidatePath } = await import("next/cache");
    
    // Invalidate the layout cache to trigger server-side re-render on next page load
    revalidatePath("/", "layout");
    payload.logger.info("⚡ Next.js layout cache revalidated successfully");
  } catch (error) {
    payload.logger.error(
      `❌ Failed to revalidate Next.js cache: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
  return doc;
};
export default revalidateTheme;
