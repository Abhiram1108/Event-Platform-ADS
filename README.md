# AFTERIMAGE — Event Platform

A production-style paid workshop registration platform built with Next.js, PostgreSQL, OAuth, Stripe Checkout, and email confirmation.

The project demonstrates a complete real-world registration flow:

**OAuth login → workshop registration → Stripe payment → verified webhook → confirmation email → user dashboard**

It also includes a protected admin area for viewing registered users.

---

# 1. Project Overview

AFTERIMAGE is a paid workshop registration platform designed around a real event rather than a generic SaaS product.

The application allows users to:

- Sign in using Google or GitHub
- View workshop information
- Register for the workshop
- Pay securely using Stripe Checkout TEST MODE
- View their registration and payment status
- Receive a confirmation email after successful payment

Administrators can:

- Access a protected admin dashboard
- View registered users
- View registration information
- View payment status
- Search and filter registrations

---

# 2. Assignment Requirements

This project satisfies the following requirements.

## Required

### OAuth Authentication

Users can log in without creating a password using:

- Google
- GitHub

### Paid Registration

Users can register for a paid workshop.

### Stripe Payment

The application uses:

- Stripe Checkout
- Stripe TEST MODE
- Server-side Checkout Session creation
- Stripe webhook verification

### Backend Security

Backend/API routes are protected using server-side authentication and authorization.

### Roles

The application supports:

```text
USER
ADMIN
```

Only administrators can access the registered-user list.

### Deployment

The application is designed for deployment using:

```text
Vercel
```

---

# 3. Bonus Requirement

After successful payment, the application sends a professional confirmation email to the registered user.

Email delivery uses:

```text
Resend
```

The email is sent only after the Stripe payment has been verified through the webhook.

---

# 4. Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | Full-stack React application |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling |
| Motion | Frontend animation |
| PostgreSQL | Database |
| Prisma | Database ORM |
| Auth.js | Authentication |
| Google OAuth | Login provider |
| GitHub OAuth | Login provider |
| Stripe Checkout | Payments |
| Resend | Confirmation email |
| Vercel | Deployment |
| GitHub | Source control |

---

# 5. Design Philosophy

The application intentionally avoids the typical AI-generated SaaS aesthetic.

The visual identity is called:

# AFTERIMAGE

The design direction is inspired by:

- editorial design
- independent workshop studios
- contemporary event publications
- premium print layouts
- modern typography
- physical event materials

The interface should feel like an actual event brand rather than a software template.

---

# 6. Visual Language

## Background

Warm off-white / paper-like neutral.

## Primary Text

Near-black.

## Accent

Burnt orange / vermillion.

## Secondary Accent

Muted olive.

## Typography

Use a deliberate combination of:

- editorial serif typography for major headings
- modern sans-serif for interface elements
- monospace typography for metadata

Example:

```text
AFTERIMAGE

A WORKSHOP IN
MAKING THINGS
THAT LAST.

12 OCTOBER 2026
BENGALURU
48 SEATS
```

---

# 7. Design Rules

Avoid excessive use of:

- rounded cards
- gradient backgrounds
- purple/blue SaaS gradients
- glassmorphism
- glowing containers
- generic dashboard layouts
- stock corporate photography
- unnecessary decorative elements
- repetitive three-card sections

Prefer:

- editorial layouts
- asymmetric grids
- large typography
- thin borders
- horizontal rules
- generous whitespace
- numbered sections
- image-led layouts
- strong hierarchy
- restrained animation

Uniqueness should come from composition and typography rather than excessive visual effects.

---

# 8. Motion

The frontend uses the current Motion React package.

Install:

```bash
npm install motion
```

Example import:

```tsx
import { motion } from "motion/react";
```

Motion is used for:

- page entrance
- section reveals
- hover interactions
- navigation transitions
- image movement
- subtle scroll interactions
- staggered typography

Animations should remain restrained.

The application should never feel like every element is moving.

Reduced-motion preferences should be respected.

---

# 9. Application Architecture

High-level architecture:

```text
                         ┌───────────────┐
                         │     User      │
                         └───────┬───────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │    Next.js      │
                        │   Application   │
                        └───────┬─────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
        ┌───────────┐     ┌───────────┐     ┌───────────┐
        │  Auth.js  │     │  Prisma   │     │  Stripe   │
        │ OAuth     │     │ PostgreSQL│     │ Checkout  │
        └───────────┘     └───────────┘     └─────┬─────┘
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │ Stripe       │
                                           │ Webhook      │
                                           └──────┬──────┘
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │   Resend    │
                                           │ Confirmation│
                                           │    Email    │
                                           └─────────────┘
```

---

# 10. User Flow

The primary user journey is:

```text
Landing Page
     ↓
Login
     ↓
Google / GitHub OAuth
     ↓
Workshop Details
     ↓
Registration Form
     ↓
Registration Created
     ↓
Stripe Checkout
     ↓
Payment
     ↓
Stripe Webhook
     ↓
Payment Verified
     ↓
Registration Marked PAID
     ↓
Confirmation Email
     ↓
User Dashboard
```

---

# 11. Authentication Flow

Authentication is handled through Auth.js.

Supported providers:

```text
Google
GitHub
```

A typical login flow is:

```text
User
 ↓
Login page
 ↓
Google/GitHub
 ↓
OAuth provider
 ↓
Callback
 ↓
Authenticated session
 ↓
User application
```

Password authentication is not required.

---

# 12. User Roles

The application supports two roles:

```text
USER
ADMIN
```

New users receive:

```text
USER
```

by default.

Users cannot choose or modify their own role.

Only an authorized administrator can promote a user.

---

# 13. Authorization

Authorization must happen server-side.

The application must not depend on frontend checks such as:

```tsx
if (user.role === "ADMIN") {
  // show admin page
}
```

Hiding a button is not security.

Instead, protected server routes must verify:

1. The user is authenticated.
2. The user has the correct role.

The following areas are protected:

```text
/admin
/admin/users
admin API routes
administrative server actions
```

A regular USER accessing an admin URL directly must be denied.

---

# 14. Database

PostgreSQL is used as the primary database.

Prisma provides the database access layer.

Core models include:

```text
User
Account
Session
Workshop
Registration
Payment
```

---

# 15. User Model

The User model supports authentication and authorization.

Typical fields include:

```text
id
name
email
image
role
createdAt
updatedAt
```

Role:

```text
USER
ADMIN
```

The default role is:

```text
USER
```

---

# 16. Workshop Model

The Workshop model represents the event.

Typical fields include:

```text
id
title
description
date
location
price
currency
capacity
createdAt
updatedAt
```

The workshop price is controlled by the server.

The browser must never be trusted to decide the final payment amount.

---

# 17. Registration Model

A registration belongs to a user and workshop.

Typical fields include:

```text
id
userId
workshopId
fullName
email
phone
organization
status
createdAt
updatedAt
```

Possible statuses:

```text
PENDING
PAID
CANCELLED
```

Duplicate registrations should be prevented through database constraints and server-side validation.

---

# 18. Payment Model

The Payment model stores payment information.

Typical fields include:

```text
id
registrationId
stripeSessionId
stripePaymentIntentId
amount
currency
status
createdAt
updatedAt
```

Possible statuses:

```text
PENDING
PAID
FAILED
REFUNDED
```

Stripe identifiers are stored to allow payment reconciliation.

---

# 19. Registration Validation

Registration fields:

```text
Full Name
Email
Phone
Organization / Institution
```

Validation happens both:

- client-side
- server-side

Client-side validation is for user experience.

Server-side validation is the security boundary.

---

# 20. Stripe Payment Flow

The application uses Stripe Checkout in TEST MODE.

The flow is:

```text
Registration
     ↓
Server creates Checkout Session
     ↓
User redirected to Stripe
     ↓
Test payment completed
     ↓
Stripe sends webhook
     ↓
Application verifies webhook signature
     ↓
Payment updated
     ↓
Registration marked PAID
```

---

# 21. Important Payment Security Rule

The application must never mark a payment as successful solely because the user arrives at:

```text
/success
```

The success redirect is only a user-facing redirect.

The source of truth is the verified Stripe webhook.

Correct:

```text
Stripe payment
     ↓
verified webhook
     ↓
database update
```

Incorrect:

```text
Stripe payment
     ↓
redirect
     ↓
assume payment succeeded
```

---

# 22. Stripe Webhook

The webhook endpoint receives Stripe events.

The application must:

1. Read the raw request body.
2. Verify the Stripe signature.
3. Identify the associated registration.
4. Check the current payment state.
5. Update the database safely.
6. Avoid duplicate processing.
7. Trigger email confirmation when appropriate.

Stripe webhook processing must be idempotent.

Stripe may retry events.

A repeated webhook must not create:

- duplicate payments
- duplicate registrations
- duplicate emails

---

# 23. Confirmation Email

After successful verified payment, the user receives a confirmation email.

The email should contain:

```text
AFTERIMAGE

REGISTRATION CONFIRMED

Name
Workshop
Date
Location
Registration ID
Payment Status
```

The email should visually match the website.

The email must not be sent merely because a user reaches the success page.

---

# 24. Frontend Routes

The main routes are:

```text
/
```

Landing page.

```text
/login
```

OAuth authentication.

```text
/register
```

Workshop registration.

```text
/checkout
```

Checkout preparation / payment initiation.

```text
/success
```

Payment result.

```text
/dashboard
```

Authenticated user's registration details.

```text
/admin
```

Protected admin dashboard.

```text
/admin/users
```

Protected registered-user list.

---

# 25. API Routes

API routes should be organized around application responsibilities.

Example structure:

```text
/api/auth/*
/api/registration/*
/api/checkout/*
/api/stripe/webhook
```

Sensitive logic should execute server-side.

Never expose:

```text
DATABASE_URL
AUTH_SECRET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
```

to the browser.

---

# 26. Project Structure

The project should approximately follow:

```text
event-platform/
│
├── app/
│   ├── page.tsx
│   │
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── register/
│   │   └── page.tsx
│   │
│   ├── checkout/
│   │   └── page.tsx
│   │
│   ├── success/
│   │   └── page.tsx
│   │
│   ├── dashboard/
│   │   └── page.tsx
│   │
│   ├── admin/
│   │   ├── page.tsx
│   │   └── users/
│   │       └── page.tsx
│   │
│   └── api/
│       ├── auth/
│       ├── registration/
│       ├── checkout/
│       └── stripe/
│           └── webhook/
│
├── components/
│   ├── ui/
│   ├── navigation/
│   ├── workshop/
│   ├── registration/
│   ├── checkout/
│   └── admin/
│
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── stripe.ts
│   ├── email.ts
│   └── permissions.ts
│
├── prisma/
│   └── schema.prisma
│
├── public/
│
├── .env.example
├── .gitignore
├── CLAUDE.md
├── package.json
└── README.md
```

---

# 27. Environment Variables

Create a local environment file.

Example:

```env
DATABASE_URL=

AUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

RESEND_API_KEY=

NEXT_PUBLIC_APP_URL=
```

Never commit the real `.env` file.

Commit:

```text
.env.example
```

Do not commit:

```text
.env
.env.local
```

---

# 28. Local Development

## 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
```

Then:

```bash
cd event-platform
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create:

```text
.env.local
```

Fill in the required variables.

## 4. Generate Prisma Client

```bash
npx prisma generate
```

## 5. Run database migrations

For development:

```bash
npx prisma migrate dev
```

## 6. Start the development server

```bash
npm run dev
```

The application should then be available at:

```text
http://localhost:3000
```

---

# 29. Useful Commands

## Start development server

```bash
npm run dev
```

## Build application

```bash
npm run build
```

## Start production build

```bash
npm start
```

## Run lint

```bash
npm run lint
```

## Generate Prisma Client

```bash
npx prisma generate
```

## Create database migration

```bash
npx prisma migrate dev
```

## Open Prisma Studio

```bash
npx prisma studio
```

---

# 30. Google OAuth

Create a Google OAuth application in Google Cloud.

Configure the local callback URL required by the Auth.js configuration.

For production, update the OAuth configuration to use the deployed application domain.

Do not hardcode production credentials inside the source code.

---

# 31. GitHub OAuth

Create a GitHub OAuth application.

Configure the callback URL required by the Auth.js configuration.

Use separate environment variables for the client ID and client secret.

---

# 32. Stripe TEST Mode

Use Stripe TEST MODE during development and evaluation.

Do not use live payment credentials for this assignment.

Configure the webhook using the deployed URL.

Example:

```text
https://YOUR-DOMAIN/api/stripe/webhook
```

The exact URL depends on the deployment.

---

# 33. Testing Stripe Locally

For local webhook testing, a Stripe webhook forwarding workflow can be used.

The important requirement is:

```text
Stripe event
       ↓
verified webhook
       ↓
local application
```

Never disable signature verification merely to make local development easier.

---

# 34. Admin Setup

New users are regular users:

```text
USER
```

An initial administrator must be configured securely.

The role must never be editable by an ordinary user from the frontend.

Admin access should be granted through a controlled server/database procedure.

---

# 35. Admin Dashboard

The admin dashboard should provide operational information such as:

```text
REGISTRATIONS
48

PAID
42

PENDING
6
```

And a registered-user table:

```text
NAME
EMAIL
REGISTRATION ID
PAYMENT
DATE
```

Useful search and filtering can be included.

Avoid turning the admin area into an unnecessarily complex analytics application.

---

# 36. User Dashboard

The user dashboard should show the currently authenticated user's information.

Example:

```text
AFTERIMAGE

YOUR REGISTRATION

WORKSHOP
Afterimage Workshop

DATE
12 October 2026

LOCATION
Bengaluru

REGISTRATION
AF-2026-0042

PAYMENT
PAID
```

A user must never see another user's registration details.

---

# 37. Landing Page

The landing page is the visual centerpiece of the project.

A possible composition:

```text
AFTERIMAGE

A WORKSHOP IN
MAKING THINGS
THAT LAST.

12 OCTOBER 2026
BENGALURU
48 SEATS

[ RESERVE YOUR SEAT ]
```

Then:

```text
THE WORKSHOP
```

followed by the event description.

Then:

```text
WHAT YOU'LL LEARN

01
Ideation

02
Prototyping

03
Building

04
Shipping
```

Then:

```text
THE DETAILS

DATE
LOCATION
DURATION
CAPACITY
```

Then:

```text
YOUR PLACE

₹999

[ RESERVE ]
```

The exact layout can evolve as long as the visual identity remains coherent.

---

# 38. Responsive Design

The application must work on:

- desktop
- tablet
- mobile

Mobile layouts should be intentionally designed rather than simply shrinking the desktop layout.

Verify:

- navigation
- typography
- forms
- CTA buttons
- registration flow
- tables
- payment pages
- dashboard
- spacing
- images

---

# 39. Accessibility

Use:

- semantic HTML
- proper heading hierarchy
- accessible labels
- keyboard navigation
- visible focus states
- readable contrast
- useful form error messages
- descriptive buttons

Do not communicate important information through color alone.

---

# 40. Error Handling

Important operations must have proper states.

Examples:

```text
Authentication failed
Registration failed
Already registered
Checkout could not be created
Payment cancelled
Payment processing
Payment verification failed
Email could not be sent
Server error
```

Never expose server stack traces to users.

---

# 41. Loading States

Async actions should show meaningful loading states.

Examples:

```text
Signing in...
Creating registration...
Redirecting to checkout...
Processing payment...
Loading registration...
```

Prevent accidental duplicate submissions.

---

# 42. Security Checklist

Before deployment verify:

- [ ] Authentication works
- [ ] Authorization works
- [ ] Admin routes are server-protected
- [ ] Users cannot change their own role
- [ ] Users cannot access another user's data
- [ ] Stripe secret is server-only
- [ ] Stripe webhook signature is verified
- [ ] Payment amount is server-controlled
- [ ] Duplicate registration is prevented
- [ ] Duplicate webhook events are handled
- [ ] Duplicate emails are prevented
- [ ] Environment secrets are not committed
- [ ] Client cannot directly modify payment status
- [ ] Client cannot directly modify user role

---

# 43. Testing Checklist

## Authentication

- [ ] Google login
- [ ] GitHub login
- [ ] Logout
- [ ] Session persistence

## Registration

- [ ] Valid registration
- [ ] Invalid form data
- [ ] Missing fields
- [ ] Duplicate registration

## Payments

- [ ] Checkout session created
- [ ] Test payment succeeds
- [ ] Payment cancellation works
- [ ] Webhook received
- [ ] Webhook signature verified
- [ ] Payment marked PAID
- [ ] Duplicate webhook handled

## Email

- [ ] Confirmation email sent
- [ ] Correct user receives email
- [ ] Duplicate email prevented

## Admin

- [ ] Admin can access admin dashboard
- [ ] Normal user cannot access admin
- [ ] Registered users visible to admin
- [ ] Payment status visible

## Responsive

- [ ] Desktop
- [ ] Tablet
- [ ] Mobile

---

# 44. Production Deployment

The intended deployment architecture is:

```text
GitHub
   ↓
Vercel
   ↓
Next.js
   ↓
PostgreSQL
   ↓
Stripe
   ↓
Resend
```

---

# 45. Vercel Deployment

1. Push the repository to GitHub.
2. Open Vercel.
3. Import the repository.
4. Configure environment variables.
5. Deploy.
6. Verify the production URL.

Production environment variables must be configured in Vercel.

Do not copy secrets into source code.

---

# 46. Production OAuth

After deployment, update Google and GitHub OAuth applications to use the production callback URL required by Auth.js.

Verify:

```text
localhost
```

and:

```text
production domain
```

are configured appropriately.

---

# 47. Production Stripe Webhook

Create the Stripe webhook endpoint using the production domain:

```text
https://YOUR-DOMAIN/api/stripe/webhook
```

Use Stripe TEST MODE for the assignment.

Copy the webhook signing secret into the appropriate Vercel environment variable.

---

# 48. Production Email

Configure the Resend API key in Vercel.

Verify that the sending domain/email configuration is valid.

Test the complete:

```text
registration
→ payment
→ webhook
→ email
```

flow after deployment.

---

# 49. Final End-to-End Test

Before submission, perform the entire flow using the deployed application.

```text
1. Open deployed website
2. Sign in with Google/GitHub
3. Open workshop
4. Submit registration
5. Start Stripe Checkout
6. Complete Stripe TEST payment
7. Return to application
8. Verify payment status
9. Verify registration status
10. Verify confirmation email
11. Open user dashboard
12. Verify admin account
13. Open admin dashboard
14. Verify registered user appears
15. Verify normal user cannot open admin
```

---

# 50. Git Workflow

Use focused commits.

Examples:

```bash
git add .
git commit -m "feat: create application foundation"
```

```bash
git add .
git commit -m "feat: add OAuth authentication"
```

```bash
git add .
git commit -m "feat: add workshop registration"
```

```bash
git add .
git commit -m "feat: integrate Stripe checkout"
```

```bash
git add .
git commit -m "feat: add Stripe webhook"
```

```bash
git add .
git commit -m "feat: add confirmation email"
```

```bash
git add .
git commit -m "feat: create admin dashboard"
```

```bash
git add .
git commit -m "style: refine AFTERIMAGE frontend"
```

---

# 51. Development Principles

The project prioritizes:

```text
1. Correctness
2. Security
3. Reliability
4. Usability
5. Visual identity
6. Deployment
```

Do not introduce complexity without a concrete reason.

The goal is not to build the largest possible application.

The goal is to build a believable real-world event platform that demonstrates strong engineering.

---

# 52. What This Project Does Not Need

Do not add unnecessary functionality such as:

- chatbot
- AI recommendations
- social feed
- comments
- likes
- event marketplace
- multi-tenant architecture
- microservices
- Kubernetes
- GraphQL
- Redis
- unnecessary analytics
- recommendation engines

unless explicitly required later.

---

# 53. Frontend Quality Standard

Every page should feel part of the same product.

The following should be consistent:

- typography
- spacing
- borders
- button behavior
- colors
- animation
- metadata
- navigation
- visual rhythm

Do not design each page independently.

---

# 54. AI-Generated UI Warning

Avoid patterns such as:

```text
Hero
↓
Three Cards
↓
Three More Cards
↓
Testimonials
↓
Pricing Cards
↓
Gradient CTA
```

This often results in a generic AI-generated appearance.

Instead, use intentional layouts.

The website should look like an independent creative studio created it.

---

# 55. Motion Guidelines

Motion should support hierarchy.

Good:

```text
fade + rise
stagger
image reveal
hover movement
section entrance
page transitions
```

Bad:

```text
constant bouncing
floating everything
heavy parallax
random particle effects
continuous background animation
```

Use animation sparingly.

---

# 56. Definition of Done

The application is considered complete only when:

### Functionality

- [ ] Google login works
- [ ] GitHub login works
- [ ] Registration works
- [ ] Stripe TEST payment works
- [ ] Stripe webhook works
- [ ] Confirmation email works
- [ ] User dashboard works
- [ ] Admin dashboard works

### Security

- [ ] Backend routes protected
- [ ] Admin authorization protected
- [ ] User data isolated
- [ ] Secrets protected
- [ ] Stripe signatures verified
- [ ] Payment amount controlled server-side
- [ ] Duplicate operations handled

### Frontend

- [ ] Distinct AFTERIMAGE visual identity
- [ ] Responsive design
- [ ] Accessible forms
- [ ] Loading states
- [ ] Error states
- [ ] Motion interactions
- [ ] No generic AI-style SaaS layout

### Deployment

- [ ] GitHub repository
- [ ] Vercel deployment
- [ ] Production database
- [ ] OAuth configured
- [ ] Stripe webhook configured
- [ ] Resend configured
- [ ] Full production flow tested

---

# 57. Project Status

Update this section as development progresses.

Current status:

```text
Frontend:        In Development
Authentication:  In Development
Database:        In Development
Registration:    In Development
Stripe:          In Development
Email:           In Development
Admin:           In Development
Deployment:      Pending
```

Do not mark a component as complete until it has been implemented and tested.

---

# 58. Author

Event Platform / AFTERIMAGE

Built as a university web development project demonstrating:

- modern frontend development
- OAuth authentication
- relational database design
- secure backend APIs
- payment integration
- webhook handling
- transactional email
- role-based authorization
- production deployment
