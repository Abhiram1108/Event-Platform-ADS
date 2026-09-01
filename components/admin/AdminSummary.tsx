import type { IconName } from "@/components/ui/Icon";
import { IconTile } from "@/components/ui/IconTile";

type Stat = { label: string; value: string; icon: IconName; tone: "green" | "sky" | "coral" | "lavender" };

export function AdminSummary({
  filled,
  capacity,
  stats,
}: {
  filled: number;
  capacity: number | null;
  stats: Stat[];
}) {
  const pct =
    capacity && capacity > 0
      ? Math.min(100, Math.round((filled / capacity) * 100))
      : 0;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_1.4fr]">
      <div className="panel p-6">
        <p className="text-sm font-bold text-ink-soft">Seats filled</p>
        <p className="mt-1 font-display text-4xl font-bold tracking-tight text-ink">
          {filled}
          <span className="text-ink-faint">
            {capacity != null ? ` / ${capacity}` : ""}
          </span>
        </p>
        <div
          className="mt-4 h-4 overflow-hidden border-2 border-ink bg-cream"
          style={{ borderRadius: "999px" }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Seats filled"
        >
          <div className="h-full bg-green" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="panel-soft flex flex-col gap-2 p-4">
            <IconTile icon={s.icon} tone={s.tone} size="sm" />
            <p className="font-display text-2xl font-bold tracking-tight text-ink">
              {s.value}
            </p>
            <p className="text-xs font-bold uppercase tracking-wide text-ink-faint">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
