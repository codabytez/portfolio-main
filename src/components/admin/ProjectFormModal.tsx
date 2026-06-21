"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";

type Props = {
  title: string;
  onClose: () => void;
  onSave: (published: boolean) => Promise<void>;
  children: React.ReactNode;
};

export default function ProjectFormModal({ title, onClose, onSave, children }: Props) {
  const [saving, setSaving] = useState<false | "draft" | "publish">(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !saving) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, saving]);

  async function handleSave(published: boolean) {
    setSaving(published ? "publish" : "draft");
    try {
      await onSave(published);
    } finally {
      setSaving(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-start sm:p-4"
      style={{ background: "rgba(2, 6, 24, 0.75)", backdropFilter: "blur(4px)" }}
      onClick={() => {
        if (!saving) onClose();
      }}
    >
      <div
        className="border-theme-theme-stroke bg-theme-theme-background flex w-full max-w-2xl flex-col overflow-hidden rounded-t-xl border shadow-2xl sm:mt-4 sm:rounded-xl"
        style={{ maxHeight: "92dvh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-theme-theme-stroke flex shrink-0 items-center justify-between border-b px-5 py-4 sm:px-6">
          <p className="text-theme-heading-foreground text-sm font-medium">{title}</p>
          <button
            onClick={onClose}
            disabled={!!saving}
            className="text-theme-foreground hover:text-theme-heading-foreground cursor-pointer transition-colors disabled:opacity-50"
          >
            <i className="ri-close-line text-lg leading-none" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>

        <div className="border-theme-theme-stroke flex shrink-0 items-center justify-end gap-3 border-t px-5 py-4 sm:px-6">
          <Button variant="default" onClick={onClose} disabled={!!saving}>
            cancel
          </Button>
          <Button variant="default" onClick={() => handleSave(false)} disabled={!!saving}>
            {saving === "draft" && (
              <i className="ri-loader-4-line mr-1.5 animate-spin text-[14px]" />
            )}
            {saving === "draft" ? "saving..." : "save as draft"}
          </Button>
          <Button variant="primary" onClick={() => handleSave(true)} disabled={!!saving}>
            {saving === "publish" && (
              <i className="ri-loader-4-line mr-1.5 animate-spin text-[14px]" />
            )}
            {saving === "publish" ? "publishing..." : "publish"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
