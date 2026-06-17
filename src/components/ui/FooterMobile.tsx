import SocialIcon from "@/components/ui/SocialIcon";

type FooterMobileProps = {
  className?: string;
};

export default function FooterMobile({ className }: FooterMobileProps) {
  return (
    <div
      className={[
        "border-theme-theme-stroke flex w-full items-center justify-between border-t",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center px-6 py-5">
        <p className="text-body-md text-theme-foreground whitespace-nowrap">find me in:</p>
      </div>
      <div className="flex items-center">
        <div className="border-theme-theme-stroke flex items-center border-r border-l p-4">
          <SocialIcon type="x" state="static" />
        </div>
        <div className="border-theme-theme-stroke flex items-center border-r p-4">
          <SocialIcon type="linkedin" state="static" />
        </div>
        <div className="flex items-center p-4">
          <SocialIcon type="git" state="static" />
        </div>
      </div>
    </div>
  );
}
