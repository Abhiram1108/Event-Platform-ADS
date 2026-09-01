import { redirect } from "next/navigation";

import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Pill } from "@/components/ui/Pill";
import { requireUser } from "@/lib/permissions";
import { getMyRegistration } from "@/lib/registration";
import { formatPrice, formatWorkshopDate } from "@/lib/workshop";

const EVENT_TIME = "10:00 AM – 1:00 PM";

export default async function RegisterPage() {
  const user = await requireUser();
  const { workshop, registration } = await getMyRegistration(user.id);

  if (!workshop) {
    return (
      <Container className="py-[var(--section-y)]">
        <p className="lede">Registration isn&rsquo;t open yet.</p>
      </Container>
    );
  }
  if (registration && registration.status === "PAID") {
    redirect("/dashboard");
  }
  if (registration && registration.status === "PENDING") {
    redirect("/checkout");
  }

  const price = formatPrice(workshop.priceMinor, workshop.currency);

  return (
    <Container className="py-[var(--section-y)]">
      <div className="mx-auto max-w-4xl">
        <Pill tone="green">Step 1 of 2</Pill>
        <h1 className="h-section mt-4">Reserve your seat</h1>
        <p className="lede mt-3 max-w-xl">
          Tell us who&rsquo;s coming. Next you&rsquo;ll confirm payment and your
          seat is locked in.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_20rem]">
          <Card className="p-6 sm:p-8">
            <RegistrationForm
              defaultValues={{
                fullName: user.name ?? "",
                email: user.email ?? "",
              }}
            />
          </Card>

          <aside className="panel h-fit bg-sky-soft p-6">
            <Pill tone="white">You&rsquo;re enrolling in</Pill>
            <h2 className="mt-3 font-display text-lg font-bold tracking-tight text-ink">
              {workshop.title}
            </h2>
            <dl className="mt-4 space-y-2.5 text-sm text-ink">
              <div className="flex items-center gap-2.5">
                <Icon name="calendar" className="size-4 text-ink-soft" strokeWidth={2.25} />
                {formatWorkshopDate(workshop.date)}
              </div>
              <div className="flex items-center gap-2.5">
                <Icon name="clock" className="size-4 text-ink-soft" strokeWidth={2.25} />
                {EVENT_TIME}
              </div>
              <div className="flex items-center gap-2.5">
                <Icon name="pin" className="size-4 text-ink-soft" strokeWidth={2.25} />
                {workshop.location}
              </div>
            </dl>
            <div className="mt-5 flex items-baseline justify-between border-t-2 border-ink/15 pt-4">
              <span className="text-sm font-bold text-ink-soft">Total</span>
              <span className="font-display text-2xl font-bold tracking-tight text-ink">
                {price}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </Container>
  );
}
