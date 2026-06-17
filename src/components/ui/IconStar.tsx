type IconStarProps = {
  className?: string;
  type?: "solid" | "outline";
};

export default function IconStar({ className, type = "solid" }: IconStarProps) {
  const icon = type === "outline" ? "ri-star-line" : "ri-star-fill";

  return (
    <i
      className={["text-theme-foreground text-[18px] leading-none", icon, className]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    />
  );
}
