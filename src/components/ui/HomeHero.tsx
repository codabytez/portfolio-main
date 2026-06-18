"use client";

import { motion } from "motion/react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export default function HomeHero() {
  const profile = useQuery(api.profile.get);
  const socials = useQuery(api.socials.list);

  const loaded = profile !== undefined && socials !== undefined;
  const name = profile?.name ?? "";
  const subtitle = profile?.tagline ? `> ${profile.tagline}` : "";
  const github = socials?.find((s) => s.platform === "github");

  const SUBTITLE_START = 0.65;
  const CODE_START = SUBTITLE_START + subtitle.length * 0.04 + 0.12;

  const constTokens = [
    { text: "const", className: "text-primitive-indigo-500" },
    { text: " " },
    { text: "githubLink", className: "text-primitive-teal-400" },
    { text: " = ", className: "text-theme-heading-foreground" },
    {
      text: `"${github?.url ?? ""}"`,
      className: "text-theme-link-foreground underline cursor-pointer",
      href: github?.url,
    },
  ];

  return (
    <div className="relative flex w-full flex-col items-start gap-18.75 lg:min-w-0 lg:flex-1 xl:w-126 xl:flex-none">
      {/* Introduction */}
      <div className="flex w-full flex-col items-start gap-2">
        <motion.p
          className="text-body-lg text-theme-foreground w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.05 }}
        >
          Hi all. I am
        </motion.p>

        <div className="flex w-full flex-col items-start gap-3">
          {/* Name skeleton */}
          {!loaded && (
            <div className="flex w-full flex-col gap-3">
              <div className="bg-primitive-slate-800/60 h-12 w-72 animate-pulse rounded md:h-16 md:w-96" />
              <div className="bg-primitive-slate-800/60 h-6 w-48 animate-pulse rounded" />
            </div>
          )}

          {/* Name + subtitle — only render once data is ready so the animation fires on real content */}
          {loaded && (
            <>
              <p className="text-heading-h2 text-theme-heading-foreground md:text-heading-h1 w-full">
                {name.split(" ").map((word, wi, words) => {
                  const charOffset = words.slice(0, wi).reduce((n, w) => n + w.length + 1, 0);
                  return (
                    <span key={wi}>
                      <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                        {word.split("").map((char, ci) => (
                          <motion.span
                            key={ci}
                            style={{ display: "inline-block" }}
                            initial={{ opacity: 0, y: 48 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 320,
                              damping: 20,
                              delay: 0.18 + (charOffset + ci) * 0.035,
                            }}
                          >
                            {char}
                          </motion.span>
                        ))}
                      </span>
                      {wi < words.length - 1 && " "}
                    </span>
                  );
                })}
              </p>

              <p className="text-heading-h6 text-primitive-indigo-500 md:text-heading-h4 w-full">
                {subtitle.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.01, delay: SUBTITLE_START + i * 0.04 }}
                  >
                    {char}
                  </motion.span>
                ))}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{
                    delay: SUBTITLE_START + subtitle.length * 0.04,
                    duration: 0.9,
                    repeat: Infinity,
                    times: [0, 0.1, 0.7, 1],
                  }}
                >
                  |
                </motion.span>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Code block */}
      <div className="flex w-full flex-col items-start gap-3">
        <motion.p
          className="text-body-md text-theme-foreground hidden w-full md:block"
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 28, delay: CODE_START }}
        >
          {"// complete the game to continue"}
        </motion.p>

        <motion.p
          className="text-body-sm text-theme-foreground md:text-body-md w-full"
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 28, delay: CODE_START + 0.15 }}
        >
          {"// find my profile on Github:"}
        </motion.p>

        {/* const line - per-token fade */}
        <p className="text-body-sm md:text-body-md w-full">
          {constTokens.map(({ text, className, href }, i) => (
            <motion.span
              key={i}
              className={className}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: CODE_START + 0.32 + i * 0.12 }}
              {...(href ? { onClick: () => window.open(href, "_blank"), role: "link" } : {})}
            >
              {text}
            </motion.span>
          ))}
        </p>
      </div>
    </div>
  );
}
