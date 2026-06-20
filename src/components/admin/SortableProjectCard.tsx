"use client";

import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Project = {
  _id: string;
  name: string;
  description: string;
  tech: string[];
  imageUrl?: string;
};

type Props = {
  p: Project;
  onEdit: () => void;
  onDelete: () => void;
};

export default function SortableProjectCard({ p, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: p._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="border-theme-theme-stroke bg-theme-theme-backdrop hover:border-primitive-slate-600 flex items-start gap-3 rounded-lg border p-4 transition-colors">
        <button
          {...attributes}
          {...listeners}
          className="text-primitive-slate-700 hover:text-theme-foreground/70 mt-0.5 shrink-0 cursor-grab touch-none transition-colors active:cursor-grabbing"
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
          <p className="text-theme-heading-foreground font-medium">{p.name}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {p.tech.map((t) => (
              <span
                key={t}
                className="bg-primitive-slate-800 text-theme-foreground rounded px-2 py-0.5 text-xs"
              >
                {t}
              </span>
            ))}
          </div>
          {p.description && (
            <p className="text-theme-foreground/70 mt-1.5 line-clamp-2 text-sm">{p.description}</p>
          )}
        </div>
        <div className="ml-1 flex shrink-0 items-center gap-1">
          <button
            onClick={onEdit}
            title="Edit"
            className="text-theme-foreground/70 hover:bg-primitive-slate-800 hover:text-primitive-indigo-400 cursor-pointer rounded p-1.5 transition-colors"
          >
            <i className="ri-pencil-line text-base leading-none" />
          </button>
          <button
            onClick={onDelete}
            title="Delete"
            className="text-primitive-rose-400 hover:bg-primitive-slate-800 cursor-pointer rounded p-1.5 transition-colors"
          >
            <i className="ri-delete-bin-line text-base leading-none" />
          </button>
        </div>
      </div>
    </div>
  );
}
