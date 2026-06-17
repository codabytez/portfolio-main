import MenuItem from "@/components/ui/MenuItem";
import SocialIcon from "@/components/ui/SocialIcon";

type FooterDesktopProps = {
  className?: string;
};

export default function FooterDesktop({ className }: FooterDesktopProps) {
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
        <div className="border-theme-theme-stroke group flex cursor-pointer items-center border-r p-5">
          <SocialIcon type="x" state="static" />
        </div>
        <div className="border-theme-theme-stroke group flex cursor-pointer items-center border-r p-5">
          <SocialIcon type="linkedin" state="static" />
        </div>
      </div>
      <div className="border-theme-theme-stroke border-l">
        <MenuItem state="icon" label="@username" />
      </div>
    </div>
  );
}
