"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Field, Input } from "../../_components/Field";
import SaveButton from "../../_components/SaveButton";

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
  const [overrides, setOverrides] = useState<{ email?: string; phone?: string }>({});

  const email = overrides.email ?? contact?.email ?? "";
  const phone = overrides.phone ?? contact?.phone ?? "";

  return (
    <section>
      <h2 className="mb-4 text-base font-semibold text-[#f8fafc]">Contact Info</h2>
      <div className="rounded border border-[#314158] bg-[#0a1628] p-5">
        <div className="flex flex-col gap-4">
          <Field label="Email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setOverrides((p) => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Phone" hint="optional">
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setOverrides((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+1 234 567 8900"
            />
          </Field>
        </div>
        <div className="mt-5">
          <SaveButton
            onSave={() => upsert({ email: email.trim(), phone: phone.trim() || undefined })}
          />
        </div>
      </div>
    </section>
  );
}

function SocialRow({ platform }: { platform: Platform }) {
  const socials = useQuery(api.socials.list);
  const upsert = useMutation(api.socials.upsert);
  const existing = socials?.find((s) => s.platform === platform);
  const [url, setUrl] = useState("");
  const [handle, setHandle] = useState("");
  const [loaded, setLoaded] = useState(false);

  if (existing && !loaded) {
    setUrl(existing.url ?? "");
    setHandle(existing.handle ?? "");
    setLoaded(true);
  }
  if (!existing && socials && !loaded) {
    setLoaded(true);
  }

  return (
    <div className="rounded border border-[#314158] bg-[#0a1628] p-4">
      <p className="mb-3 text-sm font-medium text-[#f8fafc]">{PLATFORM_LABELS[platform]}</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="URL">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={`https://${platform === "x" ? "x.com" : platform === "github" ? "github.com" : platform + ".com"}/...`}
          />
        </Field>
        <Field label="Handle" hint="optional, e.g. @username">
          <Input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@username"
          />
        </Field>
      </div>
      <div className="mt-3">
        <SaveButton
          label="Save"
          onSave={() =>
            upsert({
              platform,
              url: url.trim(),
              handle: handle.trim() || undefined,
              order: PLATFORMS.indexOf(platform),
            })
          }
        />
      </div>
    </div>
  );
}

export default function ContactAdmin() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 text-xl font-semibold text-[#f8fafc]">Contact & Socials</h1>
      <p className="mb-8 text-sm text-[#90a1b9]">
        Manage your contact info and social media links.
      </p>
      <div className="flex flex-col gap-8">
        <ContactInfoSection />
        <section>
          <h2 className="mb-4 text-base font-semibold text-[#f8fafc]">Social Links</h2>
          <div className="flex flex-col gap-4">
            {PLATFORMS.map((p) => (
              <SocialRow key={p} platform={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
