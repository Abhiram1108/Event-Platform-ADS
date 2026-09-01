"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { registrationSchema } from "@/lib/validation";

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
};
type FieldErrors = Partial<Record<keyof FormValues, string[]>>;

export function RegistrationForm({
  defaultValues,
}: {
  defaultValues: { fullName: string; email: string };
}) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({
    fullName: defaultValues.fullName,
    email: defaultValues.email,
    phone: "",
    organization: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const summaryRef = useRef<HTMLParagraphElement>(null);

  function update(key: keyof FormValues, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function focusSummary() {
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  async function submit() {
    if (pending) return;
    setFormError(null);

    const parsed = registrationSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(z.flattenError(parsed.error).fieldErrors as FieldErrors);
      setFormError("Please fix the highlighted fields and try again.");
      focusSummary();
      return;
    }
    setFieldErrors({});
    setPending(true);

    try {
      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json().catch(() => ({}));

      const canProceed =
        res.status === 201 ||
        (res.status === 409 && data.code === "ALREADY_REGISTERED");

      if (canProceed) {
        const checkout = await fetch("/api/checkout", { method: "POST" });
        const cdata = await checkout.json().catch(() => ({}));
        if (checkout.ok && cdata.url) {
          window.location.href = cdata.url;
          return;
        }
        if (cdata.code === "ALREADY_PAID") {
          router.push("/dashboard");
          return;
        }
        setFormError(cdata.error ?? "Could not start checkout.");
        setPending(false);
        return;
      }

      if (res.status === 422 && data.fields) {
        setFieldErrors(data.fields as FieldErrors);
        setFormError(data.error ?? "Please fix the highlighted fields.");
        setPending(false);
        focusSummary();
        return;
      }

      setFormError(data.error ?? "Something went wrong. Please try again.");
      setPending(false);
    } catch {
      setFormError("Network error. Please try again.");
      setPending(false);
    }
  }

  function onFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    void submit();
  }

  return (
    <form onSubmit={onFormSubmit} noValidate className="flex flex-col gap-4">
      {formError && (
        <p
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="border-2 border-ink bg-danger-soft px-3 py-2.5 text-sm font-semibold text-danger outline-none"
          style={{ borderRadius: "12px" }}
        >
          {formError}
        </p>
      )}

      <Field
        label="Full name"
        name="fullName"
        autoComplete="name"
        value={values.fullName}
        errors={fieldErrors.fullName}
        onChange={(e) => update("fullName", e.target.value)}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        value={values.email}
        errors={fieldErrors.email}
        onChange={(e) => update("email", e.target.value)}
      />
      <Field
        label="Phone"
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={values.phone}
        errors={fieldErrors.phone}
        onChange={(e) => update("phone", e.target.value)}
      />
      <Field
        label="Organization or institution"
        name="organization"
        autoComplete="organization"
        value={values.organization}
        errors={fieldErrors.organization}
        onChange={(e) => update("organization", e.target.value)}
      />

      <Button
        type="button"
        onClick={() => void submit()}
        loading={pending}
        size="lg"
        variant="green"
        className="mt-2 w-full"
      >
        {pending ? "Taking you to payment…" : "Continue to payment"}
      </Button>
      <p className="text-center text-xs text-ink-faint">
        Secure payment by Stripe. One registration per person.
      </p>
    </form>
  );
}
