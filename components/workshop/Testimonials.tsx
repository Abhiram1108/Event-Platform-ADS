import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/lib/motion";

/**
 * Sample feedback for the demo. These are not real people or quotes — the
 * section is labelled as placeholder content.
 */
const SAMPLES: { quote: string; name: string; role: string; tone: string }[] = [
  {
    quote:
      "I came in having never called an API and left with a small app deployed. The pacing was right for a beginner.",
    name: "Sample student A",
    role: "2nd year, CSE",
    tone: "bg-coral-soft",
  },
  {
    quote:
      "Useful because it was all building. By the end the prompt-to-API-to-UI flow finally clicked.",
    name: "Sample student B",
    role: "3rd year, IT",
    tone: "bg-sky-soft",
  },
  {
    quote:
      "Good intro to shipping with a model. I kept working on the project after the session.",
    name: "Sample student C",
    role: "1st year, ECE",
    tone: "bg-lavender-soft",
  },
];

export function Testimonials() {
  return (
    <div>
      <div className="grid gap-5 md:grid-cols-3">
        {SAMPLES.map((s, i) => (
          <Reveal key={s.name} delay={i * 0.05}>
            <figure className="panel h-full p-6">
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Icon key={k} name="star" className="size-4" strokeWidth={2} />
                ))}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-ink">
                &ldquo;{s.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t-2 border-ink/10 pt-4">
                <span className={`tile size-9 ${s.tone}`}>
                  <Icon name="users" className="size-4 text-ink" strokeWidth={2.25} />
                </span>
                <span>
                  <span className="block font-display text-sm font-bold text-ink">
                    {s.name}
                  </span>
                  <span className="block text-xs text-ink-soft">{s.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 text-center text-xs font-semibold text-ink-faint">
        Sample feedback shown for the demo — not real attendees or quotes.
      </p>
    </div>
  );
}
