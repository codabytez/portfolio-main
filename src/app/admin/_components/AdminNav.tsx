"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_SLUGS = [
  { label: "Profile", slug: "profile" },
  { label: "About", slug: "about" },
  { label: "Projects", slug: "projects" },
  { label: "Contact & Socials", slug: "contact" },
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
    <aside className="flex h-full w-52 shrink-0 flex-col border-r border-[#314158] bg-[#020618]">
      <div className="border-b border-[#314158] px-6 py-5">
        <p className="text-sm font-medium text-[#f8fafc]">admin panel</p>
        <p className="text-xs text-[#90a1b9]">portfolio cms</p>
      </div>

      <nav className="flex flex-col gap-1 p-3">
        {NAV_SLUGS.map(({ label, slug }) => {
          const href = `${prefix}/${slug}`;
          const active = pathname.startsWith(`/${slug}`) || pathname.startsWith(`/admin/${slug}`);
          return (
            <Link
              key={slug}
              href={href}
              className={[
                "rounded px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-[#1e2d45] text-[#f8fafc]"
                  : "text-[#90a1b9] hover:bg-[#1e2d45]/50 hover:text-[#f8fafc]",
              ].join(" ")}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-[#314158] p-3">
        <a
          href={process.env.NEXT_PUBLIC_SITE_URL ?? "/"}
          className="flex items-center gap-2 rounded px-3 py-2 text-sm text-[#90a1b9] transition-colors hover:text-[#f8fafc]"
        >
          <i className="ri-arrow-left-line text-[14px]" />
          Back to portfolio
        </a>
        <button
          onClick={handleLogout}
          className="hover:text-primitive-rose-400 flex items-center gap-2 rounded px-3 py-2 text-left text-sm text-[#90a1b9] transition-colors"
        >
          <i className="ri-logout-box-line text-[14px]" />
          Log out
        </button>
      </div>
    </aside>
  );
}
