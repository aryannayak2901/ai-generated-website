import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-surface border-t border-slate-200 dark:bg-navy dark:border-white/5 font-sans">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Column 1: Branding */}
          <div className="space-y-4">
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-tight text-navy dark:text-white block"
            >
              Chambers of Jeet Bhatt
            </Link>
            <p className="text-slate-gray dark:text-slate-gray/80 text-sm md:text-base max-w-xs leading-relaxed font-serif italic">
              Excellence in Legal Counsel
            </p>
          </div>

          {/* Column 2: Contact */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-navy dark:text-white">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start text-slate-gray dark:text-slate-gray/80 text-sm">
                <MapPin className="h-5 w-5 mr-3 flex-shrink-0 text-gold" />
                <span>
                  Gandhinagar Office
                  <br />
                  Gujarat, India
                </span>
              </li>
              <li className="flex items-center text-slate-gray dark:text-slate-gray/80 text-sm">
                <Phone className="h-5 w-5 mr-3 flex-shrink-0 text-gold" />
                <span>+91 XXXXX XXXXX</span>
              </li>
              <li className="flex items-center text-slate-gray dark:text-slate-gray/80 text-sm">
                <Mail className="h-5 w-5 mr-3 flex-shrink-0 text-gold" />
                <span>contact@jeetbhatt.in</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-navy dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/practice-areas"
                  className="text-slate-gray dark:text-slate-gray/80 text-sm hover:text-gold transition-colors"
                >
                  Practice Areas
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-gray dark:text-slate-gray/80 text-sm hover:text-gold transition-colors"
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link
                  href="/insights"
                  className="text-slate-gray dark:text-slate-gray/80 text-sm hover:text-gold transition-colors"
                >
                  Insights & Blogs
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-gray dark:text-slate-gray/80 text-sm hover:text-gold transition-colors"
                >
                  Consultation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-gray dark:text-slate-gray/80 text-sm">
              © {new Date().getFullYear()} Chambers of Jeet Bhatt. All rights
              reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link
                href="/privacy"
                className="text-slate-gray dark:text-slate-gray/80 text-sm hover:text-navy dark:hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-slate-gray dark:text-slate-gray/80 text-sm hover:text-navy dark:hover:text-white transition-colors"
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
