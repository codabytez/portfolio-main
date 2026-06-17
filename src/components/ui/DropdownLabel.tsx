type DropdownLabelProps = {
  className?: string;
  open?: boolean;
  label?: string;
  showClose?: boolean;
};

export default function DropdownLabel({
  className,
  open = true,
  label = "personal-info",
  showClose = true,
}: DropdownLabelProps) {
  return (
    <div className={["flex items-center gap-1 px-6 py-3", className].filter(Boolean).join(" ")}>
      <div className="flex flex-1 items-center gap-3">
        <i
          className={[
            "ri-arrow-down-s-fill text-theme-heading-foreground text-[16px] leading-none",
            open ? "" : "-rotate-90",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden="true"
        />
        <p className="text-body-md text-theme-heading-foreground flex-1">{label}</p>
      </div>
      {showClose && (
        <i
          className="ri-close-line text-theme-heading-foreground text-[16px] leading-none"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
