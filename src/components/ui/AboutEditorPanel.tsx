"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAbout } from "@/components/ui/AboutContext";
import AboutEditor from "@/components/ui/AboutEditor";
import Skeleton from "@/components/ui/Skeleton";

type Line = string | { text: string; href: string };

function contentToLines(title: string, content: string): Line[] {
  const bodyLines = content.split("\n").map((line) => (line.trim() === "" ? " *" : ` * ${line}`));
  return ["/**", ` * ${title}`, " *", ...bodyLines, " */"];
}

function spotifyToLines(snapshot: {
  topTracks: { name: string; artist: string; url: string }[];
  topArtists: { name: string; url: string }[];
}): Line[] {
  return [
    "/**",
    " * Music",
    " *",
    " * top tracks (last 4 weeks)",
    " *",
    ...snapshot.topTracks.map((t, i) => ({
      text: ` *  ${i + 1}. ${t.name} by ${t.artist}`,
      href: t.url,
    })),
    " *",
    " * top artists",
    " *",
    ...snapshot.topArtists.map((a, i) => ({
      text: ` *  ${i + 1}. ${a.name}`,
      href: a.url,
    })),
    " */",
  ];
}

const FALLBACK_LINES: Line[] = ["/**", " * Select a file to view.", " */"];

type Props = { className?: string };

export default function AboutEditorPanel({ className }: Props) {
  const { activeTab } = useAbout();
  const sections = useQuery(api.about.getAll);
  const spotify = useQuery(api.spotify.get);

  let lines: Line[];

  const isLoading = sections === undefined || (activeTab === "music" && spotify === undefined);

  if (isLoading) {
    return (
      <div className={["flex flex-col gap-2 p-6", className].filter(Boolean).join(" ")}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-4" style={{ width: `${55 + (i % 3) * 15}%` }} />
        ))}
      </div>
    );
  }

  if (activeTab === "music") {
    lines = spotify ? spotifyToLines(spotify) : ["/**", " * No music data yet.", " */"];
  } else {
    const section = sections?.find((s) => s.key === activeTab);
    lines = section ? contentToLines(section.title, section.content) : FALLBACK_LINES;
  }

  return <AboutEditor lines={lines} className={className} />;
}
