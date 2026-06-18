"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import Skeleton from "@/components/ui/Skeleton";

type SidebarItem = {
  icon: string;
  label: string;
  href?: string;
};

const PLATFORM_ICONS: Record<string, string> = {
  github: "ri-github-fill",
  linkedin: "ri-linkedin-fill",
  x: "ri-twitter-x-fill",
  instagram: "ri-instagram-line",
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" as const } },
};

function AccordionSection({
  title,
  items,
  open,
  onToggle,
  topBorder = false,
}: {
  title: string;
  items: SidebarItem[];
  open: boolean;
  onToggle: () => void;
  topBorder?: boolean;
}) {
  return (
    <div className="flex w-full flex-col">
      <motion.button
        onClick={onToggle}
        whileHover={{ backgroundColor: "rgb(29 41 61 / 0.4)" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={[
          "border-theme-theme-stroke bg-primitive-slate-700 flex w-full cursor-pointer items-center gap-3 border-b px-6 py-3 lg:bg-transparent",
          topBorder ? "border-t" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <motion.i
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className="ri-arrow-down-s-fill text-theme-heading-foreground text-[16px] leading-none"
          aria-hidden
        />
        <p className="text-body-md text-theme-heading-foreground flex-1 text-left">{title}</p>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-2 p-3"
            >
              {items.map(({ icon, label, href }) => (
                <motion.a
                  key={href ?? label}
                  href={href}
                  target={href ? "_blank" : undefined}
                  rel={href ? "noopener noreferrer" : undefined}
                  variants={itemVariants}
                  whileHover={{ x: 3, backgroundColor: "rgb(29 41 61 / 0.6)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="group flex cursor-pointer items-center gap-2 rounded px-3 py-1"
                >
                  <i
                    className={[
                      icon,
                      "text-theme-foreground group-hover:text-theme-heading-foreground shrink-0 text-[16px] leading-none transition-colors",
                    ].join(" ")}
                    aria-hidden
                  />
                  <p className="text-body-md text-theme-foreground group-hover:text-theme-heading-foreground whitespace-nowrap transition-colors">
                    {label}
                  </p>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactSidebar() {
  const contact = useQuery(api.contact.get);
  const socials = useQuery(api.socials.list);

  const loading = contact === undefined || socials === undefined;

  const contactItems: SidebarItem[] = [
    ...(contact?.email
      ? [{ icon: "ri-mail-line", label: contact.email, href: `mailto:${contact.email}` }]
      : []),
    ...(contact?.phone
      ? [{ icon: "ri-phone-line", label: contact.phone, href: `tel:${contact.phone}` }]
      : []),
  ];

  const socialItems: SidebarItem[] = (socials ?? []).map((s) => ({
    icon: PLATFORM_ICONS[s.platform] ?? "ri-link",
    label: s.handle ?? s.platform,
    href: s.url,
  }));

  const [mobileOpen, setMobileOpen] = useState<"contacts" | "social" | null>("contacts");
  const [desktopContactsOpen, setDesktopContactsOpen] = useState(true);
  const [desktopSocialOpen, setDesktopSocialOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="border-theme-theme-stroke w-full shrink-0 border-b lg:w-77.75 lg:self-stretch lg:border-r lg:border-b-0"
    >
      <div className="border-theme-theme-stroke flex items-center border-b px-6 py-3 lg:hidden">
        <p className="text-body-md text-theme-heading-foreground">_contact-me</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3 p-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 shrink-0" />
              <Skeleton className="h-4" style={{ width: `${45 + (i % 3) * 20}%` }} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Mobile: radio accordion */}
          <div className="lg:hidden">
            <AccordionSection
              title="contacts"
              items={contactItems}
              open={mobileOpen === "contacts"}
              onToggle={() => setMobileOpen((s) => (s === "contacts" ? null : "contacts"))}
            />
            <AccordionSection
              title="find-me-also-in"
              items={socialItems}
              open={mobileOpen === "social"}
              onToggle={() => setMobileOpen((s) => (s === "social" ? null : "social"))}
              topBorder
            />
          </div>

          {/* Desktop: independent accordions */}
          <div className="hidden lg:block">
            <AccordionSection
              title="contacts"
              items={contactItems}
              open={desktopContactsOpen}
              onToggle={() => setDesktopContactsOpen((o) => !o)}
            />
            <AccordionSection
              title="find-me-also-in"
              items={socialItems}
              open={desktopSocialOpen}
              onToggle={() => setDesktopSocialOpen((o) => !o)}
              topBorder
            />
          </div>
        </>
      )}
    </motion.div>
  );
}
