"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "profile", slug: "profile", icon: "ri-user-3-line" },
  { label: "about", slug: "about", icon: "ri-file-text-line" },
  { label: "projects", slug: "projects", icon: "ri-code-box-line" },
  { label: "contact", slug: "contact", icon: "ri-at-line" },
];

export default function AdminBottomNav() {
  const pathname = usePathname();
  const isSubdomain =
    typeof window !== "undefined" && window.location.hostname.startsWith("admin.");
  const prefix = isSubdomain ? "" : "/admin";

  return (
    <nav className="border-theme-theme-stroke bg-theme-theme-backdrop flex shrink-0 border-t md:hidden">
      {NAV_ITEMS.map(({ label, slug, icon }) => {
        const href = `${prefix}/${slug}`;
        const active = pathname.startsWith(`/${slug}`) || pathname.startsWith(`/admin/${slug}`);
        return (
          <Link
            key={slug}
            href={href}
            className={[
              "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors",
              active
                ? "text-primary-background"
                : "text-theme-foreground hover:text-theme-heading-foreground",
            ].join(" ")}
          >
            <i className={`${icon} text-xl leading-none`} />
            <span className="leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
