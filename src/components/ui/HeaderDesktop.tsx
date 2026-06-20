"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutGroup } from "motion/react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import MenuItem from "@/components/ui/MenuItem";
import Skeleton from "@/components/ui/Skeleton";

type HeaderDesktopProps = { className?: string };

const PATH_TO_ITEM: Record<string, string> = {
  "/": "_hello",
  "/about": "_about-me",
  "/projects": "_projects",
  "/contact": "_contact-me",
};

export default function HeaderDesktop({ className }: HeaderDesktopProps) {
  const pathname = usePathname();
  const router = useRouter();
  const active = PATH_TO_ITEM[pathname] ?? null;
  const profile = useQuery(api.profile.get);

  return (
    <LayoutGroup>
      <div
        className={[
          "border-theme-theme-stroke flex w-full items-center justify-between border-b",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="flex items-center">
          <div className="flex items-center justify-center px-6 py-5 lg:w-77.5">
            {profile === undefined ? (
              <Skeleton className="h-4 w-28" />
            ) : (
              <p className="text-body-md text-theme-foreground whitespace-nowrap">
                {profile?.slug ?? ""}
              </p>
            )}
          </div>
          <div className="flex items-center">
            <div className="border-theme-theme-stroke border-x">
              <MenuItem
                state={active === "_hello" ? "selected" : "static"}
                label="_hello"
                layoutId="nav-indicator"
                onClick={() => router.push("/")}
              />
            </div>
            <div className="border-theme-theme-stroke border-r">
              <MenuItem
                state={active === "_about-me" ? "selected" : "static"}
                label="_about-me"
                layoutId="nav-indicator"
                onClick={() => router.push("/about")}
              />
            </div>
            <div className="border-theme-theme-stroke border-r">
              <MenuItem
                state={active === "_projects" ? "selected" : "static"}
                label="_projects"
                layoutId="nav-indicator"
                onClick={() => router.push("/projects")}
              />
            </div>
          </div>
        </div>
        <div className="border-theme-theme-stroke border-l">
          <MenuItem
            state={active === "_contact-me" ? "selected" : "static"}
            label="_contact-me"
            layoutId="nav-indicator"
            onClick={() => router.push("/contact")}
          />
        </div>
      </div>
    </LayoutGroup>
  );
}
