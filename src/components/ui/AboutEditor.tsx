type Line = string | { text: string; href: string };

type AboutEditorProps = {
  lines?: Line[];
  className?: string;
};

const DEFAULT_LINES: Line[] = ["/**", " * Select a file to view.", " */"];

export default function AboutEditor({ lines = DEFAULT_LINES, className }: AboutEditorProps) {
  return (
    <div
      className={[
        "border-theme-theme-stroke flex h-full items-start gap-5 overflow-y-auto border-r px-5 py-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Line numbers */}
      <div className="text-body-lg text-theme-foreground shrink-0 text-right whitespace-nowrap">
        {lines.map((_, i) => (
          <p key={i} className="leading-6.75">
            {i + 1}
          </p>
        ))}
      </div>

      {/* Code content */}
      <div className="text-body-lg text-theme-foreground min-w-0 whitespace-pre-wrap">
        {lines.map((line, i) =>
          typeof line === "string" ? (
            <p key={i} className="leading-6.75">
              {line}
            </p>
          ) : (
            <p key={i} className="leading-6.75">
              <a
                href={line.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-link-foreground underline-offset-2 hover:underline"
              >
                {line.text}
              </a>
            </p>
          ),
        )}
      </div>
    </div>
  );
}
