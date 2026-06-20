"use client";

import { useRef, useState } from "react";
import { useMutation, useConvex } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export default function ImageUpload({ value, onChange }: Props) {
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const convex = useConvex();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = await res.json();
      const url = await convex.query(api.storage.getUrl, {
        storageId: storageId as Id<"_storage">,
      });
      if (!url) throw new Error("Could not get storage URL");
      onChange(url);
    } catch {
      setError("Upload failed. Try again or paste a URL.");
    } finally {
      setUploading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or upload below"
          className="border-theme-theme-stroke bg-theme-theme-backdrop text-theme-heading-foreground placeholder:text-theme-foreground/40 focus:border-primitive-slate-500 flex-1 rounded border px-3 py-2.5 text-sm transition-colors focus:outline-none"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="border-theme-theme-stroke bg-theme-theme-backdrop text-theme-foreground hover:border-primitive-slate-500 hover:text-theme-heading-foreground shrink-0 cursor-pointer rounded border px-3 py-2.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {value && (
        <div
          className="border-theme-theme-stroke relative h-32 w-full overflow-hidden rounded border"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="bg-theme-theme-backdrop/80 text-theme-heading-foreground hover:bg-theme-theme-backdrop absolute top-2 right-2 cursor-pointer rounded px-2 py-0.5 text-xs"
          >
            Remove
          </button>
        </div>
      )}

      {!value && (
        <div
          className="border-theme-theme-stroke text-theme-foreground flex h-20 items-center justify-center rounded border border-dashed text-sm"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          Drop image here or use Upload
        </div>
      )}

      {error && <p className="text-primitive-rose-400 text-xs">{error}</p>}
    </div>
  );
}
