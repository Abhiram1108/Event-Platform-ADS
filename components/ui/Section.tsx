import type { ReactNode } from "react";

import { Pill } from "@/components/ui/Pill";
import { Reveal } from "@/lib/motion";

type PillTone = "green" | "sky" | "coral" | "lavender";

export function Section({
  id,
  eyebrow,
  eyebrowTone = "green",
  title,
  intro,
  band = false,
  children,
}: {
  id?: string;
  eyebrow?: string;
  eyebrowTone?: PillTone;
  title?: string;
  intro?: string;
  band?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={title && id ? `${id}-title` : undefined}
      className={band ? "bg-sky" : "bg-cream"}
    >
      <div className="wrap py-[var(--section-y)]">
        {(eyebrow || title || intro) && (
          <Reveal className="mx-auto max-w-2xl text-center">
            {eyebrow && <Pill tone={eyebrowTone}>{eyebrow}</Pill>}
            {title && (
              <h2
                id={id ? `${id}-title` : undefined}
                className="h-section mt-4 text-balance"
              >
                {title}
              </h2>
            )}
            {intro && <p className="lede mt-3">{intro}</p>}
          </Reveal>
        )}
        <div className={eyebrow || title || intro ? "mt-12" : ""}>
          {children}
        </div>
      </div>
    </section>
  );
}
