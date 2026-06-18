"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Field, Textarea } from "../../_components/Field";
import SaveButton from "../../_components/SaveButton";

const SECTIONS = [
  {
    group: "Personal",
    items: [
      { key: "bio", title: "Bio" },
      { key: "interests", title: "Interests" },
      { key: "education", title: "Education" },
    ],
  },
  {
    group: "Professional",
    items: [
      { key: "experience", title: "Experience" },
      { key: "skills", title: "Skills" },
      { key: "certificates", title: "Certificates" },
    ],
  },
  {
    group: "Hobbies",
    items: [
      { key: "music", title: "Music" },
      { key: "movies", title: "Movies" },
      { key: "games", title: "Games" },
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
    <div className="rounded border border-[#314158] bg-[#0a1628] p-4">
      <p className="mb-3 text-sm font-medium text-[#f8fafc]">{title}</p>
      <Field label="Content" hint="each line becomes a comment line in the editor">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          placeholder={`Write about ${title.toLowerCase()} here...\nEach line becomes a comment line.`}
          className="w-full font-mono"
        />
      </Field>
      <div className="mt-3">
        <SaveButton
          label="Save"
          onSave={() => upsert({ key: sectionKey, title, content: content.trim() })}
        />
      </div>
    </div>
  );
}

export default function AboutAdmin() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 text-xl font-semibold text-[#f8fafc]">About Sections</h1>
      <p className="mb-8 text-sm text-[#90a1b9]">
        Each section appears as a JSDoc comment in the about page editor. Write plain text — one
        thought per line.
      </p>

      <div className="flex flex-col gap-8">
        {SECTIONS.map(({ group, items }) => (
          <div key={group}>
            <p className="mb-3 text-xs font-semibold tracking-widest text-[#90a1b9] uppercase">
              {group}
            </p>
            <div className="flex flex-col gap-4">
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
