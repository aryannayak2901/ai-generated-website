"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "@payloadcms/ui";
import { Laptop, Smartphone, Menu, ArrowRight, Eye, Check } from "lucide-react";

// Default navigation links to display when no navItems are set
const defaultNavLinks = [
  { label: "Home", link: "/" },
  { label: "About CJB", link: "/about" },
  { label: "Practice Areas", link: "/practice-areas" },
  { label: "Blog", link: "/blog" },
  { label: "Contact", link: "/contact" },
];

export const HeaderPreview: React.FC = () => {
  const form = useForm();
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch live form state from Payload CMS UI Form Context
  const formData = useMemo(() => {
    if (form && typeof form.getData === "function") {
      return form.getData();
    }
    return {};
  }, [form]);

  // Extract form configuration values with safe fallbacks
  const headerStyle = formData.headerStyle || "classic";
  const sticky = formData.sticky !== false; // default to true if undefined
  const showCTA = formData.showCTA !== false; // default to true if undefined
  const ctaLabel = formData.ctaLabel || "Get In Touch";
  
  // Resolve dynamic logo object (could be an ID string, an object populated, or undefined)
  const logoUrl = typeof formData.logo === "object" && formData.logo?.url 
    ? formData.logo.url 
    : null;
  const logoAlt = typeof formData.logo === "object" && formData.logo?.alt 
    ? formData.logo.alt 
    : "Chambers Logo";

  // Resolve navigation items
  const navItems = Array.isArray(formData.navItems) && formData.navItems.length > 0
    ? formData.navItems
    : defaultNavLinks;

  // Resolve layout-specific settings
  const splitSettings = formData.splitSettings || {};
  const leftNavItems = Array.isArray(splitSettings.leftNavItems) && splitSettings.leftNavItems.length > 0 ? splitSettings.leftNavItems : navItems.slice(0, Math.ceil(navItems.length / 2));
  const rightNavItems = Array.isArray(splitSettings.rightNavItems) && splitSettings.rightNavItems.length > 0 ? splitSettings.rightNavItems : navItems.slice(Math.ceil(navItems.length / 2));

  const corporateSettings = formData.corporateSettings || {};
  const contactEmail = corporateSettings.contactEmail || "contact@jeetbhatt.com";
  const contactPhone = corporateSettings.contactPhone || "+91 123 456 7890";

  const sidebarSettings = formData.sidebarSettings || {};
  const drawerPosition = sidebarSettings.drawerPosition || "right";
  const menuLabel = sidebarSettings.menuLabel || "MENU";
  const sidebarNavItems = Array.isArray(sidebarSettings.navItems) && sidebarSettings.navItems.length > 0 ? sidebarSettings.navItems : navItems;

  const megaNavSettings = formData.megaNavSettings || {};
  const megaNavItems = Array.isArray(megaNavSettings.megaNavItems) && megaNavSettings.megaNavItems.length > 0 ? megaNavSettings.megaNavItems : navItems.map((item: any) => ({ ...item, dropdownColumns: [] }));

  // Resolve which nav items to display in the mobile simulator drawer
  const mobileDrawerNavItems = useMemo(() => {
    if (headerStyle === "mega") return megaNavItems;
    if (headerStyle === "sidebar") return sidebarNavItems;
    return navItems;
  }, [headerStyle, megaNavItems, sidebarNavItems, navItems]);

  return (
    <div 
      className="header-preview-container"
      style={{
        marginTop: "20px",
        marginBottom: "32px",
        background: "#0b0f19",
        border: "1px solid rgba(212, 175, 55, 0.25)",
        borderRadius: "12px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
        overflow: "hidden",
        color: "#f8fafc",
        fontFamily: "'Public Sans', sans-serif",
        position: "relative"
      }}
    >
      {/* Dynamic Fonts Injection for High-End Typography */}
      <link 
        rel="stylesheet" 
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Public+Sans:wght@300;400;500;600;700&display=swap" 
      />

      {/* Control Panel / Studio Toolbar */}
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          background: "linear-gradient(to right, #0e1424, #0b0f19)",
          borderBottom: "1px solid rgba(212, 175, 55, 0.15)",
          flexWrap: "wrap",
          gap: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div 
            style={{
              width: "36px",
              height: "36px",
              background: "rgba(212, 175, 55, 0.1)",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              color: "#d4af37"
            }}
          >
            🏛️
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600", fontFamily: "Playfair Display, serif", color: "#ffffff", letterSpacing: "0.5px" }}>
              Live Navigation Studio
            </h4>
            <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}>
              <Eye size={11} style={{ color: "#d4af37" }} /> 
              Theme: <span style={{ textTransform: "capitalize", color: "#d4af37", fontWeight: "600" }}>{headerStyle}</span>
            </p>
          </div>
        </div>

        {/* Action Status Badges & Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", gap: "8px", fontSize: "11px" }} className="hidden sm:flex">
            {sticky && (
              <span style={{ padding: "3px 8px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "4px", display: "flex", alignItems: "center", gap: "4px", fontWeight: "500" }}>
                <Check size={10} /> Sticky Pinned
              </span>
            )}
            {showCTA && (
              <span style={{ padding: "3px 8px", background: "rgba(212, 175, 55, 0.15)", color: "#d4af37", border: "1px solid rgba(212, 175, 55, 0.3)", borderRadius: "4px", display: "flex", alignItems: "center", gap: "4px", fontWeight: "500" }}>
                <Check size={10} /> CTA: {ctaLabel}
              </span>
            )}
          </div>

          {/* Viewport Toggle Buttons */}
          <div style={{ display: "flex", gap: "4px", background: "#060911", padding: "4px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              style={{
                background: viewport === "desktop" ? "linear-gradient(135deg, #1e293b, #0f172a)" : "transparent",
                color: viewport === "desktop" ? "#ffffff" : "#64748b",
                border: viewport === "desktop" ? "1px solid rgba(212, 175, 55, 0.3)" : "1px solid transparent",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "11px",
                fontWeight: "600",
                transition: "all 0.2s ease"
              }}
            >
              <Laptop size={13} style={{ color: viewport === "desktop" ? "#d4af37" : "inherit" }} /> Desktop
            </button>
            <button
              type="button"
              onClick={() => setViewport("mobile")}
              style={{
                background: viewport === "mobile" ? "linear-gradient(135deg, #1e293b, #0f172a)" : "transparent",
                color: viewport === "mobile" ? "#ffffff" : "#64748b",
                border: viewport === "mobile" ? "1px solid rgba(212, 175, 55, 0.3)" : "1px solid transparent",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "11px",
                fontWeight: "600",
                transition: "all 0.2s ease"
              }}
            >
              <Smartphone size={13} style={{ color: viewport === "mobile" ? "#d4af37" : "inherit" }} /> Mobile
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Device Wrapper Canvas */}
      <div 
        style={{
          padding: viewport === "desktop" ? "32px" : "40px 16px",
          background: "#070a13",
          backgroundImage: "radial-gradient(rgba(212, 175, 55, 0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "180px"
        }}
      >
        <div 
          style={{
            width: viewport === "desktop" ? "100%" : "375px",
            maxWidth: "100%",
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8)",
            border: viewport === "mobile" ? "8px solid #1e293b" : "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: viewport === "mobile" ? "36px" : "8px",
            overflow: "hidden",
            position: "relative",
            background: "#090d16",
            aspectRatio: viewport === "mobile" ? "9/16" : "auto",
            height: viewport === "mobile" ? "620px" : "auto"
          }}
        >
          {/* Simulated Mobile Status Bar */}
          {viewport === "mobile" && (
            <div 
              style={{
                background: "#0a0f1d",
                height: "28px",
                padding: "0 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "10px",
                color: "rgba(255, 255, 255, 0.6)",
                fontWeight: "600",
                borderBottom: "1px solid rgba(255, 255, 255, 0.03)"
              }}
            >
              <span>12:00</span>
              <div style={{ display: "flex", gap: "4px" }}>
                <span>📶</span>
                <span>🔋</span>
              </div>
            </div>
          )}

          {/* RENDER SIMULATION */}
          {viewport === "desktop" ? (
            /* =========================================================
               DESKTOP VIEWPORTS (4 Premium Layout Styles)
               ========================================================= */
            <div style={{ background: "#0a0e1a", minHeight: "120px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              
              {/* LAYOUT 1: CHAMBERS CLASSIC (Traditional, Solid, Deep Navy & Gold Line) */}
              {headerStyle === "classic" && (
                <div 
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "18px 32px",
                    background: "#0f1729",
                    borderBottom: "2px solid #d4af37",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
                    transition: "all 0.3s ease"
                  }}
                >
                  {/* Branding Group */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                    {logoUrl ? (
                      <img src={logoUrl} alt={logoAlt} style={{ width: "32px", height: "32px", objectFit: "contain" }} />
                    ) : (
                      <div style={{ background: "linear-gradient(135deg, #d4af37, #aa841c)", color: "#0f1729", width: "32px", height: "32px", borderRadius: "4px", fontWeight: "bold", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Playfair Display, serif shadow-md" }}>
                        JB
                      </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: "700", fontFamily: "Playfair Display, serif", fontSize: "14px", color: "#ffffff", letterSpacing: "0.5px", lineHeight: "1.2" }}>Chambers of Jeet Bhatt</span>
                      <span style={{ fontSize: "8px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#d4af37", fontWeight: "600", marginTop: "1px" }}>Advocates & Solicitors</span>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div style={{ display: "flex", gap: "24px", fontSize: "12px", fontWeight: "500", color: "rgba(248, 250, 252, 0.85)" }}>
                    {navItems.map((item: any, i: number) => (
                      <span key={i} style={{ cursor: "pointer", transition: "color 0.2s ease" }} className="hover-gold-text">
                        {item.label}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  {showCTA && (
                    <div 
                      style={{
                        background: "linear-gradient(135deg, #d4af37, #c5a059)",
                        color: "#0f1729",
                        padding: "8px 18px",
                        fontSize: "11px",
                        fontWeight: "700",
                        borderRadius: "4px",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        boxShadow: "0 4px 10px rgba(212, 175, 55, 0.2)",
                        cursor: "pointer"
                      }}
                    >
                      {ctaLabel}
                    </div>
                  )}
                </div>
              )}

              {/* LAYOUT 2: CENTERED LUXURY (Symmetric, Grandeur, Playfair focus) */}
              {headerStyle === "centered" && (
                <div 
                  style={{ 
                    background: "#0c1322", 
                    borderBottom: "1px solid rgba(212, 175, 55, 0.15)", 
                    padding: "20px 32px 14px 32px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "14px",
                    textAlign: "center"
                  }}
                >
                  {/* Posh Logo Block */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    {logoUrl ? (
                      <img src={logoUrl} alt={logoAlt} style={{ width: "38px", height: "38px", objectFit: "contain", marginBottom: "2px" }} />
                    ) : (
                      <span style={{ color: "#d4af37", fontSize: "20px", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>🏛️</span>
                    )}
                    <span style={{ fontWeight: "700", fontFamily: "Playfair Display, serif", fontSize: "18px", letterSpacing: "0.08em", color: "#ffffff", textTransform: "uppercase" }}>
                      Chambers of Jeet Bhatt
                    </span>
                    <span style={{ fontSize: "9px", color: "#d4af37", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: "600" }}>
                      Advocates & Legal Strategists
                    </span>
                  </div>

                  {/* Navigation Links and CTA Docked underneath */}
                  <div 
                    style={{ 
                      borderTop: "1px solid rgba(212, 175, 55, 0.2)", 
                      width: "100%", 
                      maxWidth: "800px",
                      paddingTop: "12px", 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center"
                    }}
                  >
                    <div style={{ width: "100px" }} /> {/* Balance Spacer */}
                    
                    <div style={{ display: "flex", justifyContent: "center", gap: "28px", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.7)" }}>
                      {navItems.map((item: any, i: number) => (
                        <span key={i} style={{ cursor: "pointer", transition: "color 0.2s" }} className="hover-gold-text">
                          {item.label}
                        </span>
                      ))}
                    </div>

                    {showCTA ? (
                      <div 
                        style={{
                          border: "1px solid #d4af37",
                          background: "rgba(212, 175, 55, 0.05)",
                          color: "#d4af37",
                          padding: "6px 14px",
                          fontSize: "10px",
                          fontWeight: "700",
                          borderRadius: "2px",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          cursor: "pointer"
                        }}
                      >
                        {ctaLabel}
                      </div>
                    ) : (
                      <div style={{ width: "100px" }} />
                    )}
                  </div>
                </div>
              )}

              {/* LAYOUT 3: GLASSMORPHIC FLOAT (Contemporary, Floating Capsule, Soft Shadows) */}
              {headerStyle === "glassmorphic" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "24px 16px", background: "radial-gradient(circle, #0e1424 0%, #070a13 100%)", width: "100%" }}>
                  {/* State 1: At Page Top */}
                  <div>
                    <div style={{ fontSize: "10px", color: "#d4af37", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", paddingLeft: "8px" }}>
                      State 1: At Page Top (Full-width, flat)
                    </div>
                    <div 
                      style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center", 
                        padding: "14px 24px", 
                        background: "rgba(15, 23, 41, 0.85)", 
                        backdropFilter: "blur(12px)", 
                        WebkitBackdropFilter: "blur(12px)", 
                        borderBottom: "1px solid rgba(212, 175, 55, 0.15)",
                        width: "100%"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <span style={{ color: "#d4af37", fontSize: "14px" }}>⚖️</span>
                        <span style={{ fontWeight: "700", fontFamily: "Playfair Display, serif", fontSize: "12px", letterSpacing: "0.05em", color: "#ffffff" }}>JEET BHATT</span>
                      </div>
                      <div style={{ display: "flex", gap: "20px", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255, 255, 255, 0.8)" }}>
                        {navItems.map((item: any, i: number) => (
                          <span key={i} style={{ cursor: "pointer" }}>{item.label}</span>
                        ))}
                      </div>
                      {showCTA && (
                        <div style={{ background: "#d4af37", color: "#0f1729", padding: "6px 16px", fontSize: "10px", fontWeight: "700", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {ctaLabel}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* State 2: On Scroll */}
                  <div>
                    <div style={{ fontSize: "10px", color: "#d4af37", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", paddingLeft: "24px" }}>
                      State 2: On Scroll (Rounded floating pill)
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", padding: "0 16px" }}>
                      <div 
                        style={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          alignItems: "center", 
                          padding: "10px 24px", 
                          background: "rgba(15, 23, 41, 0.9)", 
                          backdropFilter: "blur(16px)", 
                          WebkitBackdropFilter: "blur(16px)", 
                          border: "1px solid rgba(212, 175, 55, 0.25)", 
                          borderRadius: "50px", 
                          width: "100%",
                          boxShadow: "0 12px 36px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.05)"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                          <span style={{ color: "#d4af37", fontSize: "14px" }}>⚖️</span>
                          <span style={{ fontWeight: "700", fontFamily: "Playfair Display, serif", fontSize: "12px", letterSpacing: "0.05em", color: "#ffffff" }}>JEET BHATT</span>
                        </div>
                        <div style={{ display: "flex", gap: "20px", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255, 255, 255, 0.8)" }}>
                          {navItems.map((item: any, i: number) => (
                            <span key={i} style={{ cursor: "pointer" }}>{item.label}</span>
                          ))}
                        </div>
                        {showCTA && (
                          <div style={{ background: "#d4af37", color: "#0f1729", padding: "6px 16px", fontSize: "10px", fontWeight: "700", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {ctaLabel}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LAYOUT 4: MINIMAL DRAWER (Ultra-clean, High Contrast, Hidden Menu) */}
              {headerStyle === "minimal" && (
                <div 
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    padding: "20px 36px", 
                    background: "#080c14", 
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <span style={{ fontWeight: "800", fontSize: "14px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ffffff", fontFamily: "Playfair Display, serif" }}>CJB</span>
                    <span style={{ height: "14px", width: "1px", background: "#d4af37" }}></span>
                    <span style={{ textTransform: "uppercase", fontSize: "9px", letterSpacing: "0.15em", color: "#94a3b8", fontWeight: "600" }}>Advocacy</span>
                  </div>

                  <div style={{ display: "flex", gap: "24px", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255, 255, 255, 0.6)" }}>
                    {navItems.slice(0, 3).map((item: any, i: number) => (
                      <span key={i} style={{ cursor: "pointer", transition: "color 0.2s" }} className="hover-white-text">
                        {item.label}
                      </span>
                    ))}
                    <span style={{ color: "#d4af37", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                      MORE <span style={{ fontSize: "14px" }}>☰</span>
                    </span>
                  </div>
                </div>
              )}

              {/* LAYOUT 5: SPLIT LUXURY */}
              {headerStyle === "split" && (
                <div 
                  style={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    padding: "20px 32px", 
                    background: "#0f1729", 
                    borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
                    gap: "40px"
                  }}
                >
                  <div style={{ display: "flex", gap: "20px", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255, 255, 255, 0.8)", flex: 1, justifyContent: "flex-end" }}>
                    {leftNavItems.map((item: any, i: number) => (
                      <span key={i} style={{ cursor: "pointer" }} className="hover-gold-text">{item.label}</span>
                    ))}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
                    {logoUrl ? (
                      <img src={logoUrl} alt={logoAlt} style={{ height: "40px", objectFit: "contain", marginBottom: "4px" }} />
                    ) : (
                      <span style={{ color: "#d4af37", fontSize: "20px" }}>⚖️</span>
                    )}
                    <span style={{ fontWeight: "700", fontFamily: "Playfair Display, serif", fontSize: "14px", color: "#ffffff", letterSpacing: "0.05em", textTransform: "uppercase" }}>JEET BHATT</span>
                  </div>

                  <div style={{ display: "flex", gap: "20px", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255, 255, 255, 0.8)", flex: 1, justifyContent: "flex-start", alignItems: "center" }}>
                    {rightNavItems.map((item: any, i: number) => (
                      <span key={i} style={{ cursor: "pointer" }} className="hover-gold-text">{item.label}</span>
                    ))}
                    {showCTA && (
                      <span style={{ border: "1px solid #d4af37", color: "#d4af37", padding: "4px 10px", borderRadius: "2px", marginLeft: "10px", cursor: "pointer" }}>{ctaLabel}</span>
                    )}
                  </div>
                </div>
              )}

              {/* LAYOUT 6: SIDEBAR / APP STYLE */}
              {headerStyle === "sidebar" && (
                <div 
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    padding: "16px 24px", 
                    background: "#060911", 
                    borderBottom: "1px solid rgba(255,255,255,0.05)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <span style={{ color: "#d4af37", fontSize: "18px" }}>☰</span>
                    <span style={{ fontWeight: "600", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ffffff" }}>{menuLabel}</span>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <span style={{ fontWeight: "700", fontFamily: "Playfair Display, serif", fontSize: "16px", color: "#ffffff", letterSpacing: "0.05em", textTransform: "uppercase" }}>JEET BHATT</span>
                  </div>

                  {showCTA ? (
                    <div style={{ background: "#d4af37", color: "#0f1729", padding: "6px 16px", fontSize: "10px", fontWeight: "700", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer" }}>
                      {ctaLabel}
                    </div>
                  ) : <div style={{ width: "80px" }} />}
                </div>
              )}

              {/* LAYOUT 7: TOP BAR CORPORATE */}
              {headerStyle === "corporate" && (
                <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                  {/* Top thin bar */}
                  <div style={{ background: "#0a0e1a", padding: "6px 32px", display: "flex", justifyContent: "flex-end", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "9px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}>
                    <span>{contactEmail} | {contactPhone}</span>
                  </div>
                  {/* Main bar */}
                  <div style={{ background: "#0f1729", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                      {logoUrl ? <img src={logoUrl} alt={logoAlt} style={{ height: "30px", objectFit: "contain" }} /> : <span style={{ color: "#d4af37", fontSize: "16px" }}>⚖️</span>}
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "700", fontFamily: "Playfair Display, serif", fontSize: "14px", color: "#ffffff", letterSpacing: "0.05em" }}>Chambers of Jeet Bhatt</span>
                        <span style={{ fontSize: "8px", color: "#d4af37", letterSpacing: "0.1em", textTransform: "uppercase" }}>Advocates & Legal Strategists</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "20px", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255, 255, 255, 0.8)", alignItems: "center" }}>
                      {navItems.map((item: any, i: number) => (
                        <span key={i} style={{ cursor: "pointer" }} className="hover-gold-text">{item.label}</span>
                      ))}
                      {showCTA && (
                        <div style={{ border: "1px solid #d4af37", color: "#d4af37", padding: "6px 14px", borderRadius: "2px", cursor: "pointer" }}>{ctaLabel}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* LAYOUT 8: FLOATING ISLAND */}
              {headerStyle === "island" && (
                <div style={{ padding: "24px", display: "flex", justifyContent: "center", background: "radial-gradient(circle, #0e1424 0%, #070a13 100%)", minHeight: "140px" }}>
                  <div 
                    style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center", 
                      padding: "8px 12px 8px 20px", 
                      background: "rgba(15, 23, 41, 0.95)", 
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      border: "1px solid rgba(212, 175, 55, 0.3)", 
                      borderRadius: "50px", 
                      boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
                      maxWidth: "700px",
                      width: "100%"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                      {logoUrl ? <img src={logoUrl} alt={logoAlt} style={{ height: "24px", objectFit: "contain" }} /> : <span style={{ fontWeight: "800", fontFamily: "Playfair Display, serif", fontSize: "14px", color: "#ffffff", letterSpacing: "0.1em" }}>CJB</span>}
                    </div>
                    <div style={{ display: "flex", gap: "16px", fontSize: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255, 255, 255, 0.8)", alignItems: "center" }}>
                      {navItems.map((item: any, i: number) => (
                        <span key={i} style={{ cursor: "pointer" }} className="hover-gold-text">{item.label}</span>
                      ))}
                    </div>
                    {showCTA && (
                      <div style={{ background: "#d4af37", color: "#0f1729", padding: "8px 16px", fontSize: "10px", fontWeight: "700", borderRadius: "30px", textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer" }}>{ctaLabel}</div>
                    )}
                  </div>
                </div>
              )}

              {/* LAYOUT 9: MEGA-NAV PORTAL */}
              {headerStyle === "mega" && (
                <div 
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    padding: "20px 36px", 
                    background: "#0f1729", 
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    position: "relative"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    {logoUrl ? <img src={logoUrl} alt={logoAlt} style={{ height: "30px", objectFit: "contain" }} /> : <span style={{ color: "#d4af37", fontSize: "18px" }}>⚖️</span>}
                    <span style={{ fontWeight: "700", fontFamily: "Playfair Display, serif", fontSize: "14px", color: "#ffffff", letterSpacing: "0.05em", textTransform: "uppercase" }}>JEET BHATT</span>
                  </div>

                  <div style={{ display: "flex", gap: "24px", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255, 255, 255, 0.8)", alignItems: "center" }}>
                    {megaNavItems.map((item: any, i: number) => (
                      <span key={i} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }} className="hover-gold-text">
                        {item.label} {item.dropdownColumns?.length > 0 && <span style={{ fontSize: "8px" }}>▼</span>}
                      </span>
                    ))}
                    {showCTA && (
                      <div style={{ background: "transparent", border: "1px solid #d4af37", color: "#d4af37", padding: "8px 16px", fontSize: "10px", fontWeight: "700", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer", marginLeft: "10px" }}>{ctaLabel}</div>
                    )}
                  </div>
                  
                  {/* Simulated Mega Menu dropdown (static for preview based on first mega item) */}
                  {megaNavItems[0]?.dropdownColumns?.length > 0 && (
                    <div style={{ position: "absolute", top: "100%", left: "36px", right: "36px", background: "rgba(15, 23, 41, 0.98)", border: "1px solid rgba(212, 175, 55, 0.2)", borderTop: "none", padding: "20px", display: "flex", gap: "40px", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", zIndex: 10, opacity: 0.5 }}>
                      {megaNavItems[0].dropdownColumns.map((col: any, colIndex: number) => (
                        <div key={colIndex} style={{ flex: 1 }}>
                          <div style={{ fontSize: "10px", color: "#d4af37", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{col.columnTitle}</div>
                          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "flex", flexDirection: "column", gap: "6px" }}>
                            {col.subLinks?.map((subLink: any, subIndex: number) => (
                              <span key={subIndex}>{subLink.label}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* =========================================================
               MOBILE VIEWPORTS (Responsive Layout Simulation)
               ========================================================= */
            <div style={{ background: "#0a0e1a", height: "100%", position: "relative" }}>
              <div 
                style={{ 
                  background: "#0f1729", 
                  borderBottom: "1px solid rgba(212, 175, 55, 0.2)", 
                  padding: "14px 20px",
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {logoUrl ? (
                    <img src={logoUrl} alt={logoAlt} style={{ width: "24px", height: "24px", objectFit: "contain" }} />
                  ) : (
                    <span style={{ color: "#d4af37", fontSize: "14px" }}>⚖️</span>
                  )}
                  <span style={{ fontWeight: "700", fontFamily: "Playfair Display, serif", fontSize: "12px", color: "#ffffff", letterSpacing: "0.5px" }}>Chambers of JB</span>
                </div>
                
                <button 
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  style={{ 
                    background: "rgba(255, 255, 255, 0.05)", 
                    border: "1px solid rgba(212, 175, 55, 0.2)", 
                    color: "#ffffff", 
                    cursor: "pointer", 
                    width: "32px", 
                    height: "32px", 
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    outline: "none"
                  }}
                >
                  <Menu size={16} style={{ color: mobileMenuOpen ? "#d4af37" : "#ffffff" }} />
                </button>
              </div>

              {/* Dynamic Simulated Mobile Drawer Body */}
              <div 
                style={{
                  position: "absolute",
                  top: "47px",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(to bottom, #0f1729, #060911)",
                  padding: "24px",
                  transform: mobileMenuOpen ? "translateX(0)" : (drawerPosition === "left" ? "translateX(-100%)" : "translateX(100%)"),
                  transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  zIndex: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px"
                }}
              >
                <div style={{ borderBottom: "1px solid rgba(212, 175, 55, 0.15)", paddingBottom: "12px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "10px", textTransform: "uppercase", color: "#d4af37", fontWeight: "700", letterSpacing: "0.15em" }}>NAVIGATION DIRECTORY</span>
                </div>

                {mobileDrawerNavItems.map((item: any, i: number) => (
                  <div 
                    key={i} 
                    style={{ 
                      fontSize: "14px", 
                      fontFamily: "Playfair Display, serif", 
                      color: "rgba(255, 255, 255, 0.9)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "4px 0",
                      cursor: "pointer",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.03)"
                    }}
                  >
                    <span>{item.label}</span>
                    <ArrowRight size={12} style={{ color: "#d4af37" }} />
                  </div>
                ))}

                {showCTA && (
                  <div 
                    style={{ 
                      background: "linear-gradient(135deg, #d4af37, #c5a059)", 
                      color: "#0f1729", 
                      textAlign: "center", 
                      padding: "12px", 
                      fontSize: "12px", 
                      fontWeight: "700", 
                      borderRadius: "4px",
                      marginTop: "16px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      boxShadow: "0 6px 15px rgba(212, 175, 55, 0.15)",
                      cursor: "pointer"
                    }}
                  >
                    {ctaLabel}
                  </div>
                )}
              </div>

              {/* Mobile Sandbox Home Mock Content */}
              <div style={{ padding: "40px 24px", color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
                <span style={{ fontSize: "28px", display: "block", marginBottom: "12px" }}>⚖️</span>
                <h3 style={{ fontFamily: "Playfair Display, serif", color: "#ffffff", fontSize: "16px", marginBottom: "6px" }}>Chambers of Jeet Bhatt</h3>
                <p style={{ fontSize: "11px", lineHeight: "1.6" }}>
                  Select &quot;Desktop&quot; or toggle menu button on the top right to simulate user interaction in mobile drawer mode.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS Hover Helpers via raw style block */}
      <style>{`
        .hover-gold-text:hover {
          color: #d4af37 !important;
        }
        .hover-white-text:hover {
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
};

export default HeaderPreview;
