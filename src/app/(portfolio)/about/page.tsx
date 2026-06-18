import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import AboutDesktop from "@/components/ui/AboutDesktop";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await fetchQuery(api.profile.get).catch(() => null);
  const name = profile?.name ?? "Portfolio";

  return {
    title: `About ${name} — Background, Skills & Experience`,
    description: `Learn about ${name} — his background, technical skills, experience, and the things he's passionate about beyond the screen.`,
    alternates: { canonical: "/about" },
  };
}

export default function About() {
  return <AboutDesktop />;
}
