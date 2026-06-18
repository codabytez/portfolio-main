import { useId } from "react";

interface NextjsIconProps {
  size?: number;
  className?: string;
  withBackground?: boolean;
}

export default function NextjsIcon({
  size = 20,
  className,
  withBackground = false,
}: NextjsIconProps) {
  const maskId = useId();

  if (withBackground) {
    return (
      <svg viewBox="0 0 180 180" width={size} height={size} aria-hidden="true">
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          width="180"
          height="180"
          x="0"
          y="0"
          style={{ maskType: "alpha" }}
        >
          <circle cx="90" cy="90" r="90" fill="black" />
        </mask>
        <g mask={`url(#${maskId})`}>
          <circle cx="90" cy="90" r="90" fill="black" />
          <path
            d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
            fill="white"
          />
          <rect fill="white" height="72" width="12" x="115" y="54" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 180 180"
      width={size}
      height={size}
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" />
      <rect height="72" width="12" x="115" y="54" />
    </svg>
  );
}
