"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Button from "@/components/ui/Button";
import ContactSidebar from "@/components/ui/ContactSidebar";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getFormattedDate() {
  const d = new Date();
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const formVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" as const } },
};

// Syntax-highlight color helpers
const KW = ({ c }: { c: string }) => <span className="text-primitive-purple-400">{c}</span>;
const VR = ({ c }: { c: string }) => <span className="text-primitive-indigo-500">{c}</span>;
const ST = ({ c }: { c: string }) => <span className="text-[#ffb86a]">{c}</span>;
const TX = ({ c }: { c: string }) => <span className="text-theme-foreground">{c}</span>;

function CodeLine({ children }: { children: React.ReactNode }) {
  return <p className="text-body-lg mb-0 leading-6.75">{children}</p>;
}

function CodeSnippet({ name, email, message }: { name: string; email: string; message: string }) {
  const date = getFormattedDate();
  return (
    <div className="text-theme-foreground text-body-lg flex gap-8">
      {/* Line numbers */}
      <div className="shrink-0 text-right select-none">
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i} className="mb-0 leading-6.75">
            {i + 1}
          </p>
        ))}
      </div>

      {/* Code body */}
      <div className="min-w-0 flex-1 whitespace-pre-wrap">
        <CodeLine>
          <KW c="const" /> <VR c="button" /> <KW c="=" /> <VR c="document" />
          <TX c="." />
          <VR c="querySelector" />
          <TX c="(" />
          <ST c="'#sendBtn'" />
          <TX c=");" />
        </CodeLine>

        <CodeLine> </CodeLine>

        <CodeLine>
          <KW c="const" /> <VR c="message" /> <KW c="=" /> <TX c="{ " />
        </CodeLine>

        <CodeLine>
          <TX c="  " />
          <VR c="name:" /> <ST c={`"${name}"`} />
          <TX c="," />
        </CodeLine>

        <CodeLine>
          <TX c="  " />
          <VR c="email:" /> <ST c={`"${email}"`} />
          <TX c="," />
        </CodeLine>

        <CodeLine>
          <TX c="  " />
          <VR c="message:" /> <ST c={`"${message}"`} />
          <TX c="," />
        </CodeLine>

        <CodeLine>
          <TX c="  " />
          <VR c="date:" /> <ST c={`"${date}"`} />
          <TX c=" " />
        </CodeLine>

        <CodeLine>
          <TX c="} " />
        </CodeLine>

        <CodeLine> </CodeLine>

        <CodeLine>
          <VR c="button" />
          <TX c="." />
          <VR c="addEventListener" />
          <TX c="(" />
          <ST c="'click'" />
          <TX c=", () " />
          <KW c="=>" />
          <TX c=" { " />
        </CodeLine>

        <CodeLine>
          <TX c="  " />
          <VR c="form" />
          <TX c="." />
          <VR c="send" />
          <TX c="(" />
          <VR c="message" />
          <TX c=");" />
        </CodeLine>

        <CodeLine>
          <TX c="})" />
        </CodeLine>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
}

function InputField({ label, id, value, onChange, error, placeholder }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.75">
      <label htmlFor={id} className="text-body-md text-theme-foreground">
        {label}
      </label>
      <div
        className={[
          "rounded-3 focus-within:border-primitive-slate-300 border transition-colors duration-150",
          error
            ? "border-[#fb2c36] bg-[rgba(70,8,9,0.3)]"
            : "border-theme-theme-stroke bg-theme-theme-backdrop",
        ].join(" ")}
      >
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="text-body-md text-theme-foreground w-full bg-transparent p-3 focus:outline-none"
        />
      </div>
      {error && <p className="text-body-sm text-[#fb2c36]">{error}</p>}
    </div>
  );
}

function TextareaField({ label, id, value, onChange, placeholder }: Omit<FieldProps, "error">) {
  return (
    <div className="flex flex-col gap-1.75">
      <label htmlFor={id} className="text-body-md text-theme-foreground">
        {label}
      </label>
      <div className="border-theme-theme-stroke bg-theme-theme-backdrop rounded-3 focus-within:border-primitive-slate-300 border transition-colors duration-150">
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className="text-body-md text-theme-foreground min-h-30 w-full resize-none bg-transparent p-3 focus:outline-none"
        />
      </div>
    </div>
  );
}

export default function ContactContent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const allFilled = name.trim() !== "" && email.trim() !== "" && message.trim() !== "";

  function handleSubmit() {
    if (!isValidEmail(email)) {
      setEmailError("Wrong email address");
      return;
    }
    setEmailError("");
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  }

  function handleReset() {
    setSubmitted(false);
    setEmailError("");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col self-stretch overflow-y-auto lg:flex-row lg:overflow-hidden">
      <ContactSidebar />

      {/* Contact container */}
      <div className="flex min-w-0 flex-1 flex-col self-stretch">
        {/* Empty tab bar — desktop only */}
        <div className="border-theme-theme-stroke hidden h-10.25 shrink-0 border-b border-l lg:block" />

        {/* Content row */}
        <div className="flex min-h-0 flex-1 items-stretch">
          {/* Form panel */}
          <div className="lg:border-theme-theme-stroke flex min-w-0 flex-1 flex-col items-center justify-center px-6 py-10 lg:border-r lg:border-l lg:px-8 lg:py-32.5">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="thankyou"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex w-full max-w-93 flex-col items-center gap-8 text-center"
                >
                  <div className="flex flex-col gap-2">
                    <p className="text-heading-h4 text-theme-heading-foreground">Thank you! 🤘</p>
                    <p className="text-body-lg text-theme-foreground">
                      Your message has been accepted. You will receive answer soon!
                    </p>
                  </div>
                  <Button variant="primary" onClick={handleReset}>
                    send-new-message
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -16, transition: { duration: 0.2, ease: "easeIn" } }}
                  className="flex w-full max-w-93 flex-col gap-6"
                >
                  <motion.div variants={fieldVariants}>
                    <InputField
                      id="contact-name"
                      label="_name:"
                      value={name}
                      onChange={setName}
                      placeholder=""
                    />
                  </motion.div>
                  <motion.div variants={fieldVariants}>
                    <InputField
                      id="contact-email"
                      label="_email:"
                      value={email}
                      onChange={(v) => {
                        setEmail(v);
                        if (emailError) setEmailError("");
                      }}
                      error={emailError}
                      placeholder=""
                    />
                  </motion.div>
                  <motion.div variants={fieldVariants}>
                    <TextareaField
                      id="contact-message"
                      label="_message"
                      value={message}
                      onChange={setMessage}
                      placeholder="your message here..."
                    />
                  </motion.div>
                  <motion.div variants={fieldVariants}>
                    <Button variant="primary" disabled={!allFilled} onClick={handleSubmit}>
                      submit-message
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Code snippet panel — desktop only */}
          <div className="border-theme-theme-stroke hidden min-w-0 flex-1 items-start justify-center overflow-hidden border-r px-8 py-3 lg:flex">
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
              className="w-full"
            >
              <CodeSnippet name={name} email={email} message={message} />
            </motion.div>
          </div>

          {/* Scroll indicator — desktop only */}
          <div className="border-theme-theme-stroke hidden w-8 shrink-0 border-r px-2 py-3 lg:block">
            <div className="bg-primitive-slate-500 h-1.5 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
