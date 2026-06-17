"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import AboutMenuIcon from "@/components/ui/AboutMenuIcon";
import DropdownTitle from "@/components/ui/DropdownTitle";
import DropdownItem from "@/components/ui/DropdownItem";
import { useAbout } from "@/components/ui/AboutContext";

type IconType = "professional info" | "personal info" | "hobbies";

const iconContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const iconItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

function AccordionSection({
  label,
  children,
  bordered,
}: {
  label: string;
  children: React.ReactNode;
  bordered?: boolean;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex w-full flex-col items-start">
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ backgroundColor: "rgb(29 41 61 / 0.4)" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={[
          "border-theme-theme-stroke flex w-full cursor-pointer items-center gap-3 border-b px-6 py-3",
          bordered ? "border-t" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <motion.i
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ duration: 0.2 }}
          className="ri-arrow-down-s-fill text-theme-heading-foreground text-[16px] leading-none"
          aria-hidden
        />
        <p className="text-body-md text-theme-heading-foreground flex-1 text-left">{label}</p>
      </motion.button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key={label}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full overflow-hidden"
          >
            <div className="flex w-full flex-col items-start gap-2 p-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfessionalInfoContent() {
  const { openTab } = useAbout();
  return (
    <AccordionSection label="professional-info">
      <DropdownTitle title="experience" onOpen={() => openTab("experience")} />
      <DropdownTitle title="skills" onOpen={() => openTab("skills")} />
      <DropdownTitle title="certificates" onOpen={() => openTab("certificates")} />
    </AccordionSection>
  );
}

function PersonalInfoContent() {
  const { openTab } = useAbout();
  return (
    <AccordionSection label="personal-info">
      <DropdownTitle title="bio" onOpen={() => openTab("bio")} />
      <DropdownTitle title="interests" onOpen={() => openTab("interests")} />
      <DropdownTitle title="education" state="opened" onOpen={() => openTab("education")}>
        <DropdownItem label="high-school" variant="space" onOpen={() => openTab("high-school")} />
        <DropdownItem label="university" variant="space" onOpen={() => openTab("university")} />
      </DropdownTitle>
    </AccordionSection>
  );
}

function ContactsSection() {
  return (
    <AccordionSection label="contacts" bordered>
      <DropdownItem
        label="user@gmail.com"
        icon="ri-mail-line"
        variant="no space"
        onOpen={() => (window.location.href = "mailto:user@gmail.com")}
      />
      <DropdownItem
        label="+3598246359"
        icon="ri-phone-line"
        variant="no space"
        onOpen={() => (window.location.href = "tel:+3598246359")}
      />
    </AccordionSection>
  );
}

function HobbiesContent() {
  const { openTab } = useAbout();
  return (
    <AccordionSection label="hobbies">
      <DropdownTitle title="music" onOpen={() => openTab("music")} />
      <DropdownTitle title="books" onOpen={() => openTab("books")} />
      <DropdownTitle title="hiking" onOpen={() => openTab("hiking")} />
      <DropdownTitle title="games" onOpen={() => openTab("games")} />
    </AccordionSection>
  );
}

const ICONS: IconType[] = ["professional info", "personal info", "hobbies"];

export default function AboutSidebar({ className }: { className?: string }) {
  const { selected, setSelected } = useAbout();

  return (
    <div
      className={["border-theme-theme-stroke flex shrink-0 self-stretch border-r", className]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Icon strip */}
      <motion.div
        variants={iconContainer}
        initial="hidden"
        animate="visible"
        className="border-theme-theme-stroke flex w-17.25 shrink-0 flex-col items-center gap-8 border-r px-5 py-3"
      >
        {ICONS.map((type) => (
          <motion.div key={type} variants={iconItem}>
            <AboutMenuIcon
              type={type}
              state={selected === type ? "selected" : "static"}
              onClick={() => setSelected(type)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Accordion panel */}
      <div className="flex w-60.5 shrink-0 flex-col items-start">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {selected === "professional info" && <ProfessionalInfoContent />}
            {selected === "personal info" && <PersonalInfoContent />}
            {selected === "hobbies" && <HobbiesContent />}
          </motion.div>
        </AnimatePresence>
        <ContactsSection />
      </div>
    </div>
  );
}
