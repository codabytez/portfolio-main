"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
};

function AccordionSection({
  label,
  children,
  bordered,
  open: controlledOpen,
  onToggle,
}: {
  label: string;
  children: React.ReactNode;
  bordered?: boolean;
  open?: boolean;
  onToggle?: () => void;
}) {
  const [localOpen, setLocalOpen] = useState(true);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : localOpen;

  function handleClick() {
    if (isControlled) onToggle?.();
    else setLocalOpen((o) => !o);
  }

  return (
    <div className="flex w-full flex-col items-start">
      <motion.button
        onClick={handleClick}
        whileHover={{ backgroundColor: "rgb(29 41 61 / 0.4)" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={[
          "border-theme-theme-stroke bg-primitive-slate-700 flex w-full cursor-pointer items-center gap-3 border-b px-6 py-3 lg:bg-transparent",
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

function ProfessionalInfoContent({ open, onToggle }: { open?: boolean; onToggle?: () => void }) {
  const { openTab } = useAbout();
  return (
    <AccordionSection label="professional-info" open={open} onToggle={onToggle}>
      <DropdownTitle
        title="experience"
        folderColor="text-primitive-orange-400"
        onOpen={() => openTab("experience")}
      />
      <DropdownTitle
        title="skills"
        folderColor="text-primitive-teal-400"
        onOpen={() => openTab("skills")}
      />
      <DropdownTitle
        title="certificates"
        folderColor="text-primitive-indigo-500"
        onOpen={() => openTab("certificates")}
      />
    </AccordionSection>
  );
}

function PersonalInfoContent({ open, onToggle }: { open?: boolean; onToggle?: () => void }) {
  const { openTab } = useAbout();
  return (
    <AccordionSection label="personal-info" open={open} onToggle={onToggle}>
      <DropdownTitle
        title="bio"
        folderColor="text-primitive-rose-400"
        onOpen={() => openTab("bio")}
      />
      <DropdownTitle
        title="interests"
        folderColor="text-primitive-teal-400"
        onOpen={() => openTab("interests")}
      />
      <DropdownTitle
        title="education"
        folderColor="text-primitive-indigo-500"
        onOpen={() => openTab("education")}
      />
    </AccordionSection>
  );
}

function ContactsSection({ open, onToggle }: { open?: boolean; onToggle?: () => void }) {
  const contact = useQuery(api.contact.get);

  return (
    <AccordionSection label="contacts" bordered open={open} onToggle={onToggle}>
      {contact?.email && (
        <DropdownItem
          label={contact.email}
          icon="ri-mail-line"
          variant="no space"
          onOpen={() => (window.location.href = `mailto:${contact.email}`)}
        />
      )}
      {contact?.phone && (
        <DropdownItem
          label={contact.phone}
          icon="ri-phone-line"
          variant="no space"
          onOpen={() => (window.location.href = `tel:${contact.phone}`)}
        />
      )}
    </AccordionSection>
  );
}

function HobbiesContent({ open, onToggle }: { open?: boolean; onToggle?: () => void }) {
  const { openTab } = useAbout();
  return (
    <AccordionSection label="hobbies" open={open} onToggle={onToggle}>
      <DropdownTitle
        title="music"
        folderColor="text-primitive-rose-400"
        onOpen={() => openTab("music")}
      />
      <DropdownTitle
        title="movies"
        folderColor="text-primitive-orange-400"
        onOpen={() => openTab("movies")}
      />
      <DropdownTitle
        title="games"
        folderColor="text-primitive-indigo-500"
        onOpen={() => openTab("games")}
      />
    </AccordionSection>
  );
}

type MobileSection = "personal-info" | "professional-info" | "hobbies" | "contacts";

function MobileAccordions() {
  const [openSection, setOpenSection] = useState<MobileSection | null>("personal-info");

  function toggle(id: MobileSection) {
    setOpenSection((o) => (o === id ? null : id));
  }

  return (
    <div className="flex w-full flex-col lg:hidden">
      <PersonalInfoContent
        open={openSection === "personal-info"}
        onToggle={() => toggle("personal-info")}
      />
      <ProfessionalInfoContent
        open={openSection === "professional-info"}
        onToggle={() => toggle("professional-info")}
      />
      <HobbiesContent open={openSection === "hobbies"} onToggle={() => toggle("hobbies")} />
      <ContactsSection open={openSection === "contacts"} onToggle={() => toggle("contacts")} />
    </div>
  );
}

const ICONS: IconType[] = ["professional info", "personal info", "hobbies"];

export default function AboutSidebar({ className }: { className?: string }) {
  const { selected, setSelected } = useAbout();

  return (
    <div
      className={[
        "border-theme-theme-stroke flex w-full shrink-0 flex-col border-b lg:w-auto lg:flex-row lg:self-stretch lg:border-r lg:border-b-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Mobile: _about-me header */}
      <div className="border-theme-theme-stroke flex w-full items-center border-b px-6 py-3 lg:hidden">
        <p className="text-body-md text-theme-heading-foreground">_about-me</p>
      </div>

      {/* Mobile: radio-style accordion */}
      <MobileAccordions />

      {/* Desktop: icon strip */}
      <motion.div
        variants={iconContainer}
        initial="hidden"
        animate="visible"
        className="border-theme-theme-stroke hidden w-17 shrink-0 flex-col items-center gap-8 border-r px-5 py-3 lg:flex"
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

      {/* Desktop: accordion panel */}
      <div className="hidden w-60.5 shrink-0 flex-col items-start lg:flex">
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
