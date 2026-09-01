import Stripe from "stripe";

/**
 * Lazily-constructed Stripe client. Constructed on first use so a missing key
 * fails a request cleanly rather than crashing the build. Use test-mode keys
 * only (sk_test_...); nothing here is ever sent to the browser.
 */
let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (client) return client;

  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY is not set.");
  }

  client = new Stripe(apiKey, {
    typescript: true,
    appInfo: { name: "Alexa Developers SRM Event Platform" },
  });
  return client;
}

/** Canonical public base URL, used for Stripe success/cancel redirects. */
export function getAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? process.env.AUTH_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_APP_URL is not set.");
  }
  return url.replace(/\/$/, "");
}
