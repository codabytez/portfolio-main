import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import HomeContent from "@/components/ui/HomeContent";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await fetchQuery(api.profile.get).catch(() => null);
  const name = profile?.name ?? "Portfolio";
  const tagline = profile?.tagline ?? "Software Engineer";

  return {
    title: `${name} — ${tagline}`,
    description: `Hi, I'm ${name} — a ${tagline} who builds fast, beautiful, and accessible web experiences. Explore my work and get in touch.`,
    alternates: { canonical: "/" },
  };
}

export default function Home() {
  return <HomeContent />;
}
