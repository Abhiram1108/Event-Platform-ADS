# Build With AI — Workshop Registration

A workshop registration platform for **Alexa Developers SRM**. Attendees sign in
with Google or GitHub, register for the *Build With AI* workshop, pay through
Stripe, and get a confirmation email. Organisers get an admin view of everyone
who has registered.

Built with Next.js (App Router), PostgreSQL, and Stripe Checkout in test mode.

**Live:** https://event-platform-ads.vercel.app

## What it does

- Google / GitHub sign-in (Auth.js, database sessions)
- One paid registration per user, with server-side validation
- Stripe Checkout — the amount is read from the database, never the client
- Payment is confirmed only by a signature-verified Stripe webhook
- Confirmation email after payment (Resend), sent once even on webhook retries
- User dashboard: registration status, payment status, reference, event details
- Admin dashboard + registration table, protected server-side (non-admins get 404)

## Tech stack

| | |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL (Neon), Prisma ORM |
| Auth | Auth.js v5 — Google + GitHub OAuth |
| Payments | Stripe Checkout (test mode) + webhooks |
| Email | Resend |
| Hosting | Vercel |

## Getting started

Requires Node 20+ and a PostgreSQL database (a free Neon project works).

```bash
git clone <repo-url>
cd Event-Platform
npm install

cp .env.example .env      # then fill in the values (see below)

npm run db:deploy         # apply the migration
npm run db:seed           # create the workshop row

npm run dev               # http://localhost:3000
```

For local Stripe webhooks, forward events while `npm run dev` is running:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Use the `whsec_…` it prints as `STRIPE_WEBHOOK_SECRET`.

## Environment variables

All are listed with notes in `.env.example`. Summary:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Pooled Postgres connection (app runtime) |
| `DIRECT_URL` | Direct Postgres connection (Prisma migrations) |
| `AUTH_SECRET` | Auth.js session secret — `npx auth secret` |
| `AUTH_URL` | App URL (`http://localhost:3000` locally) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_…`) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (`whsec_…`) |
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | Verified sender address |
| `NEXT_PUBLIC_APP_URL` | Public base URL, for Stripe redirect URLs |
| `ADMIN_EMAILS` | Comma-separated emails granted the admin role |

`.env` is git-ignored — never commit real secrets.

## Project layout

```
app/
  page.tsx              landing page
  login/ register/ checkout/ success/ dashboard/
  admin/ admin/users/   admin-only
  api/
    auth/               Auth.js handler
    registration/       create a registration
    checkout/           create a Stripe Checkout session
    stripe/webhook/     verify + process Stripe events
components/
  ui/ workshop/ navigation/ registration/ checkout/ admin/
lib/
  auth.ts permissions.ts prisma.ts stripe.ts payments.ts
  email.ts admin.ts validation.ts workshop.ts registration.ts
prisma/
  schema.prisma  seed.ts  migrations/
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:migrate` | Create + apply a migration (dev) |
| `npm run db:deploy` | Apply pending migrations |
| `npm run db:seed` | Seed the workshop |
| `npm run db:studio` | Prisma Studio |

## Deployment

Deployed on Vercel: **https://event-platform-ads.vercel.app**

To deploy your own:

1. Import the repo into Vercel.
2. Add all environment variables (Production). Set `AUTH_URL` and
   `NEXT_PUBLIC_APP_URL` to the deployed URL.
3. In the Stripe Dashboard (test mode, **not** a sandbox) add a webhook endpoint:
   `https://<your-domain>/api/stripe/webhook`, listening to
   `checkout.session.completed` and `payment_intent.succeeded`. Put its signing
   secret in `STRIPE_WEBHOOK_SECRET` and redeploy.
4. Add `https://<your-domain>/api/auth/callback/google` (and `/github`) to the
   OAuth apps' authorized redirect URIs.
5. The Stripe secret key and the webhook must belong to the **same** Stripe
   environment.

## Notes

- Reaching `/success` is never treated as proof of payment — status always comes
  from the database, updated only by the verified webhook.
- Workshop details (title, date, price, capacity) live in the database and are
  set by `prisma/seed.ts`.

