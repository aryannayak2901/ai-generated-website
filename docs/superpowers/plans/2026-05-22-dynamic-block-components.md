# Dynamic Block Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the Payload CMS block configurations and their corresponding React components to make all component UIs fully dynamic and high-performing.

**Architecture:** Update block configuration schemas where fields are missing and adjust the frontend mapper & components to dynamically consume these props, with elegant visual fallbacks and premium enhancements (e.g., split-column layouts, glassmorphic maps).

**Tech Stack:** Next.js, React 19, Payload CMS v3, Tailwind CSS v4, Framer Motion, GSAP, Lucide React

---

### Task 1: Practice Areas Grid Icon Resolution

**Files:**
- Modify: `src/components/practice-areas/PracticeAreasGrid.tsx`

- [ ] **Step 1: Update mapping inside `PracticeAreasGrid.tsx`**

Replace the active areas mapping block (lines 34-44) to resolve icons using `iconMap` for both dynamic and default areas.

```typescript
// Replace lines 34-44 in src/components/practice-areas/PracticeAreasGrid.tsx:
  const activeAreas = payloadAreas && payloadAreas.length > 0
    ? payloadAreas.map((area, index) => ({
        id: `payload-area-${index}`,
        title: area.title,
        description: area.description || "",
        icon: area.icon && iconMap[area.icon] ? iconMap[area.icon] : iconMap.Briefcase,
        services: area.services ? area.services.map(s => s.name) : []
      }))
    : defaultAreas.map((area) => ({
        ...area,
        icon: iconMap[area.icon] || iconMap.Briefcase,
      }));
```

- [ ] **Step 2: Run a quick build/compile check to ensure no TS errors**

Run: `npm run build`
Expected: Successful compile or no new TypeScript errors.

- [ ] **Step 3: Commit the changes**

```bash
git add src/components/practice-areas/PracticeAreasGrid.tsx
git commit -m "fix: resolve practice area icons from string to component"
```

---

### Task 2: Contact Info Dynamic Layout

**Files:**
- Modify: `src/components/contact/ContactInfo.tsx`

- [ ] **Step 1: Update `ContactInfo.tsx` props and component mapping**

Rewrite `ContactInfo.tsx` to accept and map over `infoItems`.

```typescript
"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const iconMap: Record<string, LucideIcon> = {
  Phone: Phone,
  Mail: Mail,
  MapPin: MapPin,
  Clock: Clock,
};

export interface ContactInfoProps {
  infoItems?: {
    icon: string;
    title: string;
    value: string;
    link?: string | null;
  }[] | null;
}

const defaultInfoItems = [
  {
    icon: "MapPin",
    title: "Office Address",
    value: "Gandhinagar, Gujarat, India",
    link: "https://maps.google.com/?q=Gandhinagar,Gujarat,India",
  },
  {
    icon: "Phone",
    title: "Contact Number",
    value: "+91 94082 82982",
    link: "tel:+919408282982",
  },
  {
    icon: "Mail",
    title: "Email Address",
    value: "info@jeetbhatt.com",
    link: "mailto:info@jeetbhatt.com",
  },
];

export default function ContactInfo({ infoItems }: ContactInfoProps) {
  const activeInfoItems = infoItems && infoItems.length > 0 ? infoItems : defaultInfoItems;

  return (
    <section className="py-16 md:py-24 px-6 bg-secondary w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-[1280px] mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeInfoItems.map((item, index) => {
            const Icon = iconMap[item.icon] || MapPin;
            const isClickable = !!item.link;
            const CardWrapper = isClickable ? 'a' : 'div';
            const wrapperProps = isClickable ? { href: item.link || undefined, target: "_blank", rel: "noopener noreferrer" } : {};
            
            return (
              <Card key={index} className="border-slate-200 hover:border-accent/30 transition-all duration-300 bg-white h-full hover:shadow-lg">
                <CardContent className="p-6 md:p-8 h-full">
                  <CardWrapper {...wrapperProps} className="flex items-start gap-4 h-full">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 text-accent">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        {item.title}
                      </h3>
                      <p className="text-foreground font-sans whitespace-pre-line leading-relaxed">
                        {item.value}
                      </p>
                    </div>
                  </CardWrapper>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/contact/ContactInfo.tsx
git commit -m "feat: make contact info cards fully dynamic"
```

---

### Task 3: Contact Form Split Layout

**Files:**
- Modify: `src/components/contact/ContactForm.tsx`

- [ ] **Step 1: Rewrite `ContactForm.tsx` to support the split-column features layout**

```typescript
// Add imports at top of src/components/contact/ContactForm.tsx:
import { Clock, Users, ShieldCheck, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Clock,
  Users,
  ShieldCheck,
};

export interface ContactFormProps {
  badge?: string | null;
  title?: string | null;
  subtitle?: string | null;
  features?: {
    icon: string;
    title: string;
    description?: string | null;
  }[] | null;
}

// Modify component signature:
export default function ContactForm({ badge, title, subtitle, features }: ContactFormProps) {
  const form = useForm({ ... });
  ...
  const showFeatures = features && features.length > 0;
```

If `showFeatures` is true, render the premium 2-column bento structure. If not, render the original centered single-column block.

```typescript
  return (
    <section className="py-16 md:py-24 px-6 bg-white w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-[1280px] mx-auto"
      >
        {showFeatures ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            {/* Left Column: Title, Subtitle, Features */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                {badge && (
                  <span className="inline-block text-accent font-bold tracking-[0.3em] uppercase text-xs mb-4">
                    {badge}
                  </span>
                )}
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                  {title || "Send Us a Message"}
                </h2>
                <div className="w-20 h-0.5 bg-accent/50 mb-6" />
                <p className="text-muted-foreground text-lg leading-relaxed font-sans">
                  {subtitle || "Fill out the form and our specialist team will reach out with a strategic roadmap."}
                </p>
              </div>
              
              {/* Features List */}
              <div className="space-y-6 pt-6 border-t border-slate-100">
                {features?.map((item, index) => {
                  const Icon = iconMap[item.icon] || ShieldCheck;
                  return (
                    <div key={index} className="flex gap-4 items-start group">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent/20 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-base text-foreground mb-1 group-hover:text-accent transition-colors">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Right Column: Form */}
            <div className="lg:col-span-7 bg-secondary p-8 md:p-12 rounded-xl border border-slate-200 shadow-sm">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* ... Keep original form fields exactly as they were ... */}
                </form>
              </Form>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {badge && (
              <div className="text-center mb-2">
                <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs mb-4 inline-block">
                  {badge}
                </span>
              </div>
            )}
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
              {title || "Send Us a Message"}
            </h2>
            <div className="w-24 h-0.5 bg-accent/50 mx-auto mb-8" />
            <p className="text-muted-foreground text-center mb-12 leading-relaxed">
              {subtitle || "Fill out the form below and our team will get back to you within 24 hours."}
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* ... Keep original form fields ... */}
              </form>
            </Form>
          </div>
        )}
      </motion.div>
    </section>
  );
```

- [ ] **Step 2: Commit**

```bash
git add src/components/contact/ContactForm.tsx
git commit -m "feat: make contact form layout and details dynamic"
```

---

### Task 4: Contact Map Dynamic Interactive Iframe

**Files:**
- Modify: `src/components/contact/ContactMap.tsx`

- [ ] **Step 1: Update `ContactMap.tsx` to render interactive maps & info bar dynamically**

```typescript
"use client";

import { motion } from "framer-motion";

export interface ContactMapProps {
  mapUrl?: string | null;
  locationTitle?: string | null;
  locationAddress?: string | null;
}

export default function ContactMap({ mapUrl, locationTitle, locationAddress }: ContactMapProps) {
  const activeMapUrl = mapUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.697926017772!2d72.5222!3d23.0784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e833444444445%3A0x6b74ad4a4e63480e!2sSG+Business+Hub!5e0!3m2!1sen!2sin!4v1710450000000!5m2!1sen!2sin';
  const activeTitle = locationTitle || 'Main Chamber';
  const activeAddress = locationAddress || 'SG Business Hub, Sola, SG Highway, Ahmedabad';

  return (
    <section className="py-16 md:py-24 px-6 bg-secondary w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-[1280px] mx-auto"
      >
        <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200 grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Map Iframe */}
          <div className="lg:col-span-8 relative h-[450px] bg-slate-100">
            <iframe
              src={activeMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={activeTitle}
              className="absolute inset-0 w-full h-full"
            />
          </div>
          
          {/* Map Info Box */}
          <div className="lg:col-span-4 p-8 md:p-12 flex flex-col justify-center bg-white space-y-6">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <svg 
                className="w-6 h-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
            </div>
            
            <div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-3 leading-tight">
                {activeTitle}
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed font-sans whitespace-pre-line">
                {activeAddress}
              </p>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeAddress)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent hover:text-accent/85 transition-colors font-semibold text-sm uppercase tracking-wider"
              >
                Get Directions
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/contact/ContactMap.tsx
git commit -m "feat: render live Google Map iframe and details panel dynamically"
```

---

### Task 5: Office Map Section Alignment

**Files:**
- Modify: `src/blocks/OfficeBlocks.ts`
- Modify: `src/components/offices/MapSection.tsx`

- [ ] **Step 1: Add `mapUrl` field to `MapSection` block configuration in `src/blocks/OfficeBlocks.ts`**

```typescript
// Add as last field of MapSection block configuration (line ~138):
    {
      name: 'mapOverlayDescription',
      type: 'textarea',
    },
    {
      name: 'mapUrl',
      type: 'text',
      defaultValue: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.697926017772!2d72.5222!3d23.0784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e833444444445%3A0x6b74ad4a4e63480e!2sSG+Business+Hub!5e0!3m2!1sen!2sin!4v1710450000000!5m2!1sen!2sin',
    }
```

- [ ] **Step 2: Update `MapSection.tsx` component to render Map iframe and overlay dynamically**

```typescript
"use client";

import { motion } from "framer-motion";
import { Compass, MapPin } from "lucide-react";

export interface MapSectionProps {
  title?: string | null;
  subtitle?: string | null;
  features?: { text: string }[] | null;
  mapOverlayTitle?: string | null;
  mapOverlayDescription?: string | null;
  mapUrl?: string | null;
}

export const MapSection = ({ title, subtitle, features: payloadFeatures, mapOverlayTitle, mapOverlayDescription, mapUrl }: MapSectionProps) => {
  const activeFeatures = payloadFeatures && payloadFeatures.length > 0 
    ? payloadFeatures.map(f => f.text) 
    : [
        "Reserved Client Parking Available",
        "Accessible Entry Points",
        "Strategic Business Hubs"
      ];
  const activeMapUrl = mapUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.697926017772!2d72.5222!3d23.0784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e833444444445%3A0x6b74ad4a4e63480e!2sSG+Business+Hub!5e0!3m2!1sen!2sin!4v1710450000000!5m2!1sen!2sin';

  return (
    <section className="py-16 md:py-24 px-6 bg-white w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-[1280px] mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-4"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                {title || "Find Us"}
              </h2>
            </div>
            
            <div className="w-24 h-0.5 bg-accent/50 mb-6" />
            
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 font-sans">
              {subtitle || "Our chambers are located in premium business districts, ensuring ease of access and absolute confidentiality."}
            </p>

            <div className="space-y-4">
              {activeFeatures.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-foreground font-sans">
                  <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Map Iframe with Glass Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-8 relative aspect-video rounded-xl overflow-hidden shadow-lg border border-slate-200 min-h-[400px]"
          >
            <iframe
              src={activeMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={title || "Map Location"}
              className="absolute inset-0 w-full h-full"
            />
            
            {/* Glass Overlay */}
            {(mapOverlayTitle || mapOverlayDescription) && (
              <div className="absolute bottom-6 left-6 max-w-sm p-6 bg-primary/85 backdrop-blur-md rounded-lg border border-white/10 text-white shadow-xl pointer-events-none hidden md:block">
                {mapOverlayTitle && (
                  <h3 className="font-serif text-lg font-bold mb-2 text-accent">
                    {mapOverlayTitle}
                  </h3>
                )}
                {mapOverlayDescription && (
                  <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                    {mapOverlayDescription}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
```

- [ ] **Step 3: Commit**

```bash
git add src/blocks/OfficeBlocks.ts src/components/offices/MapSection.tsx
git commit -m "feat: make map section interactive with live iframe and glassmorphic details overlay"
```

---

### Task 6: Awards Marquee Rich Fields

**Files:**
- Modify: `src/blocks/AwardsMarquee.ts`
- Modify: `src/components/home/AwardsMarquee.tsx`

- [ ] **Step 1: Add dynamic fields to the awards array schema in `src/blocks/AwardsMarquee.ts`**

```typescript
// Add inside array fields (under organization, line ~22):
        {
          name: 'organization',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        }
```

- [ ] **Step 2: Update `AwardsMarquee.tsx` component mapper to read custom descriptions & images**

Update lines 110-121 inside `src/components/home/AwardsMarquee.tsx` to read the newly defined fields dynamically:

```typescript
export const AwardsMarquee = ({ awards: payloadAwards }: AwardsMarqueeProps) => {
  // If payload awards exist, map them to the AwardItem shape, otherwise use default awards
  const activeAwards = payloadAwards && payloadAwards.length > 0 
    ? payloadAwards.map((a, i) => ({
        id: `payload-${i}`,
        title: a.title,
        subtitle: a.organization || "",
        description: (a as any).description || "",
        image: (a as any).image?.url || awards[i % awards.length].image, // fallback to default images
        yearBadge: a.year || "",
      }))
    : awards;
```

- [ ] **Step 3: Commit**

```bash
git add src/blocks/AwardsMarquee.ts src/components/home/AwardsMarquee.tsx
git commit -m "feat: make awards marquee fully dynamic with customizable images and descriptions"
```

---

### Task 7: Newsletter & Core Values Schema Alignment

**Files:**
- Modify: `src/blocks/BlogBlocks.ts`
- Modify: `src/components/blog/Newsletter.tsx`
- Modify: `src/blocks/AboutValues.ts`
- Modify: `src/components/about/AboutValues.tsx`

- [ ] **Step 1: Add missing fields to Newsletter block in `src/blocks/BlogBlocks.ts`**

```typescript
// Add badge and disclaimer to Newsletter block configuration:
export const Newsletter: Block = {
  slug: 'newsletter',
  fields: [
    {
      name: 'badge',
      type: 'text',
      defaultValue: 'Newsletter',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Stay Informed',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue: 'Subscribe to our newsletter for exclusive legal insights and firm updates delivered directly to your inbox.',
    },
    {
      name: 'buttonText',
      type: 'text',
      defaultValue: 'Subscribe',
    },
    {
      name: 'disclaimer',
      type: 'text',
      defaultValue: '* Your privacy is our priority. Unsubscribe at any time.',
    }
  ],
}
```

- [ ] **Step 2: Update `Newsletter.tsx` component interface and subscribe button label**

```typescript
// Modify NewsletterProps (lines 8-13):
export interface NewsletterProps {
  badge?: string | null;
  title?: string | null;
  subtitle?: string | null;
  buttonText?: string | null;
  disclaimer?: string | null;
}

// Modify return block (lines 52-54) to render buttonText:
            <button className="px-8 py-3 bg-accent hover:bg-accent/85 text-white font-semibold uppercase tracking-wider text-sm rounded-sm transition-all duration-300 shadow-lg hover:shadow-accent/20 flex items-center gap-2">
              {buttonText || "Subscribe"}
            </button>
```

- [ ] **Step 3: Harmonize icon select options inside `src/blocks/AboutValues.ts`**

```typescript
// Update options array under icon (line ~39):
        {
          name: 'icon',
          type: 'select',
          options: ['Scale', 'ShieldCheck', 'Award', 'Handshake', 'Gavel', 'Building2'],
          defaultValue: 'ShieldCheck',
        }
```

- [ ] **Step 4: Update `AboutValues.tsx` component's iconMap fallback to use `ShieldCheck` key**

Ensure the mapper checks correctly (lines 59-60):
```typescript
        icon: v.icon && iconMap[v.icon] ? v.icon : "ShieldCheck",
```
This is already set up inside `AboutValues.tsx`, so it matches perfectly!

- [ ] **Step 5: Run a complete build check to compile and verify all changes**

Run: `npm run build`
Expected: Successful production compile and output, confirming no TypeScript or static compilation warnings or errors.

- [ ] **Step 6: Commit**

```bash
git add src/blocks/BlogBlocks.ts src/components/blog/Newsletter.tsx src/blocks/AboutValues.ts
git commit -m "feat: align newsletter dynamic options and core values icon options"
```
