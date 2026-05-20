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
 */
export const generateAdminCSS = (settings: any): string => {
  if (!settings) {
    return ADMIN_THEME_DEFAULTS.light + "\n" + ADMIN_THEME_DEFAULTS.dark + "\n" + ADMIN_CSS_FRAMEWORK;
  }

  const {
    mode = "light",
    adminRadius = 0.375,
    adminCSSOverrides = "",
  } = settings;

  // 1. Start with the core custom layout styling rules
  let css = ADMIN_CSS_FRAMEWORK;

  // 2. Generate Light Mode variables
  if (mode === "light" || mode === "system") {
    let lightVars = "\n:root, html[data-theme=\"light\"] {\n";
    
    // Default base Light colors
    lightVars += "  /* Admin Theme - Light Mode */\n";
    ADMIN_COLOR_MAPPINGS.forEach(([cssVar, fieldName]) => {
      const value = settings[fieldName];
      if (value) {
        lightVars += `  ${cssVar}: ${value};\n`;
      }
    });

    // Apply radius
    lightVars += `  ${ADMIN_RADIUS_MAPPING[0]}: ${adminRadius}rem;\n`;
    lightVars += "}\n";
    css += lightVars;
  }

  // 3. Generate Dark Mode variables
  if (mode === "dark" || mode === "system") {
    let darkVars = "\nhtml[data-theme=\"dark\"] {\n";
    
    // Default base Dark colors
    darkVars += "  /* Admin Theme - Dark Mode */\n";
    ADMIN_COLOR_MAPPINGS.forEach(([cssVar, fieldName]) => {
      // Look for explicit dark mode overrides like adminBgDark, adminFgDark
      const darkFieldName = `${fieldName}Dark`;
      const value = settings[darkFieldName] || settings[fieldName];
      if (value) {
        darkVars += `  ${cssVar}: ${value};\n`;
      }
    });

    // Apply radius
    darkVars += `  ${ADMIN_RADIUS_MAPPING[0]}: ${adminRadius}rem;\n`;
    darkVars += "}\n";
    css += darkVars;
  }

  // 4. Append custom CSS overrides for CMS
  if (adminCSSOverrides) {
    css += `\n/* Custom Admin CMS CSS Overrides */\n${adminCSSOverrides}\n`;
  }

  return css;
};
