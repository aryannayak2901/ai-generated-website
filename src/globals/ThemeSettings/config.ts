import type { GlobalConfig } from "payload";
import { syncThemeBeforeChange, syncThemeAfterChange } from "./hooks/syncTheme";
import revalidateTheme from "./hooks/revalidateTheme";

export const ThemeSettings: GlobalConfig = {
  slug: "theme-settings",
  label: "Theme Settings",
  admin: {
    group: "Settings",
  },
  access: {
    read: () => true, // Allowed for storefront loading
    update: ({ req }) => !!req.user, // Allowed only for logged-in users
  },
  hooks: {
    beforeChange: [syncThemeBeforeChange],
    afterChange: [syncThemeAfterChange, revalidateTheme],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "General Settings",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "preset",
                  label: "Theme Preset Selector",
                  type: "select",
                  defaultValue: "chambersClassic",
                  required: true,
                  options: [
                    {
                      label: "Chambers Classic (Deep Navy & Gold)",
                      value: "chambersClassic",
                    },
                    {
                      label: "Slate Minimalist (Stark Charcoal)",
                      value: "slateMinimalist",
                    },
                    {
                      label: "Emerald Editorial (Green & Gold)",
                      value: "emeraldEditorial",
                    },
                    {
                      label: "Amber Executive (Slate & Amber)",
                      value: "amberExecutive",
                    },
                    {
                      label: "Crimson Court (Burgundy & Brass)",
                      value: "crimsonCourt",
                    },
                    {
                      label: "Royal Bar (Royal Blue & Gold)",
                      value: "royalBar",
                    },
                    {
                      label: "Midnight Executive (Midnight & Silver)",
                      value: "midnightExecutive",
                    },
                    {
                      label: "Bronze Brief (Earthy Bronze & Brass)",
                      value: "bronzeBrief",
                    },
                    {
                      label: "Forest Fiducia (Forest Green & Slate)",
                      value: "forestFiducia",
                    },
                    {
                      label: "Sapphire Solace (Sapphire & Silver)",
                      value: "sapphireSolace",
                    },
                    {
                      label: "Platinum Prestige (Platinum & Charcoal)",
                      value: "platinumPrestige",
                    },
                    {
                      label: "Terracotta Tribunal (Terracotta & Charcoal)",
                      value: "terracottaTribunal",
                    },
                    {
                      label: "Oxford Obiter (Oxford Blue & Gold)",
                      value: "oxfordObiter",
                    },
                    {
                      label: "Teak Trustee (Teak Wood & Bronze)",
                      value: "teakTrustee",
                    },
                    {
                      label: "Custom Theme (Manual Tweaking)",
                      value: "custom",
                    },
                  ],
                  admin: {
                    width: "50%",
                    description:
                      "Selecting a preset automatically populates colors. Modifying colors will switch it to Custom.",
                  },
                },
                {
                  name: "mode",
                  label: "Theme Mode Selection",
                  type: "select",
                  defaultValue: "system",
                  required: true,
                  options: [
                    {
                      label: "Sync with User System Preferences",
                      value: "system",
                    },
                    { label: "Enforce Light Theme globally", value: "light" },
                    { label: "Enforce Dark Theme globally", value: "dark" },
                  ],
                  admin: {
                    width: "50%",
                    description:
                      "Controls the active mode of both storefront and admin panel.",
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "radius",
                  label: "Website Corner Radius (rem)",
                  type: "number",
                  defaultValue: 0.5,
                  required: true,
                  admin: {
                    width: "50%",
                    description:
                      "Controls button, card, and input border radius on website.",
                  },
                },
                {
                  name: "adminRadius",
                  label: "Admin Corner Radius (rem)",
                  type: "number",
                  defaultValue: 0.375,
                  required: true,
                  admin: {
                    width: "50%",
                    description:
                      "Controls button, modal, and card border radius in admin.",
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "headingFont",
                  label: "Website Heading Font (Google Fonts)",
                  type: "text",
                  defaultValue: "Playfair Display",
                  required: true,
                  admin: {
                    width: "50%",
                    description:
                      "Google Font name for all headings (h1, h2, h3, etc.).",
                  },
                },
                {
                  name: "bodyFont",
                  label: "Website Body Font (Google Fonts)",
                  type: "text",
                  defaultValue: "Public Sans",
                  required: true,
                  admin: {
                    width: "50%",
                    description:
                      "Google Font name for base reading text and elements.",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Website Colors",
          fields: [
            // We group light colors side-by-side with their corresponding dark mode overrides in rows.
            {
              type: "row",
              fields: [
                {
                  name: "background",
                  label: "Base Background (Light)",
                  type: "text",
                  defaultValue: "#ffffff",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
                {
                  name: "backgroundDark",
                  label: "Base Background (Dark Override)",
                  type: "text",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "foreground",
                  label: "Base Text Color (Light)",
                  type: "text",
                  defaultValue: "#1e293b",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
                {
                  name: "foregroundDark",
                  label: "Base Text Color (Dark Override)",
                  type: "text",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "primary",
                  label: "Primary Brand Color (Light)",
                  type: "text",
                  defaultValue: "#0f1729",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
                {
                  name: "primaryDark",
                  label: "Primary Brand Color (Dark Override)",
                  type: "text",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "primaryForeground",
                  label: "Text on Primary Color (Light)",
                  type: "text",
                  defaultValue: "#ffffff",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
                {
                  name: "primaryForegroundDark",
                  label: "Text on Primary Color (Dark Override)",
                  type: "text",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "secondary",
                  label: "Secondary Surface (Light)",
                  type: "text",
                  defaultValue: "#f8fafc",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
                {
                  name: "secondaryDark",
                  label: "Secondary Surface (Dark Override)",
                  type: "text",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "secondaryForeground",
                  label: "Text on Secondary (Light)",
                  type: "text",
                  defaultValue: "#0f1729",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
                {
                  name: "secondaryForegroundDark",
                  label: "Text on Secondary (Dark Override)",
                  type: "text",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "card",
                  label: "Card/Panel Background (Light)",
                  type: "text",
                  defaultValue: "#ffffff",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
                {
                  name: "cardDark",
                  label: "Card/Panel Background (Dark Override)",
                  type: "text",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "cardForeground",
                  label: "Card Text Color (Light)",
                  type: "text",
                  defaultValue: "#1e293b",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
                {
                  name: "cardForegroundDark",
                  label: "Card Text Color (Dark Override)",
                  type: "text",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "popover",
                  label: "Popover/Popup Surface (Light)",
                  type: "text",
                  defaultValue: "#ffffff",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
                {
                  name: "popoverDark",
                  label: "Popover/Popup Surface (Dark Override)",
                  type: "text",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "popoverForeground",
                  label: "Popover Text Color (Light)",
                  type: "text",
                  defaultValue: "#1e293b",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
                {
                  name: "popoverForegroundDark",
                  label: "Popover Text Color (Dark Override)",
                  type: "text",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "muted",
                  label: "Muted Component Fill (Light)",
                  type: "text",
                  defaultValue: "#f1f5f9",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
                {
                  name: "mutedDark",
                  label: "Muted Component Fill (Dark Override)",
                  type: "text",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "mutedForeground",
                  label: "Muted Text Color (Light)",
                  type: "text",
                  defaultValue: "#64748b",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
                {
                  name: "mutedForegroundDark",
                  label: "Muted Text Color (Dark Override)",
                  type: "text",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "accent",
                  label: "Accent Accent/Highlight (Light)",
                  type: "text",
                  defaultValue: "#d4af37",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
                {
                  name: "accentDark",
                  label: "Accent Accent/Highlight (Dark Override)",
                  type: "text",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "accentForeground",
                  label: "Text on Accent Color (Light)",
                  type: "text",
                  defaultValue: "#ffffff",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
                {
                  name: "accentForegroundDark",
                  label: "Text on Accent Color (Dark Override)",
                  type: "text",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "destructive",
                  label: "Destructive Action (Light)",
                  type: "text",
                  defaultValue: "#ef4444",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
                {
                  name: "destructiveDark",
                  label: "Destructive Action (Dark Override)",
                  type: "text",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "destructiveForeground",
                  label: "Text on Destructive (Light)",
                  type: "text",
                  defaultValue: "#ffffff",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
                {
                  name: "destructiveForegroundDark",
                  label: "Text on Destructive (Dark Override)",
                  type: "text",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "border",
                  label: "Separators/Borders Color (Light)",
                  type: "text",
                  defaultValue: "#e2e8f0",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
                {
                  name: "borderDark",
                  label: "Separators/Borders Color (Dark Override)",
                  type: "text",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "input",
                  label: "Form Input Border Color (Light)",
                  type: "text",
                  defaultValue: "#e2e8f0",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
                {
                  name: "inputDark",
                  label: "Form Input Border Color (Dark Override)",
                  type: "text",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "ring",
                  label: "Focus Ring Halo Color (Light)",
                  type: "text",
                  defaultValue: "#d4af37",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
                {
                  name: "ringDark",
                  label: "Focus Ring Halo Color (Dark Override)",
                  type: "text",
                  admin: {
                    width: "50%",
                    components: {
                      Field:
                        "@/components/Theme/ColorPickerField#ColorPickerField",
                    },
                  },
                },
              ],
            },
          ],
        },
        // {
        //   label: "Admin Panel Colors",
        //   fields: [
        //     // Overrides for Payload CMS Admin UI
        //     {
        //       type: "row",
        //       fields: [
        //         {
        //           name: "adminBg",
        //           label: "CMS Main Background (Light)",
        //           type: "text",
        //           defaultValue: "#ffffff",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //         {
        //           name: "adminBgDark",
        //           label: "CMS Main Background (Dark Override)",
        //           type: "text",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       type: "row",
        //       fields: [
        //         {
        //           name: "adminFg",
        //           label: "CMS Primary Text Color (Light)",
        //           type: "text",
        //           defaultValue: "#0f1729",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //         {
        //           name: "adminFgDark",
        //           label: "CMS Primary Text Color (Dark Override)",
        //           type: "text",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       type: "row",
        //       fields: [
        //         {
        //           name: "adminPrimary",
        //           label: "CMS Primary Action Brand Color (Light)",
        //           type: "text",
        //           defaultValue: "#0f1729",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //         {
        //           name: "adminPrimaryDark",
        //           label: "CMS Primary Action Brand Color (Dark Override)",
        //           type: "text",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       type: "row",
        //       fields: [
        //         {
        //           name: "adminPrimaryFg",
        //           label: "CMS Text on Buttons (Light)",
        //           type: "text",
        //           defaultValue: "#ffffff",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //         {
        //           name: "adminPrimaryFgDark",
        //           label: "CMS Text on Buttons (Dark Override)",
        //           type: "text",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       type: "row",
        //       fields: [
        //         {
        //           name: "adminSecondary",
        //           label: "CMS Sidebar/Header Surface (Light)",
        //           type: "text",
        //           defaultValue: "#f8fafc",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //         {
        //           name: "adminSecondaryDark",
        //           label: "CMS Sidebar/Header Surface (Dark Override)",
        //           type: "text",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       type: "row",
        //       fields: [
        //         {
        //           name: "adminSecondaryFg",
        //           label: "CMS Sidebar Text Color (Light)",
        //           type: "text",
        //           defaultValue: "#0f1729",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //         {
        //           name: "adminSecondaryFgDark",
        //           label: "CMS Sidebar Text Color (Dark Override)",
        //           type: "text",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       type: "row",
        //       fields: [
        //         {
        //           name: "adminSurface",
        //           label: "CMS Card/Panel Surface (Light)",
        //           type: "text",
        //           defaultValue: "#ffffff",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //         {
        //           name: "adminSurfaceDark",
        //           label: "CMS Card/Panel Surface (Dark Override)",
        //           type: "text",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       type: "row",
        //       fields: [
        //         {
        //           name: "adminSurfaceFg",
        //           label: "CMS Text inside Cards (Light)",
        //           type: "text",
        //           defaultValue: "#0f1729",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //         {
        //           name: "adminSurfaceFgDark",
        //           label: "CMS Text inside Cards (Dark Override)",
        //           type: "text",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       type: "row",
        //       fields: [
        //         {
        //           name: "adminAccent",
        //           label: "CMS Selected Input/Focus Ring (Light)",
        //           type: "text",
        //           defaultValue: "#d4af37",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //         {
        //           name: "adminAccentDark",
        //           label: "CMS Selected Input/Focus Ring (Dark Override)",
        //           type: "text",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       type: "row",
        //       fields: [
        //         {
        //           name: "adminAccentFg",
        //           label: "CMS Accent Elements Text (Light)",
        //           type: "text",
        //           defaultValue: "#ffffff",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //         {
        //           name: "adminAccentFgDark",
        //           label: "CMS Accent Elements Text (Dark Override)",
        //           type: "text",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       type: "row",
        //       fields: [
        //         {
        //           name: "adminBorder",
        //           label: "CMS Lines/Borders Color (Light)",
        //           type: "text",
        //           defaultValue: "#e2e8f0",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //         {
        //           name: "adminBorderDark",
        //           label: "CMS Lines/Borders Color (Dark Override)",
        //           type: "text",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       type: "row",
        //       fields: [
        //         {
        //           name: "adminMuted",
        //           label: "CMS Disabled/Muted Labels (Light)",
        //           type: "text",
        //           defaultValue: "#64748b",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //         {
        //           name: "adminMutedDark",
        //           label: "CMS Disabled/Muted Labels (Dark Override)",
        //           type: "text",
        //           admin: {
        //             width: "50%",
        //             components: {
        //               Field:
        //                 "@/components/Theme/ColorPickerField#ColorPickerField",
        //             },
        //           },
        //         },
        //       ],
        //     },
        //   ],
        // },
        {
          label: "Theme Preview",
          fields: [
            {
              name: "themePreview",
              type: "ui",
              admin: {
                components: {
                  Field: "@/components/Theme/ThemePlayground#ThemePlayground",
                },
              },
            },
          ],
        },
        {
          label: "CSS Overrides",
          fields: [
            {
              name: "cssOverrides",
              label: "Website CSS Custom Code",
              type: "code",
              defaultValue: "",
              admin: {
                language: "css",
                description:
                  "Advanced styling variables and layout modifications for website pages.",
              },
            },
            // {
            //   name: "adminCSSOverrides",
            //   label: "CMS Admin Custom CSS Overrides",
            //   type: "code",
            //   defaultValue: "",
            //   admin: {
            //     language: "css",
            //     description: "Custom style overrides to modify the Payload CMS admin interface appearance.",
            //   },
            // },
          ],
        },
      ],
    },
  ],
};

export default ThemeSettings;
