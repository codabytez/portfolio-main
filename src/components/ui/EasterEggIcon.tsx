"use client";

import { useRouter } from "next/navigation";

export default function EasterEggIcon() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/konami")}
      className="border-theme-theme-stroke group flex cursor-pointer items-center border-r p-5"
    >
      <i
        className="ri-link-unlink-m text-primitive-rose-400 flex size-6 items-center justify-center text-[24px] leading-none opacity-40 transition-all duration-200 group-hover:opacity-100"
        aria-hidden="true"
      />
    </div>
  );
}
