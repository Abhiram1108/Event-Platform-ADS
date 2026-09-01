import { redirect } from "next/navigation";

import { CheckoutButton } from "@/components/checkout/CheckoutButton";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Pill } from "@/components/ui/Pill";
import { requireUser } from "@/lib/permissions";
import { getMyRegistration } from "@/lib/registration";
import { formatPrice, formatWorkshopDate } from "@/lib/workshop";

const EVENT_TIME = "10:00 AM – 1:00 PM";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const { canceled } = await searchParams;
  const user = await requireUser();
  const { workshop, registration } = await getMyRegistration(user.id);

  if (!workshop) {
    return (
      <Container className="py-[var(--section-y)]">
        <p className="lede">Checkout isn&rsquo;t available yet.</p>
      </Container>
    );
  }
  if (!registration || registration.status === "CANCELLED") {
    redirect("/register");
  }
  if (registration.status === "PAID" || registration.payment?.status === "PAID") {
    redirect("/dashboard");
  }

  const price = formatPrice(workshop.priceMinor, workshop.currency);

  return (
    <Container className="py-[var(--section-y)]">
      <div className="mx-auto max-w-lg">
        <Pill tone="green">Step 2 of 2</Pill>
        <h1 className="h-section mt-4">Confirm and pay</h1>

        {canceled && (
          <p
            role="status"
            className="mt-6 border-2 border-ink bg-coral-soft px-4 py-3 text-sm font-semibold text-ink"
            style={{ borderRadius: "12px" }}
          >
            Payment wasn&rsquo;t completed. Your seat is still held — pay whenever
            you&rsquo;re ready.
          </p>
        )}

        <Card className="mt-8 overflow-hidden">
          <div className="border-b-2 border-ink bg-cream p-6">
            <h2 className="font-display text-lg font-bold tracking-tight text-ink">
              {workshop.title}
            </h2>
            <dl className="mt-3 space-y-2 text-sm text-ink-soft">
              <div className="flex items-center gap-2.5">
                <Icon name="calendar" className="size-4" strokeWidth={2.25} />
                {formatWorkshopDate(workshop.date)} · {EVENT_TIME}
              </div>
              <div className="flex items-center gap-2.5">
                <Icon name="pin" className="size-4" strokeWidth={2.25} />
                {workshop.location}
              </div>
            </dl>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-soft">Workshop seat</span>
              <span className="font-semibold text-ink">{price}</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between border-t-2 border-ink/15 pt-3">
              <span className="font-bold text-ink">Total</span>
              <span className="font-display text-2xl font-bold tracking-tight text-ink">
                {price}
              </span>
            </div>

            <div className="mt-6">
              <CheckoutButton amountLabel={price} />
            </div>
            <p className="mt-3 text-xs text-ink-faint">
              You&rsquo;ll be redirected to Stripe. Test mode — use card 4242 4242
              4242 4242, any future expiry, any CVC.
            </p>
          </div>
        </Card>
      </div>
    </Container>
  );
}
