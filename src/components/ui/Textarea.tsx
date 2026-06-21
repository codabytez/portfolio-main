import type { TextareaHTMLAttributes } from "react";

type TextareaState = "static" | "focus" | "error";

type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & {
  className?: string;
  label?: string;
  hint?: string;
  state?: TextareaState;
  errorMessage?: string;
};

const stateClasses: Record<TextareaState, string> = {
  static: "bg-theme-theme-backdrop border-theme-theme-stroke",
  focus: "bg-theme-theme-backdrop border-primitive-slate-300",
  error: "bg-semantic-error-alpha border-semantic-error-background",
};

export default function Textarea({
  className,
  label = "Label",
  hint,
  state = "static",
  errorMessage = "Something went wrong",
  ...props
}: TextareaProps) {
  const isError = state === "error";

  return (
    <div
      className={["flex w-full flex-col items-start gap-1.75", className].filter(Boolean).join(" ")}
    >
      <div className="flex w-full items-baseline gap-2">
        <p className="text-body-md text-theme-foreground">{label}</p>
        {hint && <span className="text-theme-foreground/60 text-xs">{hint}</span>}
      </div>
      <div
        className={[
          "rounded-3 p-button-left-right flex min-h-30 w-full items-start gap-[10px] border transition-colors",
          props.readOnly
            ? "border-theme-theme-stroke/30 bg-transparent"
            : `${stateClasses[state]} focus-within:border-primitive-slate-400`,
        ].join(" ")}
      >
        <textarea
          className="text-body-md text-theme-foreground w-full flex-1 resize-none bg-transparent outline-none read-only:cursor-default read-only:select-none"
          {...props}
        />
        {isError && (
          <i
            className="ri-error-warning-fill text-semantic-error-background shrink-0 text-[24px] leading-none"
            aria-hidden="true"
          />
        )}
      </div>
      {isError && (
        <p className="text-body-sm text-semantic-error-background w-full">{errorMessage}</p>
      )}
    </div>
  );
}
