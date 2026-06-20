"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import Input from "@/components/ui/Input";
import SaveButton from "@/components/admin/SaveButton";

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
      <p className="text-theme-foreground mb-4 text-xs tracking-widest">{"// contact info"}</p>
      <div className="border-theme-theme-stroke bg-theme-theme-backdrop rounded-lg border p-5">
        <div className="flex flex-col gap-5">
          <Input
            label="email"
            type="email"
            value={email}
            onChange={(e) => setOverrides((p) => ({ ...p, email: e.target.value }))}
            placeholder="you@example.com"
          />
          <Input
            label="phone"
            hint="optional"
            type="tel"
            value={phone}
            onChange={(e) => setOverrides((p) => ({ ...p, phone: e.target.value }))}
            placeholder="+1 234 567 8900"
          />
        </div>
        <div className="border-theme-theme-stroke mt-5 border-t pt-5">
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
    <div className="border-theme-theme-stroke bg-theme-theme-backdrop rounded-lg border p-5">
      <p className="text-theme-foreground mb-4 text-xs tracking-widest">
        {"// "}
        {PLATFORM_LABELS[platform].toLowerCase()}
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={`https://${platform === "x" ? "x.com" : platform === "github" ? "github.com" : platform + ".com"}/...`}
        />
        <Input
          label="handle"
          hint="optional"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="@username"
        />
      </div>
      <div className="border-theme-theme-stroke mt-4 border-t pt-4">
        <SaveButton
          label="save"
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
