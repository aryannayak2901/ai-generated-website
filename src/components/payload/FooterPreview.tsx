"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "@payloadcms/ui";
import { Laptop, Smartphone, Eye, MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const defaultNavColumns = [
  {
    title: "Practice Areas",
    links: [
      { label: "Corporate Law", link: "/practice-areas" },
      { label: "Litigation", link: "/practice-areas" },
      { label: "Intellectual Property", link: "/practice-areas" },
      { label: "Real Estate", link: "/practice-areas" },
    ]
  },
  {
    title: "About",
    links: [
      { label: "Our Team", link: "/about" },
      { label: "Insights & Blog", link: "/blog" },
      { label: "Our Offices", link: "/offices" },
      { label: "Contact Us", link: "/contact" },
    ]
  }
];

export const FooterPreview: React.FC = () => {
  const form = useForm();
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");

  const formData = useMemo(() => {
    if (form && typeof form.getData === "function") {
      return form.getData();
    }
    return {};
  }, [form]);

  const footerStyle = formData.footerStyle || "classic";
  
  const companyInfo = formData.companyInfo || {
    logoText: "Chambers of Jeet Bhatt",
    description: "Premium legal expertise with modern approach. Trusted advisors for complex legal matters."
  };

  const navColumns = Array.isArray(formData.navColumns) && formData.navColumns.length > 0 
    ? formData.navColumns 
    : defaultNavColumns;

  const contactInfo = formData.contactInfo || {
    title: "Contact",
    address: "Gandhinagar, Gujarat\nIndia",
    phone: "+91 94082 82982",
    email: "info@jeetbhatt.com"
  };

  const socialLinks = Array.isArray(formData.socialLinks) ? formData.socialLinks : [];

  const bottomSection = formData.bottomSection || {
    copyrightText: "© 2026 Chambers of Jeet Bhatt. All rights reserved.",
    legalLinks: [
      { label: "Privacy Policy", link: "/privacy" },
      { label: "Terms of Service", link: "/terms" },
    ]
  };

  const renderSocialIcon = (platform: string) => {
    switch(platform) {
      case 'facebook': return <Facebook className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      case 'instagram': return <Instagram className="h-4 w-4" />;
      default: return null;
    }
  };

  const gridCols = 2 + navColumns.length;
  const isMobile = viewport === "mobile";

  return (
    <div 
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
      }}
    >
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          background: "linear-gradient(to right, #0e1424, #0b0f19)",
          borderBottom: "1px solid rgba(212, 175, 55, 0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", background: "rgba(212, 175, 55, 0.1)", border: "1px solid rgba(212, 175, 55, 0.4)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "#d4af37" }}>
            ⚖️
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600", fontFamily: "Playfair Display, serif", color: "#ffffff" }}>
              Live Footer Studio
            </h4>
            <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}>
              <Eye size={11} style={{ color: "#d4af37" }} /> Theme: <span style={{ textTransform: "capitalize", color: "#d4af37", fontWeight: "600" }}>{footerStyle}</span>
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "4px", background: "#060911", padding: "4px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setViewport("desktop"); }}
            style={{
              background: !isMobile ? "linear-gradient(135deg, #1e293b, #0f172a)" : "transparent",
              color: !isMobile ? "#ffffff" : "#64748b",
              border: !isMobile ? "1px solid rgba(212, 175, 55, 0.3)" : "1px solid transparent",
              padding: "6px 12px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "600", transition: "all 0.2s ease"
            }}
          >
            <Laptop size={13} style={{ color: !isMobile ? "#d4af37" : "inherit" }} /> Desktop
          </button>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setViewport("mobile"); }}
            style={{
              background: isMobile ? "linear-gradient(135deg, #1e293b, #0f172a)" : "transparent",
              color: isMobile ? "#ffffff" : "#64748b",
              border: isMobile ? "1px solid rgba(212, 175, 55, 0.3)" : "1px solid transparent",
              padding: "6px 12px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "600", transition: "all 0.2s ease"
            }}
          >
            <Smartphone size={13} style={{ color: isMobile ? "#d4af37" : "inherit" }} /> Mobile
          </button>
        </div>
      </div>

      <div 
        style={{
          padding: isMobile ? "40px 16px" : "32px",
          background: "#070a13",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px"
        }}
      >
        <div 
          style={{
            width: isMobile ? "375px" : "100%",
            transition: "all 0.4s ease",
            border: isMobile ? "8px solid #1e293b" : "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: isMobile ? "36px" : "8px",
            overflow: "hidden",
            background: "#0f1729",
            color: "#ffffff"
          }}
        >
          {/* Simulated Footer Component */}
          <div style={{ padding: isMobile ? "24px 16px" : "48px 64px" }}>
            
            {/* MINIMAL STYLE */}
            {footerStyle === 'minimal' && (
              <div style={{ background: "#020617", padding: "20px", borderRadius: "12px" }}>
                <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", gap: "32px", borderBottom: "1px solid rgba(212,175,55,0.1)", paddingBottom: "32px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "300px" }}>
                    <span style={{ fontFamily: "Playfair Display, serif", fontSize: "24px", fontWeight: "700" }}>{companyInfo.logoText}</span>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>{companyInfo.description}</span>
                    {socialLinks.length > 0 && (
                      <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                        {socialLinks.map((social: any, i: number) => (
                          <span key={i} style={{ color: "#94a3b8" }}>{renderSocialIcon(social.platform)}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "48px" }}>
                    {navColumns.map((col: any, idx: number) => (
                      <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#d4af37", fontWeight: "600" }}>{col.title}</span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px", color: "#cbd5e1" }}>
                          {Array.isArray(col.links) && col.links.map((link: any, lIdx: number) => (
                            <span key={lIdx}>{link.label}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: "24px", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: "16px", fontSize: "11px", color: "#64748b" }}>
                  <span>{bottomSection?.copyrightText?.replace('{year}', '2026')}</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
                    {Array.isArray(bottomSection?.legalLinks) && bottomSection.legalLinks.map((legal: any, i: number) => (
                      <span key={i}>{legal.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* NEWSLETTER STYLE */}
            {footerStyle === 'newsletter' && (
              <div style={{ background: "#0f1729", padding: "20px", borderRadius: "12px" }}>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "5fr 7fr", gap: "48px", borderBottom: "1px solid rgba(212,175,55,0.1)", paddingBottom: "32px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <span style={{ fontFamily: "Playfair Display, serif", fontSize: "28px", fontWeight: "700" }}>{formData.newsletter?.heading || 'Subscribe to Our Insights'}</span>
                    <span style={{ fontSize: "14px", color: "#94a3b8" }}>{formData.newsletter?.description || 'Get the latest legal updates.'}</span>
                    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "8px", marginTop: "8px" }}>
                      <div style={{ flex: 1, padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", fontSize: "12px", color: "#fff" }}>
                        {formData.newsletter?.placeholder || 'Email address'}
                      </div>
                      <div style={{ padding: "12px 24px", background: "#d4af37", color: "#0f1729", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", textAlign: "center" }}>
                        {formData.newsletter?.buttonText || 'Subscribe'}
                      </div>
                    </div>
                    {socialLinks.length > 0 && (
                      <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
                        {socialLinks.map((social: any, i: number) => (
                          <span key={i} style={{ color: "#94a3b8" }}>{renderSocialIcon(social.platform)}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "24px" }}>
                    {navColumns.map((col: any, idx: number) => (
                      <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <span style={{ fontFamily: "Playfair Display, serif", fontSize: "16px", fontWeight: "600" }}>{col.title}</span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px", color: "#94a3b8" }}>
                          {Array.isArray(col.links) && col.links.map((link: any, lIdx: number) => (
                            <span key={lIdx}>{link.label}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <span style={{ fontFamily: "Playfair Display, serif", fontSize: "16px", fontWeight: "600" }}>{contactInfo.title}</span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px", color: "#94a3b8" }}>
                        {contactInfo.address && <span>{contactInfo.address.split('\n')[0]}...</span>}
                        {contactInfo.phone && <span>{contactInfo.phone}</span>}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: "24px", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: "16px", fontSize: "12px", color: "#94a3b8" }}>
                  <span style={{ fontFamily: "Playfair Display, serif", fontSize: "18px", fontWeight: "700", color: "#fff" }}>{companyInfo.logoText}</span>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px" }}>
                    <span>{bottomSection?.copyrightText?.replace('{year}', '2026')}</span>
                    {!isMobile && <span style={{ width: "1px", height: "12px", background: "rgba(255,255,255,0.1)" }}></span>}
                    {Array.isArray(bottomSection?.legalLinks) && bottomSection.legalLinks.map((legal: any, i: number) => (
                      <span key={i}>{legal.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SPLIT MODERN STYLE */}
            {footerStyle === 'split' && (
              <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ background: "#060911", padding: isMobile ? "32px 24px" : "48px", width: isMobile ? "100%" : "40%", display: "flex", flexDirection: "column", gap: "32px" }}>
                  <span style={{ fontFamily: "Playfair Display, serif", fontSize: "28px", fontWeight: "700" }}>{companyInfo.logoText}</span>
                  <span style={{ fontSize: "14px", color: "#94a3b8", fontStyle: "italic" }}>{companyInfo.description}</span>
                  <div>
                    <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#d4af37", fontWeight: "600", display: "block", marginBottom: "16px" }}>{contactInfo.title}</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px", color: "#94a3b8" }}>
                      {contactInfo.address && <span>{contactInfo.address.split('\n').join(', ')}</span>}
                      {contactInfo.phone && <span>{contactInfo.phone}</span>}
                    </div>
                  </div>
                  {socialLinks.length > 0 && (
                    <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                      {socialLinks.map((social: any, i: number) => (
                        <span key={i} style={{ color: "#94a3b8" }}>{renderSocialIcon(social.platform)}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ background: "#0f1729", padding: isMobile ? "32px 24px" : "48px", width: isMobile ? "100%" : "60%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "32px" }}>
                    {navColumns.map((col: any, idx: number) => (
                      <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <span style={{ fontFamily: "Playfair Display, serif", fontSize: "18px", fontWeight: "600" }}>{col.title}</span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px", color: "#94a3b8" }}>
                          {Array.isArray(col.links) && col.links.map((link: any, lIdx: number) => (
                            <span key={lIdx}>{link.label}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid rgba(212,175,55,0.1)", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: "16px", fontSize: "11px", color: "#94a3b8" }}>
                    <span>{bottomSection?.copyrightText?.replace('{year}', '2026')}</span>
                    <div style={{ display: "flex", gap: "16px" }}>
                      {Array.isArray(bottomSection?.legalLinks) && bottomSection.legalLinks.map((legal: any, i: number) => (
                        <span key={i}>{legal.label}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GRAND CENTERED STYLE */}
            {footerStyle === 'grand' && (
              <div style={{ background: "#0f1729", padding: "48px 24px", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)" }}></div>
                <span style={{ fontFamily: "Playfair Display, serif", fontSize: isMobile ? "32px" : "42px", fontWeight: "700", marginBottom: "16px" }}>{companyInfo.logoText}</span>
                <span style={{ fontSize: "14px", color: "#94a3b8", fontStyle: "italic", maxWidth: "500px", marginBottom: "48px" }}>{companyInfo.description}</span>
                
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: isMobile ? "16px" : "32px", marginBottom: "48px" }}>
                  {navColumns.map((col: any, idx: number) => (
                    <div key={idx} style={{ display: "flex", gap: isMobile ? "16px" : "32px" }}>
                      {Array.isArray(col.links) && col.links.map((link: any, lIdx: number) => (
                        <span key={`${idx}-${lIdx}`} style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>{link.label}</span>
                      ))}
                    </div>
                  ))}
                </div>

                <div style={{ width: "48px", height: "1px", background: "rgba(212,175,55,0.3)", marginBottom: "32px" }}></div>

                <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "24px", fontSize: "12px", color: "#94a3b8", marginBottom: "32px" }}>
                  {contactInfo.address && <span>{contactInfo.address.split('\n').join(', ')}</span>}
                  {contactInfo.phone && <span>{contactInfo.phone}</span>}
                </div>

                {socialLinks.length > 0 && (
                  <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
                    {socialLinks.map((social: any, i: number) => (
                      <span key={i} style={{ color: "#94a3b8" }}>{renderSocialIcon(social.platform)}</span>
                    ))}
                  </div>
                )}

                <div style={{ width: "100%", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>
                  <span>{bottomSection?.copyrightText?.replace('{year}', '2026')}</span>
                  <div style={{ display: "flex", gap: "24px" }}>
                    {Array.isArray(bottomSection?.legalLinks) && bottomSection.legalLinks.map((legal: any, i: number) => (
                      <span key={i}>{legal.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CORPORATE GRID STYLE */}
            {footerStyle === 'corporate' && (
              <div style={{ background: "#0f1729", padding: isMobile ? "24px" : "48px 64px", borderTop: "1px solid rgba(212,175,55,0.1)" }}>
                {/* Top Bar */}
                <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "24px", marginBottom: "32px", gap: "16px" }}>
                  <span style={{ fontFamily: "Playfair Display, serif", fontSize: "24px", fontWeight: "700" }}>{companyInfo.logoText}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {!isMobile && <span style={{ fontSize: "12px", color: "#94a3b8" }}>Connect with us</span>}
                    {socialLinks.length > 0 && (
                      <div style={{ display: "flex", gap: "12px" }}>
                        {socialLinks.map((social: any, i: number) => (
                          <span key={i} style={{ color: "#94a3b8" }}>{renderSocialIcon(social.platform)}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Middle Grid */}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: "32px", marginBottom: "48px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <span style={{ fontFamily: "Playfair Display, serif", fontSize: "16px", fontWeight: "600" }}>About Us</span>
                    <span style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.6" }}>{companyInfo.description}</span>
                  </div>
                  {navColumns.map((col: any, idx: number) => (
                    <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <span style={{ fontFamily: "Playfair Display, serif", fontSize: "16px", fontWeight: "600" }}>{col.title}</span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px", color: "#94a3b8" }}>
                        {Array.isArray(col.links) && col.links.map((link: any, lIdx: number) => (
                          <span key={lIdx}>{link.label}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <span style={{ fontFamily: "Playfair Display, serif", fontSize: "16px", fontWeight: "600" }}>{contactInfo.title}</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px", color: "#94a3b8" }}>
                      {contactInfo.address && <span>{contactInfo.address.split('\n').join(', ')}</span>}
                      {contactInfo.phone && <span>{contactInfo.phone}</span>}
                      {contactInfo.email && <span>{contactInfo.email}</span>}
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "24px", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "center", gap: "16px", fontSize: "11px", color: "#64748b" }}>
                  <span>{bottomSection?.copyrightText?.replace('{year}', '2026')}</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "center" }}>
                    {Array.isArray(bottomSection?.legalLinks) && bottomSection.legalLinks.map((legal: any, i: number) => (
                      <span key={i}>{legal.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CREATIVE ASYMMETRIC STYLE */}
            {footerStyle === 'asymmetric' && (
              <div style={{ background: "#020617", padding: isMobile ? "32px 16px" : "64px", borderTop: "1px solid rgba(212,175,55,0.1)", display: "flex", flexDirection: isMobile ? "column" : "row", gap: "64px" }}>
                <div style={{ width: isMobile ? "100%" : "40%", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "48px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <span style={{ fontFamily: "Playfair Display, serif", fontSize: isMobile ? "32px" : "48px", fontWeight: "700", lineHeight: "1.2" }}>{companyInfo.logoText}</span>
                    <div style={{ width: "64px", height: "4px", background: "#d4af37" }}></div>
                    <span style={{ fontSize: "16px", color: "#94a3b8", fontStyle: "italic", lineHeight: "1.6" }}>{companyInfo.description}</span>
                  </div>
                  <div style={{ borderTop: "1px solid #1e293b", paddingTop: "32px" }}>
                    {socialLinks.length > 0 && (
                      <div style={{ display: "flex", gap: "16px" }}>
                        {socialLinks.map((social: any, i: number) => (
                          <span key={i} style={{ color: "#94a3b8" }}>{renderSocialIcon(social.platform)}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{ width: isMobile ? "100%" : "60%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "32px" }}>
                    {navColumns.map((col: any, idx: number) => (
                      <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", color: "#64748b", fontWeight: "600" }}>{col.title}</span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px", color: "#e2e8f0" }}>
                          {Array.isArray(col.links) && col.links.map((link: any, lIdx: number) => (
                            <span key={lIdx} style={{ fontWeight: "500" }}>{link.label}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                      <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", color: "#64748b", fontWeight: "600" }}>{contactInfo.title}</span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px", color: "#e2e8f0" }}>
                        {contactInfo.address && <span>{contactInfo.address.split('\n')[0]}</span>}
                        {contactInfo.phone && <span>{contactInfo.phone}</span>}
                        {contactInfo.email && <span>{contactInfo.email}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: "64px", paddingTop: "24px", borderTop: "1px solid #1e293b", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: "16px", fontSize: "12px", color: "#64748b" }}>
                    <span>{bottomSection?.copyrightText?.replace('{year}', '2026')}</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
                      {Array.isArray(bottomSection?.legalLinks) && bottomSection.legalLinks.map((legal: any, i: number) => (
                        <span key={i}>{legal.label}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LOCATION FOCUS STYLE */}
            {footerStyle === 'location' && (
              <div style={{ background: "#0f1729", padding: isMobile ? "24px 16px" : "48px 64px", borderTop: "1px solid rgba(212,175,55,0.2)" }}>
                <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "48px", alignItems: isMobile ? "flex-start" : "stretch" }}>
                  
                  {/* Location Block */}
                  <div style={{ width: isMobile ? "100%" : "33%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "12px", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <span style={{ fontFamily: "Playfair Display, serif", fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>{contactInfo.title || 'Our Office'}</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px", color: "#cbd5e1" }}>
                      {contactInfo.address && (
                        <div style={{ display: "flex", gap: "12px" }}>
                          <MapPin size={20} color="#d4af37" style={{ flexShrink: 0 }} />
                          <span>{contactInfo.address}</span>
                        </div>
                      )}
                      {contactInfo.phone && (
                        <div style={{ display: "flex", gap: "12px" }}>
                          <Phone size={20} color="#d4af37" />
                          <span>{contactInfo.phone}</span>
                        </div>
                      )}
                      {contactInfo.email && (
                        <div style={{ display: "flex", gap: "12px" }}>
                          <Mail size={20} color="#d4af37" />
                          <span>{contactInfo.email}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                      {socialLinks.length > 0 && (
                        <div style={{ display: "flex", gap: "16px" }}>
                          {socialLinks.map((social: any, i: number) => (
                            <span key={i} style={{ color: "#cbd5e1" }}>{renderSocialIcon(social.platform)}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nav Block */}
                  <div style={{ width: isMobile ? "100%" : "66%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontFamily: "Playfair Display, serif", fontSize: "24px", fontWeight: "700", display: "block", marginBottom: "16px" }}>{companyInfo.logoText}</span>
                      <span style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.6", display: "block", marginBottom: "32px", maxWidth: "600px" }}>{companyInfo.description}</span>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: "24px" }}>
                      {navColumns.map((col: any, idx: number) => (
                        <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                          <span style={{ fontFamily: "Playfair Display, serif", fontSize: "16px", fontWeight: "600" }}>{col.title}</span>
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px", color: "#94a3b8" }}>
                            {Array.isArray(col.links) && col.links.map((link: any, lIdx: number) => (
                              <span key={lIdx}>{link.label}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: "16px", fontSize: "12px", color: "#64748b" }}>
                      <span>{bottomSection?.copyrightText?.replace('{year}', '2026')}</span>
                      <div style={{ display: "flex", gap: "16px" }}>
                        {Array.isArray(bottomSection?.legalLinks) && bottomSection.legalLinks.map((legal: any, i: number) => (
                          <span key={i}>{legal.label}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* STACKED ELEGANT STYLE */}
            {footerStyle === 'stacked' && (
              <div style={{ background: "#040814", padding: "64px 24px 32px 24px", borderTop: "1px solid rgba(212,175,55,0.2)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <span style={{ fontFamily: "Playfair Display, serif", fontSize: "28px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "16px" }}>{companyInfo.logoText}</span>
                <div style={{ width: "32px", height: "2px", background: "#d4af37", marginBottom: "24px" }}></div>
                <span style={{ fontSize: "14px", color: "#94a3b8", fontStyle: "italic", marginBottom: "48px", maxWidth: "600px" }}>{companyInfo.description}</span>
                
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px 32px", marginBottom: "48px" }}>
                  {navColumns.map((col: any) => (
                    Array.isArray(col.links) && col.links.map((link: any, lIdx: number) => (
                      <span key={lIdx} style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "2px", color: "#cbd5e1" }}>{link.label}</span>
                    ))
                  ))}
                </div>

                <div style={{ width: "100%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", marginBottom: "32px" }}></div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", marginBottom: "32px" }}>
                  {contactInfo.address && <span style={{ fontSize: "12px", color: "#94a3b8" }}>{contactInfo.address.split('\n').join(' • ')}</span>}
                  <div style={{ display: "flex", gap: "24px", fontSize: "12px", color: "#94a3b8" }}>
                    {contactInfo.phone && <span>{contactInfo.phone}</span>}
                    {contactInfo.email && <span>{contactInfo.email}</span>}
                  </div>
                  {socialLinks.length > 0 && (
                    <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                      {socialLinks.map((social: any, i: number) => (
                        <span key={i} style={{ color: "#94a3b8" }}>{renderSocialIcon(social.platform)}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                  <div style={{ display: "flex", gap: "24px" }}>
                    {Array.isArray(bottomSection?.legalLinks) && bottomSection.legalLinks.map((legal: any, i: number) => (
                      <span key={i} style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#64748b" }}>{legal.label}</span>
                    ))}
                  </div>
                  <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#475569" }}>{bottomSection?.copyrightText?.replace('{year}', '2026')}</span>
                </div>
              </div>
            )}

            {/* CLASSIC STYLE */}
            {footerStyle === 'classic' && (
              <div style={{ background: "#0f1729", padding: "20px", borderRadius: "12px" }}>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : `repeat(${gridCols}, 1fr)`, gap: "32px" }}>
                  
                  {/* Logo / About */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <span style={{ fontFamily: "Playfair Display, serif", fontSize: isMobile ? "20px" : "24px", fontWeight: "700" }}>
                      {companyInfo.logoText}
                    </span>
                    <span style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic", lineHeight: "1.6" }}>
                      {companyInfo.description}
                    </span>
                    {socialLinks.length > 0 && (
                      <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                        {socialLinks.map((social: any, i: number) => (
                          <span key={i} style={{ color: "#94a3b8", cursor: "pointer" }}>{renderSocialIcon(social.platform)}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Nav Columns */}
                  {navColumns.map((col: any, idx: number) => (
                    <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <span style={{ fontFamily: "Playfair Display, serif", fontSize: "16px", fontWeight: "600" }}>{col.title}</span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px", color: "#94a3b8" }}>
                        {Array.isArray(col.links) && col.links.map((link: any, lIdx: number) => (
                          <span key={lIdx} style={{ cursor: "pointer" }}>{link.label}</span>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Contact Column */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <span style={{ fontFamily: "Playfair Display, serif", fontSize: "16px", fontWeight: "600" }}>{contactInfo.title}</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px", color: "#94a3b8" }}>
                      {contactInfo.address && (
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                          <MapPin size={16} color="#d4af37" style={{ marginTop: "2px" }} />
                          <span style={{ whiteSpace: "pre-line" }}>{contactInfo.address}</span>
                        </div>
                      )}
                      {contactInfo.phone && (
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <Phone size={16} color="#d4af37" />
                          <span>{contactInfo.phone}</span>
                        </div>
                      )}
                      {contactInfo.email && (
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <Mail size={16} color="#d4af37" />
                          <span>{contactInfo.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Bottom Section */}
                <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1px solid rgba(212, 175, 55, 0.1)", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: "16px", fontSize: "12px", color: "#94a3b8" }}>
                  <span>{bottomSection?.copyrightText?.replace('{year}', '2026')}</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
                    {Array.isArray(bottomSection?.legalLinks) && bottomSection.legalLinks.map((legal: any, i: number) => (
                      <span key={i} style={{ cursor: "pointer" }}>{legal.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
