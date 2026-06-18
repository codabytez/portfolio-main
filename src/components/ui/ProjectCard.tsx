"use client";

import Image from "next/image";
import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import TechIconBox from "@/components/ui/TechIconBox";

export default function ProjectCard({
  className,
  name,
  slug,
  image = "/projects/project-1.jpg",
  description = "Duis aute irure dolor in velit esse cillum dolore.",
  tech = "react",
  href,
  onClick,
}: ProjectCardProps & { onClick?: () => void }) {
  return (
    <motion.div
      className={["group flex flex-col items-start gap-4", className].filter(Boolean).join(" ")}
      whileHover="hovered"
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {(name || slug) && (
        <p className="text-body-md w-full">
          {name && <span className="text-primitive-indigo-500 font-bold">{name}</span>}
          {name && slug && <span className="text-theme-foreground">{" // "}</span>}
          {slug && <span className="text-theme-foreground">{slug}</span>}
        </p>
      )}

      <motion.div
        variants={{
          hovered: {
            y: -6,
            boxShadow: "0 16px 48px rgba(97, 95, 255, 0.22), 0 0 0 1px rgba(97, 95, 255, 0.3)",
          },
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="rounded-4 relative flex w-full flex-col items-start"
      >
        <div className="border-primitive-slate-800 rounded-t-4 relative h-36.25 w-full overflow-hidden border">
          <Image
            src={image}
            alt={name ?? ""}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="border-primitive-slate-800 bg-primitive-slate-950 rounded-b-4 flex w-full flex-col items-start gap-5.25 border-x border-b p-7">
          <p className="text-body-lg text-theme-foreground">{description}</p>
          <Button
            variant="default"
            onClick={onClick ?? (href ? () => window.open(href, "_blank") : undefined)}
          >
            view-project
          </Button>
        </div>
        <div className="absolute top-5 right-5">
          <TechIconBox type={tech} />
        </div>
      </motion.div>
    </motion.div>
  );
}
