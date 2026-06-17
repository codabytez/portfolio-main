type SocialIconType = "x" | "facebook" | "linkedin" | "git";
type SocialIconState = "static" | "hover";

type SocialIconProps = {
  className?: string;
  type?: SocialIconType;
  state?: SocialIconState;
};

const icons: Record<SocialIconType, string> = {
  x: "ri-twitter-x-fill",
  facebook: "ri-facebook-fill",
  linkedin: "ri-linkedin-fill",
  git: "ri-github-fill",
};

export default function SocialIcon({ className, type = "x", state = "static" }: SocialIconProps) {
  return (
    <i
      className={[
        icons[type],
        "flex size-6 items-center justify-center text-[24px] leading-none",
        state === "hover"
          ? "text-theme-heading-foreground"
          : "text-theme-foreground group-hover:text-theme-heading-foreground transition-colors duration-200 group-active:opacity-70",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    />
  );
}
