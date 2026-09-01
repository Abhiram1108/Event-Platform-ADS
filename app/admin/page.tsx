import { AdminSummary } from "@/components/admin/AdminSummary";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Pill } from "@/components/ui/Pill";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAdminOverview, listRegistrations } from "@/lib/admin";
import { formatPrice, getCurrentWorkshop } from "@/lib/workshop";

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
});

export default async function AdminPage() {
  // getAdminOverview() / listRegistrations() call requireAdmin():
  // a signed-in non-admin gets a 404 here; anonymous is sent to /login.
  const [overview, recent, workshop] = await Promise.all([
    getAdminOverview(),
    listRegistrations(),
    getCurrentWorkshop(),
  ]);

  const revenue = workshop
    ? formatPrice(overview.paid * workshop.priceMinor, workshop.currency)
    : "—";
  const rows = recent.slice(0, 8);

  return (
    <Container className="py-[var(--section-y)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Pill tone="green">Event management</Pill>
          <h1 className="h-section mt-4">Registrations</h1>
        </div>
        <ButtonLink href="/admin/users" variant="sky" size="sm">
          View all
        </ButtonLink>
      </div>

      <div className="mt-8">
        <AdminSummary
          filled={overview.paid}
          capacity={overview.capacity}
          stats={[
            { label: "Pending", value: String(overview.pending), icon: "clock", tone: "coral" },
            { label: "Cancelled", value: String(overview.cancelled), icon: "tag", tone: "lavender" },
            { label: "Revenue", value: revenue, icon: "check", tone: "green" },
          ]}
        />
      </div>

      <h2 className="mt-12 font-display text-lg font-bold tracking-tight text-ink">
        Recent registrations
      </h2>
      <div className="mt-4 overflow-x-auto panel p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-ink bg-cream text-left">
              <th className="px-4 py-3 font-display font-bold text-ink">Name</th>
              <th className="px-4 py-3 font-display font-bold text-ink">Email</th>
              <th className="px-4 py-3 font-display font-bold text-ink">Reference</th>
              <th className="px-4 py-3 font-display font-bold text-ink">Payment</th>
              <th className="px-4 py-3 font-display font-bold text-ink">Placed</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-b-2 border-ink/10 last:border-0 hover:bg-cream"
              >
                <td className="px-4 py-3 font-semibold text-ink">{r.fullName}</td>
                <td className="px-4 py-3 text-ink-soft">{r.email}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-soft">
                  {r.ref}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.paymentStatus} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-soft">
                  {DATE_FMT.format(new Date(r.createdAt))}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-faint">
                  No registrations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
