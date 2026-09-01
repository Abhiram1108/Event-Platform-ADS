import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * The single workshop this platform sells: "Build With AI" by Alexa
 * Developers SRM.
 *
 * priceMinor is in the smallest currency unit (paise). Rs 299.00 -> 29900.
 * This value is the only source of truth for the amount charged by Stripe.
 */
const WORKSHOP = {
  slug: "build-with-ai-2026",
  title: "Build With AI",
  description:
    "A hands-on workshop that takes you from prompt to product. Learn practical " +
    "AI integration — prompting, API calls, and building an interface — and " +
    "leave with a small working application you built yourself. Beginner-friendly. " +
    "Bring a laptop and an idea you have been meaning to try.",
  date: new Date("2026-10-12T10:00:00+05:30"),
  location: "SRMIST, Kattankulathur",
  priceMinor: 29900,
  currency: "inr",
  capacity: 48,
} as const;

async function main() {
  const workshop = await prisma.workshop.upsert({
    where: { slug: WORKSHOP.slug },
    update: {
      title: WORKSHOP.title,
      description: WORKSHOP.description,
      date: WORKSHOP.date,
      location: WORKSHOP.location,
      priceMinor: WORKSHOP.priceMinor,
      currency: WORKSHOP.currency,
      capacity: WORKSHOP.capacity,
    },
    create: { ...WORKSHOP },
  });

  console.log(
    `Seeded workshop "${workshop.title}" (${workshop.slug}) — ` +
      `${workshop.currency.toUpperCase()} ${(workshop.priceMinor / 100).toFixed(2)}, ` +
      `${workshop.priceMinor} minor units, ${workshop.capacity} seats.`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
