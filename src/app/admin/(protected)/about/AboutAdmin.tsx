"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import Textarea from "@/components/ui/Textarea";
import SaveButton from "@/components/admin/SaveButton";

const SECTIONS = [
  {
    group: "personal",
    items: [
      { key: "bio", title: "bio" },
      { key: "interests", title: "interests" },
      { key: "education", title: "education" },
    ],
  },
  {
    group: "professional",
    items: [
      { key: "experience", title: "experience" },
      { key: "skills", title: "skills" },
      { key: "certificates", title: "certificates" },
    ],
  },
  {
    group: "hobbies",
    items: [
      { key: "music", title: "music" },
      { key: "movies", title: "movies" },
      { key: "games", title: "games" },
    ],
  },
] as const;

type Key = (typeof SECTIONS)[number]["items"][number]["key"];

function SectionEditor({ sectionKey, title }: { sectionKey: Key; title: string }) {
  const sections = useQuery(api.about.getAll);
  const upsert = useMutation(api.about.upsert);

  const existing = sections?.find((s) => s.key === sectionKey);
  const [content, setContent] = useState("");
  const [loaded, setLoaded] = useState(false);

  if (existing && !loaded) {
    setContent(existing.content);
    setLoaded(true);
  }

  return (
    <div className="border-theme-theme-stroke bg-theme-theme-backdrop rounded-lg border p-5">
      <p className="text-theme-foreground mb-4 text-xs tracking-widest">
        {"// "}
        {title}
      </p>
      <Textarea
        label="content"
        hint="each line becomes a comment line in the editor"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        placeholder={`Write about ${title} here...\nEach line becomes a comment line.`}
        className="font-mono"
      />
      <div className="border-theme-theme-stroke mt-4 border-t pt-4">
        <SaveButton
          label="save"
          onSave={() => upsert({ key: sectionKey, title, content: content.trim() })}
        />
      </div>
    </div>
  );
}

export default function AboutAdmin() {
  return (
    <div className="max-w-2xl">
      <p className="text-theme-foreground mb-8 text-sm">
        {"// each section appears as a JSDoc comment in the about page."}
      </p>

      <div className="flex flex-col gap-10">
        {SECTIONS.map(({ group, items }) => (
          <div key={group}>
            <p className="text-theme-foreground mb-4 text-xs tracking-widest">
              {"// "}
              {group}
            </p>
            <div className="flex flex-col gap-3">
              {items.map(({ key, title }) => (
                <SectionEditor key={key} sectionKey={key} title={title} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
