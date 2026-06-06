# Header Selection and Live CMS Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement dynamic header style selections in Payload CMS, a live responsive preview frame inside the CMS edit view, and real-time reflection of these configurations on the Next.js storefront.

**Architecture:** Extend the `header` global schema in Payload CMS with styling and functionality fields, render a custom React client component (`HeaderPreview`) that reactively tracks form state with the CMS `useForm` hook, and customize `Navbar.tsx` on the storefront to render the chosen layout style (Classic, Centered, Glassmorphic, Minimal).

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion, Payload CMS v3.

---

### Task 1: Extend Payload Global Schema (`src/globals/Header.ts`)

**Files:**
- Modify: `src/globals/Header.ts`

- [ ] **Step 1: Write the updated Header schema**
  Update the schema in `src/globals/Header.ts` to add the custom preview `ui` field at the top, followed by `headerStyle`, `sticky`, `showCTA`, `ctaLabel`, and `ctaLink` fields.
  
  ```typescript
  import type { GlobalConfig } from 'payload'
  
  export const Header: GlobalConfig = {
    slug: 'header',
    access: {
      read: () => true,
      update: ({ req }) => !!req.user,
    },
    fields: [
      {
        name: 'headerPreview',
        type: 'ui',
        admin: {
          components: {
            Field: '@/components/payload/HeaderPreview#HeaderPreview',
          },
        },
      },
      {
        type: 'row',
        fields: [
          {
            name: 'headerStyle',
            label: 'Header Layout Style',
            type: 'select',
            defaultValue: 'classic',
            required: true,
            options: [
              { label: 'Chambers Classic (Traditional & Authoritative)', value: 'classic' },
              { label: 'Centered Luxury (Symmetric & Prestigious)', value: 'centered' },
              { label: 'Glassmorphic Float (Modern & Progressive)', value: 'glassmorphic' },
              { label: 'Minimal Drawer (Clean & Ultra-Modern)', value: 'minimal' },
            ],
            admin: {
              width: '50%',
              description: 'Select the primary layout style for the website navigation header.',
            },
          },
          {
            name: 'sticky',
            label: 'Sticky Header Toggle',
            type: 'checkbox',
            defaultValue: true,
            admin: {
              width: '50%',
              description: 'When enabled, the header remains pinned to the top on scroll.',
            },
          },
        ],
      },
      {
        type: 'row',
        fields: [
          {
            name: 'showCTA',
            label: 'Display Consult Button',
            type: 'checkbox',
            defaultValue: true,
            admin: {
              width: '33%',
              description: 'Show/hide the primary Call-To-Action button.',
            },
          },
          {
            name: 'ctaLabel',
            label: 'CTA Button Label',
            type: 'text',
            defaultValue: 'Get In Touch',
            required: true,
            admin: {
              width: '33%',
              description: 'Text displayed on the button (e.g. "Get In Touch").',
              condition: (data) => !!data.showCTA,
            },
          },
          {
            name: 'ctaLink',
            label: 'CTA Destination Link',
            type: 'text',
            defaultValue: '/contact',
            required: true,
            admin: {
              width: '34%',
              description: 'URL path for the button action (e.g. "/contact").',
              condition: (data) => !!data.showCTA,
            },
          },
        ],
      },
      {
        name: 'logo',
        type: 'upload',
        relationTo: 'media',
      },
      {
        name: 'navItems',
        type: 'array',
        fields: [
          {
            name: 'label',
            type: 'text',
            required: true,
          },
          {
            name: 'link',
            type: 'text',
            required: true,
          },
        ],
      },
    ],
  }
  ```

- [ ] **Step 2: Verify type generation**
  Run Payload TypeScript generator to update types.
  Run: `yarn dev` (Wait to see if the builder completes successfully, generating `src/payload-types.ts` automatically)

- [ ] **Step 3: Commit global configuration changes**
  ```bash
  git add src/globals/Header.ts
  git commit -m "cms: extend header global config schema with style options & preview registration"
  ```

---

### Task 2: Build Custom Reactive Live Preview Component (`src/components/payload/HeaderPreview.tsx`)

**Files:**
- Create: `src/components/payload/HeaderPreview.tsx`

- [ ] **Step 1: Write the reactive HeaderPreview React component**
  Write the React client component that extracts form settings reactively with `useForm()` and renders the styled simulation of the 4 layout headers inside a responsive viewport container.
  
  ```typescript
  "use client";
  
  import React, { useState, useMemo } from "react";
  import { useForm } from "@payloadcms/ui";
  import { Laptop, Smartphone, Menu, Phone, Mail } from "lucide-react";
  
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
  
    // Fetch live form state
    const formData = useMemo(() => {
      if (form && typeof form.getData === "function") {
        return form.getData();
      }
      return {};
    }, [form]);
  
    const headerStyle = formData.headerStyle || "classic";
    const sticky = !!formData.sticky;
    const showCTA = !!formData.showCTA;
    const ctaLabel = formData.ctaLabel || "Get In Touch";
    const ctaLink = formData.ctaLink || "/contact";
    
    // Resolve dynamic logo URL
    const logoUrl = typeof formData.logo === "object" && formData.logo?.url 
      ? formData.logo.url 
      : null;
    const logoAlt = typeof formData.logo === "object" && formData.logo?.alt 
      ? formData.logo.alt 
      : "Chambers Logo";
  
    // Resolve nav items
    const navItems = Array.isArray(formData.navItems) && formData.navItems.length > 0
      ? formData.navItems
      : defaultNavLinks;
  
    return (
      <div 
        style={{
          marginTop: "16px",
          marginBottom: "24px",
          background: "#0f172a",
          border: "1px solid rgba(212, 175, 55, 0.3)",
          borderRadius: "8px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
          overflow: "hidden",
          color: "#f8fafc",
          fontFamily: "'Public Sans', sans-serif"
        }}
      >
        {/* Dynamic Font Loader */}
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Public+Sans:wght@400;500;600;700&display=swap" 
        />
  
        {/* Preview Control Bar */}
        <div 
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 18px",
            background: "rgba(255, 255, 255, 0.03)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>⚖️</span>
            <div>
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: "600", fontFamily: "Playfair Display, serif", color: "#ffffff" }}>
                Header Live Preview Studio
              </h4>
              <p style={{ margin: 0, fontSize: "10px", color: "#94a3b8" }}>
                Simulating: <span style={{ textTransform: "capitalize", color: "#d4af37", fontWeight: "500" }}>{headerStyle}</span> layout
              </p>
            </div>
          </div>
  
          {/* Viewport Toggles */}
          <div style={{ display: "flex", gap: "4px", background: "rgba(0,0,0,0.3)", padding: "3px", borderRadius: "6px" }}>
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              style={{
                background: viewport === "desktop" ? "rgba(255,255,255,0.08)" : "transparent",
                color: viewport === "desktop" ? "#ffffff" : "#64748b",
                border: "none",
                padding: "4px 8px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "10px",
                fontWeight: "600"
              }}
            >
              <Laptop size={12} /> Desktop
            </button>
            <button
              type="button"
              onClick={() => setViewport("mobile")}
              style={{
                background: viewport === "mobile" ? "rgba(255,255,255,0.08)" : "transparent",
                color: viewport === "mobile" ? "#ffffff" : "#64748b",
                border: "none",
                padding: "4px 8px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "10px",
                fontWeight: "600"
              }}
            >
              <Smartphone size={12} /> Mobile
            </button>
          </div>
        </div>
  
        {/* Simulation Canvas */}
        <div 
          style={{
            padding: "24px",
            background: "#090d16",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div 
            style={{
              width: viewport === "desktop" ? "100%" : "375px",
              maxWidth: "100%",
              transition: "width 0.3s ease",
              boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "4px",
              overflow: "hidden",
              position: "relative"
            }}
          >
            {/* RENDER DYNAMIC LAYOUT BASED ON STYLE SELECTION */}
            {viewport === "desktop" ? (
              /* ==============================================
                 DESKTOP SIMULATIONS
                 ============================================== */
              <div>
                {/* Chambers Classic Layout */}
                {headerStyle === "classic" && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", background: "#0f1729", borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {logoUrl ? (
                        <img src={logoUrl} alt={logoAlt} style={{ width: "28px", height: "28px", objectFit: "contain" }} />
                      ) : (
                        <div style={{ background: "rgba(255,255,255,0.1)", color: "#ffffff", padding: "4px 8px", borderRadius: "2px", fontWeight: "bold", fontSize: "10px" }}>JJB</div>
                      )}
                      <span style={{ fontWeight: "700", fontFamily: "Playfair Display, serif", fontSize: "13px", letterSpacing: "0.02em" }}>Chambers of Jeet Bhatt</span>
                    </div>
                    <div style={{ display: "flex", gap: "16px", fontSize: "11px", fontWeight: "500", color: "rgba(255,255,255,0.8)" }}>
                      {navItems.map((item: any, i: number) => (
                        <span key={i} style={{ cursor: "pointer" }}>{item.label}</span>
                      ))}
                    </div>
                    {showCTA && (
                      <div style={{ background: "#d4af37", color: "#0f1729", padding: "6px 12px", fontSize: "10px", fontWeight: "600", borderRadius: "2px", letterSpacing: "0.05em" }}>{ctaLabel}</div>
                    )}
                  </div>
                )}
  
                {/* Centered Luxury Layout */}
                {headerStyle === "centered" && (
                  <div style={{ background: "#0f1729", borderBottom: "1px solid rgba(212,175,55,0.15)", padding: "12px 24px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                      {logoUrl ? (
                        <img src={logoUrl} alt={logoAlt} style={{ width: "32px", height: "32px", objectFit: "contain" }} />
                      ) : (
                        <span style={{ color: "#d4af37", fontSize: "16px" }}>⚖️</span>
                      )}
                      <span style={{ fontWeight: "bold", fontFamily: "Playfair Display, serif", fontSize: "14px", letterSpacing: "0.06em" }}>CHAMBERS OF JEET BHATT</span>
                    </div>
                    <div style={{ borderTop: "1px solid rgba(212,175,55,0.15)", marginTop: "8px", paddingTop: "8px", display: "flex", justifyContent: "center", gap: "20px", fontSize: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.7)" }}>
                      {navItems.map((item: any, i: number) => (
                        <span key={i} style={{ cursor: "pointer" }}>{item.label}</span>
                      ))}
                    </div>
                  </div>
                )}
  
                {/* Glassmorphic Float Layout */}
                {headerStyle === "glassmorphic" && (
                  <div style={{ padding: "16px", background: "radial-gradient(circle, #1e293b 0%, #090d16 100%)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 20px", background: "rgba(15,23,41,0.75)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "30px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: "#d4af37", fontSize: "12px" }}>⚖️</span>
                        <span style={{ fontWeight: "700", fontSize: "11px", letterSpacing: "0.05em", color: "#ffffff" }}>JEET BHATT</span>
                      </div>
                      <div style={{ display: "flex", gap: "14px", fontSize: "10px", fontWeight: "500", color: "rgba(255,255,255,0.8)" }}>
                        {navItems.map((item: any, i: number) => (
                          <span key={i} style={{ cursor: "pointer" }}>{item.label}</span>
                        ))}
                      </div>
                      {showCTA ? (
                        <div style={{ border: "1.5px solid #d4af37", color: "#d4af37", padding: "4px 10px", fontSize: "9px", fontWeight: "600", borderRadius: "20px" }}>{ctaLabel}</div>
                      ) : (
                        <div style={{ width: "20px" }} />
                      )}
                    </div>
                  </div>
                )}
  
                {/* Minimal Drawer Layout */}
                {headerStyle === "minimal" && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", background: "#090d16", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontWeight: "800", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase" }}>CJB</span>
                    <div style={{ display: "flex", gap: "16px", fontSize: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255,255,255,0.6)" }}>
                      {navItems.slice(0, 3).map((item: any, i: number) => (
                        <span key={i} style={{ cursor: "pointer" }}>{item.label}</span>
                      ))}
                      <span style={{ color: "#ffffff", fontWeight: "bold" }}>☰</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ==============================================
                 MOBILE SIMULATION
                 ============================================== */
              <div style={{ background: "#0f1729", borderBottom: "1px solid rgba(212,175,55,0.15)", padding: "10px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {logoUrl ? (
                      <img src={logoUrl} alt={logoAlt} style={{ width: "22px", height: "22px", objectFit: "contain" }} />
                    ) : (
                      <span style={{ color: "#d4af37", fontSize: "11px" }}>⚖️</span>
                    )}
                    <span style={{ fontWeight: "700", fontFamily: "Playfair Display, serif", fontSize: "11px" }}>Chambers of JB</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{ background: "transparent", border: "none", color: "#ffffff", cursor: "pointer" }}
                  >
                    <Menu size={18} />
                  </button>
                </div>
  
                {/* Simulated mobile menu expansion */}
                {mobileMenuOpen && (
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: "10px", paddingTop: "10px", display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "8px" }}>
                    {navItems.map((item: any, i: number) => (
                      <span key={i} style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)" }}>{item.label}</span>
                    ))}
                    {showCTA && (
                      <div style={{ background: "#d4af37", color: "#0f1729", textAlign: "center", padding: "8px", fontSize: "10px", fontWeight: "600", borderRadius: "2px" }}>{ctaLabel}</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default HeaderPreview;
  ```

- [ ] **Step 2: Commit custom component**
  ```bash
  git add src/components/payload/HeaderPreview.tsx
  git commit -m "cms: add HeaderPreview client component for reactive form data rendering inside Payload UI"
  ```

---

### Task 3: Integrate Layout Options inside Storefront Navbar (`src/components/Navbar.tsx`)

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Implement the dynamic header renderings**
  Modify `src/components/Navbar.tsx` to handle the props reactively and output the requested classic, centered, glassmorphic, or minimal styling.
  
  Let's verify the updated imports, interface, and rendering block inside `src/components/Navbar.tsx`:
  
  ```typescript
  "use client";
  
  import Link from "next/link";
  import { Phone, Mail, MapPin, Menu, X } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { useState, useEffect } from "react";
  import { motion, AnimatePresence } from "framer-motion";
  import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
  } from "@/components/ui/sheet";
  
  interface NavbarProps {
    headerData?: {
      logo?: any;
      headerStyle?: "classic" | "centered" | "glassmorphic" | "minimal" | null;
      sticky?: boolean | null;
      showCTA?: boolean | null;
      ctaLabel?: string | null;
      ctaLink?: string | null;
      navItems?: {
        label: string;
        link: string;
        id?: string | null;
      }[] | null;
    } | null;
  }
  
  const defaultNavLinks = [
    { title: "Home", href: "/" },
    { title: "About CJB", href: "/about" },
    { title: "Practice Areas", href: "/practice-areas" },
    { title: "Blog", href: "/blog" },
    { title: "Media", href: "/media" },
    { title: "Offices", href: "/offices" },
    { title: "Contact", href: "/contact" },
  ];
  
  export function Navbar({ headerData }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
  
    // Listen to scroll to adjust styles on glassmorphic or sticky headers
    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 20) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  
    const headerStyle = headerData?.headerStyle || "classic";
    const isSticky = headerData?.sticky !== false; // defaults to true
    const showCTA = headerData?.showCTA !== false; // defaults to true
    const ctaLabel = headerData?.ctaLabel || "Get In Touch";
    const ctaLink = headerData?.ctaLink || "/contact";
  
    const navLinks = headerData?.navItems?.length
      ? headerData.navItems.map((item) => ({
          title: item.label,
          href: item.link,
        }))
      : defaultNavLinks;
  
    const logoUrl =
      typeof headerData?.logo === "object" && headerData?.logo?.url
        ? headerData.logo.url
        : null;
    const logoAlt =
      typeof headerData?.logo === "object" && headerData?.logo?.alt
        ? headerData.logo.alt
        : "Chambers of Jeet Bhatt Logo";
  
    // Common Logo Component
    const LogoBranding = () => (
      <Link href="/" className="flex items-center gap-3 group shrink-0">
        {logoUrl ? (
          <div className="flex items-center justify-center p-0.5 rounded-sm shrink-0 w-10 h-10 shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden">
            <img
              src={logoUrl}
              alt={logoAlt}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-white/10 p-2 rounded-sm shrink-0 w-10 h-10 shadow-xl transition-all duration-300 group-hover:scale-105">
            <span className="text-white font-serif font-bold text-sm leading-none">
              JJB
            </span>
          </div>
        )}
        <div className="flex flex-col justify-center overflow-hidden text-left">
          <span className="font-serif text-base sm:text-lg lg:text-xl font-bold text-white leading-tight group-hover:text-accent transition-colors duration-300 whitespace-nowrap">
            Chambers of Jeet Bhatt
          </span>
          <p className="text-muted-foreground font-sans text-[9px] sm:text-[10px] tracking-[0.15em] uppercase font-semibold mt-0.5 whitespace-nowrap hidden sm:block">
            Advocates & Legal Strategists
          </p>
        </div>
      </Link>
    );
  
    // RENDER: GLASSMORPHIC FLOAT
    if (headerStyle === "glassmorphic") {
      return (
        <header className={`${isSticky ? "sticky top-0 z-40" : "relative"} w-full px-6 py-4 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
          <div 
            className={`max-w-[1280px] w-full mx-auto px-6 md:px-8 py-3 rounded-full border transition-all duration-300 ${
              scrolled 
                ? "bg-primary/90 backdrop-blur-xl border-accent/20 shadow-2xl" 
                : "bg-primary/50 backdrop-blur-md border-white/5 shadow-lg"
            }`}
          >
            <div className="flex flex-row items-center justify-between gap-4">
              <LogoBranding />
              
              <nav className="hidden lg:flex items-center gap-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="text-white/80 hover:text-accent transition-colors duration-300 text-sm font-semibold uppercase tracking-wider relative group whitespace-nowrap"
                  >
                    {link.title}
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </nav>
  
              <div className="flex items-center gap-4">
                {showCTA && (
                  <Button asChild className="hidden lg:flex bg-accent hover:bg-accent/85 text-accent-foreground px-6 h-10 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md">
                    <Link href={ctaLink}>{ctaLabel}</Link>
                  </Button>
                )}
                
                {/* Mobile Trigger */}
                <MobileMenuTrigger isOpen={isOpen} setIsOpen={setIsOpen} navLinks={navLinks} logoUrl={logoUrl} logoAlt={logoAlt} showCTA={showCTA} ctaLabel={ctaLabel} ctaLink={ctaLink} />
              </div>
            </div>
          </div>
        </header>
      );
    }
  
    // RENDER: CENTERED LUXURY
    if (headerStyle === "centered") {
      return (
        <header className={`${isSticky ? "sticky top-0 z-40" : "relative"} w-full bg-primary border-b border-accent/10 shadow-sm transition-all duration-300`}>
          <div className="max-w-[1280px] w-full mx-auto px-6 py-4 flex flex-col items-center gap-4">
            {/* Top Deck: Branding */}
            <div className="flex items-center justify-between w-full lg:justify-center">
              <Link href="/" className="flex flex-col items-center gap-1 group">
                {logoUrl && (
                  <img src={logoUrl} alt={logoAlt} className="w-12 h-12 object-contain mb-1 transition-transform group-hover:scale-105" />
                )}
                <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-[0.05em] uppercase text-center group-hover:text-accent transition-colors">
                  Chambers of Jeet Bhatt
                </span>
                <p className="text-accent font-sans text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-bold text-center">
                  Advocates & Legal Strategists
                </p>
              </Link>
              
              {/* Mobile trigger for layout consistency on small screens */}
              <div className="lg:hidden">
                <MobileMenuTrigger isOpen={isOpen} setIsOpen={setIsOpen} navLinks={navLinks} logoUrl={logoUrl} logoAlt={logoAlt} showCTA={showCTA} ctaLabel={ctaLabel} ctaLink={ctaLink} />
              </div>
            </div>
  
            {/* Bottom Deck: Navigation Links */}
            <div className="hidden lg:flex items-center justify-between w-full border-t border-accent/10 pt-4 mt-2">
              <div className="w-20" /> {/* Spacer to center list */}
              <nav className="flex items-center gap-x-10">
                {navLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="text-white/80 hover:text-accent transition-colors duration-300 text-xs font-bold uppercase tracking-[0.15em] relative group"
                  >
                    {link.title}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </nav>
              {showCTA ? (
                <Button asChild className="bg-accent hover:bg-accent/85 text-accent-foreground px-5 h-9 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all duration-300">
                  <Link href={ctaLink}>{ctaLabel}</Link>
                </Button>
              ) : (
                <div className="w-20" />
              )}
            </div>
          </div>
        </header>
      );
    }
  
    // RENDER: MINIMAL DRAWER
    if (headerStyle === "minimal") {
      return (
        <header className={`${isSticky ? "sticky top-0 z-40" : "relative"} w-full bg-background border-b border-border shadow-sm`}>
          <div className="max-w-[1280px] w-full mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo Initials only for Minimal style */}
              <Link href="/" className="flex items-center gap-2 group">
                <span className="font-serif text-xl sm:text-2xl font-black text-foreground tracking-widest uppercase">CJB</span>
                <span className="h-5 w-0.5 bg-accent hidden sm:block"></span>
                <span className="text-[10px] tracking-widest text-muted-foreground uppercase hidden sm:block font-bold">Advocacy</span>
              </Link>
  
              {/* Right Side Controls */}
              <div className="flex items-center gap-8">
                <nav className="hidden lg:flex items-center gap-x-6">
                  {navLinks.slice(0, 4).map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-xs font-bold uppercase tracking-wider"
                    >
                      {link.title}
                    </Link>
                  ))}
                </nav>
                
                {/* Advanced Trigger (Slider Menu) */}
                <MobileMenuTrigger isOpen={isOpen} setIsOpen={setIsOpen} navLinks={navLinks} logoUrl={logoUrl} logoAlt={logoAlt} showCTA={showCTA} ctaLabel={ctaLabel} ctaLink={ctaLink} isMinimal />
              </div>
            </div>
          </div>
        </header>
      );
    }
  
    // RENDER: CHAMBERS CLASSIC (Default Layout fallback)
    return (
      <header className={`${isSticky ? "sticky top-0 z-40" : "relative"} w-full font-sans`}>
        <div className="w-full bg-primary border-b border-accent/10 backdrop-blur-xl shadow-sm">
          <div className="max-w-[1280px] w-full mx-auto px-6 md:px-8 lg:px-12 py-4">
            <div className="flex flex-row items-center justify-between gap-4">
              <LogoBranding />
  
              <nav className="hidden lg:flex items-center gap-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="text-white/80 hover:text-accent transition-colors duration-300 text-sm font-semibold uppercase tracking-wider relative group whitespace-nowrap"
                  >
                    {link.title}
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </nav>
  
              <div className="hidden lg:flex items-center shrink-0">
                {showCTA && (
                  <Button asChild className="bg-accent hover:bg-accent/85 text-accent-foreground px-6 h-11 rounded-sm text-sm font-semibold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap">
                    <Link href={ctaLink}>{ctaLabel}</Link>
                  </Button>
                )}
              </div>
  
              <div className="lg:hidden flex items-center">
                <MobileMenuTrigger isOpen={isOpen} setIsOpen={setIsOpen} navLinks={navLinks} logoUrl={logoUrl} logoAlt={logoAlt} showCTA={showCTA} ctaLabel={ctaLabel} ctaLink={ctaLink} />
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
  
  // SHARED MOBILE COMPONENT MENU TRIGGER
  interface MobileMenuTriggerProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    navLinks: { title: string; href: string }[];
    logoUrl: string | null;
    logoAlt: string;
    showCTA: boolean;
    ctaLabel: string;
    ctaLink: string;
    isMinimal?: boolean;
  }
  
  function MobileMenuTrigger({ isOpen, setIsOpen, navLinks, logoUrl, logoAlt, showCTA, ctaLabel, ctaLink, isMinimal }: MobileMenuTriggerProps) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`${isMinimal ? "text-foreground" : "text-white"} hover:bg-white/10 shrink-0`}
            aria-label="Open Navigation Menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="bg-primary border-l-accent/10 w-[300px] p-0 flex flex-col"
        >
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div className="p-8 border-b border-accent/10">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <div className="p-0.5 rounded-sm shrink-0 w-10 h-10 overflow-hidden">
                  <img
                    src={logoUrl}
                    alt={logoAlt}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="bg-white/10 p-1.5 rounded-sm">
                  <span className="text-white font-bold text-lg">JJB</span>
                </div>
              )}
              <h2 className="font-serif text-2xl font-bold text-white">Chambers</h2>
            </div>
          </div>
  
          <div className="flex-1 overflow-y-auto px-8 py-10">
            <nav className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-serif font-bold text-white/80 hover:text-accent transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>
  
          {showCTA && (
            <div className="p-8 border-t border-accent/10 bg-primary/50">
              <Button asChild className="w-full bg-accent hover:bg-accent/85 text-accent-foreground rounded-sm h-14 text-sm font-semibold uppercase tracking-wider transition-all duration-300">
                <Link href={ctaLink} onClick={() => setIsOpen(false)}>{ctaLabel}</Link>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    );
  }
  ```

- [ ] **Step 2: Commit storefront navigation code**
  ```bash
  git add src/components/Navbar.tsx
  git commit -m "storefront: update Navbar to dynamically support Classic, Centered, Glassmorphic, and Minimal layout options"
  ```

---

### Task 4: Compilation and Real-World Verification

- [ ] **Step 1: Run developer compilation checks**
  Run next lint and payload verification.
  Run: `npm run build`
  Expected: Success without TypeScript or linter compile errors.

- [ ] **Step 2: Start dev server**
  Run: `npm run dev`

- [ ] **Step 3: Conduct manual visual verification**
  1. Open Chrome and navigate to the Payload CMS Header page: `http://localhost:3000/admin/globals/header`.
  2. Verify the Live Preview is displayed at the top, showing the responsive viewport simulator.
  3. Change the `Header Layout Style` dropdown (e.g. from `classic` to `glassmorphic`) and confirm the preview immediately updates its look.
  4. Toggle the `showCTA` checkbox and verify the consult button appears/disappears on the fly in the preview.
  5. Save the header changes.
  6. Go to the storefront index page: `http://localhost:3000`.
  7. Confirm the storefront renders the exact chosen style dynamically.
