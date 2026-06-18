import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import { fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import "./globals.css";
import KonamiListener from "@/components/ui/KonamiListener";
import ConvexClientProvider from "@/components/ConvexClientProvider";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await fetchQuery(api.profile.get).catch(() => null);

  const name = profile?.name ?? "Portfolio";
  const tagline = profile?.tagline ?? "Software Engineer";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  return {
    title: name,
    description: tagline,
    metadataBase: new URL(siteUrl || "http://localhost:3000"),
    openGraph: {
      type: "website",
      siteName: name,
      title: name,
      description: tagline,
      images: [{ url: "/og-image.jpg", width: 1920, height: 1080, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: tagline,
      images: ["/og-image.jpg"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${firaCode.variable} h-full overflow-hidden antialiased`}>
      <body className="flex h-full flex-col overflow-hidden">
        <KonamiListener />
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
