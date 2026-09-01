import { prisma } from "@/lib/prisma";

/**
 * This platform sells a single workshop. It is identified by this slug and
 * created by `prisma/seed.ts`.
 */
export const CURRENT_WORKSHOP_SLUG = "build-with-ai-2026";

export async function getCurrentWorkshop() {
  return prisma.workshop.findUnique({
    where: { slug: CURRENT_WORKSHOP_SLUG },
  });
}

/**
 * Human-facing registration reference, e.g. "ADS-2026-8F3K2Q".
 * Display only — the cuid `id` remains the real key.
 */
export function formatRegistrationRef(id: string): string {
  const tail = id.replace(/[^a-z0-9]/gi, "").slice(-6).toUpperCase();
  return `ADS-2026-${tail.padStart(6, "0")}`;
}

const WORKSHOP_DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

/** e.g. "12 October 2026" */
export function formatWorkshopDate(date: Date): string {
  return WORKSHOP_DATE_FORMAT.format(date);
}

/** Format minor units (paise) as a display price, e.g. 99900 -> "₹999". */
export function formatPrice(minor: number, currency: string): string {
  const major = minor / 100;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: major % 1 === 0 ? 0 : 2,
    }).format(major);
  } catch {
    return `${currency.toUpperCase()} ${major.toFixed(2)}`;
  }
}
