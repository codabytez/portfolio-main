type AboutEditorProps = {
  lines?: string[];
  className?: string;
};

const DEFAULT_LINES = ["/**", " * Select a file to view.", " */"];

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
      <div className="text-body-lg text-theme-foreground shrink-0 whitespace-pre-wrap">
        {lines.map((line, i) => (
          <p key={i} className="leading-6.75">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
