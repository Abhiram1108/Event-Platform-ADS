import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getAppUrl, getStripe } from "@/lib/stripe";
import { getCurrentWorkshop } from "@/lib/workshop";

/**
 * POST /api/checkout
 * Creates a Stripe Checkout Session (test mode) for the signed-in user's
 * registration. The amount and currency are read from the Workshop row on
 * the server — the request body carries no price and no workshop choice.
 * The registration id is attached as Stripe metadata so the webhook can
 * reconcile the payment.
 */
export async function POST() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to check out." },
      { status: 401 },
    );
  }

  const workshop = await getCurrentWorkshop();
  if (!workshop) {
    return NextResponse.json(
      { error: "Checkout is not available yet." },
      { status: 503 },
    );
  }

  const registration = await prisma.registration.findUnique({
    where: { userId_workshopId: { userId: user.id, workshopId: workshop.id } },
    include: { payment: true },
  });

  if (!registration || registration.status === "CANCELLED") {
    return NextResponse.json(
      { error: "Register for the workshop before checking out.", code: "NO_REGISTRATION" },
      { status: 409 },
    );
  }

  if (registration.status === "PAID" || registration.payment?.status === "PAID") {
    return NextResponse.json(
      { error: "This registration is already paid.", code: "ALREADY_PAID" },
      { status: 409 },
    );
  }

  const appUrl = getAppUrl();
  const stripe = getStripe();

  // Ensure a PENDING Payment row exists, with the server-controlled amount.
  const payment = registration.payment
    ? await prisma.payment.update({
        where: { id: registration.payment.id },
        data: {
          amountMinor: workshop.priceMinor,
          currency: workshop.currency,
          status: "PENDING",
        },
      })
    : await prisma.payment.create({
        data: {
          registrationId: registration.id,
          amountMinor: workshop.priceMinor,
          currency: workshop.currency,
          status: "PENDING",
        },
      });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: registration.email,
      client_reference_id: registration.id,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: workshop.currency,
            unit_amount: workshop.priceMinor,
            product_data: {
              name: workshop.title,
              description: `${workshop.date.toISOString().slice(0, 10)} · ${workshop.location}`,
            },
          },
        },
      ],
      metadata: {
        registrationId: registration.id,
        workshopId: workshop.id,
        paymentId: payment.id,
      },
      payment_intent_data: {
        metadata: { registrationId: registration.id, paymentId: payment.id },
      },
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout?canceled=1`,
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : (session.payment_intent?.id ?? null),
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.error("[checkout] Stripe session creation failed:", error);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 502 },
    );
  }
}
