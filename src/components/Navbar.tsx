"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

interface NavbarProps {
  headerData?: {
    logo?: any;
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

  return (
    <header className="sticky top-0 z-40 w-full font-sans">
      {/* Main Navigation Header */}
      <div className="w-full bg-primary border-b border-accent/10 backdrop-blur-xl shadow-sm">
        <div className="max-w-[1280px] w-full mx-auto px-6 md:px-8 lg:px-12 py-4">
          <div className="flex flex-row items-center justify-between gap-4">
            {/* Left: Branding */}
            <Link
              href="/"
              className="flex items-center gap-3 group shrink-0"
            >
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
              <div className="flex flex-col justify-center overflow-hidden">
                <span className="font-serif text-base sm:text-lg lg:text-xl font-bold text-white leading-tight group-hover:text-accent transition-colors duration-300 whitespace-nowrap">
                  Chambers of Jeet Bhatt
                </span>
                <p className="text-muted-foreground font-sans text-[9px] sm:text-[10px] tracking-[0.15em] uppercase font-semibold mt-0.5 whitespace-nowrap hidden sm:block">
                  Advocates & Legal Strategists
                </p>
              </div>
            </Link>

            {/* Center: Navigation Links (Desktop) */}
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

            {/* Right: CTA Button (Desktop) */}
            <div className="hidden lg:flex items-center shrink-0">
              <Button asChild className="bg-accent hover:bg-accent/85 text-accent-foreground px-6 h-11 rounded-sm text-sm font-semibold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap">
                <Link href="/contact">Get In Touch</Link>
              </Button>
            </div>

            {/* Mobile Nav Toggle */}
            <div className="lg:hidden flex items-center">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 shrink-0"
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
                          <span className="text-white font-bold text-lg">
                            JJB
                          </span>
                        </div>
                      )}
                      <h2 className="font-serif text-2xl font-bold text-white">
                        Chambers
                      </h2>
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

                  <div className="p-8 border-t border-accent/10 bg-primary/50">
                    <Button asChild className="w-full bg-accent hover:bg-accent/85 text-accent-foreground rounded-sm h-14 text-sm font-semibold uppercase tracking-wider transition-all duration-300">
                      <Link href="/contact" onClick={() => setIsOpen(false)}>Get In Touch</Link>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
