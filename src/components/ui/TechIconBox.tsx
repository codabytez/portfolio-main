type TechIconType = "react" | "html" | "vue" | "css" | "gatsby" | "angular" | "flutter";

type TechIconBoxProps = {
  className?: string;
  type?: TechIconType;
};

const icons: Record<TechIconType, string> = {
  react: "ri-reactjs-fill",
  html: "ri-html5-fill",
  vue: "ri-vuejs-fill",
  css: "ri-css3-fill",
  gatsby: "ri-gatsby-fill",
  angular: "ri-angularjs-fill",
  flutter: "ri-flutter-fill",
};

const backgroundClasses: Record<TechIconType, string> = {
  react: "bg-primitive-indigo-300",
  html: "bg-primitive-orange-300",
  vue: "bg-primitive-teal-300",
  css: "bg-primitive-indigo-300",
  gatsby: "bg-primitive-purple-200",
  angular: "bg-primitive-rose-300",
  flutter: "bg-primitive-slate-400",
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
      <i
        className={[icons[type], "text-primitive-slate-950 text-[20px] leading-none"].join(" ")}
        aria-hidden="true"
      />
    </div>
  );
}
