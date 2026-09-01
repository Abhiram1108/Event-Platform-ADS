import { redirect } from "next/navigation";

import { RegistrationCard } from "@/components/registration/RegistrationCard";
import { SuccessReveal } from "@/components/success/SuccessReveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconTile } from "@/components/ui/IconTile";
import { requireUser } from "@/lib/permissions";
import { getMyRegistration } from "@/lib/registration";
import { formatRegistrationRef, formatWorkshopDate } from "@/lib/workshop";

const ORG = "Alexa Developers SRM";
const EVENT_TIME = "10:00 AM – 1:00 PM";

/**
 * Reaching this page is NOT proof of payment. Status is read from the
 * database, which is only updated by the verified Stripe webhook.
 */
export default async function SuccessPage() {
  const user = await requireUser();
  const { registration } = await getMyRegistration(user.id);

  if (!registration) {
    redirect("/register");
  }

  const paid =
    registration.status === "PAID" || registration.payment?.status === "PAID";
  const w = registration.workshop;

  if (!paid) {
    return (
      <Container className="py-[var(--section-y)]">
        <div className="mx-auto max-w-lg text-center">
          <div className="flex justify-center">
            <IconTile icon="clock" tone="coral" size="lg" />
          </div>
          <h1 className="h-section mt-5">Payment received</h1>
          <p className="lede mt-3">
            We&rsquo;re confirming your payment with Stripe. This page shows your
            real status from our records — refresh in a moment.
          </p>
          <div className="mt-8">
            <ButtonLink href="/dashboard" variant="sky">
              Go to my dashboard
            </ButtonLink>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-[var(--section-y)]">
      <SuccessReveal>
        <div className="text-center">
          <div className="flex justify-center">
            <IconTile icon="check" tone="green" size="lg" />
          </div>
          <h1 className="h-section mt-5">You&rsquo;re in!</h1>
          <p className="lede mx-auto mt-3 max-w-md">
            Your seat is confirmed. We&rsquo;ve emailed a copy to{" "}
            {registration.email}.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <RegistrationCard
            org={ORG}
            workshopTitle={w.title}
            reference={formatRegistrationRef(registration.id)}
            rows={[
              { icon: "calendar", label: "Date", value: formatWorkshopDate(w.date) },
              { icon: "clock", label: "Time", value: EVENT_TIME },
              { icon: "pin", label: "Where", value: w.location },
            ]}
            registrationStatus={registration.status}
            paymentStatus={registration.payment?.status ?? undefined}
          />
        </div>

        <div className="mt-10 flex justify-center">
          <ButtonLink href="/dashboard" variant="green">
            Go to my dashboard
          </ButtonLink>
        </div>
      </SuccessReveal>
    </Container>
  );
}
