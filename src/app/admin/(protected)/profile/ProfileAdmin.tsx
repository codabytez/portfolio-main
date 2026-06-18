"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Field, Input, Textarea } from "../../_components/Field";
import SaveButton from "../../_components/SaveButton";

type Overrides = { name?: string; slug?: string; tagline?: string };

export default function ProfileAdmin() {
  const profile = useQuery(api.profile.get);
  const upsert = useMutation(api.profile.upsert);

  const [overrides, setOverrides] = useState<Overrides>({});
  const set =
    (k: keyof Overrides) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setOverrides((prev) => ({ ...prev, [k]: e.target.value }));

  const name = overrides.name ?? profile?.name ?? "";
  const slug = overrides.slug ?? profile?.slug ?? "";
  const tagline = overrides.tagline ?? profile?.tagline ?? "";

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-xl font-semibold text-[#f8fafc]">Profile</h1>

      <div className="flex flex-col gap-5">
        <Field label="Full name" hint="shown in hero and page title">
          <Input value={name} onChange={set("name")} placeholder="Michael Weaver" />
        </Field>

        <Field label="Slug" hint="used in header link (no spaces)">
          <Input value={slug} onChange={set("slug")} placeholder="michael-weaver" />
        </Field>

        <Field label="Tagline" hint="shown under name on home page">
          <Textarea
            value={tagline}
            onChange={set("tagline")}
            rows={3}
            placeholder="Full-stack developer..."
          />
        </Field>

        <SaveButton
          onSave={() => upsert({ name: name.trim(), slug: slug.trim(), tagline: tagline.trim() })}
        />
      </div>
    </div>
  );
}
