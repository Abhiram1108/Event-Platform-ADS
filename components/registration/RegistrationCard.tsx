import type { ReactNode } from "react";

import { Icon, type IconName } from "@/components/ui/Icon";
import { IconTile } from "@/components/ui/IconTile";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Row = { icon: IconName; label: string; value: string };

export function RegistrationCard({
  org,
  workshopTitle,
  reference,
  rows,
  registrationStatus,
  paymentStatus,
  placeholder = false,
  children,
}: {
  org: string;
  workshopTitle: string;
  reference: string;
  rows: Row[];
  registrationStatus?: string;
  paymentStatus?: string;
  placeholder?: boolean;
  children?: ReactNode;
}) {
  if (placeholder) {
    return (
      <div
        className="w-full max-w-md border-2 border-dashed border-ink p-8 text-center"
        style={{ borderRadius: "22px" }}
      >
        <div className="flex justify-center">
          <IconTile icon="tag" tone="lavender" size="lg" />
        </div>
        <h2 className="mt-4 font-display text-lg font-bold text-ink">
          No seat reserved yet
        </h2>
        <div className="mt-4">{children}</div>
      </div>
    );
  }

  return (
    <div className="panel w-full max-w-md overflow-hidden">
      <div className="border-b-2 border-ink bg-green-soft px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-wide text-green-ink">
          {org}
        </p>
        <h2 className="mt-1 font-display text-xl font-bold tracking-tight text-ink">
          {workshopTitle}
        </h2>
        {reference && (
          <p className="mt-2 font-mono text-sm font-medium text-ink-soft">
            {reference}
          </p>
        )}
      </div>

      <div className="px-6 py-5">
        <dl className="grid gap-3">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center gap-3">
              <Icon name={r.icon} className="size-4 shrink-0 text-ink-soft" strokeWidth={2.25} />
              <dt className="w-20 shrink-0 text-xs font-bold uppercase tracking-wide text-ink-faint">
                {r.label}
              </dt>
              <dd className="text-sm font-semibold text-ink">{r.value}</dd>
            </div>
          ))}
        </dl>

        {(registrationStatus || paymentStatus) && (
          <div className="mt-5 flex flex-wrap gap-2 border-t-2 border-ink/10 pt-4">
            {registrationStatus && (
              <StatusBadge status={registrationStatus} prefix="Registration" />
            )}
            {paymentStatus && (
              <StatusBadge status={paymentStatus} prefix="Payment" />
            )}
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
