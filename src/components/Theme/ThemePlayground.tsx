"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "@payloadcms/ui";
import { motion } from "framer-motion";
import { 
  Globe, 
  Settings, 
  Moon, 
  Sun, 
  Smartphone, 
  Laptop,
  CheckCircle,
  FolderLock,
  UserCheck,
  Search,
  BookOpen
} from "lucide-react";

// Standard default fallbacks so preview doesn't break
const DEFAULT_PREVIEW_COLORS: Record<string, string> = {
  // Website
  background: "#ffffff",
  foreground: "#1e293b",
  primary: "#0f1729",
  primaryForeground: "#ffffff",
  secondary: "#f8fafc",
  secondaryForeground: "#0f1729",
  card: "#ffffff",
  cardForeground: "#1e293b",
  accent: "#d4af37",
  accentForeground: "#ffffff",
  border: "#e2e8f0",
  // Admin
  adminBg: "#ffffff",
  adminFg: "#0f1729",
  adminPrimary: "#0f1729",
  adminPrimaryFg: "#ffffff",
  adminSecondary: "#f8fafc",
  adminSecondaryFg: "#0f1729",
  adminSurface: "#ffffff",
  adminSurfaceFg: "#0f1729",
  adminAccent: "#d4af37",
  adminAccentFg: "#ffffff",
  adminBorder: "#e2e8f0",
  adminMuted: "#64748b",
};

export const ThemePlayground: React.FC = () => {
  const form = useForm();
  const [activeTab, setActiveTab] = useState<"website" | "admin">("website");
  const [viewportSize, setViewportSize] = useState<"desktop" | "mobile">("desktop");
  const [previewDarkMode, setPreviewDarkMode] = useState<boolean>(false);

  // Read form data dynamically in real time
  const formData = useMemo(() => {
    if (form && typeof form.getData === "function") {
      return form.getData();
    }
    return {};
  }, [form]);

  // Merge form state colors with fallbacks
  const getThemeValue = (key: string, isDark: boolean): string => {
    // If system dark mode preview is active, look for dark variants
    if (isDark) {
      // Look for Dark variant fields in formData (e.g. backgroundDark, adminBgDark)
      const darkKey = key.includes("admin") 
        ? key.replace(/Color$/, "DarkColor").replace(/Bg$/, "BgDark").replace(/Fg$/, "FgDark").replace(/Primary$/, "PrimaryDark").replace(/Secondary$/, "SecondaryDark").replace(/Surface$/, "SurfaceDark").replace(/Accent$/, "AccentDark").replace(/Border$/, "BorderDark").replace(/Muted$/, "MutedDark")
        : `${key}Dark`; // e.g. backgroundDark, primaryDark, etc. Wait, let's map them perfectly.
      
      const customDarkKey = {
        background: "backgroundDark",
        foreground: "foregroundDark",
        primary: "primaryDark",
        primaryForeground: "primaryForegroundDark",
        secondary: "secondaryDark",
        secondaryForeground: "secondaryForegroundDark",
        card: "cardDark",
        cardForeground: "cardForegroundDark",
        accent: "accentDark",
        accentForeground: "accentForegroundDark",
        border: "borderDark",
        // Admin mappings
        adminBg: "adminBgDark",
        adminFg: "adminFgDark",
        adminPrimary: "adminPrimaryDark",
        adminPrimaryFg: "adminPrimaryFgDark",
        adminSecondary: "adminSecondaryDark",
        adminSecondaryFg: "adminSecondaryFgDark",
        adminSurface: "adminSurfaceDark",
        adminSurfaceFg: "adminSurfaceFgDark",
        adminAccent: "adminAccentDark",
        adminAccentFg: "adminAccentFgDark",
        adminBorder: "adminBorderDark",
        adminMuted: "adminMutedDark",
      }[key] || darkKey;

      if (formData[customDarkKey]) {
        return formData[customDarkKey] as string;
      }
    }

    // Default to light color from form data or fallback
    return (formData[key] as string) || DEFAULT_PREVIEW_COLORS[key] || "#ffffff";
  };

  // Get active settings
  const themeMode = formData.mode || "light";
  const webRadius = typeof formData.radius === "number" ? formData.radius : 0.5;
  const adminRadius = typeof formData.adminRadius === "number" ? formData.adminRadius : 0.375;
  
  // Dynamic fonts
  const headingFont = formData.headingFont || "Playfair Display";
  const bodyFont = formData.bodyFont || "Public Sans";

  // Resolve current active theme mode
  const resolvedDarkMode = themeMode === "dark" || (themeMode === "system" && previewDarkMode);

  // Extract variables for Website mockup
  const webBackground = getThemeValue("background", resolvedDarkMode);
  const webForeground = getThemeValue("foreground", resolvedDarkMode);
  const webPrimary = getThemeValue("primary", resolvedDarkMode);
  const webPrimaryForeground = getThemeValue("primaryForeground", resolvedDarkMode);
  const webSecondary = getThemeValue("secondary", resolvedDarkMode);
  const webSecondaryForeground = getThemeValue("secondaryForeground", resolvedDarkMode);
  const webCard = getThemeValue("card", resolvedDarkMode);
  const webCardForeground = getThemeValue("cardForeground", resolvedDarkMode);
  const webAccent = getThemeValue("accent", resolvedDarkMode);
  const webBorder = getThemeValue("border", resolvedDarkMode);

  // Extract variables for Admin mockup
  const admBg = getThemeValue("adminBg", resolvedDarkMode);
  const admFg = getThemeValue("adminFg", resolvedDarkMode);
  const admPrimary = getThemeValue("adminPrimary", resolvedDarkMode);
  const admPrimaryFg = getThemeValue("adminPrimaryFg", resolvedDarkMode);
  const admSecondary = getThemeValue("adminSecondary", resolvedDarkMode);
  const admSurface = getThemeValue("adminSurface", resolvedDarkMode);
  const admSurfaceFg = getThemeValue("adminSurfaceFg", resolvedDarkMode);
  const admBorder = getThemeValue("adminBorder", resolvedDarkMode);
  const admMuted = getThemeValue("adminMuted", resolvedDarkMode);

  return (
    <div 
      className="theme-playground-dashboard"
      style={{
        marginTop: "24px",
        marginBottom: "32px",
        background: "#0f172a",
        borderRadius: "12px",
        border: "1px solid rgba(212, 175, 55, 0.25)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
        overflow: "hidden",
        color: "#f1f5f9",
        fontFamily: "'Public Sans', sans-serif"
      }}
    >
      {/* Dynamic Font Loader (Loads Google Fonts live in the preview) */}
      <link 
        rel="stylesheet" 
        href={`https://fonts.googleapis.com/css2?family=${headingFont.replace(/ /g, "+")}:wght@400;600;700&family=${bodyFont.replace(/ /g, "+")}:wght@400;500;600&display=swap`} 
      />

      {/* Control Header Bar */}
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.03)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "16px 24px",
          flexWrap: "wrap",
          gap: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>⚖️</span>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", fontFamily: "Playfair Display, serif", color: "#ffffff" }}>
              Theme Preview Studio
            </h3>
            <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#94a3b8" }}>
              Real-time brand layout simulation before saving
            </p>
          </div>
        </div>

        {/* View Selection Tabs */}
        <div style={{ display: "flex", gap: "6px", background: "rgba(0,0,0,0.2)", padding: "4px", borderRadius: "6px" }}>
          <button
            type="button"
            onClick={() => setActiveTab("website")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: activeTab === "website" ? "#d4af37" : "transparent",
              color: activeTab === "website" ? "#0f1729" : "#94a3b8",
              border: "none",
              padding: "6px 14px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <Globe size={13} /> Frontend Website
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("admin")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: activeTab === "admin" ? "#d4af37" : "transparent",
              color: activeTab === "admin" ? "#0f1729" : "#94a3b8",
              border: "none",
              padding: "6px 14px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <Settings size={13} /> Admin CMS Panel
          </button>
        </div>

        {/* Mockup Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Viewport size switcher */}
          <div style={{ display: "flex", gap: "4px", background: "rgba(0,0,0,0.2)", padding: "3px", borderRadius: "6px" }}>
            <button
              type="button"
              onClick={() => setViewportSize("desktop")}
              style={{
                background: viewportSize === "desktop" ? "rgba(255,255,255,0.08)" : "transparent",
                color: viewportSize === "desktop" ? "#ffffff" : "#64748b",
                border: "none",
                padding: "4px 8px",
                borderRadius: "4px",
                cursor: "pointer"
              }}
              title="Simulate Laptop"
            >
              <Laptop size={14} />
            </button>
            <button
              type="button"
              onClick={() => setViewportSize("mobile")}
              style={{
                background: viewportSize === "mobile" ? "rgba(255,255,255,0.08)" : "transparent",
                color: viewportSize === "mobile" ? "#ffffff" : "#64748b",
                border: "none",
                padding: "4px 8px",
                borderRadius: "4px",
                cursor: "pointer"
              }}
              title="Simulate Mobile"
            >
              <Smartphone size={14} />
            </button>
          </div>

          {/* Dark mode override */}
          {themeMode === "system" ? (
            <button
              type="button"
              onClick={() => setPreviewDarkMode(!previewDarkMode)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#cbd5e1",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "11px",
                cursor: "pointer"
              }}
            >
              {previewDarkMode ? <Sun size={12} className="text-amber-400" /> : <Moon size={12} />}
              <span>System: {previewDarkMode ? "Dark" : "Light"}</span>
            </button>
          ) : (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              color: "#64748b",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "11px"
            }}>
              {resolvedDarkMode ? <Moon size={12} /> : <Sun size={12} />}
              <span style={{ textTransform: "capitalize" }}>Mode: {themeMode}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div 
        className="canvas-container"
        style={{
          padding: "24px",
          background: "#090d16",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "420px"
        }}
      >
        <motion.div
          layout
          style={{
            width: viewportSize === "desktop" ? "100%" : "375px",
            maxWidth: "920px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "8px",
            overflow: "hidden",
            transition: "width 0.4s ease"
          }}
        >
          {activeTab === "website" ? (
            /* ====================================================
               MOCKUP: WEBSITE FRONTEND
               ==================================================== */
            <div
              style={{
                background: webBackground,
                color: webForeground,
                fontFamily: bodyFont,
                paddingBottom: "32px",
                textAlign: "left"
              }}
            >
              {/* Top Banner Accent */}
              <div style={{ background: webAccent, height: "4px" }} />

              {/* Website Navigation Header */}
              <div 
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 24px",
                  borderBottom: `1px solid ${webBorder}`,
                }}
              >
                <div style={{ fontFamily: headingFont, fontWeight: "bold", fontSize: "18px", color: webForeground, display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: webAccent }}>⚖️</span> Chambers
                </div>
                <div style={{ display: "flex", gap: "16px", fontSize: "13px", fontWeight: "500", color: webForeground, opacity: 0.8 }}>
                  <span>Practice Areas</span>
                  <span>Our Attorneys</span>
                  <span>Insights</span>
                </div>
                <button
                  type="button"
                  style={{
                    background: "transparent",
                    color: webAccent,
                    border: `1.5px solid ${webAccent}`,
                    borderRadius: `${webRadius}rem`,
                    padding: "6px 14px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Consultation
                </button>
              </div>

              {/* Hero Block */}
              <div style={{ padding: "40px 24px 32px 24px", textAlign: "center", maxWidth: "680px", margin: "0 auto" }}>
                <h1 
                  style={{
                    fontFamily: headingFont,
                    fontSize: viewportSize === "desktop" ? "32px" : "24px",
                    fontWeight: "700",
                    color: webForeground,
                    lineHeight: "1.2",
                    marginBottom: "14px"
                  }}
                >
                  Uncompromising Legal Advocacy
                </h1>
                <p style={{ fontSize: "14px", color: webForeground, opacity: 0.75, lineHeight: "1.6", marginBottom: "20px" }}>
                  Chambers of Jeet Bhatt blends prestigious advocacy traditions with contemporary strategic precision, defending your commercial interest with rigor and distinction.
                </p>

                {/* Primary CTA */}
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  <button
                    type="button"
                    style={{
                      background: webPrimary,
                      color: webPrimaryForeground,
                      border: "none",
                      borderRadius: `${webRadius}rem`,
                      padding: "10px 20px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                    }}
                  >
                    Retain Counsel
                  </button>
                  <button
                    type="button"
                    style={{
                      background: webSecondary,
                      color: webSecondaryForeground,
                      border: `1px solid ${webBorder}`,
                      borderRadius: `${webRadius}rem`,
                      padding: "10px 20px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    Read Journal
                  </button>
                </div>
              </div>

              {/* Showcase Bento Grid */}
              <div 
                style={{
                  display: "grid",
                  gridTemplateColumns: viewportSize === "desktop" ? "repeat(3, 1fr)" : "1fr",
                  gap: "16px",
                  padding: "0 24px"
                }}
              >
                {/* Practice Card 1 */}
                <div 
                  style={{
                    background: webCard,
                    border: `1px solid ${webBorder}`,
                    borderRadius: `${webRadius}rem`,
                    padding: "20px",
                    color: webCardForeground,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                  }}
                >
                  <div style={{ background: `rgba(${webAccent.startsWith("#") ? "212,175,55" : "255,255,255"}, 0.1)`, width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", color: webAccent }}>
                    <FolderLock size={15} />
                  </div>
                  <h4 style={{ fontFamily: headingFont, fontWeight: "600", fontSize: "15px", margin: "0 0 6px 0", color: webCardForeground }}>
                    Arbitration & Suits
                  </h4>
                  <p style={{ fontSize: "12px", color: webCardForeground, opacity: 0.7, margin: 0, lineHeight: "1.5" }}>
                    Expert representation in high-stakes corporate disputes, international arbitration, and appeals.
                  </p>
                </div>

                {/* Practice Card 2 */}
                <div 
                  style={{
                    background: webCard,
                    border: `1px solid ${webBorder}`,
                    borderRadius: `${webRadius}rem`,
                    padding: "20px",
                    color: webCardForeground,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                  }}
                >
                  <div style={{ background: `rgba(${webAccent.startsWith("#") ? "212,175,55" : "255,255,255"}, 0.1)`, width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", color: webAccent }}>
                    <UserCheck size={15} />
                  </div>
                  <h4 style={{ fontFamily: headingFont, fontWeight: "600", fontSize: "15px", margin: "0 0 6px 0", color: webCardForeground }}>
                    Corporate Counsel
                  </h4>
                  <p style={{ fontSize: "12px", color: webCardForeground, opacity: 0.7, margin: 0, lineHeight: "1.5" }}>
                    Guiding multi-jurisdictional acquisitions, private equity, and board-level risk management.
                  </p>
                </div>

                {/* Practice Card 3 */}
                <div 
                  style={{
                    background: webCard,
                    border: `1px solid ${webBorder}`,
                    borderRadius: `${webRadius}rem`,
                    padding: "20px",
                    color: webCardForeground,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                  }}
                >
                  <div style={{ background: `rgba(${webAccent.startsWith("#") ? "212,175,55" : "255,255,255"}, 0.1)`, width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", color: webAccent }}>
                    <BookOpen size={15} />
                  </div>
                  <h4 style={{ fontFamily: headingFont, fontWeight: "600", fontSize: "15px", margin: "0 0 6px 0", color: webCardForeground }}>
                    Advisory Opinions
                  </h4>
                  <p style={{ fontSize: "12px", color: webCardForeground, opacity: 0.7, margin: 0, lineHeight: "1.5" }}>
                    Strategic regulatory synthesis, compliance auditing, and constitutional litigation briefs.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* ====================================================
               MOCKUP: ADMIN CMS PANEL
               ==================================================== */
            <div
              style={{
                background: admBg,
                color: admFg,
                fontFamily: bodyFont,
                display: "flex",
                minHeight: "340px",
                textAlign: "left"
              }}
            >
              {/* Sidebar navigation wrapper */}
              <div 
                style={{
                  width: viewportSize === "desktop" ? "200px" : "60px",
                  background: admSecondary,
                  borderRight: `1px solid ${admBorder}`,
                  padding: "16px 12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  flexShrink: 0
                }}
              >
                {/* Admin Logo branding */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 8px" }}>
                  <div style={{ background: admPrimary, color: admPrimaryFg, width: "24px", height: "24px", borderRadius: "4px", display: "flex", alignItems: "center", fontWeight: "bold", fontSize: "12px", justifyContent: "center" }}>J</div>
                  {viewportSize === "desktop" && (
                    <span style={{ fontWeight: "700", fontSize: "12px", color: admFg, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Chambers Admin
                    </span>
                  )}
                </div>

                {/* Sidebar links simulated */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "12px" }}>
                  {["Collections", "Globals", "Theme Settings", "GA4 Analytics", "Media Assets"].map((link, idx) => {
                    const isSelected = link === "Theme Settings";
                    return (
                      <div
                        key={idx}
                        style={{
                          background: isSelected ? `rgba(${admPrimary.startsWith("#") ? "37,99,235" : "255,255,255"}, 0.08)` : "transparent",
                          color: isSelected ? admPrimary : admFg,
                          padding: "8px 12px",
                          borderRadius: `${adminRadius}rem`,
                          fontSize: "12px",
                          fontWeight: isSelected ? "600" : "500",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          opacity: isSelected ? 1 : 0.75
                        }}
                      >
                        <span style={{ fontSize: "12px" }}>{["📂", "🌐", "🎨", "📊", "🖼️"][idx]}</span>
                        {viewportSize === "desktop" && <span>{link}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Main content body panel */}
              <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                {/* Header */}
                <div 
                  style={{
                    height: "50px",
                    borderBottom: `1px solid ${admBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 20px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "200px" }}>
                    <Search size={12} style={{ color: admMuted }} />
                    <input 
                      type="text" 
                      placeholder="Search admin..." 
                      disabled
                      style={{ background: "transparent", border: "none", fontSize: "11px", color: admFg, outline: "none", width: "100%" }}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: admPrimary, color: admPrimaryFg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "bold" }}>A</div>
                  </div>
                </div>

                {/* Sub-body content workspace */}
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Breadcrumb & Title */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "10px", color: admMuted, textTransform: "uppercase" }}>Globals &gt; Settings</div>
                      <h2 style={{ fontFamily: headingFont, fontSize: "18px", fontWeight: "700", color: admFg, margin: "2px 0 0 0" }}>
                        Theme Settings
                      </h2>
                    </div>

                    <button
                      type="button"
                      style={{
                        background: admPrimary,
                        color: admPrimaryFg,
                        border: "none",
                        borderRadius: `${adminRadius}rem`,
                        padding: "6px 14px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      Save Settings
                    </button>
                  </div>

                  {/* Surface Card Component */}
                  <div 
                    style={{
                      background: admSurface,
                      border: `1px solid ${admBorder}`,
                      borderRadius: `${adminRadius}rem`,
                      padding: "16px",
                      color: admSurfaceFg
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: `1px solid ${admBorder}`, paddingBottom: "10px", marginBottom: "12px" }}>
                      <CheckCircle size={14} style={{ color: admPrimary }} />
                      <span style={{ fontWeight: "600", fontSize: "12px" }}>Unified Dynamic Styles Status</span>
                    </div>

                    <p style={{ fontSize: "11px", color: admMuted, margin: "0 0 12px 0", lineHeight: "1.4" }}>
                      Theming constants are successfully mapped to native variables. The server hook compiles dynamic stylesheets in `/public/` on every save.
                    </p>

                    {/* Inputs simulation */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div>
                        <div style={{ fontSize: "10px", fontWeight: "600", color: admFg, marginBottom: "4px" }}>Selected Preset</div>
                        <div style={{ border: `1px solid ${admBorder}`, borderRadius: `${adminRadius}rem`, padding: "6px 10px", fontSize: "11px", display: "flex", justifyContent: "space-between", background: admSecondary }}>
                          <span>Chambers Classic (Gold & Navy)</span>
                          <span style={{ color: admPrimary }}>▼</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ThemePlayground;
