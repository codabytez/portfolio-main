"use client";

import { useState, useRef } from "react";

type Props = {
  value: string[];
  onChange: (v: string[]) => void;
  allTags: string[];
};

export default function TagInput({ value, onChange, allTags }: Props) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const suggestions = allTags
    .filter((t) => t.toLowerCase().includes(input.toLowerCase()) && !value.includes(t))
    .slice(0, 8);

  const showAdd =
    input.trim() !== "" &&
    !allTags.some((t) => t.toLowerCase() === input.trim().toLowerCase()) &&
    !value.includes(input.trim());
  const items = showAdd ? [...suggestions, `+ Add "${input.trim()}"`] : suggestions;

  function add(tag: string) {
    const clean = tag.startsWith('+ Add "') ? input.trim() : tag;
    if (clean && !value.includes(clean)) onChange([...value, clean]);
    setInput("");
    setOpen(false);
    inputRef.current?.focus();
  }

  function remove(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (items[highlighted]) add(items[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Backspace" && input === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((t) => (
            <span
              key={t}
              className="bg-primary-background text-primary-inverted flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium"
            >
              {t}
              <button
                type="button"
                onClick={() => remove(t)}
                className="cursor-pointer leading-none opacity-70 hover:opacity-100"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setHighlighted(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKey}
          placeholder="Type to search or add a tag…"
          className="border-theme-theme-stroke bg-theme-theme-backdrop text-theme-heading-foreground placeholder:text-theme-foreground/50 focus:border-primitive-slate-500 w-full rounded border px-3 py-1.5 text-sm focus:outline-none"
        />
        {open && items.length > 0 && (
          <ul
            ref={listRef}
            className="border-theme-theme-stroke bg-theme-theme-backdrop absolute z-10 mt-1 w-full rounded border py-1 shadow-lg"
          >
            {items.map((item, i) => (
              <li
                key={item}
                onMouseDown={() => add(item)}
                className={[
                  "cursor-pointer px-3 py-1.5 text-sm",
                  i === highlighted
                    ? "bg-primitive-slate-800 text-theme-heading-foreground"
                    : "text-theme-foreground hover:bg-primitive-slate-800 hover:text-theme-heading-foreground",
                  item.startsWith('+ Add "') ? "text-primary-background" : "",
                ].join(" ")}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
