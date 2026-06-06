import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export interface FooterProps {
  footerData?: any;
}

export function Footer({ footerData }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Extract variables with fallbacks to static defaults
  const footerStyle = footerData?.footerStyle || "classic";
  
  const companyInfo = footerData?.companyInfo || {
    logoText: "Chambers of Jeet Bhatt",
    description: "Premium legal expertise with modern approach. Trusted advisors for complex legal matters."
  };

  const navColumns = footerData?.navColumns?.length > 0 ? footerData.navColumns : [
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

  const contactInfo = footerData?.contactInfo || {
    title: "Contact",
    address: "Gandhinagar, Gujarat\nIndia",
    phone: "+91 94082 82982",
    email: "info@jeetbhatt.com"
  };

  const socialLinks = footerData?.socialLinks || [];

  const bottomSection = footerData?.bottomSection || {
    copyrightText: `© ${currentYear} Chambers of Jeet Bhatt. All rights reserved.`,
    legalLinks: [
      { label: "Privacy Policy", link: "/privacy" },
      { label: "Terms of Service", link: "/terms" },
    ]
  };

  const copyrightReplaced = bottomSection.copyrightText?.replace('{year}', currentYear.toString());

  // ==========================================
  // RENDER HELPERS
  // ==========================================

  const renderSocialIcon = (platform: string) => {
    switch(platform) {
      case 'facebook': return <Facebook className="h-5 w-5" />;
      case 'twitter': return <Twitter className="h-5 w-5" />;
      case 'linkedin': return <Linkedin className="h-5 w-5" />;
      case 'instagram': return <Instagram className="h-5 w-5" />;
      default: return null;
    }
  };

  const renderSocialLinksSection = () => {
    if (!socialLinks || socialLinks.length === 0) return null;
    return (
      <div className="flex space-x-4 items-center">
        {socialLinks.map((social: any, index: number) => (
          <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors duration-300">
            {renderSocialIcon(social.platform)}
          </a>
        ))}
      </div>
    );
  };

  const renderCopyrightSection = () => (
    <div className="mt-12 pt-8 border-t border-accent/10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-muted-foreground text-sm">
          {copyrightReplaced}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4 md:space-x-6">
          {Array.isArray(bottomSection?.legalLinks) && bottomSection.legalLinks.map((legal: any, index: number) => (
            <Link
              key={index}
              href={legal.link}
              className="text-muted-foreground text-sm hover:text-accent transition-colors duration-300"
            >
              {legal.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContactSection = () => (
    <ul className="space-y-3">
      {contactInfo.address && (
        <li className="flex items-start text-muted-foreground text-sm">
          <MapPin className="h-5 w-5 mr-3 flex-shrink-0 text-accent mt-0.5" />
          <span className="whitespace-pre-line">{contactInfo.address}</span>
        </li>
      )}
      {contactInfo.phone && (
        <li className="flex items-center text-muted-foreground text-sm">
          <Phone className="h-5 w-5 mr-3 flex-shrink-0 text-accent" />
          <span>{contactInfo.phone}</span>
        </li>
      )}
      {contactInfo.email && (
        <li className="flex items-center text-muted-foreground text-sm">
          <Mail className="h-5 w-5 mr-3 flex-shrink-0 text-accent" />
          <span>{contactInfo.email}</span>
        </li>
      )}
    </ul>
  );

  // ==========================================
  // LAYOUTS
  // ==========================================

  if (footerStyle === 'minimal') {
    return (
      <footer className="bg-[#020617] border-t border-accent/5 font-sans pb-8">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12 py-16">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 border-b border-accent/10 pb-12">
            <div className="max-w-md space-y-6">
              <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-white block">
                {companyInfo.logoText}
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                {companyInfo.description}
              </p>
              {renderSocialLinksSection()}
            </div>
            
            <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
              {navColumns.map((col: any, index: number) => (
                <div key={index} className="space-y-6">
                  <h3 className="font-sans text-xs uppercase tracking-widest text-accent font-semibold">
                    {col.title}
                  </h3>
                  <ul className="space-y-4">
                    {Array.isArray(col.links) && col.links.map((linkItem: any, linkIndex: number) => (
                      <li key={linkIndex}>
                        <Link href={linkItem.link} className="text-slate-300 text-sm hover:text-white transition-colors duration-300">
                          {linkItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-xs">
              {copyrightReplaced}
            </p>
            <div className="flex flex-wrap gap-6">
              {Array.isArray(bottomSection?.legalLinks) && bottomSection.legalLinks.map((legal: any, index: number) => (
                <Link key={index} href={legal.link} className="text-slate-500 text-xs hover:text-slate-300 transition-colors">
                  {legal.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (footerStyle === 'newsletter') {
    const newsletter = footerData?.newsletter || {
      heading: 'Subscribe to Our Insights',
      description: 'Get the latest legal updates and strategies delivered to your inbox.',
      placeholder: 'Enter your email address',
      buttonText: 'Subscribe'
    };

    return (
      <footer className="bg-primary font-sans">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-b border-accent/10 pb-16">
            
            {/* Newsletter Section (Left, large) */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl text-white font-bold">{newsletter.heading}</h2>
              <p className="text-muted-foreground text-base">{newsletter.description}</p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <input 
                  type="email" 
                  placeholder={newsletter.placeholder} 
                  className="flex-1 bg-white/5 border border-white/10 rounded-md px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
                />
                <button className="bg-accent text-primary px-6 py-3 rounded-md text-sm font-bold uppercase tracking-wider hover:bg-accent/90 transition-colors">
                  {newsletter.buttonText}
                </button>
              </div>
              {renderSocialLinksSection()}
            </div>

            {/* Links and Contact (Right) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {navColumns.map((col: any, index: number) => (
                <div key={index} className="space-y-5">
                  <h3 className="font-serif text-lg font-semibold text-white">{col.title}</h3>
                  <ul className="space-y-3">
                    {Array.isArray(col.links) && col.links.map((linkItem: any, linkIndex: number) => (
                      <li key={linkIndex}>
                        <Link href={linkItem.link} className="text-muted-foreground text-sm hover:text-accent transition-colors">
                          {linkItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="space-y-5">
                <h3 className="font-serif text-lg font-semibold text-white">{contactInfo.title}</h3>
                {renderContactSection()}
              </div>
            </div>
          </div>
          
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="font-serif text-xl font-bold tracking-tight text-white block">
              {companyInfo.logoText}
            </Link>
            <div className="flex flex-wrap gap-6 items-center">
              <p className="text-muted-foreground text-sm">{copyrightReplaced}</p>
              <div className="hidden md:block w-px h-4 bg-white/10"></div>
              {Array.isArray(bottomSection?.legalLinks) && bottomSection.legalLinks.map((legal: any, index: number) => (
                <Link key={index} href={legal.link} className="text-muted-foreground text-sm hover:text-accent transition-colors">
                  {legal.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (footerStyle === 'split') {
    return (
      <footer className="flex flex-col lg:flex-row font-sans">
        {/* Left Side (Darker) */}
        <div className="bg-[#060911] w-full lg:w-5/12 p-12 lg:p-24 flex flex-col justify-between">
          <div className="space-y-8">
            <Link href="/" className="font-serif text-3xl font-bold tracking-tight text-white block">
              {companyInfo.logoText}
            </Link>
            <p className="text-muted-foreground text-lg leading-relaxed font-serif italic max-w-md">
              {companyInfo.description}
            </p>
            <div className="pt-4">
              <h3 className="font-sans text-xs uppercase tracking-widest text-accent font-semibold mb-6">{contactInfo.title}</h3>
              {renderContactSection()}
            </div>
            <div className="pt-8">
              {renderSocialLinksSection()}
            </div>
          </div>
        </div>
        
        {/* Right Side (Lighter) */}
        <div className="bg-primary w-full lg:w-7/12 p-12 lg:p-24 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {navColumns.map((col: any, index: number) => (
              <div key={index} className="space-y-6">
                <h3 className="font-serif text-xl font-semibold text-white">{col.title}</h3>
                <ul className="space-y-4">
                  {Array.isArray(col.links) && col.links.map((linkItem: any, linkIndex: number) => (
                    <li key={linkIndex}>
                      <Link href={linkItem.link} className="text-muted-foreground text-sm hover:text-accent transition-colors">
                        {linkItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-24 pt-8 border-t border-accent/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">{copyrightReplaced}</p>
            <div className="flex gap-6">
              {Array.isArray(bottomSection?.legalLinks) && bottomSection.legalLinks.map((legal: any, index: number) => (
                <Link key={index} href={legal.link} className="text-muted-foreground text-sm hover:text-accent transition-colors">
                  {legal.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (footerStyle === 'grand') {
    return (
      <footer className="bg-primary border-t border-accent/10 font-sans relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
        
        <div className="max-w-[1000px] mx-auto px-6 py-20 flex flex-col items-center text-center">
          <Link href="/" className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            {companyInfo.logoText}
          </Link>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl font-serif italic mb-16">
            {companyInfo.description}
          </p>
          
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 mb-16">
            {navColumns.map((col: any, index: number) => (
              <div key={index} className="flex gap-8">
                {Array.isArray(col.links) && col.links.map((linkItem: any, linkIndex: number) => (
                  <Link key={`${index}-${linkIndex}`} href={linkItem.link} className="text-white text-sm font-semibold tracking-wider uppercase hover:text-accent transition-colors">
                    {linkItem.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          <div className="w-16 h-[1px] bg-accent/30 mb-12"></div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-muted-foreground text-sm mb-16">
            {contactInfo.address && <span>{contactInfo.address.split('\n').join(', ')}</span>}
            {contactInfo.phone && <span>{contactInfo.phone}</span>}
            {contactInfo.email && <span>{contactInfo.email}</span>}
          </div>

          <div className="mb-16">
            {renderSocialLinksSection()}
          </div>

          <div className="flex flex-col items-center gap-4 border-t border-white/10 w-full pt-8">
            <p className="text-muted-foreground text-xs uppercase tracking-widest">{copyrightReplaced}</p>
            <div className="flex gap-6">
              {Array.isArray(bottomSection?.legalLinks) && bottomSection.legalLinks.map((legal: any, index: number) => (
                <Link key={index} href={legal.link} className="text-muted-foreground text-xs hover:text-accent transition-colors">
                  {legal.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (footerStyle === 'corporate') {
    return (
      <footer className="bg-primary font-sans border-t border-accent/10">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12 pt-12 pb-8">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8 mb-10">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-white block">
              {companyInfo.logoText}
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm mr-4 hidden md:block">Connect with us</span>
              {renderSocialLinksSection()}
            </div>
          </div>
          
          {/* Middle Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-1 space-y-6">
               <h3 className="font-serif text-lg font-semibold text-white">About Us</h3>
               <p className="text-muted-foreground text-sm leading-relaxed">{companyInfo.description}</p>
            </div>
            
            {navColumns.map((col: any, index: number) => (
              <div key={index} className="space-y-6">
                <h3 className="font-serif text-lg font-semibold text-white">{col.title}</h3>
                <ul className="space-y-3">
                  {Array.isArray(col.links) && col.links.map((linkItem: any, linkIndex: number) => (
                    <li key={linkIndex}>
                      <Link href={linkItem.link} className="text-muted-foreground text-sm hover:text-accent transition-colors">
                        {linkItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="space-y-6">
               <h3 className="font-serif text-lg font-semibold text-white">{contactInfo.title}</h3>
               {renderContactSection()}
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-xs">{copyrightReplaced}</p>
            <div className="flex flex-wrap gap-6">
              {Array.isArray(bottomSection?.legalLinks) && bottomSection.legalLinks.map((legal: any, index: number) => (
                <Link key={index} href={legal.link} className="text-muted-foreground text-xs hover:text-accent transition-colors">
                  {legal.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (footerStyle === 'asymmetric') {
    return (
      <footer className="bg-[#020617] font-sans overflow-hidden border-t border-accent/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 lg:py-32 flex flex-col lg:flex-row gap-20">
          
          {/* Massive Left Section */}
          <div className="w-full lg:w-5/12 flex flex-col justify-between">
            <div className="space-y-8">
              <Link href="/" className="font-serif text-4xl lg:text-6xl font-bold tracking-tight text-white block leading-tight">
                {companyInfo.logoText}
              </Link>
              <div className="w-24 h-1 bg-accent"></div>
              <p className="text-slate-400 text-lg lg:text-xl font-light leading-relaxed max-w-md">
                {companyInfo.description}
              </p>
            </div>
            
            <div className="mt-16 pt-12 border-t border-slate-800">
              {renderSocialLinksSection()}
            </div>
          </div>

          {/* Right Section (Navigation & Contact) */}
          <div className="w-full lg:w-7/12 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 lg:gap-16">
              {navColumns.map((col: any, index: number) => (
                <div key={index} className="space-y-8">
                  <h3 className="font-sans text-sm uppercase tracking-widest text-slate-500 font-semibold">{col.title}</h3>
                  <ul className="space-y-5">
                    {Array.isArray(col.links) && col.links.map((linkItem: any, linkIndex: number) => (
                      <li key={linkIndex}>
                        <Link href={linkItem.link} className="text-slate-200 text-base font-medium hover:text-accent transition-colors">
                          {linkItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              
              <div className="space-y-8">
                <h3 className="font-sans text-sm uppercase tracking-widest text-slate-500 font-semibold">{contactInfo.title}</h3>
                {renderContactSection()}
              </div>
            </div>

            <div className="mt-20 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
               <p className="text-slate-500 text-sm">{copyrightReplaced}</p>
               <div className="flex flex-wrap gap-6">
                 {Array.isArray(bottomSection?.legalLinks) && bottomSection.legalLinks.map((legal: any, index: number) => (
                    <Link key={index} href={legal.link} className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
                      {legal.label}
                    </Link>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (footerStyle === 'location') {
    return (
      <footer className="bg-primary border-t border-accent/20 font-sans">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12 py-16">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center lg:items-stretch">
            
            {/* Location Block */}
            <div className="w-full lg:w-1/3 bg-white/5 border border-accent/20 rounded-xl p-10 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h3 className="font-serif text-3xl font-bold text-white mb-8 relative z-10">{contactInfo.title || 'Our Office'}</h3>
              <div className="space-y-6 relative z-10">
                {contactInfo.address && (
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 mr-4 text-accent shrink-0 mt-1" />
                    <span className="text-slate-300 text-lg leading-relaxed">{contactInfo.address}</span>
                  </div>
                )}
                {contactInfo.phone && (
                  <div className="flex items-center">
                    <Phone className="h-6 w-6 mr-4 text-accent shrink-0" />
                    <span className="text-slate-300 text-lg">{contactInfo.phone}</span>
                  </div>
                )}
                {contactInfo.email && (
                  <div className="flex items-center">
                    <Mail className="h-6 w-6 mr-4 text-accent shrink-0" />
                    <span className="text-slate-300 text-lg">{contactInfo.email}</span>
                  </div>
                )}
              </div>
              <div className="mt-10 pt-8 border-t border-white/10 relative z-10">
                 {renderSocialLinksSection()}
              </div>
            </div>

            {/* Content & Nav */}
            <div className="w-full lg:w-2/3 flex flex-col justify-between py-6">
              <div className="mb-12">
                <Link href="/" className="font-serif text-3xl font-bold tracking-tight text-white block mb-4">
                  {companyInfo.logoText}
                </Link>
                <p className="text-slate-400 text-base max-w-xl leading-relaxed">
                  {companyInfo.description}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                {navColumns.map((col: any, index: number) => (
                  <div key={index} className="space-y-5">
                    <h4 className="font-serif text-xl font-semibold text-white">{col.title}</h4>
                    <ul className="space-y-3">
                      {Array.isArray(col.links) && col.links.map((linkItem: any, linkIndex: number) => (
                        <li key={linkIndex}>
                          <Link href={linkItem.link} className="text-slate-400 text-sm hover:text-accent transition-colors">
                            {linkItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-slate-500 text-sm">{copyrightReplaced}</p>
                <div className="flex gap-6">
                  {Array.isArray(bottomSection?.legalLinks) && bottomSection.legalLinks.map((legal: any, index: number) => (
                    <Link key={index} href={legal.link} className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
                      {legal.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </footer>
    );
  }

  if (footerStyle === 'stacked') {
    return (
      <footer className="bg-[#040814] font-sans pt-24 pb-12 border-t border-accent/20">
        <div className="max-w-[800px] mx-auto px-6 text-center flex flex-col items-center">
          <Link href="/" className="font-serif text-4xl font-bold tracking-widest text-white uppercase mb-6">
            {companyInfo.logoText}
          </Link>
          <div className="w-8 h-[2px] bg-accent mb-8"></div>
          <p className="text-slate-400 text-base font-light italic leading-relaxed mb-16">
            {companyInfo.description}
          </p>

          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mb-16">
             {navColumns.map((col: any) => (
               Array.isArray(col.links) && col.links.map((linkItem: any, linkIndex: number) => (
                 <Link key={linkIndex} href={linkItem.link} className="text-slate-300 text-sm tracking-widest uppercase hover:text-accent transition-colors">
                   {linkItem.label}
                 </Link>
               ))
             ))}
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12"></div>

          <div className="flex flex-col items-center gap-6 mb-16">
            {contactInfo.address && <p className="text-slate-400 text-sm">{contactInfo.address.split('\n').join(' • ')}</p>}
            <div className="flex gap-8 text-slate-400 text-sm">
              {contactInfo.phone && <span>{contactInfo.phone}</span>}
              {contactInfo.email && <span>{contactInfo.email}</span>}
            </div>
            <div className="mt-4 flex justify-center w-full">
              {renderSocialLinksSection()}
            </div>
          </div>

          <div className="flex flex-col gap-4 items-center">
            <div className="flex gap-6">
              {Array.isArray(bottomSection?.legalLinks) && bottomSection.legalLinks.map((legal: any, index: number) => (
                <Link key={index} href={legal.link} className="text-slate-500 text-xs uppercase tracking-wider hover:text-slate-300 transition-colors">
                  {legal.label}
                </Link>
              ))}
            </div>
            <p className="text-slate-600 text-xs uppercase tracking-widest">{copyrightReplaced}</p>
          </div>
        </div>
      </footer>
    );
  }

  // DEFAULT: Classic Luxury
  const gridCols = 2 + navColumns.length;
  
  return (
    <footer className="bg-primary border-t border-accent/10 font-sans">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12 py-12 md:py-16">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${gridCols} gap-8 lg:gap-12`}>
          
          {/* Column 1: Logo/About */}
          <div className="space-y-4">
            <Link
              href="/"
              className="font-serif text-xl lg:text-2xl font-bold tracking-tight text-white block"
            >
              {companyInfo.logoText}
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed font-serif italic">
              {companyInfo.description}
            </p>
            {renderSocialLinksSection()}
          </div>

          {/* Dynamic Nav Columns */}
          {navColumns.map((col: any, index: number) => (
            <div key={index} className="space-y-4">
              <h3 className="font-serif text-lg font-semibold text-white">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {Array.isArray(col.links) && col.links.map((linkItem: any, linkIndex: number) => (
                  <li key={linkIndex}>
                    <Link
                      href={linkItem.link}
                      className="text-muted-foreground text-sm hover:text-accent transition-colors duration-300"
                    >
                      {linkItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info Column */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-white">
              {contactInfo.title}
            </h3>
            {renderContactSection()}
          </div>

        </div>

        {renderCopyrightSection()}
      </div>
    </footer>
  );
}
