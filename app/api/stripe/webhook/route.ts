import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { sendConfirmationEmail } from "@/lib/email";
import {
  markPaymentFailed,
  markPaymentRefunded,
  markRegistrationPaid,
} from "@/lib/payments";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
// Stripe must receive a fast 2xx; never statically optimize this route.
export const dynamic = "force-dynamic";

function registrationIdFrom(
  metadata: Stripe.Metadata | null | undefined,
): string | null {
  const id = metadata?.registrationId;
  return typeof id === "string" && id.length > 0 ? id : null;
}

/**
 * POST /api/stripe/webhook
 *
 * The only trusted signal that a payment succeeded. Verifies the Stripe
 * signature against the raw body, then applies idempotent state changes.
 * `/success` is never treated as proof of payment.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET is not set.");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (error) {
    console.error("[webhook] signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        // For card payments this is "paid"; async methods may be "unpaid"
        // here and settle later via payment_intent.succeeded.
        if (session.payment_status !== "paid") break;

        const registrationId =
          registrationIdFrom(session.metadata) ??
          (typeof session.client_reference_id === "string"
            ? session.client_reference_id
            : null);
        if (!registrationId) break;

        await markRegistrationPaid({
          registrationId,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : (session.payment_intent?.id ?? null),
          amountMinor: session.amount_total,
          currency: session.currency,
        });

        // Idempotent: sends once, retries here on a redelivery if it failed.
        await sendConfirmationEmail(registrationId);
        break;
      }

      case "payment_intent.succeeded": {
        const intent = event.data.object;
        const registrationId = registrationIdFrom(intent.metadata);
        if (!registrationId) break;

        await markRegistrationPaid({
          registrationId,
          stripePaymentIntentId: intent.id,
          amountMinor: intent.amount_received,
          currency: intent.currency,
        });

        // Idempotent: sends once, retries here on a redelivery if it failed.
        await sendConfirmationEmail(registrationId);
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object;
        const registrationId = registrationIdFrom(intent.metadata);
        if (registrationId) await markPaymentFailed(registrationId);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        const registrationId = registrationIdFrom(charge.metadata);
        if (registrationId) await markPaymentRefunded(registrationId);
        break;
      }

      default:
        // Unhandled event types are acknowledged so Stripe stops retrying.
        break;
    }
  } catch (error) {
    // A processing failure (e.g. DB unavailable) — return 500 so Stripe
    // retries the delivery later.
    console.error(`[webhook] failed handling ${event.type}:`, error);
    return NextResponse.json({ error: "Processing error." }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
