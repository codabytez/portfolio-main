import CodeHighlight from "@/components/ui/CodeHighlight";
import CmdZListener from "@/components/ui/CmdZListener";
import NotFoundAscii from "@/components/ui/NotFoundAscii";

const NOT_FOUND_CODE = `const page = findPage('you-were-looking-for');

if (!page) {
  console.log("Oops! Looks like you took a wrong turn in the codebase.");
  console.log("But hey, since you're here...");
  console.log("🔍 Go back to the homepage and explore more cool stuff!");
  throw new Error("404: PageNotFoundError 😢");
}

/* Suggestions:
 * - Check the URL for typos
 * - Use the site navigation
 * - Or hit CMD+Z in real life 😅
 */

redirect('home');`;

const LINE_COUNT = NOT_FOUND_CODE.split("\n").length;

const ASCII_LINES = [
  "██╗  ██╗ ██████╗ ██╗  ██╗ ",
  "██║  ██║██╔═████╗██║  ██║ ",
  "███████║██║██╔██║███████║ ",
  "╚════██║████╔╝██║╚════██║ ",
  "     ██║╚██████╔╝     ██║ ",
  "     ╚═╝ ╚═════╝      ╚═╝",
];

function MobileNotFound() {
  return (
    <div className="flex flex-col gap-10 px-6 py-16 lg:hidden">
      {/* ASCII 404 art */}
      <div className="text-theme-foreground text-[14px] leading-normal whitespace-pre">
        {ASCII_LINES.map((line, i) => (
          <p key={i} className="mb-0">
            {line}
          </p>
        ))}
      </div>

      {/* Code snippet */}
      <div className="text-body-lg flex flex-col">
        {/* throw new Error( */}
        <p className="mb-0 leading-6.75">
          <span className="text-primitive-indigo-500">throw new </span>
          <span className="text-primitive-rose-400">Error</span>
          <span className="text-theme-heading-foreground">(</span>
        </p>
        {/* "404: PageNotFoundError 😢" */}
        <p className="text-primitive-teal-400 mb-0 leading-6.75">{`"404: PageNotFoundError 😢"`}</p>
        {/* ); */}
        <p className="text-theme-heading-foreground mb-0 leading-6.75">{`);`}</p>
        {/* blank line */}
        <p className="mb-0 leading-6.75">&nbsp;</p>
        {/* goBack() || goHome(); */}
        <p className="mb-0 leading-6.75">
          <span className="text-primitive-rose-400">goBack</span>
          <span className="text-theme-heading-foreground">() </span>
          <span className="text-theme-foreground">||</span>
          <span className="text-primitive-rose-400">{` goHome`}</span>
          <span className="text-theme-heading-foreground">()</span>
          <span className="text-theme-foreground">;</span>
        </p>
      </div>
    </div>
  );
}

export default async function NotFoundContent() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:items-center lg:justify-center">
      <CmdZListener />

      {/* Mobile layout */}
      <MobileNotFound />

      {/* Desktop layout */}
      <div className="hidden items-start gap-36.5 lg:flex">
        {/* ASCII art 404 / snake game */}
        <NotFoundAscii />

        {/* Code snippet */}
        <div className="text-body-lg flex items-start gap-8">
          {/* Line numbers */}
          <div className="text-theme-foreground shrink-0 text-right select-none">
            {Array.from({ length: LINE_COUNT }, (_, i) => (
              <p key={i} className="mb-0 leading-6.75">
                {i + 1}
              </p>
            ))}
          </div>

          {/* Shiki highlighted code */}
          <CodeHighlight
            code={NOT_FOUND_CODE}
            lang="javascript"
            className="[&_pre]:text-body-lg! [&_code]:leading-6.75! [&_pre]:leading-6.75!"
          />
        </div>
      </div>
    </div>
  );
}
