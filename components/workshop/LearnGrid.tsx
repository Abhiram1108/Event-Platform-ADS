import { IconTile } from "@/components/ui/IconTile";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/lib/motion";

export type LearnItem = {
  n: string;
  icon: IconName;
  tone: "green" | "sky" | "coral" | "lavender";
  title: string;
  body: string;
};

export function LearnGrid({ items }: { items: LearnItem[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {items.map((item, i) => (
        <Reveal key={item.n} delay={i * 0.04}>
          <div className="panel-soft h-full p-6 transition-transform hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <IconTile icon={item.icon} tone={item.tone} />
              <span className="pill bg-green-soft text-green-ink">
                <Icon name="book" className="size-3.5" strokeWidth={2.5} />
                Module {item.n}
              </span>
            </div>
            <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-ink">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {item.body}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
