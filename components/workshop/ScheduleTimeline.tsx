import { Reveal } from "@/lib/motion";

export type ScheduleItem = { time: string; title: string; detail?: string };

export function ScheduleTimeline({ items }: { items: ScheduleItem[] }) {
  return (
    <ol className="mx-auto max-w-2xl space-y-4">
      {items.map((item, i) => (
        <Reveal key={item.time} as="li" delay={i * 0.04}>
          <div className="panel-soft flex items-center gap-4 p-4">
            <span
              className={
                "grid size-14 shrink-0 place-items-center border-2 border-ink font-display text-sm font-bold " +
                (i === 0 ? "bg-green text-white" : "bg-cream text-ink")
              }
              style={{ borderRadius: "12px" }}
            >
              {item.time}
            </span>
            <div>
              <h3 className="font-display text-base font-bold tracking-tight text-ink">
                {item.title}
              </h3>
              {item.detail && (
                <p className="mt-0.5 text-sm text-ink-soft">{item.detail}</p>
              )}
            </div>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
