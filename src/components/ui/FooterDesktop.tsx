"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import SocialIcon from "@/components/ui/SocialIcon";
import EasterEggIcon from "@/components/ui/EasterEggIcon";
import MenuItem from "@/components/ui/MenuItem";

type FooterDesktopProps = { className?: string };

export default function FooterDesktop({ className }: FooterDesktopProps) {
  const socials = useQuery(api.socials.list);
  const footerSocials = socials?.filter((s) => s.platform === "linkedin" || s.platform === "x");
  const github = socials?.find((s) => s.platform === "github");
  const githubUsername =
    github?.handle ?? (github?.url ? `@${github.url.split("/").filter(Boolean).pop()}` : "@...");

  return (
    <div
      className={[
        "border-theme-theme-stroke flex w-full items-center justify-between border-t",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center">
        <div className="border-theme-theme-stroke flex items-center justify-center border-r px-6 py-5">
          <p className="text-body-md text-theme-foreground whitespace-nowrap">find me in:</p>
        </div>
        {(footerSocials ?? []).map((s) => (
          <a
            key={s.platform}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border-theme-theme-stroke group flex cursor-pointer items-center border-r p-5"
          >
            <SocialIcon
              type={s.platform as "github" | "linkedin" | "x" | "instagram"}
              state="static"
            />
          </a>
        ))}
        <EasterEggIcon />
      </div>
      <div className="border-theme-theme-stroke border-l">
        <a href={github?.url} target="_blank" rel="noopener noreferrer">
          <MenuItem state="icon" label={githubUsername} />
        </a>
      </div>
    </div>
  );
}
