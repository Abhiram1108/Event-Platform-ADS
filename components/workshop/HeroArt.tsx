import { Icon } from "@/components/ui/Icon";
import { IconTile } from "@/components/ui/IconTile";

/**
 * The hero's course-progress mockup — a chunky bordered card showing the
 * workshop as a track with progress, plus two floating accent tiles.
 */
export function HeroArt({ moduleCount = 6, hours = "3h" }: { moduleCount?: number; hours?: string }) {
  return (
    <div className="relative">
      {/* floating accent tiles */}
      <span
        aria-hidden
        className="tile absolute -right-3 -top-5 z-10 size-14 rotate-6 bg-coral"
      >
        <Icon name="rocket" className="size-6 text-ink" strokeWidth={2.25} />
      </span>
      <span
        aria-hidden
        className="tile absolute -bottom-5 -left-4 z-10 size-12 -rotate-6 bg-green-soft"
      >
        <Icon name="star" className="size-5 text-ink" strokeWidth={2.25} />
      </span>

      <div className="panel p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <IconTile icon="sparkle" tone="sky" />
          <div>
            <p className="font-display text-lg font-bold text-ink">
              Build With AI
            </p>
            <p className="text-sm text-ink-soft">
              {moduleCount} modules · {hours} hands-on
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-bold text-ink-soft">
            <span>What you&rsquo;ll cover</span>
          </div>
          <ul className="mt-2 space-y-2">
            {[
              "Prompting that returns what you need",
              "Calling a model from your own code",
              "A real interface, then a live deploy",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm text-ink">
                <span className="tile size-6 bg-green-soft">
                  <Icon name="check" className="size-3.5 text-green-ink" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 border-2 border-ink bg-green px-4 py-3 text-center font-display text-sm font-bold text-white" style={{ borderRadius: "12px" }}>
          Reserve your seat
        </div>
      </div>
    </div>
  );
}
