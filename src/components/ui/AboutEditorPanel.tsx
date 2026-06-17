"use client";

import { useAbout } from "@/components/ui/AboutContext";
import AboutEditor from "@/components/ui/AboutEditor";

const TAB_LINES: Record<string, string[]> = {
  bio: [
    "/**",
    " * Bio",
    " *",
    " * I have 5 years of experience in web",
    " * development. I love building products",
    " * that are fast, beautiful, and simple.",
    " *",
    " * I care deeply about the details —",
    " * from pixel-perfect UI to clean",
    " * architecture on the backend.",
    " */",
  ],
  interests: [
    "/**",
    " * Interests",
    " *",
    " * - Web performance & UX",
    " * - Design systems",
    " * - Open source",
    " * - AI & LLMs",
    " * - Distributed systems",
    " */",
  ],
  education: [
    "/**",
    " * Education",
    " *",
    " * Studied Computer Science.",
    " * Learned more from building",
    " * things than from classrooms.",
    " */",
  ],
  "high-school": [
    "/**",
    " * High School",
    " *",
    " * Graduated with distinction.",
    " * First exposure to programming",
    " * was here — never looked back.",
    " */",
  ],
  university: [
    "/**",
    " * University",
    " *",
    " * B.Sc. Computer Science",
    " * Focused on software engineering,",
    " * algorithms, and systems design.",
    " */",
  ],
  experience: [
    "/**",
    " * Experience",
    " *",
    " * 5 years of professional",
    " * web development.",
    " *",
    " * frontend & backend,",
    " * startups & product teams.",
    " */",
  ],
  skills: [
    "/**",
    " * Skills",
    " *",
    " * Languages:",
    " *   TypeScript, JavaScript",
    " *",
    " * Frontend:",
    " *   React, Next.js, Tailwind",
    " *",
    " * Backend:",
    " *   Node.js, PostgreSQL, Prisma",
    " *",
    " * Tools:",
    " *   Figma, Git, Docker",
    " */",
  ],
  certificates: ["/**", " * Certificates", " *", " * - ...", " * - ...", " */"],
  music: [
    "/**",
    " * Music",
    " *",
    " * Guitar & piano.",
    " * Always have headphones on.",
    " * Genres: everything.",
    " */",
  ],
  books: [
    "/**",
    " * Books",
    " *",
    " * Sci-fi, tech, philosophy.",
    " * Currently reading: ...",
    " */",
  ],
  hiking: [
    "/**",
    " * Hiking",
    " *",
    " * Mountains, trails, nature.",
    " * Best way to reset.",
    " */",
  ],
  games: ["/**", " * Games", " *", " * Strategy & RPG.", " * Favourite: ...", " */"],
};

type Props = { className?: string };

export default function AboutEditorPanel({ className }: Props) {
  const { activeTab } = useAbout();
  const lines = TAB_LINES[activeTab] ?? ["/**", " * Select a file to view.", " */"];

  return <AboutEditor lines={lines} className={className} />;
}
