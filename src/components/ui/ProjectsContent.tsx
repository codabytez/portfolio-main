"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import ProjectsSidebar from "@/components/ui/ProjectsSidebar";
import ProjectCard from "@/components/ui/ProjectCard";
import ProjectCardSkeleton from "@/components/ui/ProjectCardSkeleton";
import ProjectModal, { type ProjectModalData } from "@/components/ui/ProjectModal";
import ProjectsEmptyState from "@/components/ui/ProjectsEmptyState";

const TECH_META: Record<string, { icon: string; label: string }> = {
  react: { icon: "ri-reactjs-fill", label: "React" },
  "react-native": { icon: "ri-reactjs-fill", label: "React Native" },
  nextjs: { icon: "ri-server-fill", label: "Next.js" },
  html: { icon: "ri-html5-fill", label: "HTML" },
  css: { icon: "ri-css3-fill", label: "CSS" },
  vue: { icon: "ri-vuejs-fill", label: "Vue" },
  svelte: { icon: "ri-svelte-fill", label: "Svelte" },
};

const SIDEBAR_DEFAULTS: TechMeta[] = Object.entries(TECH_META).map(([type, { icon, label }]) => ({
  type,
  icon,
  label,
}));

function toTechMeta(type: string): TechMeta {
  const known = TECH_META[type];
  return {
    type,
    icon: known?.icon ?? "ri-code-s-slash-fill",
    label: known?.label ?? type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, " "),
  };
}

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

export default function ProjectsContent() {
  const projects = useQuery(api.projects.list);
  const [selectedTechs, setSelectedTechs] = useState<Tech[]>([]);
  const [activeProject, setActiveProject] = useState<ProjectModalData | null>(null);

  const toggleTech = (tech: Tech) =>
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech],
    );

  const clearFilters = () => setSelectedTechs([]);

  const sidebarTechs = useMemo(() => {
    const defaultTypes = new Set(SIDEBAR_DEFAULTS.map((t) => t.type));
    const extras = Array.from(
      new Set(
        (projects ?? [])
          .map((p) => p.primaryTech)
          .filter((t): t is string => !!t && !defaultTypes.has(t)),
      ),
    ).map(toTechMeta);
    return [...SIDEBAR_DEFAULTS, ...extras];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    return selectedTechs.length === 0
      ? projects
      : projects.filter((p) => selectedTechs.some((t) => p.tech.includes(t)));
  }, [projects, selectedTechs]);

  const filterLabel = selectedTechs
    .map((t) => sidebarTechs.find((m) => m.type === t)?.label ?? t)
    .join("; ");

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col self-stretch overflow-y-auto lg:flex-row lg:items-start lg:overflow-hidden">
        <ProjectsSidebar techs={sidebarTechs} selectedTechs={selectedTechs} onToggle={toggleTech} />

        <div className="flex min-w-0 flex-1 flex-col self-stretch">
          {/* Tab bar — desktop only */}
          <div className="border-theme-theme-stroke hidden h-10.25 shrink-0 items-center border-b lg:flex">
            <AnimatePresence mode="wait">
              {selectedTechs.length > 0 && (
                <motion.div
                  key="filter-tab"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="border-theme-theme-stroke flex h-full items-center gap-4 border-x px-6"
                >
                  <span className="text-body-md text-theme-foreground whitespace-nowrap">
                    {filterLabel}
                  </span>
                  <motion.button
                    onClick={clearFilters}
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="cursor-pointer leading-none"
                    aria-label="Clear filters"
                  >
                    <i className="ri-close-line text-theme-foreground text-[16px] leading-none" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Grid */}
          <div className="lg:border-theme-theme-stroke grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:flex-1 lg:overflow-y-auto lg:border-x xl:grid-cols-3 xl:gap-8 xl:p-10">
            {/* Loading skeleton */}
            {projects === undefined && (
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProjectCardSkeleton key={i} />
                ))}
              </>
            )}

            {/* Empty state */}
            {projects !== undefined && filteredProjects.length === 0 && (
              <ProjectsEmptyState
                filtered={selectedTechs.length > 0}
                filterLabels={selectedTechs}
              />
            )}

            {/* Cards */}
            <LayoutGroup>
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, i) => (
                  <motion.div
                    key={project._id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{
                      opacity: 0,
                      scale: 0.94,
                      y: -8,
                      transition: { duration: 0.18, ease: "easeIn" as const },
                    }}
                    layout
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    className="w-full"
                  >
                    <ProjectCard
                      name={project.name}
                      slug={project.slug}
                      description={project.description}
                      image={project.imageUrl}
                      tech={project.primaryTech ?? project.tech[0]}
                      onClick={() =>
                        setActiveProject({
                          name: project.name,
                          slug: project.slug,
                          image: project.imageUrl,
                          description: project.description,
                          longDescription: project.longDescription,
                          features: project.features,
                          tech: project.tech,
                          primaryTech: project.primaryTech,
                          liveUrl: project.liveUrl,
                          githubUrl: project.githubUrl,
                        })
                      }
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </LayoutGroup>
          </div>
        </div>
      </div>

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  );
}
