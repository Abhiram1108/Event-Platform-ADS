import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { IconTile } from "@/components/ui/IconTile";
import { Pill } from "@/components/ui/Pill";
import { Reveal } from "@/lib/motion";

type Meta = { icon: IconName; label: string; value: string };

export function WorkshopHighlight({
  title,
  description,
  meta,
  price,
  seatsLabel,
  reserveHref,
}: {
  title: string;
  description: string;
  meta: Meta[];
  price: string;
  seatsLabel: string;
  reserveHref: string;
}) {
  return (
    <Reveal>
      <div className="panel overflow-hidden">
        <div className="grid lg:grid-cols-[1.5fr_1fr]">
          <div className="p-7 sm:p-9">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="coral">Featured workshop</Pill>
              <Pill tone="sky">Beginner-friendly</Pill>
            </div>

            <div className="mt-5 flex items-start gap-4">
              <IconTile icon="bolt" tone="green" size="lg" />
              <div>
                <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
                  {title}
                </h3>
                <p className="mt-2 max-w-prose text-ink-soft">{description}</p>
              </div>
            </div>

            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              {meta.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center gap-3 border-2 border-ink bg-cream px-3 py-2.5"
                  style={{ borderRadius: "12px" }}
                >
                  <Icon name={m.icon} className="size-4 shrink-0 text-ink" strokeWidth={2.25} />
                  <span>
                    <dt className="text-[0.7rem] font-bold uppercase tracking-wide text-ink-faint">
                      {m.label}
                    </dt>
                    <dd className="text-sm font-bold text-ink">{m.value}</dd>
                  </span>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col justify-center gap-6 border-t-2 border-ink bg-sky-soft p-7 sm:p-9 lg:border-l-2 lg:border-t-0">
            <div>
              <p className="text-sm font-bold text-ink-soft">One-time fee</p>
              <p className="mt-1 font-display text-5xl font-bold tracking-tight text-ink">
                {price}
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                Covers the full session and everything you build.
              </p>
            </div>
            <div>
              <ButtonLink
                href={reserveHref}
                size="lg"
                variant="green"
                className="w-full"
              >
                Reserve your seat
              </ButtonLink>
              <p className="mt-3 text-center text-sm font-bold text-ink-soft">
                {seatsLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
