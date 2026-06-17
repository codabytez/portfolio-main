import GistSnippet from "@/components/ui/GistSnippet";
import CodeHighlight from "@/components/ui/CodeHighlight";

const CODE = `function initializeModelChunk<T>(
  chunk: ResolvedModelChunk
): T {
  const value: T = parseModel(
    chunk._response,
    chunk._value
  );
  const initializedChunk: InitializedChunk<T> =
    (chunk as any);
  initializedChunk._status = INITIALIZED;
  initializedChunk._value = value;
  return value;
}`;

export default async function AboutGistShowcase({ className }: { className?: string }) {
  const codeBlock = <CodeHighlight code={CODE} />;

  return (
    <div
      className={[
        "border-theme-theme-stroke flex h-full flex-col gap-8 overflow-y-auto border-r px-8 py-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="text-body-lg text-theme-foreground shrink-0">{"// Code snippet showcase:"}</p>
      <div className="flex w-full shrink-0 flex-col items-start gap-8">
        <GistSnippet codeBlock={codeBlock} />
        <GistSnippet codeBlock={codeBlock} />
      </div>
    </div>
  );
}
