import { Resend } from "resend";

import { prisma } from "@/lib/prisma";
import { formatRegistrationRef } from "@/lib/workshop";

let client: Resend | null = null;

function getResend(): Resend {
  if (client) return client;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set.");
  client = new Resend(apiKey);
  return client;
}

function fromAddress(): string {
  return process.env.EMAIL_FROM ?? "Alexa Developers SRM <onboarding@resend.dev>";
}

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

type SendResult = { sent: boolean; reason?: string };

/**
 * Send the confirmation email for a registration, exactly once.
 *
 * Only sends when the payment is verified PAID. Idempotency is enforced in
 * the database: the row is claimed by setting `confirmationEmailSentAt` in a
 * conditional update before the email goes out, and the claim is released if
 * the send fails so a later retry (e.g. a Stripe webhook redelivery) can try
 * again.
 */
export async function sendConfirmationEmail(
  registrationId: string,
): Promise<SendResult> {
  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: { workshop: true, payment: true, user: true },
  });

  if (!registration || !registration.payment) {
    return { sent: false, reason: "registration-or-payment-missing" };
  }
  if (registration.payment.status !== "PAID") {
    return { sent: false, reason: "payment-not-paid" };
  }

  // Atomically claim the send. count === 0 means it is already claimed/sent.
  const claim = await prisma.payment.updateMany({
    where: {
      id: registration.payment.id,
      status: "PAID",
      confirmationEmailSentAt: null,
    },
    data: { confirmationEmailSentAt: new Date() },
  });
  if (claim.count === 0) {
    return { sent: false, reason: "already-sent" };
  }

  const ref = formatRegistrationRef(registration.id);
  const dateText = DATE_FORMAT.format(registration.workshop.date);
  const recipientName = registration.fullName || registration.user.name || "there";

  try {
    const { error } = await getResend().emails.send({
      from: fromAddress(),
      to: registration.email,
      subject: "Your place at Build With AI is confirmed",
      text: buildText({
        name: recipientName,
        workshop: registration.workshop.title,
        date: dateText,
        location: registration.workshop.location,
        ref,
      }),
      html: buildHtml({
        name: recipientName,
        workshop: registration.workshop.title,
        date: dateText,
        location: registration.workshop.location,
        ref,
      }),
    });

    if (error) {
      throw new Error(`Resend error: ${error.name} — ${error.message}`);
    }

    return { sent: true };
  } catch (error) {
    // Release the claim so the send can be retried.
    await prisma.payment.updateMany({
      where: { id: registration.payment.id },
      data: { confirmationEmailSentAt: null },
    });
    console.error("[email] confirmation send failed:", error);
    throw error;
  }
}

type EmailFields = {
  name: string;
  workshop: string;
  date: string;
  location: string;
  ref: string;
};

function buildText(f: EmailFields): string {
  return [
    "ALEXA DEVELOPERS SRM",
    "",
    "REGISTRATION CONFIRMED",
    "",
    `Hi ${f.name},`,
    "",
    "Your place at Build With AI is confirmed.",
    "",
    `WORKSHOP     ${f.workshop}`,
    `DATE         ${f.date}`,
    `LOCATION     ${f.location}`,
    `REGISTRATION ${f.ref}`,
    "PAYMENT      Paid",
    "",
    "See you there.",
  ].join("\n");
}

function buildHtml(f: EmailFields): string {
  const sans =
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 0;font:12px/1.4 ${sans};letter-spacing:0.06em;color:#7a879e;text-transform:uppercase;width:130px;vertical-align:top;">${label}</td>
      <td style="padding:10px 0;font:16px/1.5 ${sans};color:#0e1526;">${value}</td>
    </tr>`;

  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#f6f8fc;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #e4e9f2;border-radius:12px;">
          <tr>
            <td style="padding:32px 32px 0;font:13px/1 ${sans};font-weight:600;letter-spacing:0.12em;color:#0b6fe0;text-transform:uppercase;">Alexa Developers SRM</td>
          </tr>
          <tr>
            <td style="padding:16px 32px 0;font:700 26px/1.2 ${sans};color:#0e1526;">Registration confirmed</td>
          </tr>
          <tr>
            <td style="padding:12px 32px 0;">
              <div style="height:3px;width:44px;background:#0b6fe0;border-radius:999px;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 0;font:16px/1.6 ${sans};color:#4a5771;">
              Hi ${f.name},<br /><br />
              Your place at Build With AI is confirmed. Keep this email for your records.
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e4e9f2;">
                ${row("Workshop", f.workshop)}
                ${row("Date", f.date)}
                ${row("Location", f.location)}
                ${row("Registration", f.ref)}
                ${row("Payment", "Paid")}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 36px;font:14px/1.6 ${sans};color:#7a879e;">
              See you there.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
