import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/lib/motion";

export function AudienceSplit({
  forItems,
  notItems,
}: {
  forItems: string[];
  notItems: string[];
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Reveal>
        <div className="panel h-full bg-green-soft p-7">
          <h3 className="font-display text-lg font-bold tracking-tight text-ink">
            Come along if&hellip;
          </h3>
          <ul className="mt-4 space-y-3">
            {forItems.map((t) => (
              <li key={t} className="flex gap-3 text-sm text-ink">
                <span className="tile mt-0.5 size-6 shrink-0 bg-surface">
                  <Icon name="check" className="size-3.5 text-green-ink" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <div className="panel-soft h-full p-7">
          <h3 className="font-display text-lg font-bold tracking-tight text-ink-soft">
            Maybe not this one if&hellip;
          </h3>
          <ul className="mt-4 space-y-3">
            {notItems.map((t) => (
              <li key={t} className="flex gap-3 text-sm text-ink-soft">
                <span
                  aria-hidden
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-ink-faint"
                />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}
