import { notFound } from "next/navigation";
import { teamData } from "@/data/team";
import TeamMemberClient from "@/components/team/TeamMemberClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  const member = teamData[p.id];

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
  const member = teamData[p.id];

  if (!member) {
    notFound();
  }

  return <TeamMemberClient member={member} />;
}
