"use client";

import { createContext, useContext, useState } from "react";

export type AboutIconType = "professional info" | "personal info" | "hobbies";

type AboutContextValue = {
  selected: AboutIconType;
  setSelected: (v: AboutIconType) => void;
  tabs: string[];
  activeTab: string;
  openTab: (name: string) => void;
  closeTab: (name: string) => void;
};

const AboutContext = createContext<AboutContextValue>({
  selected: "personal info",
  setSelected: () => {},
  tabs: ["education"],
  activeTab: "education",
  openTab: () => {},
  closeTab: () => {},
});

export function AboutProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<AboutIconType>("personal info");
  const [tabs, setTabs] = useState<string[]>(["education"]);
  const [activeTab, setActiveTab] = useState("education");

  function openTab(name: string) {
    setTabs((prev) => (prev.includes(name) ? prev : [...prev, name]));
    setActiveTab(name);
  }

  function closeTab(name: string) {
    setTabs((prev) => {
      const next = prev.filter((t) => t !== name);
      if (activeTab === name) setActiveTab(next[next.length - 1] ?? "");
      return next;
    });
  }

  return (
    <AboutContext.Provider value={{ selected, setSelected, tabs, activeTab, openTab, closeTab }}>
      {children}
    </AboutContext.Provider>
  );
}

export function useAbout() {
  return useContext(AboutContext);
}
