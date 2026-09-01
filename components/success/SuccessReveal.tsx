"use client";

import type { ReactNode } from "react";

import { StaggerChildren } from "@/lib/motion";

export function SuccessReveal({ children }: { children: ReactNode }) {
  return <StaggerChildren delayChildren={0.05}>{children}</StaggerChildren>;
}
