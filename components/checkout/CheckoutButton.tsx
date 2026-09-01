"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

export function CheckoutButton({ amountLabel }: { amountLabel: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.code === "ALREADY_PAID") {
        window.location.href = "/dashboard";
        return;
      }
      setError(data.error ?? "Could not start checkout. Please try again.");
      setPending(false);
    } catch {
      setError("Network error. Please try again.");
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        onClick={() => void start()}
        loading={pending}
        size="lg"
        variant="green"
        className="w-full"
      >
        {pending ? "Redirecting to Stripe…" : `Pay ${amountLabel}`}
      </Button>
      {error && (
        <p role="alert" className="text-sm font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
