import NextjsIcon from "@/components/ui/NextjsIcon";

const icons: Record<string, string> = {
  react: "ri-reactjs-fill",
  "react-native": "ri-reactjs-fill",
  html: "ri-html5-fill",
  vue: "ri-vuejs-fill",
  css: "ri-css3-fill",
  gatsby: "ri-gatsby-fill",
  angular: "ri-angularjs-fill",
  flutter: "ri-flutter-fill",
  svelte: "ri-braces-fill",
  typescript: "ri-code-s-slash-fill",
  javascript: "ri-javascript-fill",
  node: "ri-server-fill",
  python: "ri-code-fill",
  tailwindcss: "ri-wind-fill",
  "vscode-extension": "ri-terminal-box-fill",
  "chrome-extension": "ri-chrome-fill",
  cli: "ri-terminal-fill",
  electron: "ri-app-store-fill",
  firebase: "ri-fire-fill",
  supabase: "ri-database-2-fill",
  graphql: "ri-braces-fill",
  docker: "ri-ship-fill",
};

const backgrounds: Record<string, string> = {
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
  typescript: "bg-primitive-blue-400",
  javascript: "bg-primitive-yellow-300",
  node: "bg-primitive-green-400",
  python: "bg-primitive-blue-300",
  tailwindcss: "bg-primitive-teal-400",
  "vscode-extension": "bg-primitive-indigo-400",
  "chrome-extension": "bg-primitive-yellow-400",
  cli: "bg-primitive-slate-700",
  electron: "bg-primitive-slate-500",
  firebase: "bg-primitive-orange-400",
  supabase: "bg-primitive-teal-300",
  graphql: "bg-primitive-pink-300",
  docker: "bg-primitive-blue-400",
};

export default function TechIconBox({ className, type = "react" }: TechIconBoxProps) {
  const bg = backgrounds[type] ?? "bg-primitive-slate-600";
  const icon = icons[type];

  return (
    <div
      className={["rounded-2 flex items-center justify-center p-2", bg, className]
        .filter(Boolean)
        .join(" ")}
    >
      {type === "nextjs" ? (
        <NextjsIcon size={20} className="text-white" />
      ) : icon ? (
        <i
          className={[icon, "text-primitive-slate-950 text-[20px] leading-none"].join(" ")}
          aria-hidden="true"
        />
      ) : (
        <i
          className="ri-code-s-slash-fill text-primitive-slate-950 text-[20px] leading-none"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
