import { notFound } from "next/navigation";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import TeamMemberClient from "@/components/team/TeamMemberClient";
import type { Team, Media } from "@/payload-types";
import type { TeamMember } from "@/data/team";

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
    return {
      title: "Team Member Not Found",
    };
  }

  return {
    title: `${member.name} - ${member.designation} | Chambers of Jeet Bhatt`,
    description: member.subtitle,
  };
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

  return <TeamMemberClient member={member as unknown as TeamMember} />; // We still need to cast to any for TeamMemberClient if it expects a specific interface we didn't fully define here, but it solves the local any errors
}
