import { getPayload } from "payload";
import config from "../src/payload.config";
import { generateThemeCSS } from "../src/globals/ThemeSettings/hooks/generateThemeCSS";
import { generateAdminCSS } from "../src/globals/ThemeSettings/hooks/generateAdminCSS";
import fs from "fs/promises";
import path from "path";

async function main() {
  try {
    const payload = await getPayload({ config });
    const theme = await payload.findGlobal({
      slug: "theme-settings",
      depth: 0,
    });
    
    console.log("=== COMPILING THEME SETTINGS WITH BOOSTED SPECIFICITY ===");
    const websiteCSS = generateThemeCSS(theme || {});
    const adminCSS = generateAdminCSS(theme || {});

    const publicDir = path.join(process.cwd(), "public");
    const websiteCSSPath = path.join(publicDir, "theme-overrides.css");
    const adminCSSPath = path.join(publicDir, "admin-theme.css");

    await fs.mkdir(publicDir, { recursive: true });
    await Promise.all([
      fs.writeFile(websiteCSSPath, websiteCSS, "utf-8"),
      fs.writeFile(adminCSSPath, adminCSS, "utf-8")
    ]);

    console.log("✅ Dynamic theme CSS regenerated successfully:");
    console.log(`   - Website theme path: ${websiteCSSPath}`);
    console.log(`   - Admin theme path: ${adminCSSPath}`);
  } catch (error) {
    console.error("Error regenerating theme:", error);
  }
  process.exit(0);
}

main();
