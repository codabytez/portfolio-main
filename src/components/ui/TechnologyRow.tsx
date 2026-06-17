import Checkbox from "@/components/ui/Checkbox";

type TechnologyRowProps = {
  className?: string;
  checked?: boolean;
  autoFocus?: boolean;
  icon?: string;
  label?: string;
};

export default function TechnologyRow({
  className,
  checked,
  autoFocus,
  icon = "ri-reactjs-line",
  label = "React",
}: TechnologyRowProps) {
  return (
    <div className={["flex items-center gap-6 px-3", className].filter(Boolean).join(" ")}>
      <Checkbox checked={checked} autoFocus={autoFocus} readOnly />
      <div className="flex items-center gap-3 p-1">
        <i
          className={[icon, "text-theme-foreground text-[24px] leading-none"].join(" ")}
          aria-hidden="true"
        />
        <p className="text-body-md text-theme-heading-foreground whitespace-nowrap">{label}</p>
      </div>
    </div>
  );
}
