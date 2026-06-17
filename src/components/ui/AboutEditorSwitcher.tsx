"use client";

import { useAbout } from "@/components/ui/AboutContext";

type Props = {
  professional: React.ReactNode;
  personal: React.ReactNode;
  hobbies: React.ReactNode;
  className?: string;
};

export default function AboutEditorSwitcher({ professional, personal, hobbies, className }: Props) {
  const { selected } = useAbout();

  return (
    <div className={["h-full", className].filter(Boolean).join(" ")}>
      <div className={["h-full", selected === "professional info" ? "block" : "hidden"].join(" ")}>
        {professional}
      </div>
      <div className={["h-full", selected === "personal info" ? "block" : "hidden"].join(" ")}>
        {personal}
      </div>
      <div className={["h-full", selected === "hobbies" ? "block" : "hidden"].join(" ")}>
        {hobbies}
      </div>
    </div>
  );
}
