import type { RegistrationStatus } from "@prisma/client";

import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Pill } from "@/components/ui/Pill";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { listRegistrations } from "@/lib/admin";

const STATUS_OPTIONS = ["ALL", "PENDING", "PAID", "CANCELLED"] as const;
type StatusOption = (typeof STATUS_OPTIONS)[number];

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function parseStatus(value: string | undefined): StatusOption {
  return STATUS_OPTIONS.includes(value as StatusOption)
    ? (value as StatusOption)
    : "ALL";
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const statusOption = parseStatus(status);

  // listRegistrations() calls requireAdmin(): non-admins get a 404 here.
  const rows = await listRegistrations({
    q,
    status:
      statusOption === "ALL" ? "ALL" : (statusOption as RegistrationStatus),
  });

  return (
    <Container className="py-[var(--section-y)]">
      <Pill tone="green">Event management</Pill>
      <h1 className="h-section mt-4">All registrations</h1>

      <form method="get" className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Icon
            name="message"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
            strokeWidth={2.25}
          />
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search name, email, organization"
            aria-label="Search registrations"
            className="field-input w-72 pl-9"
          />
        </div>
        <input type="hidden" name="status" value={statusOption} />
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => {
            const active = opt === statusOption;
            return (
              <button
                key={opt}
                type="submit"
                name="status"
                value={opt}
                aria-pressed={active}
                className={
                  "border-2 border-ink px-3 py-1.5 text-xs font-bold transition-transform active:translate-y-0.5 " +
                  (active ? "bg-green text-white" : "bg-surface text-ink hover:bg-cream")
                }
                style={{ borderRadius: "999px" }}
              >
                {opt.charAt(0) + opt.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>
      </form>

      <p className="mt-6 text-sm font-semibold text-ink-soft">
        {rows.length} {rows.length === 1 ? "registration" : "registrations"}
      </p>

      <div className="mt-3 overflow-x-auto panel p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-ink bg-cream text-left">
              <th className="sticky left-0 bg-cream px-4 py-3 font-display font-bold text-ink">
                Name
              </th>
              <th className="px-4 py-3 font-display font-bold text-ink">Email</th>
              <th className="px-4 py-3 font-display font-bold text-ink">Reference</th>
              <th className="px-4 py-3 font-display font-bold text-ink">Registration</th>
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
                <td className="sticky left-0 bg-surface px-4 py-3 font-semibold text-ink">
                  {r.fullName}
                </td>
                <td className="px-4 py-3 text-ink-soft">{r.email}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-soft">
                  {r.ref}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
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
                <td colSpan={6} className="px-4 py-10 text-center text-ink-faint">
                  No registrations match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
