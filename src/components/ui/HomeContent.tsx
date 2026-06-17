import Image from "next/image";
import HomeHero from "@/components/ui/HomeHero";
import SnakeGame from "@/components/ui/SnakeGame";

export default function HomeContent() {
  return (
    <div className="relative flex min-h-0 w-full flex-1 items-center justify-center gap-36.5 overflow-hidden">
      <Image
        src="/home/background-blurs.png"
        alt=""
        width={1128}
        height={940}
        className="pointer-events-none absolute -top-24.25 left-[37%] w-[64%] max-w-none"
        aria-hidden
      />
      <HomeHero />
      <SnakeGame className="relative shrink-0" />
    </div>
  );
}
