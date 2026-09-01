import { AudienceSplit } from "@/components/workshop/AudienceSplit";
import { BuildShowcase } from "@/components/workshop/BuildShowcase";
import { FeatureGrid } from "@/components/workshop/FeatureGrid";
import { FinalCta } from "@/components/workshop/FinalCta";
import { Hero } from "@/components/workshop/Hero";
import { LearnGrid, type LearnItem } from "@/components/workshop/LearnGrid";
import { ScheduleTimeline } from "@/components/workshop/ScheduleTimeline";
import { Testimonials } from "@/components/workshop/Testimonials";
import { WorkshopHighlight } from "@/components/workshop/WorkshopHighlight";
import { Section } from "@/components/ui/Section";
import { getSessionUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  formatPrice,
  formatWorkshopDate,
  getCurrentWorkshop,
} from "@/lib/workshop";

/* Page-level content not modelled by the database. */
const EVENT_TIME = "10:00 AM – 1:00 PM";
const DURATION = "3 hours";

const LEARN: LearnItem[] = [
  {
    n: "01",
    icon: "sparkle",
    tone: "coral",
    title: "AI fundamentals",
    body: "How models work in practice — tokens, context, and what they are and aren't good at.",
  },
  {
    n: "02",
    icon: "wand",
    tone: "sky",
    title: "Prompt engineering",
    body: "Prompts that return what you need: system messages, structure, and constraints.",
  },
  {
    n: "03",
    icon: "plug",
    tone: "lavender",
    title: "API integration",
    body: "Calling a model from your own code — keys, requests, streaming, and failures.",
  },
  {
    n: "04",
    icon: "layers",
    tone: "green",
    title: "Building the interface",
    body: "Wrapping the model in a real UI with input, loading, and result states.",
  },
  {
    n: "05",
    icon: "code",
    tone: "coral",
    title: "Connecting the pieces",
    body: "Wiring prompt, API, and interface into one flow that works end to end.",
  },
  {
    n: "06",
    icon: "rocket",
    tone: "sky",
    title: "Deploying the project",
    body: "Environment variables, a deploy, and a live URL you can share the same day.",
  },
];

const SCHEDULE = [
  { time: "10:00", title: "Introduction", detail: "The idea, the stack, and what you'll have by 1pm." },
  { time: "10:30", title: "AI + prompts", detail: "Fundamentals and prompt engineering, with exercises." },
  { time: "11:15", title: "Build", detail: "Your first API call and the interface around it." },
  { time: "12:15", title: "Integrate", detail: "Connect prompt, API, and UI into one working flow." },
  { time: "12:45", title: "Deploy", detail: "Ship it and get a live URL." },
  { time: "13:00", title: "Wrap up", detail: "Demos, next steps, and where to take it." },
];

const AUDIENCE_FOR = [
  "You've written some code and want to build with AI",
  "You've never shipped anything that calls an API",
  "You're building your first AI project",
  "You learn by doing",
];
const AUDIENCE_NOT = [
  "You want a lecture with slides",
  "You're after a deep dive on model internals",
  "You've already shipped several AI apps",
];

export default async function HomePage() {
  const [workshop, user] = await Promise.all([
    getCurrentWorkshop(),
    getSessionUser(),
  ]);
  const reserveHref = user ? "/register" : "/login?callbackUrl=/register";

  if (!workshop) {
    return (
      <div className="wrap py-[var(--section-y)]">
        <h1 className="h-display">Registration isn&rsquo;t open yet.</h1>
        <p className="lede mt-4">The next workshop is being scheduled.</p>
      </div>
    );
  }

  const paidCount = await prisma.registration.count({
    where: { workshopId: workshop.id, status: "PAID" },
  });
  const seatsLeft = Math.max(workshop.capacity - paidCount, 0);
  const seatsLabel =
    seatsLeft === 0
      ? "This workshop is full"
      : seatsLeft === workshop.capacity
        ? `${workshop.capacity} seats available`
        : `${seatsLeft} of ${workshop.capacity} seats left`;

  const price = formatPrice(workshop.priceMinor, workshop.currency);
  const dateText = formatWorkshopDate(workshop.date);
  const dateShort = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(workshop.date);

  return (
    <>
      <Hero
        badge="Hands-on AI workshop"
        titleLines={["Go from prompt", "to"]}
        greenWord="product"
        supporting="Turn an idea into a working AI-powered app in one hands-on workshop with Alexa Developers SRM. You leave with something that runs."
        facts={[
          { icon: "calendar", label: dateShort },
          { icon: "pin", label: "SRMIST" },
          { icon: "clock", label: DURATION },
          { icon: "tag", label: price },
        ]}
        reserveHref={reserveHref}
        seatsLeftLabel={seatsLabel}
      />

      <Section
        id="workshop"
        eyebrow="The workshop"
        eyebrowTone="green"
        title="One afternoon, one working app"
        intro="A focused, practical session — you build the whole way through."
      >
        <WorkshopHighlight
          title={workshop.title}
          description={workshop.description}
          price={price}
          seatsLabel={seatsLabel}
          reserveHref={reserveHref}
          meta={[
            { icon: "clock", label: "Duration", value: `${DURATION} · ${EVENT_TIME}` },
            { icon: "sparkle", label: "Level", value: "Beginner-friendly" },
            { icon: "calendar", label: "Date", value: dateText },
            { icon: "pin", label: "Location", value: workshop.location },
          ]}
        />
      </Section>

      <Section
        id="learn"
        eyebrow="What you'll learn"
        eyebrowTone="sky"
        title="Six modules, start to finish"
        intro="Each one builds on the last, so by the end the whole pipeline makes sense."
      >
        <LearnGrid items={LEARN} />
      </Section>

      <Section
        id="build"
        eyebrow="What you'll build"
        eyebrowTone="lavender"
        title="A small app that does something useful with a model"
        intro="Not a toy — a real API call, a usable interface, and a deploy you can share."
      >
        <BuildShowcase />
      </Section>

      <Section
        eyebrow="Why this workshop"
        eyebrowTone="coral"
        title="Everything you need to ship"
      >
        <FeatureGrid />
      </Section>

      <Section
        id="schedule"
        eyebrow="The schedule"
        eyebrowTone="green"
        title="How the three hours run"
      >
        <ScheduleTimeline items={SCHEDULE} />
      </Section>

      <Section
        id="who"
        eyebrow="Who it's for"
        eyebrowTone="sky"
        title="Come as you are"
      >
        <AudienceSplit forItems={AUDIENCE_FOR} notItems={AUDIENCE_NOT} />
      </Section>

      <Section
        id="club"
        eyebrow="Student stories"
        eyebrowTone="green"
        title="What people say"
        intro="Alexa Developers SRM is a student developer club at SRMIST that runs practical, build-first sessions."
      >
        <Testimonials />
      </Section>

      <FinalCta
        price={price}
        reserveHref={reserveHref}
        seatsLabel={seatsLabel}
      />
    </>
  );
}
