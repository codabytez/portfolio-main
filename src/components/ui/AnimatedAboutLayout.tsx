"use client";

import { motion } from "motion/react";

type Props = {
  sidebar: React.ReactNode;
  content: React.ReactNode;
  className?: string;
};

export default function AnimatedAboutLayout({ sidebar, content, className }: Props) {
  return (
    <div
      className={[
        "flex min-h-0 w-full flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex w-full shrink-0 lg:w-auto lg:self-stretch"
      >
        {sidebar}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.12 }}
        className="flex min-h-0 min-w-0 flex-1"
      >
        {content}
      </motion.div>
    </div>
  );
}
