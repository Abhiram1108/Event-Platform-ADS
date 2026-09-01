import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { getSessionUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { registrationSchema } from "@/lib/validation";
import { getCurrentWorkshop } from "@/lib/workshop";

/**
 * POST /api/registration
 * Creates (or re-opens) the current user's PENDING registration for the
 * workshop. Auth is required. The workshop — and therefore its price — is
 * resolved on the server; the client cannot choose a workshop or an amount.
 */
export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to register." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    const { fieldErrors, formErrors } = z.flattenError(parsed.error);
    return NextResponse.json(
      {
        error: formErrors[0] ?? "Please correct the highlighted fields.",
        fields: fieldErrors,
      },
      { status: 422 },
    );
  }

  const workshop = await getCurrentWorkshop();
  if (!workshop) {
    return NextResponse.json(
      { error: "Registration is not open yet." },
      { status: 503 },
    );
  }

  const { fullName, email, phone, organization } = parsed.data;

  // Best-effort sold-out guard. The seat count is measured against paid
  // registrations; the unique constraint below is the hard integrity check.
  const paidCount = await prisma.registration.count({
    where: { workshopId: workshop.id, status: "PAID" },
  });
  if (paidCount >= workshop.capacity) {
    return NextResponse.json({ error: "This workshop is sold out." }, { status: 409 });
  }

  const existing = await prisma.registration.findUnique({
    where: { userId_workshopId: { userId: user.id, workshopId: workshop.id } },
  });

  if (existing && existing.status !== "CANCELLED") {
    return NextResponse.json(
      {
        error: "You're already registered for this workshop.",
        registrationId: existing.id,
        code: "ALREADY_REGISTERED",
      },
      { status: 409 },
    );
  }

  try {
    const registration = existing
      ? await prisma.registration.update({
          where: { id: existing.id },
          data: { fullName, email, phone, organization, status: "PENDING" },
        })
      : await prisma.registration.create({
          data: {
            userId: user.id,
            workshopId: workshop.id,
            fullName,
            email,
            phone,
            organization,
            status: "PENDING",
          },
        });

    return NextResponse.json({ registrationId: registration.id }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const current = await prisma.registration.findUnique({
        where: { userId_workshopId: { userId: user.id, workshopId: workshop.id } },
      });
      return NextResponse.json(
        {
          error: "You're already registered for this workshop.",
          registrationId: current?.id,
          code: "ALREADY_REGISTERED",
        },
        { status: 409 },
      );
    }

    console.error("[registration] create failed:", error);
    return NextResponse.json(
      { error: "Something went wrong creating your registration." },
      { status: 500 },
    );
  }
}
