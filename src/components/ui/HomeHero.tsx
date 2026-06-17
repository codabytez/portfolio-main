"use client";

import { motion } from "motion/react";

const NAME = "Micheal Weaver";
const SUBTITLE = "> Front-end developer";
const SUBTITLE_START = 0.65;
const CODE_START = SUBTITLE_START + SUBTITLE.length * 0.04 + 0.12;

const CONST_TOKENS = [
  { text: "const", className: "text-primitive-indigo-500" },
  { text: " " },
  { text: "githubLink", className: "text-primitive-teal-400" },
  { text: " = ", className: "text-theme-heading-foreground" },
  { text: `"https://github.com/example/url"`, className: "text-theme-link-foreground underline" },
];

export default function HomeHero() {
  return (
    <div className="relative flex w-126 shrink-0 flex-col items-start gap-18.75">
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
          {/* Name — per-character spring */}
          <p className="text-heading-h1 text-theme-heading-foreground w-full">
            {NAME.split("").map((char, i) => (
              <motion.span
                key={i}
                style={{ display: "inline-block" }}
                initial={{ opacity: 0, y: 48 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 20,
                  delay: 0.18 + i * 0.035,
                }}
              >
                {char === " " ? " " : char}
              </motion.span>
            ))}
          </p>

          {/* Subtitle — typewriter */}
          <p className="text-heading-h4 text-primitive-indigo-500 w-full">
            {SUBTITLE.split("").map((char, i) => (
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
                delay: SUBTITLE_START + SUBTITLE.length * 0.04,
                duration: 0.9,
                repeat: Infinity,
                times: [0, 0.1, 0.7, 1],
              }}
            >
              |
            </motion.span>
          </p>
        </div>
      </div>

      {/* Code block */}
      <div className="flex w-full flex-col items-start gap-3">
        <motion.p
          className="text-body-md text-theme-foreground w-full"
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 28, delay: CODE_START }}
        >
          {"// complete the game to continue"}
        </motion.p>

        <motion.p
          className="text-body-md text-theme-foreground w-full"
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 28, delay: CODE_START + 0.15 }}
        >
          {"// find my profile on Github:"}
        </motion.p>

        {/* const line — per-token fade */}
        <p className="text-body-md w-full">
          {CONST_TOKENS.map(({ text, className }, i) => (
            <motion.span
              key={i}
              className={className}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: CODE_START + 0.32 + i * 0.12 }}
            >
              {text}
            </motion.span>
          ))}
        </p>
      </div>
    </div>
  );
}
