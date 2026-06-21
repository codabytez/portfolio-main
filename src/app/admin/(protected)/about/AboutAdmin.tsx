"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { toast } from "sonner";

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

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const content = draft ?? existing?.content ?? "";

  function handleEdit() {
    setDraft(existing?.content ?? "");
    setEditing(true);
  }

  function handleCancel() {
    setDraft(null);
    setEditing(false);
  }

  async function handleSave() {
    if (draft === null) return;
    setSaving(true);
    try {
      await upsert({ key: sectionKey, title, content: draft.trim() });
      setDraft(null);
      setEditing(false);
      toast.success(`${title} saved.`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border-theme-theme-stroke bg-theme-theme-backdrop rounded-lg border p-5">
      <p className="text-theme-foreground mb-4 text-xs tracking-widest">
        {"// "}
        {title}
      </p>
      <Textarea
        key={String(editing)}
        label="content"
        hint="each line becomes a comment line in the editor"
        value={content}
        onChange={(e) => setDraft(e.target.value)}
        readOnly={!editing}
        autoFocus={editing}
        rows={5}
        placeholder={`Write about ${title} here...\nEach line becomes a comment line.`}
        className="font-mono"
      />
      <div className="border-theme-theme-stroke mt-4 flex items-center justify-end gap-3 border-t pt-4">
        {!editing ? (
          <Button variant="default" onClick={handleEdit}>
            <i className="ri-pencil-line mr-1.5 text-[14px]" />
            edit
          </Button>
        ) : (
          <>
            <Button variant="default" onClick={handleCancel} disabled={saving}>
              cancel
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving && <i className="ri-loader-4-line mr-1.5 animate-spin text-[14px]" />}
              {saving ? "saving..." : "save"}
            </Button>
          </>
        )}
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
