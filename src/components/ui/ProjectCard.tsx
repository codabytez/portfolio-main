import Image from "next/image";
import Button from "@/components/ui/Button";
import TechIconBox from "@/components/ui/TechIconBox";

type ProjectCardProps = {
  className?: string;
  image?: string;
  description?: string;
  tech?: "react" | "html" | "vue" | "css" | "gatsby" | "angular" | "flutter";
};

export default function ProjectCard({
  className,
  image = "/projects/project-1.jpg",
  description = "Duis aute irure dolor in velit esse cillum dolore.",
  tech = "react",
}: ProjectCardProps) {
  return (
    <div
      className={["relative flex w-93 flex-col items-start", className].filter(Boolean).join(" ")}
    >
      <div className="border-primitive-slate-800 rounded-t-4 relative h-[145px] w-full border">
        <Image src={image} alt="" fill className="rounded-t-4 object-cover" />
      </div>
      <div className="border-primitive-slate-800 bg-primitive-slate-950 rounded-b-4 flex w-full flex-col items-start gap-[21px] border-x border-b p-7">
        <p className="text-body-lg text-theme-foreground">{description}</p>
        <Button variant="default">view-project</Button>
      </div>
      <div className="absolute top-5 right-5">
        <TechIconBox type={tech} />
      </div>
    </div>
  );
}
