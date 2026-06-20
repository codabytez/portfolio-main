"use client";

import { usePathname } from "next/navigation";

const SLUG_LABELS: Record<string, string> = {
  profile: "_profile",
  about: "_about-me",
  projects: "_projects",
  contact: "_contact",
};

export default function AdminHeader() {
  const pathname = usePathname();
  const segment = pathname.split("/").filter(Boolean).pop() ?? "";
  const label = SLUG_LABELS[segment] ?? `_${segment}`;

  return (
    <div className="border-theme-theme-stroke flex shrink-0 items-center border-b">
      {/* Mobile: single row */}
      <div className="flex w-full items-center justify-between px-5 py-4 md:hidden">
        <p className="text-body-md text-theme-heading-foreground">_admin</p>
        <p className="text-body-md text-theme-foreground">{label}</p>
      </div>

      {/* Desktop: two-column aligned with sidebar */}
      <div className="hidden md:flex md:w-full md:items-center">
        <div className="border-theme-theme-stroke flex w-64 shrink-0 items-center border-r px-6 py-5">
          <p className="text-body-md text-theme-heading-foreground">_admin</p>
        </div>
        <div className="border-theme-theme-stroke flex h-full items-center border-r px-6 py-5">
          <p className="text-body-md text-theme-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
