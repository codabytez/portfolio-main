import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import ProjectsContent from "@/components/ui/ProjectsContent";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await fetchQuery(api.profile.get).catch(() => null);
  const name = profile?.name ?? "Portfolio";

  return {
    title: `${name}'s Projects — Web Development Work & Portfolio`,
    description: `Explore a collection of projects built by ${name} — web apps, UI components, and experiments crafted with modern tools and attention to detail.`,
    alternates: { canonical: "/projects" },
  };
}

export default function Projects() {
  return <ProjectsContent />;
}
