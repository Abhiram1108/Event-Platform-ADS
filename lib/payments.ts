import { prisma } from "@/lib/prisma";

type MarkPaidInput = {
  registrationId: string;
  stripePaymentIntentId?: string | null;
  stripeCheckoutSessionId?: string | null;
  amountMinor?: number | null;
  currency?: string | null;
};

type MarkPaidResult = {
  /** True only on the call that actually flipped the state to PAID. */
  firstTransition: boolean;
  paymentId: string | null;
};

/**
 * Idempotently mark a registration and its payment as PAID.
 *
 * Safe to call repeatedly: Stripe delivers `checkout.session.completed` and
 * `payment_intent.succeeded` for the same purchase and retries on non-2xx.
 * Only the first call that observes a non-PAID payment returns
 * `firstTransition: true`; callers use that to fire side effects (email) once.
 */
export async function markRegistrationPaid(
  input: MarkPaidInput,
): Promise<MarkPaidResult> {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { registrationId: input.registrationId },
    });

    // The Payment row is created during checkout. If it is missing, this
    // event does not correspond to a checkout we started.
    if (!payment) {
      return { firstTransition: false, paymentId: null };
    }

    if (
      input.amountMinor != null &&
      input.amountMinor !== payment.amountMinor
    ) {
      console.error(
        `[payments] amount mismatch for registration ${input.registrationId}: ` +
          `expected ${payment.amountMinor}, Stripe reported ${input.amountMinor}`,
      );
    }

    const alreadyPaid = payment.status === "PAID";

    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        stripePaymentIntentId:
          input.stripePaymentIntentId ?? payment.stripePaymentIntentId,
        stripeCheckoutSessionId:
          input.stripeCheckoutSessionId ?? payment.stripeCheckoutSessionId,
      },
    });

    await tx.registration.update({
      where: { id: input.registrationId },
      data: { status: "PAID" },
    });

    return { firstTransition: !alreadyPaid, paymentId: payment.id };
  });
}

/** Idempotently mark a payment FAILED (only while still PENDING). */
export async function markPaymentFailed(
  registrationId: string,
): Promise<void> {
  await prisma.payment.updateMany({
    where: { registrationId, status: "PENDING" },
    data: { status: "FAILED" },
  });
}

/** Idempotently mark a payment REFUNDED. */
export async function markPaymentRefunded(
  registrationId: string,
): Promise<void> {
  await prisma.payment.updateMany({
    where: { registrationId, status: { not: "REFUNDED" } },
    data: { status: "REFUNDED" },
  });
}
