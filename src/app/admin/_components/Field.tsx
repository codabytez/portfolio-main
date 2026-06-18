type FieldProps = {
  label: string;
  hint?: string;
  children: React.ReactNode;
};

export function Field({ label, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-sm font-medium text-[#f8fafc]">{label}</label>
        {hint && <span className="text-xs text-[#90a1b9]">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={[
        "rounded border border-[#314158] bg-[#0f172b] px-3 py-2 text-sm text-[#f8fafc] placeholder:text-[#90a1b9]/50 focus:border-[#90a1b9] focus:outline-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={[
        "rounded border border-[#314158] bg-[#0f172b] px-3 py-2 text-sm text-[#f8fafc] placeholder:text-[#90a1b9]/50 focus:border-[#90a1b9] focus:outline-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={[
        "rounded border border-[#314158] bg-[#0f172b] px-3 py-2 text-sm text-[#f8fafc] focus:border-[#90a1b9] focus:outline-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </select>
  );
}
