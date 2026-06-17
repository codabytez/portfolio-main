"use client";

import { LayoutGroup, motion } from "motion/react";
import { useAbout } from "@/components/ui/AboutContext";

export default function AboutTabBar() {
  const { tabs, activeTab, openTab, closeTab } = useAbout();

  if (tabs.length === 0)
    return (
      <div className="border-theme-theme-stroke flex w-full shrink-0 items-start border-b">
        <div className="flex-1" />
      </div>
    );

  return (
    <LayoutGroup>
      <div className="border-theme-theme-stroke flex w-full shrink-0 items-start overflow-x-auto border-b">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <div
              key={tab}
              onClick={() => openTab(tab)}
              className={[
                "border-theme-theme-stroke relative flex shrink-0 cursor-pointer items-center gap-3 border-r px-6 py-3 transition-opacity",
                isActive ? "opacity-100" : "opacity-40 hover:opacity-70",
              ].join(" ")}
            >
              <p className="text-body-md text-theme-foreground whitespace-nowrap">{tab}</p>
              <i
                className="ri-close-line text-theme-foreground cursor-pointer text-[16px] leading-none"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab);
                }}
                aria-hidden
              />
              {isActive && (
                <motion.div
                  layoutId="about-tab-indicator"
                  className="bg-primitive-indigo-500 absolute right-0 bottom-0 left-0 h-px"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
            </div>
          );
        })}
        <div className="flex-1" />
      </div>
    </LayoutGroup>
  );
}
