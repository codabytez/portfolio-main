"use client";

import { motion } from "motion/react";

type MenuItemState = "selected" | "static" | "hover" | "icon" | "icon hover";

type MenuItemProps = {
  className?: string;
  state?: MenuItemState;
  label?: string;
  layoutId?: string;
  onClick?: () => void;
};

const COLORS = {
  foreground: "#90a1b9",
  foregroundHover: "#cad5e2",
  foregroundActive: "#f8fafc",
  orange: "#ffb86a",
};

export default function MenuItem({
  className,
  state = "selected",
  label = "_hello",
  layoutId,
  onClick,
}: MenuItemProps) {
  const hasIcon = state === "icon" || state === "icon hover";
  const isSelected = state === "selected";

  if (isSelected) {
    return (
      <div
        className={["relative flex items-center justify-center px-7 py-5", className]
          .filter(Boolean)
          .join(" ")}
        onClick={onClick}
      >
        <motion.div
          layoutId={layoutId}
          className="bg-primary-background absolute right-0 bottom-0 left-0 h-0.75"
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
        <p className="text-body-md text-theme-heading-foreground whitespace-nowrap">{label}</p>
      </div>
    );
  }

  return (
    <motion.div
      className={["relative flex cursor-pointer items-center justify-center px-7 py-5", className]
        .filter(Boolean)
        .join(" ")}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
    >
      {/* Subtle background glow */}
      <motion.div
        className="absolute inset-0"
        variants={{
          idle: { opacity: 0 },
          hover: { opacity: 1 },
          tap: { opacity: 0.6 },
        }}
        transition={{ duration: 0.25 }}
        style={{
          background: `radial-gradient(ellipse at 50% 150%, ${COLORS.orange}10 0%, transparent 70%)`,
        }}
      />

      {/* Hover underline */}
      <motion.div
        className="absolute right-0 bottom-0 left-0 h-0.75"
        style={{ backgroundColor: COLORS.orange, originX: 0 }}
        variants={{
          idle: { scaleX: 0, opacity: 0.8 },
          hover: { scaleX: 1, opacity: 1 },
          tap: { scaleX: 1, opacity: 0.7 },
        }}
        transition={{ type: "spring", stiffness: 600, damping: 38 }}
      />

      <div className="flex items-center gap-3">
        <motion.p
          className="text-body-md whitespace-nowrap"
          variants={{
            idle: { y: 0, color: COLORS.foreground },
            hover: { y: -2, color: COLORS.foregroundHover },
            tap: { y: 0, color: COLORS.foregroundActive, scale: 0.97 },
          }}
          transition={{ type: "spring", stiffness: 450, damping: 28 }}
        >
          {label}
        </motion.p>

        {hasIcon && (
          <motion.i
            className="ri-github-fill text-[24px] leading-none"
            variants={{
              idle: { rotate: 0, scale: 1, color: COLORS.foreground },
              hover: { rotate: -12, scale: 1.15, color: COLORS.foregroundHover },
              tap: { rotate: 0, scale: 0.88, color: COLORS.foregroundActive },
            }}
            transition={{ type: "spring", stiffness: 380, damping: 18 }}
            aria-hidden="true"
          />
        )}
      </div>
    </motion.div>
  );
}
