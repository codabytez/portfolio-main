"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import Image from "next/image";
import { Field, Input, Textarea } from "../../_components/Field";
import SaveButton from "../../_components/SaveButton";
import ImageUpload from "../../_components/ImageUpload";
import CustomSelect from "../../_components/CustomSelect";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SEED_TAGS = [
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

type FormState = {
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

const empty: FormState = {
  name: "",
  slug: "",
  description: "",
  longDescription: "",
  features: [""],
  imageUrl: "",
  tech: [] as string[],
  primaryTech: null,
  liveUrl: "",
  githubUrl: "",
  order: "0",
};

function TagInput({
  value,
  onChange,
  allTags,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  allTags: string[];
}) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const suggestions = allTags
    .filter((t) => t.toLowerCase().includes(input.toLowerCase()) && !value.includes(t))
    .slice(0, 8);

  const showAdd =
    input.trim() !== "" &&
    !allTags.some((t) => t.toLowerCase() === input.trim().toLowerCase()) &&
    !value.includes(input.trim());
  const items = showAdd ? [...suggestions, `+ Add "${input.trim()}"`] : suggestions;

  function add(tag: string) {
    const clean = tag.startsWith('+ Add "') ? input.trim() : tag;
    if (clean && !value.includes(clean)) onChange([...value, clean]);
    setInput("");
    setOpen(false);
    inputRef.current?.focus();
  }

  function remove(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (items[highlighted]) add(items[highlighted]);
    } else if (e.key === "Escape") setOpen(false);
    else if (e.key === "Backspace" && input === "" && value.length > 0)
      onChange(value.slice(0, -1));
  }

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 rounded bg-[#ff9d00] px-2 py-0.5 text-xs font-medium text-[#020618]"
            >
              {t}
              <button
                type="button"
                onClick={() => remove(t)}
                className="cursor-pointer leading-none opacity-70 hover:opacity-100"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setHighlighted(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKey}
          placeholder="Type to search or add a tag…"
          className="w-full rounded border border-[#314158] bg-[#0f172b] px-3 py-1.5 text-sm text-[#f8fafc] placeholder:text-[#90a1b9]/50 focus:border-[#90a1b9] focus:outline-none"
        />
        {open && items.length > 0 && (
          <ul
            ref={listRef}
            className="absolute z-10 mt-1 w-full rounded border border-[#314158] bg-[#0a1628] py-1 shadow-lg"
          >
            {items.map((item, i) => (
              <li
                key={item}
                onMouseDown={() => add(item)}
                className={[
                  "cursor-pointer px-3 py-1.5 text-sm",
                  i === highlighted
                    ? "bg-[#1e2d45] text-[#f8fafc]"
                    : "text-[#90a1b9] hover:bg-[#1e2d45] hover:text-[#f8fafc]",
                  item.startsWith('+ Add "') ? "text-[#ff9d00]" : "",
                ].join(" ")}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function FeaturesList({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function update(i: number, text: string) {
    const next = [...value];
    next[i] = text;
    onChange(next);
  }

  function remove(i: number) {
    const next = value.filter((_, idx) => idx !== i);
    onChange(next.length ? next : [""]);
  }

  function handleKey(e: React.KeyboardEvent, i: number) {
    if (e.key === "Enter") {
      e.preventDefault();
      const next = [...value];
      next.splice(i + 1, 0, "");
      onChange(next);
      setTimeout(() => inputRefs.current[i + 1]?.focus(), 0);
    } else if (e.key === "Backspace" && value[i] === "" && value.length > 1) {
      e.preventDefault();
      remove(i);
      setTimeout(() => inputRefs.current[Math.max(i - 1, 0)]?.focus(), 0);
    }
  }

  function handlePaste(e: React.ClipboardEvent, i: number) {
    const text = e.clipboardData.getData("text");
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.replace(/^[-•*]\s*/, "").trim())
      .filter(Boolean);
    if (lines.length <= 1) return;
    e.preventDefault();
    const next = [...value];
    next.splice(i, 1, ...lines);
    onChange(next);
    setTimeout(() => inputRefs.current[i + lines.length - 1]?.focus(), 0);
  }

  return (
    <div className="flex flex-col gap-2">
      {value.map((feat, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="shrink-0 text-xs text-[#637b96] select-none">—</span>
          <input
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            value={feat}
            onChange={(e) => update(i, e.target.value)}
            onKeyDown={(e) => handleKey(e, i)}
            onPaste={(e) => handlePaste(e, i)}
            placeholder={`Feature ${i + 1}`}
            className="flex-1 rounded border border-[#314158] bg-[#0f172b] px-3 py-1.5 text-sm text-[#f8fafc] placeholder:text-[#90a1b9]/50 focus:border-[#90a1b9] focus:outline-none"
          />
          {value.length > 1 && (
            <button
              type="button"
              onClick={() => remove(i)}
              className="hover:text-primitive-rose-400 shrink-0 cursor-pointer text-lg leading-none text-[#637b96] transition-colors"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          const next = [...value, ""];
          onChange(next);
          setTimeout(() => inputRefs.current[next.length - 1]?.focus(), 0);
        }}
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
  allTags,
}: {
  initial: FormState;
  onSave: (f: FormState) => Promise<void>;
  onCancel: () => void;
  allTags: string[];
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
        <Field label="Tech stack" hint="type to search or add a new tag">
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
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Card badge" hint="icon shown on the project card">
          <CustomSelect<string>
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

type Project = NonNullable<ReturnType<typeof useQuery<typeof api.projects.list>>>[number];

function SortableProjectCard({
  p,
  editingId,
  confirmDelete,
  allTags,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
  onConfirmDelete,
  onCancelDelete,
}: {
  p: Project;
  editingId: Id<"projects"> | null;
  confirmDelete: Id<"projects"> | null;
  allTags: string[];
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (f: FormState) => Promise<void>;
  onDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: p._id,
    disabled: editingId === p._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {editingId === p._id ? (
        <ProjectForm
          initial={{
            name: p.name,
            slug: p.slug,
            description: p.description,
            longDescription: p.longDescription ?? "",
            features: p.features?.length ? p.features : [""],
            imageUrl: p.imageUrl ?? "",
            tech: p.tech,
            primaryTech: p.primaryTech ?? null,
            liveUrl: p.liveUrl ?? "",
            githubUrl: p.githubUrl ?? "",
            order: String(p.order),
          }}
          onSave={onSave}
          onCancel={onCancelEdit}
          allTags={allTags}
        />
      ) : (
        <div className="flex items-start gap-3 rounded border border-[#314158] bg-[#0a1628] p-4">
          <button
            {...attributes}
            {...listeners}
            className="mt-0.5 shrink-0 cursor-grab touch-none text-[#314158] transition-colors hover:text-[#637b96] active:cursor-grabbing"
            title="Drag to reorder"
          >
            <i className="ri-draggable text-lg leading-none" />
          </button>
          {p.imageUrl && (
            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded">
              <Image src={p.imageUrl} alt={p.name} fill className="object-cover" unoptimized />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-medium text-[#f8fafc]">{p.name}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {p.tech.map((t) => (
                <span key={t} className="rounded bg-[#1e2d45] px-2 py-0.5 text-xs text-[#90a1b9]">
                  {t}
                </span>
              ))}
            </div>
            {p.description && (
              <p className="mt-1.5 line-clamp-2 text-sm text-[#637b96]">{p.description}</p>
            )}
          </div>
          <div className="ml-1 flex shrink-0 items-center gap-1">
            <button
              onClick={onEdit}
              title="Edit"
              className="cursor-pointer rounded p-1.5 text-[#637b96] transition-colors hover:bg-[#1e2d45] hover:text-[#4d9cff]"
            >
              <i className="ri-pencil-line text-base leading-none" />
            </button>
            {confirmDelete === p._id ? (
              <span className="flex items-center gap-1 text-sm">
                <button
                  onClick={onConfirmDelete}
                  className="cursor-pointer text-[#ff637e] hover:underline"
                >
                  Confirm
                </button>
                <span className="text-[#314158]">·</span>
                <button
                  onClick={onCancelDelete}
                  className="cursor-pointer text-[#90a1b9] hover:underline"
                >
                  Cancel
                </button>
              </span>
            ) : (
              <button
                onClick={onDelete}
                title="Delete"
                className="cursor-pointer rounded p-1.5 text-[#ff637e] transition-colors hover:bg-[#1e2d45]"
              >
                <i className="ri-delete-bin-line text-base leading-none" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectsAdmin() {
  const projects = useQuery(api.projects.list);
  const create = useMutation(api.projects.create);
  const update = useMutation(api.projects.update);
  const remove = useMutation(api.projects.remove);

  const allTags = Array.from(
    new Set([...SEED_TAGS, ...(projects ?? []).flatMap((p) => p.tech)]),
  ).sort();

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<Id<"projects"> | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Id<"projects"> | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

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
      order: projects?.length ?? 0,
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

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !projects) return;
    const oldIndex = projects.findIndex((p) => p._id === active.id);
    const newIndex = projects.findIndex((p) => p._id === over.id);
    const reordered = arrayMove(projects, oldIndex, newIndex);
    await Promise.all(reordered.map((p, i) => update({ id: p._id, order: i })));
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
          <ProjectForm
            initial={empty}
            onSave={handleCreate}
            onCancel={() => setAdding(false)}
            allTags={allTags}
          />
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={(projects ?? []).map((p) => p._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3">
            {projects?.map((p) => (
              <SortableProjectCard
                key={p._id}
                p={p}
                editingId={editingId}
                confirmDelete={confirmDelete}
                allTags={allTags}
                onEdit={() => {
                  setEditingId(p._id);
                  setAdding(false);
                }}
                onCancelEdit={() => setEditingId(null)}
                onSave={(f) => handleUpdate(p._id, f)}
                onDelete={() => setConfirmDelete(p._id)}
                onConfirmDelete={async () => {
                  await remove({ id: p._id });
                  setConfirmDelete(null);
                }}
                onCancelDelete={() => setConfirmDelete(null)}
              />
            ))}
            {projects?.length === 0 && !adding && (
              <p className="py-8 text-center text-sm text-[#637b96]">
                No projects yet. Add one above.
              </p>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
