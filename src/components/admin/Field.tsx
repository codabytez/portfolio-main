type FieldProps = {
  label: string;
  hint?: string;
  children: React.ReactNode;
};

export function Field({ label, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <label className="text-body-md text-theme-foreground">{label}</label>
        {hint && <span className="text-theme-foreground/60 text-xs">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
