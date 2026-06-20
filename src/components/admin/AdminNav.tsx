"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "_profile", slug: "profile", icon: "ri-user-3-line" },
  { label: "_about-me", slug: "about", icon: "ri-file-text-line" },
  { label: "_projects", slug: "projects", icon: "ri-code-box-line" },
  { label: "_contact", slug: "contact", icon: "ri-at-line" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const isSubdomain =
    typeof window !== "undefined" && window.location.hostname.startsWith("admin.");
  const prefix = isSubdomain ? "" : "/admin";

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = isSubdomain ? "/login" : "/admin/login";
  }

  return (
    <aside className="border-theme-theme-stroke bg-theme-theme-backdrop hidden h-full w-64 shrink-0 flex-col border-r md:flex">
      {/* Nav section */}
      <div className="flex flex-col py-6">
        <p className="text-theme-foreground mb-1 px-6 text-xs tracking-widest">{"// pages"}</p>
        <nav className="mt-2 flex flex-col">
          {NAV_ITEMS.map(({ label, slug, icon }) => {
            const href = `${prefix}/${slug}`;
            const active = pathname.startsWith(`/${slug}`) || pathname.startsWith(`/admin/${slug}`);
            return (
              <Link
                key={slug}
                href={href}
                className={[
                  "border-l-2 py-2.5 pr-6 pl-5 text-sm transition-colors",
                  "flex items-center gap-3",
                  active
                    ? "border-primary-background bg-theme-theme-background/60 text-theme-heading-foreground"
                    : "text-theme-foreground hover:bg-theme-theme-background/30 hover:text-theme-heading-foreground border-transparent",
                ].join(" ")}
              >
                <i className={`${icon} shrink-0 text-base leading-none`} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-theme-theme-stroke mt-auto flex flex-col border-t">
        <a
          href={process.env.NEXT_PUBLIC_SITE_URL ?? "/"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-theme-foreground hover:bg-theme-theme-background/30 hover:text-theme-heading-foreground flex items-center gap-3 px-6 py-3.5 text-sm transition-colors"
        >
          <i className="ri-external-link-line shrink-0 text-base leading-none" />
          view portfolio
        </a>
        <button
          onClick={handleLogout}
          className="text-theme-foreground hover:bg-theme-theme-background/30 hover:text-primitive-rose-400 flex items-center gap-3 px-6 py-3.5 text-left text-sm transition-colors"
        >
          <i className="ri-logout-box-r-line shrink-0 text-base leading-none" />
          log out
        </button>
      </div>
    </aside>
  );
}
