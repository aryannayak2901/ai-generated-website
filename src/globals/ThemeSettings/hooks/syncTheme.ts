import type { GlobalBeforeChangeHook, GlobalAfterChangeHook } from "payload";
import { THEME_PRESETS, WEBSITE_COLOR_KEYS, ADMIN_COLOR_KEYS } from "../../../components/Theme/theme-presets";
import { generateThemeCSS } from "./generateThemeCSS";
import { generateAdminCSS } from "./generateAdminCSS";
import fs from "fs/promises";
import path from "path";

/**
 * beforeChange Hook: Handles preset synchronization and auto-switching to 'custom'.
 */
export const syncThemeBeforeChange: GlobalBeforeChangeHook = async ({ data, originalDoc }) => {
  const nextData = { ...data };

  // If no preset is selected, default to chambersClassic
  if (!nextData.preset) {
    nextData.preset = "chambersClassic";
  }

  const selectedPreset = nextData.preset;

  if (selectedPreset !== "custom") {
    const presetConfig = THEME_PRESETS[selectedPreset];

    if (presetConfig) {
      // Check if any color has been manually modified away from the preset values.
      // If a manual modification has occurred, we auto-transition the preset to "custom".
      let hasManualOverride = false;

      // Check website colors
      for (const key of WEBSITE_COLOR_KEYS) {
        // Compare new input color with preset color (checking key exists in preset)
        if (
          nextData[key] !== undefined &&
          originalDoc?.[key] !== undefined &&
          nextData[key] !== originalDoc[key] &&
          nextData[key] !== presetConfig.websiteColors[key]
        ) {
          hasManualOverride = true;
          break;
        }
      }

      // Check admin colors
      if (!hasManualOverride) {
        for (const key of ADMIN_COLOR_KEYS) {
          if (
            nextData[key] !== undefined &&
            originalDoc?.[key] !== undefined &&
            nextData[key] !== originalDoc[key] &&
            nextData[key] !== presetConfig.adminColors[key]
          ) {
            hasManualOverride = true;
            break;
          }
        }
      }

      if (hasManualOverride) {
        nextData.preset = "custom";
      } else {
        // If no overrides, force preset colors and radii into form values (autopopulate)
        Object.entries(presetConfig.websiteColors).forEach(([key, color]) => {
          nextData[key] = color;
        });

        Object.entries(presetConfig.adminColors).forEach(([key, color]) => {
          nextData[key] = color;
        });

        // Autopopulate corner radii
        nextData.radius = presetConfig.websiteRadius;
        nextData.adminRadius = presetConfig.adminRadius;
      }
    }
  }

  return nextData;
};

/**
 * afterChange Hook: Compiles settings to static CSS files under the /public directory in parallel.
 */
export const syncThemeAfterChange: GlobalAfterChangeHook = async ({ doc, req: { payload } }) => {
  try {
    // 1. Generate CSS strings
    const websiteCSS = generateThemeCSS(doc);
    const adminCSS = generateAdminCSS(doc);

    // 2. Determine paths under public directory
    const publicDir = path.join(process.cwd(), "public");
    const websiteCSSPath = path.join(publicDir, "theme-overrides.css");
    const adminCSSPath = path.join(publicDir, "admin-theme.css");

    // 3. Ensure public directory exists
    await fs.mkdir(publicDir, { recursive: true });

    // 4. Write files asynchronously in parallel
    await Promise.all([
      fs.writeFile(websiteCSSPath, websiteCSS, "utf-8"),
      fs.writeFile(adminCSSPath, adminCSS, "utf-8")
    ]);

    payload.logger.info(`✅ Unified Dynamic CSS compiled and saved:`);
    payload.logger.info(`   - Website theme: ${websiteCSSPath}`);
    payload.logger.info(`   - Admin theme:   ${adminCSSPath}`);
  } catch (error) {
    payload.logger.error(
      `❌ Failed to compile static CSS theme files: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }

  return doc;
};
