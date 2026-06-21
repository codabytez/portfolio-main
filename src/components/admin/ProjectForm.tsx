"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import TagInput from "./TagInput";
import FeaturesList from "./FeaturesList";
import CustomSelect from "./CustomSelect";
import ImageUpload from "./ImageUpload";

export const SEED_TAGS = [
  "react",
  "react-native",
  "nextjs",
  "html",
  "css",
  "vue",
  "svelte",
  "typescript",
  "javascript",
  "node",
  "python",
  "tailwindcss",
  "prisma",
  "supabase",
  "convex",
  "firebase",
  "graphql",
  "trpc",
  "vscode-extension",
  "chrome-extension",
  "cli",
  "electron",
  "expo",
  "astro",
  "remix",
  "hono",
  "drizzle",
];

export type FormState = {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  features: string[];
  imageUrl: string;
  tech: string[];
  primaryTech: string | null;
  liveUrl: string;
  githubUrl: string;
  order: string;
};

export const emptyFormState: FormState = {
  name: "",
  slug: "",
  description: "",
  longDescription: "",
  features: [""],
  imageUrl: "",
  tech: [],
  primaryTech: null,
  liveUrl: "",
  githubUrl: "",
  order: "0",
};

export type ProjectFormHandle = { save: (published: boolean) => Promise<void> };

const ProjectForm = forwardRef<
  ProjectFormHandle,
  {
    initial: FormState;
    onSave: (f: FormState, published: boolean) => Promise<void>;
    allTags: string[];
  }
>(function ProjectForm({ initial, onSave, allTags }, ref) {
  const [f, setF] = useState(initial);
  const set =
    (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setF((prev) => ({ ...prev, [k]: e.target.value }));

  useImperativeHandle(ref, () => ({ save: (published: boolean) => onSave(f, published) }), [
    f,
    onSave,
  ]);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="name" value={f.name} onChange={set("name")} placeholder="My Project" />
        <Input label="slug" value={f.slug} onChange={set("slug")} placeholder="my-project" />
      </div>
      <Input
        label="card description"
        hint="short — shown on the project card"
        value={f.description}
        onChange={set("description")}
        placeholder="One-liner about what this does..."
        maxLength={120}
      />
      <Textarea
        label="full description"
        hint="shown in the modal — 2 to 3 sentences"
        value={f.longDescription}
        onChange={set("longDescription")}
        rows={4}
        placeholder="A deeper look at the project..."
      />
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <p className="text-body-md text-theme-foreground">key features</p>
          <span className="text-theme-foreground/60 text-xs">
            shown as bullet points in the modal
          </span>
        </div>
        <FeaturesList
          value={f.features}
          onChange={(features) => setF((prev) => ({ ...prev, features }))}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <p className="text-body-md text-theme-foreground">tech stack</p>
          <span className="text-theme-foreground/60 text-xs">type to search or add a new tag</span>
        </div>
        <TagInput
          value={f.tech}
          allTags={allTags}
          onChange={(tech) =>
            setF((prev) => ({
              ...prev,
              tech,
              primaryTech:
                prev.primaryTech && tech.includes(prev.primaryTech) ? prev.primaryTech : null,
            }))
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <p className="text-body-md text-theme-foreground">card badge</p>
          <span className="text-theme-foreground/60 text-xs">icon shown on the project card</span>
        </div>
        <CustomSelect<string>
          value={f.primaryTech}
          onChange={(primaryTech) => setF((prev) => ({ ...prev, primaryTech }))}
          options={f.tech.map((t) => ({ value: t, label: t }))}
          placeholder="Pick from selected stack…"
          disabled={f.tech.length === 0}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="live url"
          hint="optional"
          value={f.liveUrl}
          onChange={set("liveUrl")}
          placeholder="https://..."
        />
        <Input
          label="github url"
          hint="optional"
          value={f.githubUrl}
          onChange={set("githubUrl")}
          placeholder="https://github.com/..."
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <p className="text-body-md text-theme-foreground">image</p>
          <span className="text-theme-foreground/60 text-xs">optional, used as card thumbnail</span>
        </div>
        <ImageUpload
          value={f.imageUrl}
          onChange={(url) => setF((prev) => ({ ...prev, imageUrl: url }))}
        />
      </div>
    </div>
  );
});

export default ProjectForm;
