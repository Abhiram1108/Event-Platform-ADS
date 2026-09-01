import { createElement, type ReactNode } from "react";

/**
 * Entrance-animation wrappers.
 *
 * These deliberately render their children immediately and statically. An
 * earlier version used scroll/mount opacity transitions, but that left
 * above-the-fold content invisible until hydration finished. The visual
 * identity here (borders, hard shadows, colour) does not need entrance
 * choreography; motion is reserved for hover feedback (CSS) and the mobile
 * menu (AnimatePresence).
 *
 * The component API is kept so callers don't need to change.
 */

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const DUR = { xs: 0.12, sm: 0.2, md: 0.34, lg: 0.5 } as const;

type As = "div" | "li" | "ul" | "ol" | "section" | "span";

export function Reveal({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: As;
}) {
  return createElement(as, className ? { className } : {}, children);
}

export function StaggerChildren({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
}) {
  return createElement("div", className ? { className } : {}, children);
}
