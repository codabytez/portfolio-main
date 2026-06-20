"use client";

import { useRef } from "react";

type Props = {
  value: string[];
  onChange: (v: string[]) => void;
};

export default function FeaturesList({ value, onChange }: Props) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function update(i: number, text: string) {
    const next = [...value];
    next[i] = text;
    onChange(next);
  }

  function remove(i: number) {
    const next = value.filter((_, idx) => idx !== i);
    onChange(next.length ? next : [""]);
  }

  function handleKey(e: React.KeyboardEvent, i: number) {
    if (e.key === "Enter") {
      e.preventDefault();
      const next = [...value];
      next.splice(i + 1, 0, "");
      onChange(next);
      setTimeout(() => inputRefs.current[i + 1]?.focus(), 0);
    } else if (e.key === "Backspace" && value[i] === "" && value.length > 1) {
      e.preventDefault();
      remove(i);
      setTimeout(() => inputRefs.current[Math.max(i - 1, 0)]?.focus(), 0);
    }
  }

  function handlePaste(e: React.ClipboardEvent, i: number) {
    const text = e.clipboardData.getData("text");
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.replace(/^[-•*]\s*/, "").trim())
      .filter(Boolean);
    if (lines.length <= 1) return;
    e.preventDefault();
    const next = [...value];
    next.splice(i, 1, ...lines);
    onChange(next);
    setTimeout(() => inputRefs.current[i + lines.length - 1]?.focus(), 0);
  }

  return (
    <div className="flex flex-col gap-2">
      {value.map((feat, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-theme-foreground/70 shrink-0 text-xs select-none">—</span>
          <input
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            value={feat}
            onChange={(e) => update(i, e.target.value)}
            onKeyDown={(e) => handleKey(e, i)}
            onPaste={(e) => handlePaste(e, i)}
            placeholder={`Feature ${i + 1}`}
            className="border-theme-theme-stroke bg-theme-theme-backdrop text-theme-heading-foreground placeholder:text-theme-foreground/50 focus:border-primitive-slate-500 flex-1 rounded border px-3 py-1.5 text-sm focus:outline-none"
          />
          {value.length > 1 && (
            <button
              type="button"
              onClick={() => remove(i)}
              className="hover:text-primitive-rose-400 text-theme-foreground/70 shrink-0 cursor-pointer text-lg leading-none transition-colors"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          const next = [...value, ""];
          onChange(next);
          setTimeout(() => inputRefs.current[next.length - 1]?.focus(), 0);
        }}
        className="text-theme-foreground hover:text-theme-heading-foreground mt-1 cursor-pointer self-start text-xs transition-colors"
      >
        + add feature
      </button>
    </div>
  );
}
