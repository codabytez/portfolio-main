"use client";

import { motion } from "motion/react";

type DropdownItemProps = {
  className?: string;
  variant?: "space" | "no space";
  label?: string;
  icon?: string;
  onOpen?: () => void;
};

export default function DropdownItem({
  className,
  variant = "space",
  label = "bio",
  icon = "ri-markdown-fill",
  onOpen,
}: DropdownItemProps) {
  const isSpace = variant === "space";

  return (
    <motion.div
      onClick={onOpen}
      whileHover={{ x: 3, backgroundColor: "rgb(29 41 61 / 0.6)" }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={[
        "rounded-2 flex w-full cursor-pointer items-center gap-3 px-3 py-0.5",
        isSpace ? "pl-[28px]" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <i
        className={[icon, "text-theme-foreground text-[16px] leading-none"].join(" ")}
        aria-hidden="true"
      />
      <p className="text-body-md text-theme-foreground">{label}</p>
    </motion.div>
  );
}
