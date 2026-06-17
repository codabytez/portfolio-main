"use client";

import { motion } from "motion/react";

type Props = {
  children: React.ReactNode;
  from?: "left" | "right";
  delay?: number;
  className?: string;
};

export default function AnimatedPanel({ children, from = "left", delay = 0, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: from === "left" ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
