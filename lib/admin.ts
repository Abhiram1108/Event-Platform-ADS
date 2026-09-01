import type { RegistrationStatus } from "@prisma/client";

import { requireAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { formatRegistrationRef, getCurrentWorkshop } from "@/lib/workshop";

/**
 * Admin data-access layer. Every exported function calls requireAdmin() first,
 * so authorization holds no matter which page, action, or route calls it.
 * A signed-in non-admin gets a 404; an anonymous visitor is sent to /login.
 */

export type AdminOverview = {
  total: number;
  paid: number;
  pending: number;
  cancelled: number;
  capacity: number | null;
  seatsLeft: number | null;
};

export async function getAdminOverview(): Promise<AdminOverview> {
  await requireAdmin();

  const workshop = await getCurrentWorkshop();
  const where = workshop ? { workshopId: workshop.id } : {};

  const [total, paid, pending, cancelled] = await Promise.all([
    prisma.registration.count({ where }),
    prisma.registration.count({ where: { ...where, status: "PAID" } }),
    prisma.registration.count({ where: { ...where, status: "PENDING" } }),
    prisma.registration.count({ where: { ...where, status: "CANCELLED" } }),
  ]);

  return {
    total,
    paid,
    pending,
    cancelled,
    capacity: workshop?.capacity ?? null,
    seatsLeft: workshop ? Math.max(workshop.capacity - paid, 0) : null,
  };
}

export type AdminRegistrationRow = {
  id: string;
  ref: string;
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  status: RegistrationStatus;
  paymentStatus: string | null;
  amountMinor: number | null;
  currency: string | null;
  createdAt: string;
};

export async function listRegistrations(params?: {
  q?: string;
  status?: RegistrationStatus | "ALL";
}): Promise<AdminRegistrationRow[]> {
  await requireAdmin();

  const q = params?.q?.trim();
  const status =
    params?.status && params.status !== "ALL" ? params.status : undefined;

  const rows = await prisma.registration.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { fullName: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { organization: { contains: q, mode: "insensitive" } },
              { id: { contains: q.toLowerCase() } },
            ],
          }
        : {}),
    },
    include: { payment: true },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return rows.map((r) => ({
    id: r.id,
    ref: formatRegistrationRef(r.id),
    fullName: r.fullName,
    email: r.email,
    phone: r.phone,
    organization: r.organization,
    status: r.status,
    paymentStatus: r.payment?.status ?? null,
    amountMinor: r.payment?.amountMinor ?? null,
    currency: r.payment?.currency ?? null,
    createdAt: r.createdAt.toISOString(),
  }));
}
