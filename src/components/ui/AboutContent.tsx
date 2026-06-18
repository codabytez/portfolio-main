import AboutGistShowcase from "@/components/ui/AboutGistShowcase";
import AnimatedPanel from "@/components/ui/AnimatedPanel";
import AboutTabBar from "@/components/ui/AboutTabBar";
import AboutEditorPanel from "@/components/ui/AboutEditorPanel";

export default function AboutContent({ className }: { className?: string }) {
  return (
    <div className={["flex min-h-0 min-w-0 flex-1 flex-col", className].filter(Boolean).join(" ")}>
      <div className="hidden lg:block">
        <AboutTabBar />
      </div>

      <div className="flex w-full flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        <AnimatedPanel from="left" delay={0.2} className="min-w-0 self-stretch lg:flex-802">
          <AboutEditorPanel className="lg:h-full" />
        </AnimatedPanel>

        <div className="flex items-center justify-center gap-2 py-6 lg:hidden">
          <span className="text-body-sm text-primitive-teal-400 opacity-50">{"/**"}</span>
          <span className="text-body-sm text-theme-foreground tracking-[0.4em] opacity-25">
            {"···"}
          </span>
          <span className="text-body-sm text-primitive-teal-400 opacity-50">{"*/"}</span>
        </div>
        <div className="hidden w-6 shrink-0 flex-col items-stretch px-2 py-3 lg:flex">
          <div className="bg-primitive-slate-500 h-1.5 w-full" />
        </div>

        <AnimatedPanel from="right" delay={0.3} className="min-w-0 self-stretch lg:flex-700">
          <AboutGistShowcase className="lg:h-full" />
        </AnimatedPanel>

        <div className="hidden w-6 shrink-0 flex-col items-stretch px-2 py-3 lg:flex">
          <div className="bg-primitive-slate-500 h-1.5 w-full" />
        </div>
      </div>
    </div>
  );
}
