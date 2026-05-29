import { notFound } from "next/navigation";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import TeamMemberClient from "@/components/team/TeamMemberClient";
import type { Team, Media } from "@/payload-types";
import type { TeamMember } from "@/data/team";
import { generateSeoMetadata } from "@/lib/seo/metadata-generator";
import { generateTeamPageSchema } from "@/lib/seo/schema-generator";
import StructuredData from "@/components/SEO/StructuredData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  const payload = await getPayload({ config: configPromise });
  
  const { docs } = await payload.find({
    collection: "team",
    where: {
      slug: {
        equals: p.id,
      },
    },
  });

  const member = docs[0] as unknown as Team;

  if (!member) {
    return generateSeoMetadata({
      titleConfig: { type: "custom", title: "Team Member Not Found" },
      slug: `team/${p.id}`,
    });
  }

  return generateSeoMetadata({
    titleConfig: {
      type: 'team',
      name: member.name,
      title: member.designation,
      specialty: member.overview?.expertise?.[0]?.item || "Advocate"
    },
    descriptionConfig: {
      type: 'team',
      name: member.name,
      yearsOfExp: `${member.stats?.experience || "10+"} years`,
      specialty: member.overview?.expertise?.[0]?.item || "Complex Litigation",
      credential: member.subtitle || undefined
    },
    slug: `team/${p.id}`,
    image: (member.image as Media)?.url || undefined,
  });
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  const payload = await getPayload({ config: configPromise });
  
  const { docs } = await payload.find({
    collection: "team",
    where: {
      slug: {
        equals: p.id,
      },
    },
  });

  const memberData = docs[0] as unknown as Team;

  if (!memberData) {
    notFound();
  }

  // Map Payload data to TeamMember interface
  const member = {
    id: memberData.slug,
    name: memberData.name,
    designation: memberData.designation,
    subtitle: memberData.subtitle || "",
    stats: {
      experience: memberData.stats?.experience || "10+",
      cases: memberData.stats?.cases || "500+",
      publications: memberData.stats?.publications || "5+",
      clients: memberData.stats?.clients || "20+",
    },
    image: (memberData.image as Media)?.url || "",
    bio: memberData.bio?.map((b) => b.paragraph).filter((p): p is string => !!p) || [],
    overview: {
      expertise: memberData.overview?.expertise?.map((i) => i.item).filter((p): p is string => !!p) || [],
      clients: memberData.overview?.clients?.map((i) => i.item).filter((p): p is string => !!p) || [],
      cases: memberData.overview?.cases?.map((i) => i.item).filter((p): p is string => !!p) || [],
    },
    experience: memberData.experience?.map((e) => ({
      title: e.title,
      organization: e.organization,
      period: e.period || "",
      responsibilities: e.responsibilities?.map((r) => r.item).filter((p): p is string => !!p) || [],
    })) || [],
    education: memberData.education?.map((e) => ({
      degree: e.degree,
      institution: e.institution,
      period: e.period || "",
      specialization: e.specialization || "",
    })) || [],
    awards: memberData.awards?.map((a) => ({
      title: a.title,
      year: a.year || "",
      description: a.description || "",
    })) || [],
    publications: memberData.publications?.map((p) => ({
      title: p.title,
      publisher: p.publisher || "",
      year: p.year || "",
      link: p.link || "",
    })) || [],
  };

  return (
    <>
      <StructuredData schema={generateTeamPageSchema(memberData)} />
      <TeamMemberClient member={member as unknown as TeamMember} />
    </>
  );
}
