"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toast } from "sonner";

const PLATFORMS = ["github", "linkedin", "x", "instagram"] as const;
type Platform = (typeof PLATFORMS)[number];

const PLATFORM_LABELS: Record<Platform, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  x: "X (Twitter)",
  instagram: "Instagram",
};

function ContactInfoSection() {
  const contact = useQuery(api.contact.get);
  const upsert = useMutation(api.contact.upsert);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<{ email: string; phone: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const email = draft?.email ?? contact?.email ?? "";
  const phone = draft?.phone ?? contact?.phone ?? "";

  function handleEdit() {
    setDraft({ email: contact?.email ?? "", phone: contact?.phone ?? "" });
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
      await upsert({ email: draft.email.trim(), phone: draft.phone.trim() || undefined });
      setDraft(null);
      setEditing(false);
      toast.success("Contact info saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <p className="text-theme-foreground mb-4 text-xs tracking-widest">{"// contact info"}</p>
      <div className="border-theme-theme-stroke bg-theme-theme-backdrop rounded-lg border p-5">
        <div key={String(editing)} className="flex flex-col gap-5">
          <Input
            label="email"
            type="email"
            value={email}
            onChange={(e) => setDraft((p) => p && { ...p, email: e.target.value })}
            readOnly={!editing}
            autoFocus={editing}
            placeholder="you@example.com"
          />
          <Input
            label="phone"
            hint="optional"
            type="tel"
            value={phone}
            onChange={(e) => setDraft((p) => p && { ...p, phone: e.target.value })}
            readOnly={!editing}
            placeholder="+1 234 567 8900"
          />
        </div>
        <div className="border-theme-theme-stroke mt-5 flex items-center justify-end gap-3 border-t pt-5">
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
    </section>
  );
}

function SocialRow({ platform }: { platform: Platform }) {
  const socials = useQuery(api.socials.list);
  const upsert = useMutation(api.socials.upsert);
  const existing = socials?.find((s) => s.platform === platform);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<{ url: string; handle: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const url = draft?.url ?? existing?.url ?? "";
  const handle = draft?.handle ?? existing?.handle ?? "";

  function handleEdit() {
    setDraft({ url: existing?.url ?? "", handle: existing?.handle ?? "" });
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
        platform,
        url: draft.url.trim(),
        handle: draft.handle.trim() || undefined,
        order: PLATFORMS.indexOf(platform),
      });
      setDraft(null);
      setEditing(false);
      toast.success(`${PLATFORM_LABELS[platform]} saved.`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border-theme-theme-stroke bg-theme-theme-backdrop rounded-lg border p-5">
      <p className="text-theme-foreground mb-4 text-xs tracking-widest">
        {"// "}
        {PLATFORM_LABELS[platform].toLowerCase()}
      </p>
      <div key={String(editing)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="url"
          value={url}
          onChange={(e) => setDraft((p) => p && { ...p, url: e.target.value })}
          readOnly={!editing}
          autoFocus={editing}
          placeholder={`https://${platform === "x" ? "x.com" : platform === "github" ? "github.com" : platform + ".com"}/...`}
        />
        <Input
          label="handle"
          hint="optional"
          value={handle}
          onChange={(e) => setDraft((p) => p && { ...p, handle: e.target.value })}
          readOnly={!editing}
          placeholder="@username"
        />
      </div>
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

export default function ContactAdmin() {
  return (
    <div className="max-w-2xl">
      <p className="text-theme-foreground mb-8 text-sm">
        {"// manage your contact info and social media links."}
      </p>
      <div className="flex flex-col gap-10">
        <ContactInfoSection />
        <section>
          <p className="text-theme-foreground mb-4 text-xs tracking-widest">{"// social links"}</p>
          <div className="flex flex-col gap-3">
            {PLATFORMS.map((p) => (
              <SocialRow key={p} platform={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
