import Image from "next/image";
import HomeHero from "@/components/ui/HomeHero";
import GamePanel from "@/components/ui/GamePanel";

export default function HomeContent() {
  return (
    <div className="relative flex min-h-0 w-full flex-1 items-center justify-center px-6 py-10 lg:gap-10 lg:px-6 lg:py-0 xl:gap-16 xl:px-0 2xl:gap-36.5">
      <Image
        src="/home/background-blurs.png"
        loading="eager"
        alt=""
        width={1128}
        height={940}
        className="pointer-events-none absolute top-1/2 left-1/2 w-full max-w-none -translate-x-1/2 -translate-y-1/2 lg:-top-24.25 lg:left-[37%] lg:w-[64%] lg:translate-x-0 lg:translate-y-0"
        aria-hidden
      />
      <HomeHero />
      <GamePanel className="relative hidden shrink-0 lg:flex" />
    </div>
  );
}
