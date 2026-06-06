"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Menu, X, ChevronDown } from "lucide-react";
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
    headerStyle?:
      | "classic"
      | "centered"
      | "glassmorphic"
      | "minimal"
      | "split"
      | "sidebar"
      | "corporate"
      | "island"
      | "mega"
      | null;
    sticky?: boolean | null;
    showCTA?: boolean | null;
    ctaLabel?: string | null;
    ctaLink?: string | null;
    navItems?:
      | {
          label: string;
          link: string;
          id?: string | null;
        }[]
      | null;
    splitSettings?: {
      leftNavItems?: { label: string; link: string }[] | null;
      rightNavItems?: { label: string; link: string }[] | null;
    } | null;
    corporateSettings?: {
      contactEmail?: string | null;
      contactPhone?: string | null;
    } | null;
    sidebarSettings?: {
      drawerPosition?: "left" | "right" | null;
      menuLabel?: string | null;
      navItems?: { label: string; link: string }[] | null;
    } | null;
    megaNavSettings?: {
      megaNavItems?: {
        label: string;
        link: string;
        dropdownColumns?: {
          columnTitle?: string | null;
          subLinks?: { label: string; link: string }[] | null;
        }[] | null;
      }[] | null;
    } | null;
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

  const splitSettings = headerData?.splitSettings || {};
  const leftNavLinks = splitSettings.leftNavItems?.length ? splitSettings.leftNavItems.map((item) => ({ title: item.label, href: item.link })) : navLinks.slice(0, Math.ceil(navLinks.length / 2));
  const rightNavLinks = splitSettings.rightNavItems?.length ? splitSettings.rightNavItems.map((item) => ({ title: item.label, href: item.link })) : navLinks.slice(Math.ceil(navLinks.length / 2));

  const corporateSettings = headerData?.corporateSettings || {};
  const contactEmail = corporateSettings.contactEmail || "contact@jeetbhatt.com";
  const contactPhone = corporateSettings.contactPhone || "+91 123 456 7890";

  const sidebarSettings = headerData?.sidebarSettings || {};
  const drawerPosition = sidebarSettings.drawerPosition || "right";
  const menuLabel = sidebarSettings.menuLabel || "Menu";
  const sidebarNavLinks = sidebarSettings.navItems?.length ? sidebarSettings.navItems.map((item) => ({ title: item.label, href: item.link })) : navLinks;

  const megaNavSettings = headerData?.megaNavSettings || {};
  const megaNavItems = megaNavSettings.megaNavItems || navLinks.map((n) => ({ label: n.title, link: n.href, dropdownColumns: [] }));

  const logoUrl =
    typeof headerData?.logo === "object" && headerData?.logo?.url
      ? headerData.logo.url
      : null;
  const logoAlt =
    typeof headerData?.logo === "object" && headerData?.logo?.alt
      ? headerData.logo.alt
      : "Chambers of Jeet Bhatt Logo";

  // RENDER: GLASSMORPHIC FLOAT
  if (headerStyle === "glassmorphic") {
    return (
      <header
        className={`${isSticky ? "sticky top-0 z-40" : "relative"} w-full transition-all duration-500 ease-out ${scrolled ? "px-6 py-2" : "px-0 py-0"}`}
      >
        <div
          className={`mx-auto transition-all duration-500 ease-out overflow-hidden ${
            scrolled
              ? "max-w-[1280px] px-6 md:px-8 py-3 rounded-full border bg-primary/95 backdrop-blur-xl border-accent/20 shadow-2xl"
              : "w-full max-w-none bg-primary/85 backdrop-blur-md border-b border-accent/15 rounded-none px-6 md:px-8 lg:px-12 py-4"
          }`}
        >
          <div className="flex flex-row items-center justify-between gap-4">
            <LogoBranding logoUrl={logoUrl} logoAlt={logoAlt} />

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
                <Button
                  asChild
                  className="hidden lg:flex bg-accent hover:bg-accent/85 text-accent-foreground px-6 h-10 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md"
                >
                  <Link href={ctaLink}>{ctaLabel}</Link>
                </Button>
              )}

              {/* Mobile Trigger */}
              <div className="lg:hidden flex items-center">
                <MobileMenuTrigger
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  navLinks={navLinks}
                  logoUrl={logoUrl}
                  logoAlt={logoAlt}
                  showCTA={showCTA}
                  ctaLabel={ctaLabel}
                  ctaLink={ctaLink}
                />
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // RENDER: CENTERED LUXURY
  if (headerStyle === "centered") {
    return (
      <header
        className={`${isSticky ? "sticky top-0 z-40" : "relative"} w-full bg-primary border-b border-accent/10 shadow-sm transition-all duration-300`}
      >
        <div className="max-w-[1280px] w-full mx-auto px-6 py-4 flex flex-col items-center gap-4">
          {/* Top Deck: Branding */}
          <div className="flex items-center justify-between w-full lg:justify-center">
            <Link href="/" className="flex flex-col items-center gap-1 group">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt={logoAlt}
                  className="w-12 h-12 object-contain mb-1 transition-transform group-hover:scale-105"
                />
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
              <MobileMenuTrigger
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                navLinks={navLinks}
                logoUrl={logoUrl}
                logoAlt={logoAlt}
                showCTA={showCTA}
                ctaLabel={ctaLabel}
                ctaLink={ctaLink}
              />
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
              <Button
                asChild
                className="bg-accent hover:bg-accent/85 text-accent-foreground px-5 h-9 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all duration-300"
              >
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
      <header
        className={`${isSticky ? "sticky top-0 z-40" : "relative"} w-full bg-background border-b border-border shadow-sm`}
      >
        <div className="max-w-[1280px] w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Initials only for Minimal style */}
            <LogoBranding
              isMinimalMode={true}
              logoUrl={logoUrl}
              logoAlt={logoAlt}
            />

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
              <MobileMenuTrigger
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                navLinks={navLinks}
                logoUrl={logoUrl}
                logoAlt={logoAlt}
                showCTA={showCTA}
                ctaLabel={ctaLabel}
                ctaLink={ctaLink}
                isMinimal={true}
              />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // RENDER: SPLIT LUXURY
  if (headerStyle === "split") {
    return (
      <header
        className={`${isSticky ? "sticky top-0 z-40" : "relative"} w-full bg-primary border-b border-accent/20 shadow-lg`}
      >
        <div className="max-w-[1280px] w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between lg:justify-center gap-4 lg:gap-12">
            {/* Left Nav (Desktop) */}
            <nav className="hidden lg:flex flex-1 justify-end items-center gap-x-8">
              {leftNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="text-white/80 hover:text-accent transition-colors duration-300 text-xs font-semibold uppercase tracking-widest whitespace-nowrap"
                >
                  {link.title}
                </Link>
              ))}
            </nav>

            {/* Center Logo */}
            <LogoBranding logoUrl={logoUrl} logoAlt={logoAlt} />

            {/* Right Nav (Desktop) */}
            <nav className="hidden lg:flex flex-1 justify-start items-center gap-x-8">
              {rightNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="text-white/80 hover:text-accent transition-colors duration-300 text-xs font-semibold uppercase tracking-widest whitespace-nowrap"
                >
                  {link.title}
                </Link>
              ))}
              {showCTA && (
                <Button
                  asChild
                  className="ml-4 bg-transparent border border-accent text-accent hover:bg-accent/10 px-5 h-9 rounded-sm text-xs font-semibold uppercase tracking-widest transition-all duration-300 whitespace-nowrap"
                >
                  <Link href={ctaLink}>{ctaLabel}</Link>
                </Button>
              )}
            </nav>

            {/* Mobile Trigger */}
            <div className="lg:hidden">
              <MobileMenuTrigger
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                navLinks={navLinks}
                logoUrl={logoUrl}
                logoAlt={logoAlt}
                showCTA={showCTA}
                ctaLabel={ctaLabel}
                ctaLink={ctaLink}
              />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // RENDER: SIDEBAR / APP STYLE
  if (headerStyle === "sidebar") {
    return (
      <header
        className={`${isSticky ? "sticky top-0 z-40" : "relative"} w-full bg-[#060911] border-b border-white/5`}
      >
        <div className="w-full px-6 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Permanent Menu Trigger */}
            <MobileMenuTrigger
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              navLinks={sidebarNavLinks}
              logoUrl={logoUrl}
              logoAlt={logoAlt}
              showCTA={showCTA}
              ctaLabel={ctaLabel}
              ctaLink={ctaLink}
              side={drawerPosition}
            />

            <div className="hidden sm:block">
              <span className="text-white/60 text-xs uppercase tracking-[0.2em] font-semibold">
                {menuLabel}
              </span>
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
            <LogoBranding logoUrl={logoUrl} logoAlt={logoAlt} />
          </div>

          <div>
            {showCTA ? (
              <Button
                asChild
                className="hidden sm:flex bg-accent hover:bg-accent/85 text-accent-foreground px-5 h-9 rounded-md text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-sm"
              >
                <Link href={ctaLink}>{ctaLabel}</Link>
              </Button>
            ) : (
              <div className="w-20 hidden sm:block" />
            )}
          </div>
        </div>
      </header>
    );
  }

  // RENDER: TOP BAR CORPORATE
  if (headerStyle === "corporate") {
    return (
      <header
        className={`${isSticky ? "sticky top-0 z-40" : "relative"} w-full flex flex-col`}
      >
        {/* Top Tier */}
        <div className="w-full bg-[#0a0e1a] border-b border-white/5">
          <div className="max-w-[1280px] mx-auto px-6 py-2 flex justify-end">
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">
              {contactEmail} | {contactPhone}
            </span>
          </div>
        </div>

        {/* Main Tier */}
        <div className="w-full bg-primary shadow-lg border-b border-accent/10">
          <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between">
            <LogoBranding logoUrl={logoUrl} logoAlt={logoAlt} />

            <div className="hidden lg:flex items-center gap-8">
              <nav className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="text-white/80 hover:text-accent transition-colors duration-300 text-xs font-bold uppercase tracking-widest"
                  >
                    {link.title}
                  </Link>
                ))}
              </nav>
              {showCTA && (
                <Button
                  asChild
                  className="bg-transparent border border-accent text-accent hover:bg-accent/10 px-5 h-9 rounded-sm text-xs font-semibold uppercase tracking-widest transition-all duration-300 whitespace-nowrap"
                >
                  <Link href={ctaLink}>{ctaLabel}</Link>
                </Button>
              )}
            </div>

            <div className="lg:hidden">
              <MobileMenuTrigger
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                navLinks={navLinks}
                logoUrl={logoUrl}
                logoAlt={logoAlt}
                showCTA={showCTA}
                ctaLabel={ctaLabel}
                ctaLink={ctaLink}
              />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // RENDER: FLOATING ISLAND
  if (headerStyle === "island") {
    return (
      <header
        className={`${isSticky ? "fixed top-0 z-50" : "absolute top-0 z-50"} w-full pt-4 md:pt-6 px-4 md:px-6 pointer-events-none`}
      >
        <div className="mx-auto max-w-[800px] bg-primary/95 backdrop-blur-xl border border-accent/30 rounded-full px-6 md:px-8 py-3 shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-center justify-between pointer-events-auto">
          <Link href="/" className="flex items-center shrink-0 group">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={logoAlt}
                className="h-8 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <span className="font-serif text-lg font-bold text-white tracking-widest uppercase group-hover:text-accent transition-colors duration-300">
                CJB
              </span>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-white/80 hover:text-accent transition-colors duration-300 text-[10px] font-bold uppercase tracking-widest"
              >
                {link.title}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {showCTA && (
              <Button
                asChild
                className="hidden sm:flex bg-accent hover:bg-accent/85 text-accent-foreground px-5 h-8 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300"
              >
                <Link href={ctaLink}>{ctaLabel}</Link>
              </Button>
            )}
            <div className="lg:hidden">
              <MobileMenuTrigger
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                navLinks={navLinks}
                logoUrl={logoUrl}
                logoAlt={logoAlt}
                showCTA={showCTA}
                ctaLabel={ctaLabel}
                ctaLink={ctaLink}
              />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // RENDER: MEGA-NAV PORTAL
  if (headerStyle === "mega") {
    return (
      <header
        className={`${isSticky ? "sticky top-0 z-40" : "relative"} w-full bg-primary border-b border-white/5`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
          <LogoBranding logoUrl={logoUrl} logoAlt={logoAlt} />

          <nav className="hidden lg:flex items-center gap-x-8">
            {megaNavItems.map((item) => (
              <div key={item.label} className="relative group">
                <Link
                  href={item.link}
                  className="text-white/80 hover:text-accent transition-colors duration-300 text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5 py-4"
                >
                  {item.label}
                  {item.dropdownColumns && item.dropdownColumns.length > 0 && (
                    <span className="text-[8px] opacity-50 group-hover:opacity-100 transition-opacity">
                      ▼
                    </span>
                  )}
                </Link>

                {/* Dropdown Menu (only if columns exist) */}
                {item.dropdownColumns && item.dropdownColumns.length > 0 && (
                  <div className="absolute top-[100%] left-0 bg-primary/95 backdrop-blur-xl border border-accent/20 border-t-0 p-6 flex gap-10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-[400px] z-50">
                    {item.dropdownColumns.map((col, idx) => (
                      <div key={idx} className="flex flex-col min-w-[150px]">
                        {col.columnTitle && (
                          <h4 className="text-accent text-[10px] font-bold uppercase tracking-[0.1em] mb-4">
                            {col.columnTitle}
                          </h4>
                        )}
                        <div className="flex flex-col gap-3">
                          {col.subLinks?.map((subLink, sIdx) => (
                            <Link
                              key={sIdx}
                              href={subLink.link}
                              className="text-white/70 hover:text-white text-xs font-medium transition-colors"
                            >
                              {subLink.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {showCTA && (
              <Button
                asChild
                className="ml-4 bg-transparent border border-accent text-accent hover:bg-accent/10 px-6 h-10 rounded-sm text-xs font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap"
              >
                <Link href={ctaLink}>{ctaLabel}</Link>
              </Button>
            )}
          </nav>

          <div className="lg:hidden">
            <MobileMenuTrigger
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              navLinks={navLinks}
              megaNavItems={megaNavItems}
              logoUrl={logoUrl}
              logoAlt={logoAlt}
              showCTA={showCTA}
              ctaLabel={ctaLabel}
              ctaLink={ctaLink}
            />
          </div>
        </div>
      </header>
    );
  }

  // RENDER: CHAMBERS CLASSIC (Default Layout fallback)
  return (
    <header
      className={`${isSticky ? "sticky top-0 z-40" : "relative"} w-full font-sans`}
    >
      <div className="w-full bg-primary border-b border-accent/10 backdrop-blur-xl shadow-sm">
        <div className="max-w-[1280px] w-full mx-auto px-6 md:px-8 lg:px-12 py-4">
          <div className="flex flex-row items-center justify-between gap-4">
            <LogoBranding logoUrl={logoUrl} logoAlt={logoAlt} />

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
                <Button
                  asChild
                  className="bg-accent hover:bg-accent/85 text-accent-foreground px-6 h-11 rounded-sm text-sm font-semibold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                >
                  <Link href={ctaLink}>{ctaLabel}</Link>
                </Button>
              )}
            </div>

            <div className="lg:hidden flex items-center">
              <MobileMenuTrigger
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                navLinks={navLinks}
                logoUrl={logoUrl}
                logoAlt={logoAlt}
                showCTA={showCTA}
                ctaLabel={ctaLabel}
                ctaLink={ctaLink}
              />
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
  side?: "left" | "right";
  megaNavItems?: {
    label: string;
    link: string;
    dropdownColumns?: {
      columnTitle?: string | null;
      subLinks?: { label: string; link: string }[] | null;
    }[] | null;
  }[] | null;
}

function MobileMenuTrigger({
  isOpen,
  setIsOpen,
  navLinks,
  logoUrl,
  logoAlt,
  showCTA,
  ctaLabel,
  ctaLink,
  isMinimal,
  side,
  megaNavItems,
}: MobileMenuTriggerProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleExpand = (label: string) => {
    setExpandedItem((prev) => (prev === label ? null : label));
  };

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
        side={side || "right"}
        className={`${isMinimal ? "bg-background border-l-border text-foreground" : "bg-primary border-l-accent/10 text-white"} w-[300px] p-0 flex flex-col`}
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div
          className={`p-8 border-b ${isMinimal ? "border-border" : "border-accent/10"}`}
        >
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
              <div
                className={`${isMinimal ? "bg-accent/15" : "bg-white/10"} p-1.5 rounded-sm shrink-0 w-10 h-10 flex items-center justify-center`}
              >
                <span
                  className={`${isMinimal ? "text-accent font-bold" : "text-white font-bold"} text-lg`}
                >
                  JJB
                </span>
              </div>
            )}
            <h2
              className={`font-serif text-2xl font-bold ${isMinimal ? "text-foreground" : "text-white"}`}
            >
              Chambers
            </h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-10">
          <nav className="flex flex-col space-y-6">
            {megaNavItems && megaNavItems.length > 0 ? (
              megaNavItems.map((item) => (
                <div key={item.label} className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.link}
                      onClick={() => setIsOpen(false)}
                      className={`text-xl font-serif font-bold ${isMinimal ? "text-foreground/80 hover:text-accent" : "text-white/80 hover:text-accent"} transition-colors`}
                    >
                      {item.label}
                    </Link>
                    {item.dropdownColumns && item.dropdownColumns.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(item.label)}
                        className="p-1 text-white/50 hover:text-accent transition-colors"
                      >
                        <ChevronDown
                          className={`h-5 w-5 transition-transform duration-300 ${expandedItem === item.label ? "rotate-180 text-accent" : ""}`}
                        />
                      </button>
                    )}
                  </div>
                  <AnimatePresence>
                    {expandedItem === item.label && item.dropdownColumns && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden flex flex-col gap-6 pl-4 border-l border-accent/20 mt-2"
                      >
                        {item.dropdownColumns.map((col, cIdx) => (
                          <div key={cIdx} className="flex flex-col space-y-3">
                            {col.columnTitle && (
                              <h4 className="text-[10px] uppercase tracking-widest text-accent font-bold">
                                {col.columnTitle}
                              </h4>
                            )}
                            <div className="flex flex-col space-y-3">
                              {col.subLinks?.map((subLink, sIdx) => (
                                <Link
                                  key={sIdx}
                                  href={subLink.link}
                                  onClick={() => setIsOpen(false)}
                                  className={`text-sm font-medium ${isMinimal ? "text-foreground/60 hover:text-accent" : "text-white/60 hover:text-white"} transition-colors`}
                                >
                                  {subLink.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              navLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-xl font-serif font-bold ${isMinimal ? "text-foreground/80 hover:text-accent" : "text-white/80 hover:text-accent"} transition-colors`}
                >
                  {link.title}
                </Link>
              ))
            )}
          </nav>
        </div>

        {showCTA && (
          <div
            className={`p-8 border-t ${isMinimal ? "border-border bg-muted/20" : "border-accent/10 bg-primary/50"}`}
          >
            <Button
              asChild
              className="w-full bg-accent hover:bg-accent/85 text-accent-foreground rounded-sm h-14 text-sm font-semibold uppercase tracking-wider transition-all duration-300"
            >
              <Link href={ctaLink} onClick={() => setIsOpen(false)}>
                {ctaLabel}
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Outer Standalone Logo Branding Component
interface LogoBrandingProps {
  isMinimalMode?: boolean;
  logoUrl: string | null;
  logoAlt: string;
}

function LogoBranding({
  isMinimalMode = false,
  logoUrl,
  logoAlt,
}: LogoBrandingProps) {
  if (isMinimalMode) {
    return (
      <Link href="/" className="flex items-center gap-2 group shrink-0">
        <span className="font-serif text-xl sm:text-2xl font-black text-foreground tracking-widest uppercase hover:text-accent transition-colors duration-300">
          CJB
        </span>
        <span className="h-5 w-0.5 bg-accent/50 hidden sm:block"></span>
        <span className="text-[10px] tracking-widest text-muted-foreground uppercase hidden sm:block font-bold">
          Advocacy
        </span>
      </Link>
    );
  }

  return (
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
}
