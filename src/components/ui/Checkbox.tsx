import type { InputHTMLAttributes } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export default function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <span className="relative inline-flex size-5">
      <input
        type="checkbox"
        className={[
          "peer rounded-1 border-primitive-slate-500 bg-primitive-slate-900 size-5 cursor-pointer appearance-none border",
          "checked:bg-primitive-slate-500",
          "focus-visible:outline-primitive-slate-700 focus-visible:outline-3",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      <i
        className="ri-check-line text-theme-heading-foreground pointer-events-none absolute inset-0 flex items-center justify-center text-[12px] opacity-0 peer-checked:opacity-100"
        aria-hidden="true"
      />
    </span>
  );
}
