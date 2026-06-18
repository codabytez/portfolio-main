"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export default function ImageUpload({ value, onChange }: Props) {
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
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
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!.replace(/\/$/, "");
      onChange(`${convexUrl}/api/storage/${storageId}`);
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
          className="flex-1 rounded border border-[#314158] bg-[#0f172b] px-3 py-2 text-sm text-[#f8fafc] placeholder:text-[#90a1b9]/50 focus:border-[#90a1b9] focus:outline-none"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 cursor-pointer rounded border border-[#314158] bg-[#0f172b] px-3 py-2 text-sm text-[#90a1b9] transition-colors hover:border-[#90a1b9] hover:text-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-50"
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
          className="relative h-32 w-full overflow-hidden rounded border border-[#314158]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 cursor-pointer rounded bg-[#020618]/70 px-2 py-0.5 text-xs text-[#f8fafc] hover:bg-[#020618]"
          >
            Remove
          </button>
        </div>
      )}

      {!value && (
        <div
          className="flex h-20 items-center justify-center rounded border border-dashed border-[#314158] text-sm text-[#637b96]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          Drop image here or use Upload
        </div>
      )}

      {error && <p className="text-xs text-[#ff637e]">{error}</p>}
    </div>
  );
}
