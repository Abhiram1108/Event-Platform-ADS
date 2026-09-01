import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/lib/motion";

export function FinalCta({
  price,
  reserveHref,
  seatsLabel,
}: {
  price: string;
  reserveHref: string;
  seatsLabel: string;
}) {
  return (
    <section className="bg-sky">
      <div className="wrap py-[var(--section-y)]">
        <Reveal>
          <div className="panel mx-auto max-w-2xl p-8 text-center sm:p-12">
            <h2 className="h-section text-balance">
              Ready to build with AI?
            </h2>
            <p className="lede mx-auto mt-3 max-w-md">
              One afternoon, one working app. Bring a laptop and an idea.
            </p>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <ButtonLink href={reserveHref} size="lg" variant="green">
                Reserve your seat — {price}
                <Icon name="arrow-right" className="size-4" strokeWidth={2.5} />
              </ButtonLink>
              <ButtonLink href="/#schedule" size="lg" variant="white">
                See the schedule
              </ButtonLink>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-bold text-ink">
              <span className="flex items-center gap-1.5">
                <Icon name="check" className="size-4 text-green-ink" strokeWidth={3} />
                Beginner-friendly
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="check" className="size-4 text-green-ink" strokeWidth={3} />
                Leave with a working app
              </span>
            </div>
            <p className="mt-4 text-sm font-bold text-ink-soft">{seatsLabel}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
