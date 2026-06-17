import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "default" | "ghost" | "success" | "error" | "warning" | "link";

const baseClasses =
  "inline-flex items-center justify-center text-body-sm transition-colors cursor-pointer disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "rounded-3 px-button-left-right py-button-top-bottom bg-primary-background text-primary-inverted hover:bg-primary-hover hover:text-primary-hover-inverted",
  default:
    "rounded-3 px-button-left-right py-button-top-bottom bg-primitive-slate-600 text-theme-heading-foreground hover:bg-primitive-slate-500",
  ghost:
    "rounded-3 px-button-left-right py-button-top-bottom border border-primitive-slate-50 text-theme-heading-foreground hover:border-transparent hover:bg-primitive-slate-800",
  success:
    "rounded-3 px-button-left-right py-button-top-bottom bg-semantic-success-background text-semantic-success-inverted hover:bg-semantic-success-hover hover:text-semantic-success-hover-inverted",
  error:
    "rounded-3 px-button-left-right py-button-top-bottom bg-semantic-error-background text-semantic-error-inverted hover:bg-semantic-error-hover hover:text-semantic-error-hover-inverted",
  warning:
    "rounded-3 px-button-left-right py-button-top-bottom bg-semantic-warning-background text-semantic-warning-inverted hover:bg-semantic-warning-hover hover:text-semantic-warning-hover-inverted",
  link: "text-theme-link-foreground underline hover:text-theme-link-hover-foreground",
};

const disabledClasses =
  "rounded-3 px-button-left-right py-button-top-bottom bg-primitive-slate-700 text-primitive-slate-500 cursor-not-allowed!";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export default function Button({
  variant = "primary",
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = [baseClasses, disabled ? disabledClasses : variantClasses[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
