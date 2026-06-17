import AboutGistShowcase from "@/components/ui/AboutGistShowcase";
import AnimatedPanel from "@/components/ui/AnimatedPanel";
import AboutTabBar from "@/components/ui/AboutTabBar";
import AboutEditorPanel from "@/components/ui/AboutEditorPanel";

export default function AboutContent({ className }: { className?: string }) {
  return (
    <div className={["flex min-h-0 min-w-0 flex-1 flex-col", className].filter(Boolean).join(" ")}>
      <AboutTabBar />

      <div className="flex w-full flex-1 overflow-hidden">
        <AnimatedPanel from="left" delay={0.2} className="min-w-0 flex-802 self-stretch">
          <AboutEditorPanel className="h-full" />
        </AnimatedPanel>

        <div className="flex w-6 shrink-0 flex-col items-stretch px-2 py-3">
          <div className="bg-primitive-slate-500 h-1.5 w-full" />
        </div>

        <AnimatedPanel from="right" delay={0.3} className="min-w-0 flex-700 self-stretch">
          <AboutGistShowcase className="h-full" />
        </AnimatedPanel>

        <div className="flex w-6 shrink-0 flex-col items-stretch px-2 py-3">
          <div className="bg-primitive-slate-500 h-1.5 w-full" />
        </div>
      </div>
    </div>
  );
}
