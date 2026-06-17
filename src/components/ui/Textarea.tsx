import type { TextareaHTMLAttributes } from "react";

type TextareaState = "static" | "focus" | "error";

type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & {
  className?: string;
  label?: string;
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
  state = "static",
  errorMessage = "Something went wrong",
  ...props
}: TextareaProps) {
  const isError = state === "error";

  return (
    <div
      className={["flex w-full flex-col items-start gap-[7px]", className]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="text-body-md text-theme-foreground w-full">{label}</p>
      <div
        className={[
          "rounded-3 flex min-h-[120px] w-full items-start gap-[10px] border p-[12px]",
          stateClasses[state],
        ].join(" ")}
      >
        <textarea
          className="text-body-md text-theme-foreground w-full flex-1 resize-none bg-transparent outline-none"
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
