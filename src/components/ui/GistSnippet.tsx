"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import Avatar from "@/components/ui/Avatar";

type GistSnippetProps = {
  className?: string;
  codeBlock?: React.ReactNode;
};

export default function GistSnippet({ className, codeBlock }: GistSnippetProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={["flex w-full max-w-153.25 flex-col items-start gap-4", className]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Header */}
      <div className="flex w-full flex-wrap items-start justify-between gap-y-2">
        <div className="flex items-center gap-3">
          <Avatar variant="1" />
          <div className="flex flex-col gap-1">
            <p className="text-body-sm text-primitive-indigo-500 font-bold">@username</p>
            <p className="text-body-sm text-theme-foreground">Created 5 months ago</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Details button */}
          <button
            onClick={() => setExpanded((o) => !o)}
            className="flex cursor-pointer items-center gap-1.75"
          >
            <Image
              src="/gist/details-icon.svg"
              alt="details"
              width={16}
              height={16}
              className="shrink-0"
            />
            <p
              className={[
                "text-body-sm whitespace-nowrap transition-colors duration-150",
                expanded ? "text-theme-heading-foreground" : "text-theme-foreground",
              ].join(" ")}
            >
              details
            </p>
          </button>

          {/* Stars */}
          <div className="flex items-center gap-1.75">
            <Image
              src="/gist/stars-icon.svg"
              alt="stars"
              width={16}
              height={16}
              className="shrink-0"
            />
            <p className="text-body-sm text-theme-foreground whitespace-nowrap">3 stars</p>
          </div>
        </div>
      </div>

      {/* Code block */}
      <div
        className={[
          "bg-theme-theme-backdrop border-theme-theme-stroke rounded-4 w-full overflow-hidden border p-4",
          expanded ? "" : "h-44.25",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {codeBlock}
      </div>

      {/* Footer — animated */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="footer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full overflow-hidden"
          >
            <div className="border-theme-theme-stroke flex w-full items-start gap-6 border-t pt-5">
              <p className="text-body-sm text-theme-foreground flex-1 leading-relaxed">
                My work here was 5 months ago. It was for the project called &ldquo;...&rdquo;. Some
                other text can be placed here.
              </p>
              <button onClick={() => setExpanded(false)} className="shrink-0 cursor-pointer">
                <Image src="/gist/close-icon.svg" alt="close" width={24} height={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
