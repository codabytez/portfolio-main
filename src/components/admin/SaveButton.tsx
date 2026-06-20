"use client";

import { useState } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";

type Props = {
  onSave: () => Promise<unknown>;
  label?: string;
};

export default function SaveButton({ onSave, label = "save" }: Props) {
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
    <Button variant="primary" onClick={handleClick} disabled={saving}>
      {saving && <i className="ri-loader-4-line mr-1.5 animate-spin text-[14px]" />}
      {saving ? "saving..." : label}
    </Button>
  );
}
