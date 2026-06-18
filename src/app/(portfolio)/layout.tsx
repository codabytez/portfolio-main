import HeaderDesktop from "@/components/ui/HeaderDesktop";
import HeaderMobile from "@/components/ui/HeaderMobile";
import FooterDesktop from "@/components/ui/FooterDesktop";
import FooterMobile from "@/components/ui/FooterMobile";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-theme-theme-backdrop flex h-full min-w-[320px] flex-col items-center justify-center p-4 xl:p-17">
      <div className="bg-theme-theme-background border-theme-theme-stroke rounded-3 relative flex w-full flex-1 flex-col items-start overflow-hidden border">
        <HeaderMobile className="lg:hidden" />
        <HeaderDesktop className="hidden lg:flex" />
        <div className="flex min-h-0 w-full flex-1">{children}</div>
        <FooterMobile className="lg:hidden" />
        <FooterDesktop className="hidden lg:flex" />
      </div>
    </div>
  );
}
