"use client";

import type { ReactNode } from "react";

import { StaggerChildren } from "@/lib/motion";

export function HeroReveal({ children }: { children: ReactNode }) {
  return <StaggerChildren delayChildren={0.1}>{children}</StaggerChildren>;
}
