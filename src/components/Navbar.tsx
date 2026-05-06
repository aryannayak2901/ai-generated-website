"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "About CJB", href: "/about" },
  { title: "Practice Areas", href: "/practice-areas" },
  { title: "Blog", href: "/blog" },
  { title: "Media", href: "/media" },
  { title: "Offices", href: "/offices" },
  { title: "Contact", href: "/contact" },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full font-sans">
      {/* Top Info Bar */}
      <div className="w-full bg-navy py-2 sm:py-2.5 px-4 shadow-sm border-b border-white/10 overflow-hidden">
        <div className="max-w-[1400px] w-full mx-auto flex flex-row justify-center lg:justify-between items-center gap-4 sm:gap-6 text-[9px] sm:text-[10px] md:text-xs font-bold tracking-[0.1em] sm:tracking-[0.15em] text-white/80 uppercase">
          <div className="flex items-center gap-4 sm:gap-10">
            <a
              href="tel:+919408282982"
              className="flex items-center gap-1.5 sm:gap-2 hover:text-gold transition-all duration-300 whitespace-nowrap group"
            >
              <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-gold transition-colors">
                +91 94082 82982
              </span>
            </a>
            <a
              href="mailto:info@jeetbhatt.com"
              className="flex items-center gap-1.5 sm:gap-2 hover:text-gold transition-all duration-300 whitespace-nowrap group"
            >
              <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-gold transition-colors">
                info@jeetbhatt.com
              </span>
            </a>
          </div>
          <div className="hidden lg:flex items-center gap-2.5 hover:text-gold transition-all duration-300 cursor-pointer whitespace-nowrap group">
            <MapPin className="h-3.5 w-3.5 text-gold group-hover:scale-110 transition-transform" />
            <span className="group-hover:text-gold transition-colors">
              Ahmedabad, Gujarat, India
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="w-full bg-white/90 dark:bg-navy/95 backdrop-blur-xl border-b border-navy/5 dark:border-white/5 transition-colors duration-500 shadow-sm">
        <div className="max-w-[1400px] w-full mx-auto px-3 xs:px-4 lg:px-8 py-3.5 sm:py-4">
          <div className="flex flex-row items-center justify-between gap-2 xs:gap-4">
            {/* Left: Branding */}
            <Link
              href="/"
              className="flex items-center gap-2 xs:gap-4 group shrink-0"
            >
              <div className="flex flex-col items-center justify-center bg-navy dark:bg-white p-1.5 sm:p-2 rounded-sm shrink-0 w-8 h-8 xs:w-10 xs:h-10 xl:w-12 xl:h-12 shadow-xl transition-all duration-500 group-hover:scale-105">
                <span className="text-white dark:text-navy font-serif font-bold text-[10px] xs:text-xs sm:text-sm xl:text-lg leading-none">
                  JJB
                </span>
              </div>
              <div className="flex flex-col justify-center overflow-hidden">
                <span className="font-serif text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-navy dark:text-white leading-tight group-hover:text-gold transition-colors duration-300 whitespace-nowrap">
                  Chambers of Jeet Bhatt
                </span>
                <p className="text-slate-500 dark:text-slate-400 font-sans text-[7px] sm:text-[9px] md:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] uppercase font-bold mt-0.5 whitespace-nowrap hidden sm:block">
                  Advocates & Legal Strategists
                </p>
              </div>
            </Link>

            {/* Center/Right: Navigation & Actions (Desktop) */}
            <div className="hidden lg:flex flex-row items-center gap-8 shrink-0">
              {/* Nav Links */}
              <nav className="flex items-center gap-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="text-navy dark:text-slate-300 hover:text-gold dark:hover:text-gold transition-all duration-300 text-xs xl:text-sm font-bold uppercase tracking-widest relative group whitespace-nowrap"
                  >
                    {link.title}
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </nav>

              {/* CTA Actions */}
              <div className="flex items-center gap-6 pl-8 border-l border-navy/10 dark:border-white/10 h-10 shrink-0">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="text-navy dark:text-slate-300 hover:text-gold dark:hover:text-gold flex items-center justify-center p-2 rounded-full hover:bg-navy/5 dark:hover:bg-white/5 transition-all duration-300 shrink-0 shadow-inner"
                  aria-label="Toggle Dark Mode"
                >
                  {mounted && theme === "dark" ? (
                    <Sun className="h-5 w-5 text-gold animate-pulse" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
                <Button asChild className="bg-gold text-navy hover:bg-navy hover:text-white dark:hover:bg-white px-6 h-11 rounded-none text-xs font-bold uppercase tracking-[0.15em] transition-all duration-500 shadow-[0_5px_15px_rgba(212,175,55,0.2)] hover:shadow-[0_10px_25px_rgba(212,175,55,0.3)] whitespace-nowrap shrink-0">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>

            {/* Mobile Nav Toggle */}
            <div className="lg:hidden flex items-center gap-1.5 xs:gap-4">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-navy dark:text-white p-1.5 xs:p-2 rounded-full hover:bg-navy/5 dark:hover:bg-white/5 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {mounted && theme === "dark" ? (
                  <Sun className="h-4 w-4 xs:h-5 xs:w-5 text-gold" />
                ) : (
                  <Moon className="h-4 w-4 xs:h-5 xs:w-5" />
                )}
              </button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-navy dark:text-white hover:bg-navy/5 dark:hover:bg-white/10 shrink-0"
                    aria-label="Open Navigation Menu"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="bg-white dark:bg-navy border-l-navy/5 dark:border-l-white/10 w-[300px] p-0 flex flex-col"
                >
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <div className="p-8 border-b border-navy/5 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="bg-navy dark:bg-white p-1.5 rounded-sm">
                        <span className="text-white dark:text-navy font-bold text-lg">
                          JJB
                        </span>
                      </div>
                      <h2 className="font-serif text-2xl font-bold text-navy dark:text-white">
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
                          className="text-xl font-serif font-bold text-navy dark:text-slate-200 hover:text-gold dark:hover:text-gold transition-colors"
                        >
                          {link.title}
                        </Link>
                      ))}
                    </nav>
                  </div>
                  {/* now create the admin panel where admin user can login and can manage the content. */}

                  <div className="p-8 border-t border-navy/5 dark:border-white/10 bg-slate-50 dark:bg-navy/50">
                    <Button className="w-full bg-gold text-navy hover:bg-navy hover:text-white rounded-none h-14 text-sm font-bold uppercase tracking-[0.2em] transition-all">
                      Schedule Consultation
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
