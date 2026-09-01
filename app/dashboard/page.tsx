import { RegistrationCard } from "@/components/registration/RegistrationCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Pill } from "@/components/ui/Pill";
import { requireUser } from "@/lib/permissions";
import { getMyRegistration } from "@/lib/registration";
import { formatRegistrationRef, formatWorkshopDate } from "@/lib/workshop";

const ORG = "Alexa Developers SRM";
const EVENT_TIME = "10:00 AM – 1:00 PM";

export default async function DashboardPage() {
  const user = await requireUser();
  const { workshop, registration } = await getMyRegistration(user.id);
  const hasRegistration = registration && registration.status !== "CANCELLED";
  const firstName = user.name?.split(" ")[0];

  return (
    <Container className="py-[var(--section-y)]">
      <div className="max-w-3xl">
        <Pill tone="green">Your dashboard</Pill>
        <h1 className="h-section mt-4">
          {firstName ? `Hi ${firstName}` : "Welcome"}
        </h1>
        <p className="lede mt-3">
          {hasRegistration
            ? "Here's your registration for the workshop."
            : "You haven't reserved a seat yet."}
        </p>
      </div>

      <div className="mt-10">
        {!hasRegistration ? (
          <RegistrationCard
            org={ORG}
            placeholder
            workshopTitle={workshop?.title ?? ""}
            reference=""
            rows={[]}
          >
            <p className="mt-1 text-sm text-ink-soft">
              Reserve your seat for {workshop?.title ?? "the workshop"}.
            </p>
            <div className="mt-4">
              <ButtonLink href="/register">Reserve a seat</ButtonLink>
            </div>
          </RegistrationCard>
        ) : (
          <RegistrationCard
            org={ORG}
            workshopTitle={registration.workshop.title}
            reference={formatRegistrationRef(registration.id)}
            rows={[
              {
                icon: "calendar",
                label: "Date",
                value: formatWorkshopDate(registration.workshop.date),
              },
              { icon: "clock", label: "Time", value: EVENT_TIME },
              {
                icon: "pin",
                label: "Where",
                value: registration.workshop.location,
              },
            ]}
            registrationStatus={registration.status}
            paymentStatus={registration.payment?.status ?? undefined}
          >
            {registration.status === "PENDING" && (
              <div className="border-t-2 border-ink bg-coral-soft p-6">
                <p className="text-sm font-semibold text-ink">
                  Your seat is held but payment isn&rsquo;t complete yet.
                </p>
                <div className="mt-4">
                  <ButtonLink href="/checkout">Complete payment</ButtonLink>
                </div>
              </div>
            )}
          </RegistrationCard>
        )}
      </div>
    </Container>
  );
}
