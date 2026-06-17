"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type DropdownTitleProps = {
  className?: string;
  state?: "closed" | "opened";
  title?: string;
  children?: React.ReactNode;
  onOpen?: () => void;
};

export default function DropdownTitle({
  className,
  state = "closed",
  title = "title",
  children,
  onOpen,
}: DropdownTitleProps) {
  const [open, setOpen] = useState(state === "opened");

  function handleClick() {
    onOpen?.();
    if (children) setOpen((o) => !o);
  }

  return (
    <div className={["w-full", className].filter(Boolean).join(" ")}>
      <motion.button
        onClick={handleClick}
        whileHover={{ x: 3, backgroundColor: "rgb(29 41 61 / 0.6)" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="rounded-2 flex w-full cursor-pointer items-center gap-3 px-3 py-0.5"
      >
        <motion.i
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ duration: 0.2 }}
          className="ri-arrow-down-s-line text-theme-foreground text-[16px] leading-none"
          aria-hidden="true"
        />
        <div className="flex flex-1 items-center gap-3">
          <i
            className="ri-folder-fill text-theme-foreground text-[16px] leading-none"
            aria-hidden="true"
          />
          <p className="text-body-md text-theme-heading-foreground">{title}</p>
        </div>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && children && (
          <motion.div
            key={title}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
