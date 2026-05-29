import { WEBSITE_COLOR_KEYS } from "../../components/Theme/theme-presets";

/**
 * Utility to convert camelCase keys (like primaryForeground) to kebab-case (like primary-foreground)
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Utility to convert kebab-case (like primary-foreground) to camelCase (like primaryForeground)
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Parses an OKLCH color string into L, C, H, and optional Alpha components.
 * Supports percentages (e.g., 97% for L) and standard formats:
 * - oklch(L C H)
 * - oklch(L C H / A)
 */
export function parseOklch(str: string): { l: number; c: number; h: number; a?: number } | null {
  const clean = str.trim();
  const regex = /oklch\(\s*([0-9.]+%?)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+%?))?\s*\)/i;
  const match = clean.match(regex);
  if (!match) return null;

  let l = parseFloat(match[1]);
  if (match[1].endsWith("%")) {
    l = l / 100;
  }

  const c = parseFloat(match[2]);
  const h = parseFloat(match[3]);

  let a = 1;
  if (match[4]) {
    a = parseFloat(match[4]);
    if (match[4].endsWith("%")) {
      a = a / 100;
    }
  }

  return { l, c, h, a };
}

/**
 * Converts OKLCH values to an sRGB Hex string (#RRGGBB).
 * Implements the standard OKLab/OKLCH to sRGB conversion pipeline.
 */
export function oklchToHex(l: number, c: number, h: number): string {
  // Convert hue from degrees to radians
  const hRad = (h * Math.PI) / 180;
  const aRad = c * Math.cos(hRad);
  const bRad = c * Math.sin(hRad);

  // OKLab to LMS
  const l_ = l + 0.3963377774 * aRad + 0.2158037573 * bRad;
  const m_ = l - 0.1055613458 * aRad - 0.0638541728 * bRad;
  const s_ = l - 0.0894841775 * aRad - 1.2914855480 * bRad;

  // LMS cubing
  const l_3 = l_ * l_ * l_;
  const m_3 = m_ * m_ * m_;
  const s_3 = s_ * s_ * s_;

  // LMS to linear sRGB
  const rL = +4.0767416621 * l_3 - 3.3077115913 * m_3 + 0.2309699292 * s_3;
  const gL = -1.2684380046 * l_3 + 2.6097574011 * m_3 - 0.3413193965 * s_3;
  const bL = -0.0041960863 * l_3 - 0.7034186148 * m_3 + 1.7076147010 * s_3;

  // Linear sRGB to standard sRGB
  const toSRGB = (x: number) => {
    const val = x <= 0.0031308 ? x * 12.92 : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
    return Math.max(0, Math.min(255, Math.round(val * 255)));
  };

  const rVal = toSRGB(rL);
  const gVal = toSRGB(gL);
  const bVal = toSRGB(bL);

  const hex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${hex(rVal)}${hex(gVal)}${hex(bVal)}`;
}

/**
 * Converts an sRGB Hex string (#RRGGBB or #RGB) to an OKLCH color string.
 * Implements the standard sRGB to OKLab/OKLCH conversion pipeline.
 */
export function hexToOklch(hex: string): string {
  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2];
  }

  const r255 = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g255 = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b255 = parseInt(cleanHex.substring(4, 6), 16) || 0;

  // sRGB to linear sRGB
  const toLinear = (x: number) => {
    const val = x / 255;
    return val <= 0.04045 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  };

  const rL = toLinear(r255);
  const gL = toLinear(g255);
  const bL = toLinear(b255);

  // Linear sRGB to LMS
  const l_ = Math.pow(0.4122214708 * rL + 0.5363325363 * gL + 0.0514459929 * bL, 1 / 3);
  const m_ = Math.pow(0.2119034982 * rL + 0.6806995451 * gL + 0.1073969566 * bL, 1 / 3);
  const s_ = Math.pow(0.0883024619 * rL + 0.2817188376 * gL + 0.6300187005 * bL, 1 / 3);

  // LMS to OKLab
  const oklabL = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const oklabA = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const oklabB = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  // OKLab to OKLCH
  const c = Math.sqrt(oklabA * oklabA + oklabB * oklabB);
  let h = (Math.atan2(oklabB, oklabA) * 180) / Math.PI;
  if (h < 0) {
    h += 360;
  }

  // Format to standard CSS OKLCH string (rounding to 3 decimals for precision and clean code representation)
  return `oklch(${Number(oklabL.toFixed(3))} ${Number(c.toFixed(3))} ${Number(h.toFixed(2))})`;
}

/**
 * Normalizes any color representation (Hex or OKLCH) to a standard #RRGGBB Hex.
 */
export function normalizeToHex(colorStr: string): string {
  const clean = colorStr.trim();
  if (clean.startsWith("#")) {
    return clean;
  }
  if (clean.toLowerCase().startsWith("oklch")) {
    const parsed = parseOklch(clean);
    if (parsed) {
      return oklchToHex(parsed.l, parsed.c, parsed.h);
    }
  }
  return clean;
}

/**
 * Extracts CSS variables within a block string of variables.
 * Returns a key-value record (e.g. { "background": "oklch(0.97 0.02 225.66)" })
 */
export function extractVariables(blockContent: string): Record<string, string> {
  const vars: Record<string, string> = {};
  const varRegex = /--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
  let match;
  while ((match = varRegex.exec(blockContent)) !== null) {
    const key = match[1].trim();
    const val = match[2].trim();
    vars[key] = val;
  }
  return vars;
}

/**
 * Safely parses custom CSS overrides code block to extract color values for Payload fields.
 */
export function parseCssOverrides(cssCode: string): Record<string, any> {
  const result: Record<string, any> = {};
  if (!cssCode) return result;

  // 1. Extract Light Mode block (:root / html:root)
  const rootMatch = cssCode.match(/(?:html:root|:root)\s*\{([^}]*)\}/i);
  if (rootMatch) {
    const vars = extractVariables(rootMatch[1]);
    Object.entries(vars).forEach(([key, val]) => {
      const camelKey = kebabToCamel(key);
      if (WEBSITE_COLOR_KEYS.includes(camelKey)) {
        try {
          result[camelKey] = normalizeToHex(val);
        } catch (e) {
          // Ignore parse errors
        }
      } else if (key === "radius") {
        const radiusVal = parseFloat(val);
        if (!isNaN(radiusVal)) {
          result.radius = radiusVal;
        }
      }
    });
  }

  // 2. Extract Dark Mode block (.dark / html.dark)
  const darkMatch = cssCode.match(/(?:\.dark|html\.dark|\[data-theme="dark"\])\s*\{([^}]*)\}/i);
  if (darkMatch) {
    const vars = extractVariables(darkMatch[1]);
    Object.entries(vars).forEach(([key, val]) => {
      const camelKey = kebabToCamel(key);
      if (WEBSITE_COLOR_KEYS.includes(camelKey)) {
        try {
          result[`${camelKey}Dark`] = normalizeToHex(val);
        } catch (e) {
          // Ignore parse errors
        }
      }
    });
  }

  return result;
}

/**
 * Updates variables inside a specific selector block in a CSS code string.
 * Preserves comments, ordering, formatting, and other selectors.
 */
export function updateBlockVariables(
  cssCode: string,
  selectorPattern: RegExp,
  selectorName: string,
  variablesToUpdate: Record<string, string>
): string {
  const match = cssCode.match(selectorPattern);

  if (match) {
    let blockContent = match[1];

    Object.entries(variablesToUpdate).forEach(([key, val]) => {
      const varRegex = new RegExp(`(--${key}\\s*:\\s*)[^;]+(;)` , 'i');
      if (blockContent.match(varRegex)) {
        // Variable already exists, replace value
        blockContent = blockContent.replace(varRegex, `$1${val}$2`);
      } else {
        // Append missing variable
        blockContent = blockContent.trimEnd();
        if (blockContent && !blockContent.endsWith(";")) {
          blockContent += ";";
        }
        blockContent += `\n  --${key}: ${val};`;
      }
    });

    const fullMatch = match[0];
    const newBlock = `${selectorName} {${blockContent}\n}`;
    return cssCode.replace(fullMatch, newBlock);
  } else {
    // Selector block does not exist, append a fresh one
    let newBlock = `\n\n${selectorName} {\n`;
    Object.entries(variablesToUpdate).forEach(([key, val]) => {
      newBlock += `  --${key}: ${val};\n`;
    });
    newBlock += `}`;
    return cssCode + newBlock;
  }
}

/**
 * Formats a color value to the appropriate representation (Hex or OKLCH) based on a target preference.
 */
export function formatColor(hexValue: string, useOklch: boolean): string {
  if (useOklch) {
    try {
      return hexToOklch(hexValue);
    } catch (e) {
      return hexValue;
    }
  }
  return hexValue;
}

/**
 * Updates a CSS overrides custom code block using the individual fields from a Payload form.
 */
export function updateCssOverrides(cssCode: string, fields: Record<string, any>): string {
  let updatedCode = cssCode || `/* Chambers Custom Theme Overrides */`;

  const useOklch = updatedCode.toLowerCase().includes("oklch");

  // Compile light mode variables
  const lightVars: Record<string, string> = {};
  WEBSITE_COLOR_KEYS.forEach((key) => {
    const val = fields[key];
    if (val && typeof val === "string") {
      lightVars[camelToKebab(key)] = formatColor(val, useOklch);
    }
  });

  if (typeof fields.radius === "number") {
    lightVars["radius"] = `${fields.radius}rem`;
  } else if (typeof fields.radius === "string" && fields.radius) {
    lightVars["radius"] = fields.radius.endsWith("rem") ? fields.radius : `${fields.radius}rem`;
  }

  // Compile dark mode variables
  const darkVars: Record<string, string> = {};
  WEBSITE_COLOR_KEYS.forEach((key) => {
    const val = fields[`${key}Dark`] || fields[key];
    if (val && typeof val === "string") {
      darkVars[camelToKebab(key)] = formatColor(val, useOklch);
    }
  });

  // Write variables inside blocks
  updatedCode = updateBlockVariables(updatedCode, /(?:html:root|:root)\s*\{([^}]*)\}/i, ":root", lightVars);
  updatedCode = updateBlockVariables(updatedCode, /(?:\.dark|html\.dark|\[data-theme="dark"\])\s*\{([^}]*)\}/i, ".dark", darkVars);

  return updatedCode;
}
