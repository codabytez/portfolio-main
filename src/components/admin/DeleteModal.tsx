"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";

type Props = {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteModal({ name, onConfirm, onCancel }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onConfirm, onCancel]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
      style={{ background: "rgba(2, 6, 24, 0.7)", backdropFilter: "blur(4px)" }}
      onClick={onCancel}
    >
      <div
        className="border-theme-theme-stroke bg-theme-theme-background w-full max-w-sm overflow-hidden rounded-t-xl border shadow-2xl sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-theme-theme-stroke border-b px-6 py-4">
          <p className="text-theme-heading-foreground text-sm font-medium">delete project</p>
        </div>

        <div className="px-6 py-5">
          <p className="text-theme-foreground text-sm">
            Are you sure you want to delete{" "}
            <span className="text-theme-heading-foreground font-medium">{name}</span>? This
            can&apos;t be undone.
          </p>
        </div>

        <div className="border-theme-theme-stroke flex items-center justify-end gap-3 border-t px-6 py-4">
          <Button variant="default" onClick={onCancel}>
            cancel
          </Button>
          <Button variant="error" onClick={onConfirm}>
            delete
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
