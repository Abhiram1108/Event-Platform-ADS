import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Pill } from "@/components/ui/Pill";
import { HeroArt } from "@/components/workshop/HeroArt";
import { HeroReveal } from "@/components/workshop/HeroReveal";

type Fact = { icon: IconName; label: string };

export function Hero({
  badge,
  titleLines,
  greenWord,
  supporting,
  facts,
  reserveHref,
  seatsLeftLabel,
}: {
  badge: string;
  titleLines: string[];
  greenWord: string;
  supporting: string;
  facts: Fact[];
  reserveHref: string;
  seatsLeftLabel: string;
}) {
  return (
    <section className="bg-cream">
      <div className="wrap grid items-center gap-12 pb-[var(--section-y)] pt-12 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr]">
        <HeroReveal>
          <Pill tone="green">
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-green-ink"
            />
            {badge}
          </Pill>

          <h1 className="h-display mt-5">
            {titleLines.map((line, i) => (
              <span key={line} className="block">
                {line}
                {i === titleLines.length - 1 && (
                  <>
                    {" "}
                    <span className="text-green-ink">{greenWord}</span>
                  </>
                )}
              </span>
            ))}
          </h1>

          <p className="lede mt-5 max-w-xl">{supporting}</p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <ButtonLink href={reserveHref} size="lg" variant="green">
              Reserve your seat
              <Icon name="arrow-right" className="size-4" strokeWidth={2.5} />
            </ButtonLink>
            <ButtonLink href="/#workshop" size="lg" variant="sky">
              Explore the workshop
            </ButtonLink>
          </div>

          <p className="mt-3 text-sm font-bold text-ink-soft">
            {seatsLeftLabel}
          </p>

          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {facts.map((f) => (
              <div key={f.label} className="flex items-center gap-2">
                <span className="tile size-8 bg-lavender-soft">
                  <Icon name={f.icon} className="size-4 text-ink" strokeWidth={2.25} />
                </span>
                <dd className="font-display text-sm font-bold text-ink">
                  {f.label}
                </dd>
              </div>
            ))}
          </dl>
        </HeroReveal>

        <HeroReveal>
          <div className="mx-auto max-w-md lg:ml-auto lg:mr-0">
            <HeroArt />
          </div>
        </HeroReveal>
      </div>
    </section>
  );
}
