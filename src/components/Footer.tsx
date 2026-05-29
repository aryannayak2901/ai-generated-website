import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary border-t border-accent/10 font-sans">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Logo/About */}
          <div className="space-y-4">
            <Link
              href="/"
              className="font-serif text-xl lg:text-2xl font-bold tracking-tight text-white block"
            >
              Chambers of Jeet Bhatt
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed font-serif italic">
              Premium legal expertise with modern approach. Trusted advisors for complex legal matters.
            </p>
          </div>

          {/* Column 2: Practice Areas */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-white">
              Practice Areas
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/practice-areas"
                  className="text-muted-foreground text-sm hover:text-accent transition-colors duration-300"
                >
                  Corporate Law
                </Link>
              </li>
              <li>
                <Link
                  href="/practice-areas"
                  className="text-muted-foreground text-sm hover:text-accent transition-colors duration-300"
                >
                  Litigation
                </Link>
              </li>
              <li>
                <Link
                  href="/practice-areas"
                  className="text-muted-foreground text-sm hover:text-accent transition-colors duration-300"
                >
                  Intellectual Property
                </Link>
              </li>
              <li>
                <Link
                  href="/practice-areas"
                  className="text-muted-foreground text-sm hover:text-accent transition-colors duration-300"
                >
                  Real Estate
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: About & Resources */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-white">
              About
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-muted-foreground text-sm hover:text-accent transition-colors duration-300">Our Team</Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground text-sm hover:text-accent transition-colors duration-300">Insights & Blog</Link>
              </li>
              <li>
                <Link href="/offices" className="text-muted-foreground text-sm hover:text-accent transition-colors duration-300">Our Offices</Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground text-sm hover:text-accent transition-colors duration-300">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-white">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start text-muted-foreground text-sm">
                <MapPin className="h-5 w-5 mr-3 flex-shrink-0 text-accent mt-0.5" />
                <span>
                  Gandhinagar, Gujarat
                  <br />
                  India
                </span>
              </li>
              <li className="flex items-center text-muted-foreground text-sm">
                <Phone className="h-5 w-5 mr-3 flex-shrink-0 text-accent" />
                <span>+91 94082 82982</span>
              </li>
              <li className="flex items-center text-muted-foreground text-sm">
                <Mail className="h-5 w-5 mr-3 flex-shrink-0 text-accent" />
                <span>info@jeetbhatt.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-accent/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Chambers of Jeet Bhatt. All rights
              reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link
                href="/privacy"
                className="text-muted-foreground text-sm hover:text-accent transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground text-sm hover:text-accent transition-colors duration-300"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
