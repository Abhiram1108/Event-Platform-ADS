import { IconTile } from "@/components/ui/IconTile";
import type { IconName } from "@/components/ui/Icon";
import { Reveal } from "@/lib/motion";

const FEATURES: {
  icon: IconName;
  tone: "green" | "sky" | "coral" | "lavender";
  title: string;
  body: string;
}[] = [
  {
    icon: "wand",
    tone: "coral",
    title: "Hands-on the whole way",
    body: "No lecture-only stretches. You are building from the first 20 minutes.",
  },
  {
    icon: "sparkle",
    tone: "sky",
    title: "Made for beginners",
    body: "If you have written some code, you have enough to keep up.",
  },
  {
    icon: "rocket",
    tone: "lavender",
    title: "You leave with a deploy",
    body: "A live URL for the app you built, not a certificate.",
  },
  {
    icon: "users",
    tone: "green",
    title: "A builder community",
    body: "Run by Alexa Developers SRM — students who like shipping things.",
  },
];

export function FeatureGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map((f, i) => (
        <Reveal key={f.title} delay={i * 0.04}>
          <div className="panel-soft h-full p-6 text-center">
            <div className="flex justify-center">
              <IconTile icon={f.icon} tone={f.tone} size="lg" />
            </div>
            <h3 className="mt-4 font-display text-base font-bold tracking-tight text-ink">
              {f.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
