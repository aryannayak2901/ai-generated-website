import type { GlobalBeforeChangeHook, GlobalAfterChangeHook } from "payload";
import { THEME_PRESETS, WEBSITE_COLOR_KEYS, ADMIN_COLOR_KEYS } from "../../../components/Theme/theme-presets";
import { parseCssOverrides, updateCssOverrides } from "../color-utils";

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

  // Server-side Bi-directional Failsafe Alignment
  const originalCss = originalDoc?.cssOverrides || "";
  const nextCss = nextData.cssOverrides || "";
  const cssChanged = nextCss !== originalCss;

  let colorsChanged = false;
  if (nextData.radius !== originalDoc?.radius) {
    colorsChanged = true;
  } else {
    for (const key of WEBSITE_COLOR_KEYS) {
      if (nextData[key] !== originalDoc?.[key]) {
        colorsChanged = true;
        break;
      }
      const darkKey = `${key}Dark`;
      if (nextData[darkKey] !== originalDoc?.[darkKey]) {
        colorsChanged = true;
        break;
      }
    }
  }

  if (colorsChanged && !cssChanged) {
    // Colors updated -> synchronize the custom CSS overrides string
    nextData.cssOverrides = updateCssOverrides(nextCss, nextData);
  } else if (cssChanged && !colorsChanged) {
    // CSS overrides code block updated -> parse and align individual fields
    const parsed = parseCssOverrides(nextCss);
    Object.entries(parsed).forEach(([field, val]) => {
      nextData[field] = val;
    });
  }

  return nextData;
};

/**
 * afterChange Hook: Logs theme synchronization.
 * Note: CSS is served dynamically via Route Handlers (/admin-theme.css and /theme-overrides.css)
 * and injected inline in the layouts to ensure instant updates in serverless production environments.
 */
export const syncThemeAfterChange: GlobalAfterChangeHook = async ({ doc, req: { payload } }) => {
  payload.logger.info("✅ Theme settings updated successfully.");
  return doc;
};
