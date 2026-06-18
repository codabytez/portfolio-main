type Props = {
  filtered: boolean;
  filterLabel?: string;
};

type Token = { text: string; color?: string };
type Line = Token[];

function CodeLine({ tokens, lineNumber }: { tokens: Line; lineNumber: number }) {
  return (
    <div className="flex items-start gap-6 sm:gap-10">
      <span className="text-primitive-slate-700 w-4 shrink-0 text-right font-mono text-sm leading-6.75 select-none">
        {lineNumber}
      </span>
      <p className="font-mono text-sm leading-6.75">
        {tokens.map(({ text, color }, i) => (
          <span key={i} className={color ?? "text-theme-foreground"}>
            {text}
          </span>
        ))}
      </p>
    </div>
  );
}

function BlinkingCursor() {
  return (
    <span
      className="bg-primitive-indigo-500 ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse"
      aria-hidden
    />
  );
}

export default function ProjectsEmptyState({ filtered, filterLabel }: Props) {
  const noProjectsLines: Line[] = [
    [{ text: "// _projects.js", color: "text-primitive-slate-500" }],
    [],
    [
      { text: "const ", color: "text-primitive-indigo-500" },
      { text: "myProjects", color: "text-primitive-teal-400" },
      { text: " = ", color: "text-theme-heading-foreground" },
      { text: "[]", color: "text-primitive-slate-300" },
      { text: ";", color: "text-theme-foreground" },
    ],
    [],
    [{ text: "/**", color: "text-primitive-slate-500" }],
    [{ text: " * Nothing here yet.", color: "text-primitive-slate-500" }],
    [{ text: " * Something awesome is", color: "text-primitive-slate-500" }],
    [{ text: " * currently being built.", color: "text-primitive-slate-500" }],
    [{ text: " * Check back soon!", color: "text-primitive-slate-500" }],
    [{ text: " */", color: "text-primitive-slate-500" }],
    [],
    [
      { text: "export default ", color: "text-primitive-indigo-500" },
      { text: "myProjects", color: "text-primitive-teal-400" },
      { text: ";", color: "text-theme-foreground" },
    ],
  ];

  const tech = filterLabel ?? "selectedTech";
  const filteredLines: Line[] = [
    [{ text: "// _projects.js", color: "text-primitive-slate-500" }],
    [],
    [
      { text: "const ", color: "text-primitive-indigo-500" },
      { text: "results", color: "text-primitive-teal-400" },
      { text: " = projects", color: "text-theme-foreground" },
    ],
    [
      { text: "  .filter", color: "text-primitive-rose-400" },
      { text: "(", color: "text-theme-heading-foreground" },
      { text: "p", color: "text-primitive-orange-400" },
      { text: " => p.tech", color: "text-theme-foreground" },
    ],
    [
      { text: "    .includes", color: "text-primitive-rose-400" },
      { text: "(", color: "text-theme-heading-foreground" },
      { text: `"${tech}"`, color: "text-primitive-teal-400" },
      { text: "));", color: "text-theme-heading-foreground" },
    ],
    [],
    [
      { text: "// results", color: "text-primitive-slate-500" },
      { text: ".length", color: "text-primitive-rose-400" },
      { text: " === ", color: "text-primitive-slate-500" },
      { text: "0", color: "text-primitive-orange-400" },
    ],
    [{ text: "// Try a different filter.", color: "text-primitive-slate-500" }],
  ];

  const lines = filtered ? filteredLines : noProjectsLines;

  return (
    <div className="col-span-full flex items-start justify-start py-10 pl-2">
      <div className="flex flex-col">
        {lines.map((tokens, i) =>
          tokens.length === 0 ? (
            <div key={i} className="flex items-start gap-6 sm:gap-10">
              <span className="text-primitive-slate-700 w-4 shrink-0 text-right font-mono text-sm leading-6.75 select-none">
                {i + 1}
              </span>
              <p className="font-mono text-sm leading-6.75">&nbsp;</p>
            </div>
          ) : (
            <CodeLine key={i} tokens={tokens} lineNumber={i + 1} />
          ),
        )}
        {/* blinking cursor on last line */}
        <div className="flex items-start gap-6 sm:gap-10">
          <span className="text-primitive-slate-700 w-4 shrink-0 text-right font-mono text-sm leading-6.75 select-none">
            {lines.length + 1}
          </span>
          <p className="font-mono text-sm leading-6.75">
            <BlinkingCursor />
          </p>
        </div>
      </div>
    </div>
  );
}
