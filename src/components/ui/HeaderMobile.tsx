"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import Skeleton from "@/components/ui/Skeleton";

type HeaderMobileProps = { className?: string };

const NAV = [
  { label: "_hello", href: "/" },
  { label: "_about-me", href: "/about" },
  { label: "_projects", href: "/projects" },
  { label: "_contact-me", href: "/contact" },
];

const SOCIAL_ICONS: Record<string, string> = {
  x: "ri-twitter-x-fill",
  linkedin: "ri-linkedin-fill",
  github: "ri-github-fill",
  instagram: "ri-instagram-line",
};

export default function HeaderMobile({ className }: HeaderMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const profile = useQuery(api.profile.get);
  const socials = useQuery(api.socials.list);

  const nameEl =
    profile === undefined ? (
      <Skeleton className="h-4 w-24" />
    ) : (
      <p className="text-body-md text-theme-foreground whitespace-nowrap">{profile?.slug ?? ""}</p>
    );

  function navigate(href: string) {
    router.push(href);
    setIsOpen(false);
  }

  return (
    <>
      <div
        className={[
          "border-theme-theme-stroke flex w-full items-center justify-between border-b",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="flex items-center px-6 py-5">{nameEl}</div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex cursor-pointer items-center p-4"
          aria-label="Open menu"
        >
          <i className="ri-menu-line text-theme-foreground text-[24px] leading-none" aria-hidden />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="bg-theme-theme-background absolute inset-0 z-50 flex flex-col"
          >
            {/* Header bar */}
            <div className="border-theme-theme-stroke flex w-full shrink-0 items-center justify-between border-b">
              <div className="flex items-center px-6 py-5">{nameEl}</div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex cursor-pointer items-center p-4"
                aria-label="Close menu"
              >
                <i
                  className="ri-close-line text-theme-foreground text-[24px] leading-none"
                  aria-hidden
                />
              </button>
            </div>

            {/* Nav */}
            <div className="flex flex-1 flex-col">
              <div className="border-theme-theme-stroke flex w-full items-center border-b px-6 py-4">
                <p className="text-body-md text-theme-foreground"># navigate:</p>
              </div>
              {NAV.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    className={[
                      "border-theme-theme-stroke text-body-md flex w-full cursor-pointer items-center border-b px-6 py-4 transition-colors duration-150",
                      isActive
                        ? "text-theme-heading-foreground"
                        : "text-theme-foreground hover:text-theme-heading-foreground",
                    ].join(" ")}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-theme-theme-stroke flex w-full shrink-0 items-center justify-between border-t">
              <div className="flex items-center px-4 py-5 sm:px-6">
                <p className="text-body-md text-theme-foreground whitespace-nowrap">find me in:</p>
              </div>
              <div className="flex items-center">
                {(socials ?? []).map((s, i) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={[
                      "border-theme-theme-stroke group flex cursor-pointer items-center p-3 sm:p-4",
                      i === 0 ? "border-r border-l" : "border-r",
                    ].join(" ")}
                  >
                    <i
                      className={[
                        SOCIAL_ICONS[s.platform] ?? "ri-link",
                        "text-theme-foreground group-hover:text-theme-heading-foreground text-[24px] leading-none transition-colors duration-200",
                      ].join(" ")}
                      aria-hidden
                    />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
