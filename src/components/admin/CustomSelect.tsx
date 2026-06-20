"use client";

import { useEffect, useRef, useState } from "react";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  value: T | null;
  onChange: (v: T) => void;
  options: Option<T>[];
  placeholder?: string;
  disabled?: boolean;
};

export default function CustomSelect<T extends string>({
  value,
  onChange,
  options,
  placeholder = "Select…",
  disabled = false,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={[
          "flex w-full items-center justify-between rounded border px-3 py-2.5 text-sm transition-colors",
          disabled
            ? "border-theme-theme-stroke/50 bg-theme-theme-backdrop/50 text-theme-foreground/30 cursor-not-allowed"
            : open
              ? "border-primitive-slate-500 bg-theme-theme-backdrop text-theme-heading-foreground cursor-pointer"
              : "border-theme-theme-stroke bg-theme-theme-backdrop text-theme-heading-foreground hover:border-primitive-slate-500 cursor-pointer",
        ].join(" ")}
      >
        <span className={selected ? "text-theme-heading-foreground" : "text-theme-foreground/40"}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className={[
            "text-theme-foreground ml-2 shrink-0 transition-transform",
            open ? "rotate-180" : "",
          ].join(" ")}
        >
          <path
            d="M3 5l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && options.length > 0 && (
        <div className="border-theme-theme-stroke bg-theme-theme-backdrop absolute z-50 mt-1 w-full overflow-hidden rounded border shadow-xl shadow-black/40">
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={[
                  "flex w-full cursor-pointer items-center justify-between px-3 py-2.5 text-left text-sm transition-colors",
                  active
                    ? "bg-primary-background/10 text-primary-background"
                    : "text-theme-foreground hover:bg-theme-theme-background hover:text-theme-heading-foreground",
                ].join(" ")}
              >
                {opt.label}
                {active && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2.5 7l3.5 3.5 5.5-6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}

      {open && options.length === 0 && (
        <div className="border-theme-theme-stroke bg-theme-theme-backdrop text-theme-foreground absolute z-50 mt-1 w-full rounded border px-3 py-2.5 text-sm shadow-xl shadow-black/40">
          Select tech stack first
        </div>
      )}
    </div>
  );
}
