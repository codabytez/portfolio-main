import HeaderDesktop from "@/components/ui/HeaderDesktop";
import FooterDesktop from "@/components/ui/FooterDesktop";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-theme-theme-backdrop flex h-full flex-col items-center justify-center p-17">
      <div className="bg-theme-theme-background border-theme-theme-stroke rounded-3 relative flex w-full flex-1 flex-col items-start overflow-hidden border">
        <HeaderDesktop />
        <div className="flex min-h-0 w-full flex-1">{children}</div>
        <FooterDesktop />
      </div>
    </div>
  );
}
