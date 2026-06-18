import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import ContactContent from "@/components/ui/ContactContent";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await fetchQuery(api.profile.get).catch(() => null);
  const name = profile?.name ?? "Portfolio";

  return {
    title: `Contact ${name} — Let's Work Together`,
    description: `Interested in working together or just want to say hello? Reach out to ${name} — open to collaborations, opportunities, and good conversations.`,
    alternates: { canonical: "/contact" },
  };
}

export default function Contact() {
  return <ContactContent />;
}
