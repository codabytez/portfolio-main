import Skeleton from "@/components/ui/Skeleton";

export default function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col items-start gap-4">
      {/* name / slug line */}
      <Skeleton className="h-5 w-48" />

      <div className="rounded-4 relative flex w-full flex-col items-start">
        {/* image area */}
        <Skeleton className="border-primitive-slate-800 rounded-t-4 h-36.25 w-full rounded-b-none border" />

        {/* card body */}
        <div className="border-primitive-slate-800 bg-primitive-slate-950 rounded-b-4 flex w-full flex-col items-start gap-5.25 border-x border-b p-7">
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          {/* button */}
          <Skeleton className="h-9 w-32" />
        </div>

        {/* tech icon badge */}
        <Skeleton className="absolute top-5 right-5 h-9 w-9 rounded-lg" />
      </div>
    </div>
  );
}
