"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { toast } from "sonner";

type Draft = { name: string; slug: string; tagline: string };

export default function ProfileAdmin() {
  const profile = useQuery(api.profile.get);
  const upsert = useMutation(api.profile.upsert);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDraft((prev) => prev && { ...prev, [k]: e.target.value });

  const name = draft?.name ?? profile?.name ?? "";
  const slug = draft?.slug ?? profile?.slug ?? "";
  const tagline = draft?.tagline ?? profile?.tagline ?? "";

  function handleEdit() {
    setDraft({
      name: profile?.name ?? "",
      slug: profile?.slug ?? "",
      tagline: profile?.tagline ?? "",
    });
    setEditing(true);
  }

  function handleCancel() {
    setDraft(null);
    setEditing(false);
  }

  async function handleSave() {
    if (!draft) return;
    setSaving(true);
    try {
      await upsert({
        name: draft.name.trim(),
        slug: draft.slug.trim(),
        tagline: draft.tagline.trim(),
      });
      setDraft(null);
      setEditing(false);
      toast.success("Profile saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <p className="text-theme-foreground mb-8 text-sm">
        {"// basic info shown on your portfolio."}
      </p>

      <div className="border-theme-theme-stroke bg-theme-theme-backdrop rounded-lg border p-6">
        <div key={String(editing)} className="flex flex-col gap-6">
          <Input
            label="full name"
            hint="shown in hero and page title"
            value={name}
            onChange={set("name")}
            readOnly={!editing}
            autoFocus={editing}
            placeholder="Michael Weaver"
          />
          <Input
            label="slug"
            hint="used in header link (no spaces)"
            value={slug}
            onChange={set("slug")}
            readOnly={!editing}
            placeholder="michael-weaver"
          />
          <Textarea
            label="tagline"
            hint="shown under name on home page"
            value={tagline}
            onChange={set("tagline")}
            readOnly={!editing}
            rows={4}
            placeholder="Full-stack developer..."
          />
        </div>

        <div className="border-theme-theme-stroke mt-6 flex items-center justify-end gap-3 border-t pt-6">
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
    </div>
  );
}
