"use client";

import Image from "next/image";

type AboutMenuIconType = "hobbies" | "personal info" | "professional info";
type AboutMenuIconState = "static" | "selected";

type AboutMenuIconProps = {
  className?: string;
  type?: AboutMenuIconType;
  state?: AboutMenuIconState;
  onClick?: () => void;
};

const STATIC: Record<AboutMenuIconType, string> = {
  hobbies: "/about/hobbies-static.svg",
  "personal info": "/about/personal-info-static.svg",
  "professional info": "/about/professional-info-static.svg",
};

const HOVER: Record<AboutMenuIconType, string> = {
  hobbies: "/about/hobbies-hover.svg",
  "personal info": "/about/personal-info-hover.svg",
  "professional info": "/about/professional-info-hover.svg",
};

export default function AboutMenuIcon({
  className,
  type = "hobbies",
  state = "static",
  onClick,
}: AboutMenuIconProps) {
  const isSelected = state === "selected";

  return (
    <div
      onClick={onClick}
      className={["group relative size-6 cursor-pointer", className].filter(Boolean).join(" ")}
    >
      {/* Static icon — hidden on hover/selected */}
      <Image
        src={STATIC[type]}
        alt=""
        width={24}
        height={24}
        className={[
          "absolute inset-0 size-full transition-opacity duration-200",
          isSelected ? "opacity-0" : "opacity-100 group-hover:opacity-0",
        ].join(" ")}
        aria-hidden
      />
      {/* Hover/selected icon */}
      <Image
        src={HOVER[type]}
        alt=""
        width={24}
        height={24}
        className={[
          "absolute inset-0 size-full transition-opacity duration-200",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        ].join(" ")}
        aria-hidden
      />
    </div>
  );
}
