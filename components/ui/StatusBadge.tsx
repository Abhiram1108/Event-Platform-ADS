import { Icon, type IconName } from "@/components/ui/Icon";

type Meta = { tone: string; label: string; icon: IconName };

const MAP: Record<string, Meta> = {
  PAID: { tone: "bg-green-soft text-green-ink", label: "Paid", icon: "check" },
  PENDING: { tone: "bg-coral-soft text-ink", label: "Pending", icon: "clock" },
  FAILED: { tone: "bg-danger-soft text-danger", label: "Failed", icon: "plug" },
  CANCELLED: { tone: "bg-cream text-ink-soft", label: "Cancelled", icon: "tag" },
  REFUNDED: { tone: "bg-cream text-ink-soft", label: "Refunded", icon: "tag" },
};

export function StatusBadge({
  status,
  prefix,
}: {
  status?: string | null;
  prefix?: string;
}) {
  const key = String(status ?? "").toUpperCase();
  const meta: Meta = MAP[key] ?? {
    tone: "bg-cream text-ink-soft",
    label: status ? String(status) : "—",
    icon: "tag",
  };

  return (
    <span
      className={`pill ${meta.tone}`}
      role={prefix ? undefined : "status"}
    >
      <Icon name={meta.icon} className="size-3.5" strokeWidth={2.5} />
      {prefix ? `${prefix}: ${meta.label}` : meta.label}
    </span>
  );
}
