import Link from "next/link";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import Image from "next/image";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import type { Team } from "@/payload-types";

export const metadata = {
  title: "Our Team | Chambers of Jeet Bhatt",
  description: "Meet our experienced team of legal professionals dedicated to delivering exceptional legal services.",
  alternates: {
    canonical: "/team",
  },
};

export default async function TeamPage() {
  const payload = await getPayload({ config: configPromise });
  const { docs } = await payload.find({
    collection: "team",
    limit: 100,
  });

  const teamMembers = docs as unknown as Team[];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-primary py-16 md:py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
        
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Our Legal Team
            </h1>
            <div className="w-24 h-0.5 bg-accent/50 mb-6" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              Experienced professionals dedicated to delivering exceptional legal services with integrity and expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 md:py-24 px-6 bg-secondary">
        <div className="max-w-[1280px] mx-auto">
          <StaggerContainer
            staggerDelay={0.1}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {teamMembers.map((member) => (
              <StaggerItem key={member.id}>
                <Link href={`/team/${member.slug}`} className="group block">
                  <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-accent transition-all duration-300 hover:scale-[1.02]">
                    {/* Profile Image */}
                    <div className="relative aspect-[4/5] w-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center overflow-hidden">
                      {member.image ? (
                        <Image
                          src={(member.image as any)?.url || ""}
                          alt={member.name}
                          fill
                          className="absolute inset-0 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center">
                          <span className="text-3xl font-bold text-accent">
                            {member.name.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                        <div className="text-center">
                          <p className="text-white text-sm mb-4 line-clamp-4">
                            {(() => {
                              if (Array.isArray(member.bio)) {
                                return member.bio.map((b: any) => b.paragraph || b).join(' ') || "Experienced legal professional.";
                              }
                              if (member.bio?.root?.children) {
                                let text = '';
                                const extractText = (node: any) => {
                                  if (node.type === 'text') text += node.text;
                                  if (node.children) node.children.forEach(extractText);
                                };
                                extractText(member.bio.root);
                                return text.replace(/\n+/g, ' ') || "Experienced legal professional.";
                              }
                              return "Experienced legal professional.";
                            })()}
                          </p>
                          <span className="inline-flex items-center text-accent text-sm font-semibold uppercase tracking-wider">
                            View Profile <Users className="ml-2 w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
                        {member.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        {member.designation}
                      </p>
                      {member.subtitle && (
                        <p className="text-muted-foreground text-xs line-clamp-2 mb-4">
                          {member.subtitle}
                        </p>
                      )}
                      <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">
                        {member.stats?.experience || "10+"} Years Exp.
                      </Badge>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Empty State */}
          {teamMembers.length === 0 && (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No team members found.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-6 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-[1280px] mx-auto text-center relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Work With Our Team?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            Schedule a consultation with our expert legal team today.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/85 text-white font-semibold tracking-wider uppercase rounded-sm h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <Link href="/contact">
              Get In Touch
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
