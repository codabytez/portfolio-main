export default function Skeleton({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={["bg-primitive-slate-800/60 animate-pulse rounded", className]
        .filter(Boolean)
        .join(" ")}
      style={style}
    />
  );
}
