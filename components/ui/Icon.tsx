import type { SVGProps } from "react";

export type IconName =
  | "calendar"
  | "pin"
  | "clock"
  | "tag"
  | "users"
  | "sparkle"
  | "code"
  | "layers"
  | "rocket"
  | "message"
  | "check"
  | "arrow-right"
  | "wand"
  | "plug"
  | "book"
  | "star"
  | "bolt";

const PATHS: Record<IconName, string> = {
  calendar:
    "M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
  pin: "M12 21s-6.5-5.6-6.5-10A6.5 6.5 0 0 1 18.5 11c0 4.4-6.5 10-6.5 10Zm0-7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  tag: "M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Zm5-4h.01",
  users:
    "M16 19v-2a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v2M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM21 19v-2a3 3 0 0 0-2.4-2.94M16 4.06A3.5 3.5 0 0 1 16 11",
  sparkle:
    "M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3ZM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z",
  code: "M8 6l-6 6 6 6M16 6l6 6-6 6",
  layers: "M12 3l9 5-9 5-9-5 9-5ZM3 13l9 5 9-5M3 17l9 5 9-5",
  rocket:
    "M5 15c-1 1-1.5 4-1.5 4s3-.5 4-1.5c.6-.6.6-1.9 0-2.5-.6-.6-1.9-.6-2.5 0ZM9 15l-3-3c1-4 4-9 11-10 -1 7-6 10-10 11l-3-3ZM15 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  message: "M21 12a8 8 0 0 1-11.6 7.1L4 20l.9-5.4A8 8 0 1 1 21 12Z",
  check: "M20 6 9 17l-5-5",
  "arrow-right": "M5 12h14M13 5l7 7-7 7",
  wand: "M15 4V2M15 10V8M12 7h-2M20 7h-2M17.7 4.3l1.4-1.4M11.5 12.5 4 20M18 12l-6 6",
  plug: "M9 2v6M15 2v6M7 8h10v3a5 5 0 0 1-10 0V8ZM12 16v6",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Zm2 12h13M9 7h7",
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.9L12 3.5Z",
  bolt: "M13 3 4 14h7l-1 7 9-11h-7l1-7Z",
};

export function Icon({
  name,
  className = "size-5",
  strokeWidth = 2,
  ...rest
}: { name: IconName; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
