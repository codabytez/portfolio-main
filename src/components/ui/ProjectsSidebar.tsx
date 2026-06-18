"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Checkbox from "@/components/ui/Checkbox";
import NextjsIcon from "@/components/ui/NextjsIcon";

const TECHS: TechMeta[] = [
  { type: "react", icon: "ri-reactjs-fill", label: "React" },
  { type: "react-native", icon: "ri-reactjs-fill", label: "React Native" },
  { type: "nextjs", icon: "ri-server-fill", label: "Next.js" },
  { type: "html", icon: "ri-html5-fill", label: "HTML" },
  { type: "css", icon: "ri-css3-fill", label: "CSS" },
  { type: "vue", icon: "ri-vuejs-fill", label: "Vue" },
  { type: "svelte", icon: "ri-svelte-fill", label: "Svelte" },
  { type: "angular", icon: "ri-angularjs-fill", label: "Angular" },
  { type: "gatsby", icon: "ri-gatsby-fill", label: "Gatsby" },
  { type: "flutter", icon: "ri-flutter-fill", label: "Flutter" },
];

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
};

export default function ProjectsSidebar({ selectedTechs, onToggle }: ProjectsSidebarProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-theme-theme-stroke w-full shrink-0 border-b lg:w-77.75 lg:self-stretch lg:border-r lg:border-b-0">
      {/* Mobile: _projects header */}
      <div className="border-theme-theme-stroke flex items-center border-b px-6 py-3 lg:hidden">
        <p className="text-body-md text-theme-heading-foreground">_projects</p>
      </div>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ backgroundColor: "rgb(29 41 61 / 0.4)" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="border-theme-theme-stroke bg-primitive-slate-700 flex w-full cursor-pointer items-center gap-3 border-b px-6 py-3 lg:bg-transparent"
      >
        <motion.i
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className="ri-arrow-down-s-fill text-theme-heading-foreground text-[16px] leading-none"
          aria-hidden
        />
        <p className="text-body-md text-theme-heading-foreground flex-1 text-left">projects</p>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-2 p-3"
            >
              {TECHS.map(({ type, icon, label }) => (
                <motion.label
                  key={type}
                  variants={itemVariants}
                  whileHover={{ x: 3, backgroundColor: "rgb(29 41 61 / 0.6)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="flex cursor-pointer items-center gap-6 rounded px-3 py-1"
                >
                  <Checkbox
                    checked={selectedTechs.includes(type)}
                    onChange={() => onToggle(type)}
                  />
                  <div className="flex items-center gap-2 p-0.5">
                    {type === "nextjs" ? (
                      <NextjsIcon size={24} className="text-theme-foreground" />
                    ) : (
                      <i
                        className={[icon, "text-theme-foreground text-[24px] leading-none"].join(
                          " ",
                        )}
                        aria-hidden
                      />
                    )}
                    <p className="text-body-md text-theme-heading-foreground whitespace-nowrap">
                      {label}
                    </p>
                  </div>
                </motion.label>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
