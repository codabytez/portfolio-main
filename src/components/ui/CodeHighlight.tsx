import { codeToHtml } from "shiki";

type CodeHighlightProps = {
  code: string;
  lang?: string;
  className?: string;
};

export default async function CodeHighlight({
  code,
  lang = "typescript",
  className,
}: CodeHighlightProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "one-dark-pro",
  });

  return (
    <div
      className={["[&_pre]:bg-transparent! [&_pre]:p-0! [&_pre]:text-[13px]", className]
        .filter(Boolean)
        .join(" ")}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
