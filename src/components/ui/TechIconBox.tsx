import NextjsIcon from "@/components/ui/NextjsIcon";

const icons: Record<Exclude<Tech, "nextjs">, string> = {
  react: "ri-reactjs-fill",
  "react-native": "ri-reactjs-fill",
  html: "ri-html5-fill",
  vue: "ri-vuejs-fill",
  css: "ri-css3-fill",
  gatsby: "ri-gatsby-fill",
  angular: "ri-angularjs-fill",
  flutter: "ri-flutter-fill",
  svelte: "ri-braces-fill",
};

const backgroundClasses: Record<Tech, string> = {
  react: "bg-primitive-indigo-300",
  "react-native": "bg-primitive-green-300",
  nextjs: "bg-primitive-slate-950",
  html: "bg-primitive-orange-300",
  vue: "bg-primitive-teal-300",
  css: "bg-primitive-indigo-300",
  gatsby: "bg-primitive-purple-200",
  angular: "bg-primitive-rose-300",
  flutter: "bg-primitive-slate-400",
  svelte: "bg-primitive-orange-300",
};

export default function TechIconBox({ className, type = "react" }: TechIconBoxProps) {
  return (
    <div
      className={[
        "rounded-2 flex items-center justify-center p-2",
        backgroundClasses[type],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {type === "nextjs" ? (
        <NextjsIcon size={20} className="text-white" />
      ) : (
        <i
          className={[icons[type], "text-primitive-slate-950 text-[20px] leading-none"].join(" ")}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
