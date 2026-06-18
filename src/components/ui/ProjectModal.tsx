"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import TechIconBox from "@/components/ui/TechIconBox";
import Button from "@/components/ui/Button";

export type ProjectModalData = {
  name: string;
  slug: string;
  image?: string;
  description: string;
  longDescription?: string;
  features?: string[];
  tech: Tech[];
  primaryTech?: Tech;
  liveUrl?: string;
  githubUrl?: string;
};

type Props = {
  project: ProjectModalData | null;
  onClose: () => void;
};

export default function ProjectModal({ project, onClose }: Props) {
  useEffect(() => {
    if (!project) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [project, onClose]);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="border-primitive-slate-800 bg-primitive-slate-950 relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
            style={{ maxHeight: "90dvh" }}
          >
            {/* Image */}
            {project.image && (
              <div className="relative h-52 w-full shrink-0 overflow-hidden">
                <Image src={project.image} alt={project.name} fill className="object-cover" />
                <div className="to-primitive-slate-950/80 absolute inset-0 bg-linear-to-b from-transparent" />
              </div>
            )}

            {/* Scrollable body */}
            <div className="overflow-y-auto px-8 py-7">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-body-md">
                    <span className="text-primitive-indigo-500 font-bold">{project.name}</span>
                    {project.slug && (
                      <>
                        <span className="text-theme-foreground">{" // "}</span>
                        <span className="text-theme-foreground">{project.slug}</span>
                      </>
                    )}
                  </p>
                </div>
                {project.primaryTech && (
                  <TechIconBox type={project.primaryTech} className="shrink-0" />
                )}
              </div>

              {/* Description */}
              <p className="text-body-md text-theme-foreground mt-5 leading-relaxed">
                {project.longDescription || project.description}
              </p>

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <ul className="mt-5 flex flex-col gap-2">
                  {project.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="bg-primitive-teal-400 mt-1 h-1.5 w-1.5 shrink-0 rounded-full" />
                      <span className="text-body-sm text-theme-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Tech stack */}
              {project.tech.length > 0 && (
                <div className="mt-6">
                  <p className="text-body-sm text-primitive-slate-400 mb-3">{" // tech-stack "}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <div
                        key={t}
                        className="border-primitive-slate-800 bg-primitive-slate-900 flex items-center gap-1.5 rounded border px-3 py-1.5"
                      >
                        <TechIconBox type={t} className="h-5 w-5 p-0.5" />
                        <span className="text-body-sm text-theme-foreground">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {(project.liveUrl || project.githubUrl) && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {project.liveUrl && (
                    <Button
                      variant="default"
                      onClick={() => window.open(project.liveUrl, "_blank")}
                    >
                      view-live
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button
                      variant="ghost"
                      onClick={() => window.open(project.githubUrl, "_blank")}
                    >
                      view-source
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="bg-primitive-slate-800/80 text-primitive-slate-400 hover:bg-primitive-slate-700 hover:text-primitive-slate-100 absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full backdrop-blur-sm transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
