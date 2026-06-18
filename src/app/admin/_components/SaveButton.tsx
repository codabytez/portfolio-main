"use client";

import { useState } from "react";
import { toast } from "sonner";

type Props = {
  onSave: () => Promise<unknown>;
  label?: string;
};

export default function SaveButton({ onSave, label = "Save" }: Props) {
  const [saving, setSaving] = useState(false);

  async function handleClick() {
    setSaving(true);
    try {
      await onSave();
      toast.success("Saved successfully");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={saving}
      className="flex w-fit items-center gap-2 rounded bg-[#ff9d00] px-4 py-2 text-sm font-medium text-[#020618] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {saving && <i className="ri-loader-4-line animate-spin text-[14px]" />}
      {saving ? "Saving..." : label}
    </button>
  );
}
