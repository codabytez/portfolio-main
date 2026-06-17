type HeaderMobileProps = {
  className?: string;
  state?: "menu closed" | "menu open";
};

export default function HeaderMobile({ className, state = "menu closed" }: HeaderMobileProps) {
  const isMenuOpen = state === "menu open";

  return (
    <div
      className={[
        "border-theme-theme-stroke flex w-full items-center justify-between border-b",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center px-6 py-5">
        <p className="text-body-md text-theme-foreground whitespace-nowrap">michael-weaver</p>
      </div>
      <div className="flex items-center p-4">
        <i
          className={[
            isMenuOpen ? "ri-close-line" : "ri-menu-line",
            "text-theme-foreground text-[24px] leading-none",
          ].join(" ")}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
