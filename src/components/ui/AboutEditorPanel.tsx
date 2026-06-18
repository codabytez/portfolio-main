"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAbout } from "@/components/ui/AboutContext";
import AboutEditor from "@/components/ui/AboutEditor";
import Skeleton from "@/components/ui/Skeleton";

function contentToLines(title: string, content: string): string[] {
  const bodyLines = content.split("\n").map((line) => (line.trim() === "" ? " *" : ` * ${line}`));
  return ["/**", ` * ${title}`, " *", ...bodyLines, " */"];
}

const FALLBACK_LINES = ["/**", " * Select a file to view.", " */"];

type Props = { className?: string };

export default function AboutEditorPanel({ className }: Props) {
  const { activeTab } = useAbout();
  const sections = useQuery(api.about.getAll);

  let lines: string[];

  if (sections === undefined) {
    return (
      <div className={["flex flex-col gap-2 p-6", className].filter(Boolean).join(" ")}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-4" style={{ width: `${55 + (i % 3) * 15}%` }} />
        ))}
      </div>
    );
  } else {
    const section = sections.find((s) => s.key === activeTab);
    lines = section ? contentToLines(section.title, section.content) : FALLBACK_LINES;
  }

  return <AboutEditor lines={lines} className={className} />;
}
