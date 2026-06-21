"use client";

import { useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import Button from "@/components/ui/Button";
import ProjectForm, {
  type ProjectFormHandle,
  type FormState,
  emptyFormState,
  SEED_TAGS,
} from "@/components/admin/ProjectForm";
import SortableProjectCard from "@/components/admin/SortableProjectCard";
import DeleteModal from "@/components/admin/DeleteModal";
import ProjectFormModal from "@/components/admin/ProjectFormModal";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";

type Project = NonNullable<ReturnType<typeof useQuery<typeof api.projects.list>>>[number];

export default function ProjectsAdmin() {
  const projects = useQuery(api.projects.list);
  const create = useMutation(api.projects.create);
  const update = useMutation(api.projects.update);
  const remove = useMutation(api.projects.remove);

  const allTags = Array.from(
    new Set([...SEED_TAGS, ...(projects ?? []).flatMap((p) => p.tech)]),
  ).sort();

  const [optimisticProjects, setOptimisticProjects] = useState<Project[] | null>(null);
  const displayProjects = optimisticProjects ?? projects;

  const [formModal, setFormModal] = useState<
    { mode: "add" } | { mode: "edit"; project: Project } | null
  >(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: Id<"projects">; name: string } | null>(
    null,
  );
  const formRef = useRef<ProjectFormHandle>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function handleCreate(f: FormState, published: boolean) {
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
      published,
    });
    setFormModal(null);
  }

  async function handleUpdate(id: Id<"projects">, f: FormState, published: boolean) {
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
      published,
    });
    setFormModal(null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !projects) return;
    const oldIndex = projects.findIndex((p) => p._id === active.id);
    const newIndex = projects.findIndex((p) => p._id === over.id);
    const reordered = arrayMove(projects, oldIndex, newIndex);
    setOptimisticProjects(reordered);
    try {
      await Promise.all(reordered.map((p, i) => update({ id: p._id, order: i })));
    } finally {
      setOptimisticProjects(null);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <p className="text-theme-foreground text-sm">
          {"// "}
          {projects?.length ?? 0}
          {" project"}
          {projects?.length !== 1 ? "s" : ""}
          {" in your portfolio."}
        </p>
        <Button variant="primary" onClick={() => setFormModal({ mode: "add" })}>
          + add project
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={(displayProjects ?? []).map((p) => p._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3">
            {displayProjects?.map((p) => (
              <SortableProjectCard
                key={p._id}
                p={p}
                onEdit={() => setFormModal({ mode: "edit", project: p })}
                onDelete={() => setDeleteTarget({ id: p._id, name: p.name })}
                onTogglePublish={() =>
                  update({ id: p._id, published: p.published === false ? true : false })
                }
              />
            ))}
            {displayProjects?.length === 0 && (
              <p className="text-theme-foreground/70 py-8 text-center text-sm">
                No projects yet. Click &quot;+ add project&quot; to get started.
              </p>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {formModal?.mode === "add" && (
        <ProjectFormModal
          title="_add-project"
          onClose={() => setFormModal(null)}
          onSave={(published) => formRef.current!.save(published)}
        >
          <ProjectForm
            ref={formRef}
            initial={emptyFormState}
            onSave={handleCreate}
            allTags={allTags}
          />
        </ProjectFormModal>
      )}

      {formModal?.mode === "edit" && (
        <ProjectFormModal
          title="_edit-project"
          onClose={() => setFormModal(null)}
          onSave={(published) => formRef.current!.save(published)}
        >
          <ProjectForm
            ref={formRef}
            initial={{
              name: formModal.project.name,
              slug: formModal.project.slug,
              description: formModal.project.description,
              longDescription: formModal.project.longDescription ?? "",
              features: formModal.project.features?.length ? formModal.project.features : [""],
              imageUrl: formModal.project.imageUrl ?? "",
              tech: formModal.project.tech,
              primaryTech: formModal.project.primaryTech ?? null,
              liveUrl: formModal.project.liveUrl ?? "",
              githubUrl: formModal.project.githubUrl ?? "",
              order: String(formModal.project.order),
            }}
            onSave={(f, published) => handleUpdate(formModal.project._id, f, published)}
            allTags={allTags}
          />
        </ProjectFormModal>
      )}

      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onConfirm={async () => {
            await remove({ id: deleteTarget.id });
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
