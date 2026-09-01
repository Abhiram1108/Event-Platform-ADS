import { prisma } from "@/lib/prisma";
import { getCurrentWorkshop } from "@/lib/workshop";

/**
 * The signed-in user's registration for the current workshop, with its
 * payment and workshop included. Used by the checkout, success, and
 * dashboard pages so they share one query and one shape.
 */
export async function getMyRegistration(userId: string) {
  const workshop = await getCurrentWorkshop();
  if (!workshop) {
    return { workshop: null, registration: null };
  }

  const registration = await prisma.registration.findUnique({
    where: { userId_workshopId: { userId, workshopId: workshop.id } },
    include: { payment: true, workshop: true },
  });

  return { workshop, registration };
}
