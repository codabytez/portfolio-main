"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import SaveButton from "@/components/admin/SaveButton";

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
    <div className="max-w-xl">
      <p className="text-theme-foreground mb-8 text-sm">
        {"// basic info shown on your portfolio."}
      </p>

      <div className="border-theme-theme-stroke bg-theme-theme-backdrop rounded-lg border p-6">
        <div className="flex flex-col gap-6">
          <Input
            label="full name"
            hint="shown in hero and page title"
            value={name}
            onChange={set("name")}
            placeholder="Michael Weaver"
          />

          <Input
            label="slug"
            hint="used in header link (no spaces)"
            value={slug}
            onChange={set("slug")}
            placeholder="michael-weaver"
          />

          <Textarea
            label="tagline"
            hint="shown under name on home page"
            value={tagline}
            onChange={set("tagline")}
            rows={4}
            placeholder="Full-stack developer..."
          />
        </div>

        <div className="border-theme-theme-stroke mt-6 border-t pt-6">
          <SaveButton
            onSave={() => upsert({ name: name.trim(), slug: slug.trim(), tagline: tagline.trim() })}
          />
        </div>
      </div>
    </div>
  );
}
