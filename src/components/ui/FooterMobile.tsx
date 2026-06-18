"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import SocialIcon from "@/components/ui/SocialIcon";

type FooterMobileProps = { className?: string };

export default function FooterMobile({ className }: FooterMobileProps) {
  const socials = useQuery(api.socials.list);
  const footerSocials = socials?.filter((s) => s.platform === "linkedin" || s.platform === "x");

  return (
    <div
      className={[
        "border-theme-theme-stroke flex w-full items-center justify-between border-t",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center px-4 py-5 sm:px-6">
        <p className="text-body-md text-theme-foreground whitespace-nowrap">find me in:</p>
      </div>
      <div className="flex items-center">
        {(footerSocials ?? []).map((s, i) => (
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
            <SocialIcon
              type={s.platform as "github" | "linkedin" | "x" | "instagram"}
              state="static"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
