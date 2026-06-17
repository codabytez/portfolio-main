import { AboutProvider } from "@/components/ui/AboutContext";
import AnimatedAboutLayout from "@/components/ui/AnimatedAboutLayout";
import AboutSidebar from "@/components/ui/AboutSidebar";
import AboutContent from "@/components/ui/AboutContent";

export default function AboutDesktop({ className }: { className?: string }) {
  return (
    <AboutProvider>
      <AnimatedAboutLayout
        className={className}
        sidebar={<AboutSidebar />}
        content={<AboutContent />}
      />
    </AboutProvider>
  );
}
