"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Field, Input, Textarea } from "../../_components/Field";
import SaveButton from "../../_components/SaveButton";
import ImageUpload from "../../_components/ImageUpload";
import CustomSelect from "../../_components/CustomSelect";

const TECH_OPTIONS = [
  "react",
  "react-native",
  "nextjs",
  "html",
  "css",
  "vue",
  "svelte",
  "angular",
  "gatsby",
  "flutter",
] as const;

type Tech = (typeof TECH_OPTIONS)[number];

type FormState = {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  features: string[];
  imageUrl: string;
  tech: Tech[];
  primaryTech: Tech | null;
  liveUrl: string;
  githubUrl: string;
  order: string;
};

const empty: FormState = {
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

function TechPicker({ value, onChange }: { value: Tech[]; onChange: (v: Tech[]) => void }) {
  function toggle(t: Tech) {
    onChange(value.includes(t) ? value.filter((x) => x !== t) : [...value, t]);
  }
  return (
    <div className="flex flex-wrap gap-2">
      {TECH_OPTIONS.map((t) => {
        const active = value.includes(t);
        return (
          <button
            key={t}
            type="button"
            onClick={() => toggle(t)}
            className={[
              "cursor-pointer rounded px-2.5 py-1 text-xs font-medium transition-colors",
              active
                ? "bg-[#ff9d00] text-[#020618]"
                : "border border-[#314158] bg-[#0f172b] text-[#90a1b9] hover:border-[#90a1b9] hover:text-[#f8fafc]",
            ].join(" ")}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

function FeaturesList({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  function update(i: number, text: string) {
    const next = [...value];
    next[i] = text;
    onChange(next);
  }
  function add() {
    onChange([...value, ""]);
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div className="flex flex-col gap-2">
      {value.map((feat, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="shrink-0 text-xs text-[#637b96] select-none">—</span>
          <input
            value={feat}
            onChange={(e) => update(i, e.target.value)}
            placeholder={`Feature ${i + 1}`}
            className="flex-1 rounded border border-[#314158] bg-[#0f172b] px-3 py-1.5 text-sm text-[#f8fafc] placeholder:text-[#90a1b9]/50 focus:border-[#90a1b9] focus:outline-none"
          />
          {value.length > 1 && (
            <button
              type="button"
              onClick={() => remove(i)}
              className="shrink-0 cursor-pointer text-lg leading-none text-[#637b96] transition-colors hover:text-[#ff637e]"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="mt-1 cursor-pointer self-start text-xs text-[#90a1b9] transition-colors hover:text-[#f8fafc]"
      >
        + Add feature
      </button>
    </div>
  );
}

function ProjectForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: FormState;
  onSave: (f: FormState) => Promise<void>;
  onCancel: () => void;
}) {
  const [f, setF] = useState(initial);
  const set =
    (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setF((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="rounded border border-[#314158] bg-[#0a1628] p-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name">
          <Input value={f.name} onChange={set("name")} placeholder="My Project" />
        </Field>
        <Field label="Slug">
          <Input value={f.slug} onChange={set("slug")} placeholder="my-project" />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Card description" hint="short — shown on the project card">
          <Textarea
            value={f.description}
            onChange={set("description")}
            rows={2}
            placeholder="One-liner about what this does..."
          />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Full description" hint="shown in the modal — 2 to 3 sentences">
          <Textarea
            value={f.longDescription}
            onChange={set("longDescription")}
            rows={4}
            placeholder="A deeper look at the project..."
          />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Key features" hint="shown as bullet points in the modal">
          <FeaturesList
            value={f.features}
            onChange={(features) => setF((prev) => ({ ...prev, features }))}
          />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Tech stack" hint="pick all that apply">
          <TechPicker
            value={f.tech}
            onChange={(tech) =>
              setF((prev) => ({
                ...prev,
                tech,
                primaryTech:
                  prev.primaryTech && tech.includes(prev.primaryTech) ? prev.primaryTech : null,
              }))
            }
          />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Card badge" hint="icon shown on the project card">
          <CustomSelect<Tech>
            value={f.primaryTech}
            onChange={(primaryTech) => setF((prev) => ({ ...prev, primaryTech }))}
            options={f.tech.map((t) => ({ value: t, label: t }))}
            placeholder="Pick from selected stack…"
            disabled={f.tech.length === 0}
          />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Order" hint="lower = appears first">
          <Input
            type="number"
            value={f.order}
            onChange={set("order")}
            placeholder="0"
            className="w-32"
          />
        </Field>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Field label="Live URL" hint="optional">
          <Input value={f.liveUrl} onChange={set("liveUrl")} placeholder="https://..." />
        </Field>
        <Field label="GitHub URL" hint="optional">
          <Input
            value={f.githubUrl}
            onChange={set("githubUrl")}
            placeholder="https://github.com/..."
          />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Image" hint="optional, used as card thumbnail">
          <ImageUpload
            value={f.imageUrl}
            onChange={(url) => setF((prev) => ({ ...prev, imageUrl: url }))}
          />
        </Field>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <SaveButton label="Save project" onSave={() => onSave(f)} />
        <button
          onClick={onCancel}
          className="cursor-pointer text-sm text-[#90a1b9] transition-colors hover:text-[#f8fafc]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function ProjectsAdmin() {
  const projects = useQuery(api.projects.list);
  const create = useMutation(api.projects.create);
  const update = useMutation(api.projects.update);
  const remove = useMutation(api.projects.remove);

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<Id<"projects"> | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Id<"projects"> | null>(null);

  async function handleCreate(f: FormState) {
    await create({
      name: f.name.trim(),
      slug: f.slug.trim(),
      description: f.description.trim(),
      longDescription: f.longDescription.trim() || undefined,
      features: f.features.filter(Boolean),
      imageUrl: f.imageUrl.trim() || undefined,
      tech: f.tech,
      primaryTech: f.primaryTech ?? undefined,
      liveUrl: f.liveUrl.trim() || undefined,
      githubUrl: f.githubUrl.trim() || undefined,
      order: parseInt(f.order) || 0,
    });
    setAdding(false);
  }

  async function handleUpdate(id: Id<"projects">, f: FormState) {
    await update({
      id,
      name: f.name.trim(),
      slug: f.slug.trim(),
      description: f.description.trim(),
      longDescription: f.longDescription.trim() || undefined,
      features: f.features.filter(Boolean),
      imageUrl: f.imageUrl.trim() || undefined,
      tech: f.tech,
      primaryTech: f.primaryTech ?? undefined,
      liveUrl: f.liveUrl.trim() || undefined,
      githubUrl: f.githubUrl.trim() || undefined,
      order: parseInt(f.order) || 0,
    });
    setEditingId(null);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#f8fafc]">Projects</h1>
          <p className="mt-1 text-sm text-[#90a1b9]">
            {projects?.length ?? 0} project{projects?.length !== 1 ? "s" : ""}
          </p>
        </div>
        {!adding && (
          <button
            onClick={() => {
              setAdding(true);
              setEditingId(null);
            }}
            className="cursor-pointer rounded bg-[#ff9d00] px-4 py-2 text-sm font-medium text-[#020618] transition-opacity hover:opacity-90"
          >
            + Add project
          </button>
        )}
      </div>

      {adding && (
        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-[#90a1b9]">New project</p>
          <ProjectForm initial={empty} onSave={handleCreate} onCancel={() => setAdding(false)} />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {projects?.map((p) => (
          <div key={p._id}>
            {editingId === p._id ? (
              <ProjectForm
                initial={{
                  name: p.name,
                  slug: p.slug,
                  description: p.description,
                  longDescription: p.longDescription ?? "",
                  features: p.features?.length ? p.features : [""],
                  imageUrl: p.imageUrl ?? "",
                  tech: p.tech as Tech[],
                  primaryTech: (p.primaryTech as Tech) ?? null,
                  liveUrl: p.liveUrl ?? "",
                  githubUrl: p.githubUrl ?? "",
                  order: String(p.order),
                }}
                onSave={(f) => handleUpdate(p._id, f)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex items-start justify-between rounded border border-[#314158] bg-[#0a1628] p-4">
                <div className="min-w-0">
                  <p className="font-medium text-[#f8fafc]">{p.name}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-[#1e2d45] px-2 py-0.5 text-xs text-[#90a1b9]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {p.description && (
                    <p className="mt-1.5 line-clamp-2 text-sm text-[#637b96]">{p.description}</p>
                  )}
                </div>
                <div className="ml-4 flex shrink-0 gap-2">
                  <button
                    onClick={() => {
                      setEditingId(p._id);
                      setAdding(false);
                    }}
                    className="cursor-pointer text-sm text-[#4d9cff] hover:underline"
                  >
                    Edit
                  </button>
                  {confirmDelete === p._id ? (
                    <span className="flex items-center gap-1 text-sm">
                      <button
                        onClick={async () => {
                          await remove({ id: p._id });
                          setConfirmDelete(null);
                        }}
                        className="cursor-pointer text-[#ff637e] hover:underline"
                      >
                        Confirm
                      </button>
                      <span className="text-[#314158]">·</span>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="cursor-pointer text-[#90a1b9] hover:underline"
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(p._id)}
                      className="cursor-pointer text-sm text-[#90a1b9] transition-colors hover:text-[#ff637e]"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        {projects?.length === 0 && !adding && (
          <p className="py-8 text-center text-sm text-[#637b96]">No projects yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}
