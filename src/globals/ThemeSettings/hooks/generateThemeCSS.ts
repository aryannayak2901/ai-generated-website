import { WEBSITE_COLOR_KEYS } from "../../../components/Theme/theme-presets";

/**
 * Generates the complete website theme CSS based on form settings.
 * Outputs standard CSS variables for both light and dark modes.
 */
export const generateThemeCSS = (settings: any): string => {
  if (!settings) return "";

  const {
    mode = "light",
    radius = 0.5,
    headingFont = "Playfair Display",
    bodyFont = "Public Sans",
    cssOverrides = "",
  } = settings;

  // 1. Compile Fonts and Radius base
  let css = `/* ==========================================
   Chambers Unified Theme - Website Stylesheet
   ========================================== */

:root {
  --radius: ${radius}rem;
  --font-playfair-display: '${headingFont}', Georgia, serif;
  --font-public-sans: '${bodyFont}', sans-serif;
}
`;

  // Helper to get dark field value
  const getDarkValue = (key: string) => {
    const darkKey = `${key}Dark`;
    return settings[darkKey] || settings[key] || "";
  };

  // 2. Generate Light Mode variables
  if (mode === "light" || mode === "system") {
    let lightVars = "\n:root, html[data-theme=\"light\"] {\n";
    WEBSITE_COLOR_KEYS.forEach((key) => {
      const val = settings[key];
      if (val) {
        lightVars += `  --${camelToKebab(key)}: ${val};\n`;
      }
    });
    lightVars += "}\n";
    css += lightVars;
  }

  // 3. Generate Dark Mode variables
  if (mode === "dark" || mode === "system") {
    let darkVars = "\n.dark, html[data-theme=\"dark\"] {\n";
    WEBSITE_COLOR_KEYS.forEach((key) => {
      const val = getDarkValue(key);
      if (val) {
        darkVars += `  --${camelToKebab(key)}: ${val};\n`;
      }
    });
    darkVars += "}\n";
    css += darkVars;
  }

  // 4. Append custom CSS overrides
  if (cssOverrides) {
    css += `\n/* Custom Website CSS Overrides */\n${cssOverrides}\n`;
  }

  return css;
};

/**
 * Utility to convert camelCase keys (like primaryForeground) to kebab-case (like primary-foreground)
 */
function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
}
