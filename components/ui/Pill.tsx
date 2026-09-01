import type { ReactNode } from "react";

type Tone = "green" | "sky" | "coral" | "lavender" | "white";

const TONES: Record<Tone, string> = {
  green: "bg-green-soft text-green-ink",
  sky: "bg-sky text-ink",
  coral: "bg-coral-soft text-ink",
  lavender: "bg-lavender-soft text-ink",
  white: "bg-surface text-ink",
};

export function Pill({
  children,
  tone = "white",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span className={`pill ${TONES[tone]} ${className}`.trim()}>{children}</span>
  );
}
