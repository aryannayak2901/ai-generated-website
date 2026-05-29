import { 
  ADMIN_THEME_DEFAULTS, 
  ADMIN_CSS_FRAMEWORK 
} from "../../../components/Theme/admin-theme-defaults";
import { 
  ADMIN_COLOR_MAPPINGS, 
  ADMIN_RADIUS_MAPPING 
} from "../../../components/Theme/admin-theme-constants";

/**
 * Generate admin CSS from theme settings.
 * Overrides Payload's native theme properties on the root.
 *
 * Payload admin uses html[data-theme="light"|"dark"] attribute selector,
 * so we target that for the admin panel.
 *
 * Strategy:
 * 1. Always include ADMIN_CSS_FRAMEWORK (nav, buttons, scrollbars)
 * 2. Generate light mode vars under :root, html[data-theme="light"]
 * 3. Generate dark mode vars under html[data-theme="dark"]
 * 4. If mode is forced "dark", also override :root defaults
 */
export const generateAdminCSS = (settings: any): string => {
  if (!settings) {
    // Return safe defaults when no settings are available
    return ADMIN_CSS_FRAMEWORK + ADMIN_THEME_DEFAULTS.light + "\n" + ADMIN_THEME_DEFAULTS.dark;
  }

  const { mode = "light", adminRadius = 0.375 } = settings;

  // Start with the core custom layout styling rules
  let css = ADMIN_CSS_FRAMEWORK;

  // Helper to get dark override value
  const getDarkValue = (fieldName: string) => {
    const darkFieldName = `${fieldName}Dark`;
    return settings[darkFieldName] || settings[fieldName] || "";
  };

  // Generate Light Mode variables
  if (mode === "light" || mode === "system") {
    let lightVars = "\n:root, html[data-theme=\"light\"] {\n  /* Admin Theme - Light Mode (from Payload ThemeSettings) */\n";
    
    ADMIN_COLOR_MAPPINGS.forEach(([cssVar, fieldName]) => {
      const value = settings[fieldName];
      if (value) {
        lightVars += `  ${cssVar}: ${value};\n`;
      }
    });
    lightVars += `  ${ADMIN_RADIUS_MAPPING[0]}: ${adminRadius}rem;\n`;
    lightVars += "}\n";
    css += lightVars;
  }

  // Generate Dark Mode variables (Payload uses html[data-theme="dark"])
  if (mode === "dark" || mode === "system") {
    let darkVars = "\nhtml[data-theme=\"dark\"] {\n  /* Admin Theme - Dark Mode (from Payload ThemeSettings) */\n";
    
    ADMIN_COLOR_MAPPINGS.forEach(([cssVar, fieldName]) => {
      const value = getDarkValue(fieldName);
      if (value) {
        darkVars += `  ${cssVar}: ${value};\n`;
      }
    });
    darkVars += `  ${ADMIN_RADIUS_MAPPING[0]}: ${adminRadius}rem;\n`;
    darkVars += "}\n";
    css += darkVars;
  }

  // If forced dark, also override :root defaults
  if (mode === "dark") {
    let rootDark = "\n:root {\n  /* Forced dark mode root defaults */\n";
    ADMIN_COLOR_MAPPINGS.forEach(([cssVar, fieldName]) => {
      const value = getDarkValue(fieldName);
      if (value) {
        rootDark += `  ${cssVar}: ${value};\n`;
      }
    });
    rootDark += `  ${ADMIN_RADIUS_MAPPING[0]}: ${adminRadius}rem;\n`;
    rootDark += "}\n";
    css += rootDark;
  }

  return css;
};
