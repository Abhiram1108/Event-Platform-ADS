import Link from "next/link";
import { redirect } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { IconTile } from "@/components/ui/IconTile";
import { auth, signIn } from "@/lib/auth";

function safeCallbackUrl(value: string | undefined): string {
  if (value && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return "/dashboard";
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.48 14.97.5 12 .5A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 4.75 12 4.75Z" />
    </svg>
  );
}

function GitHubMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
    </svg>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;
  const session = await auth();
  const target = safeCallbackUrl(callbackUrl);
  if (session?.user) {
    redirect(target);
  }

  return (
    <div className="wrap flex min-h-[calc(100dvh-6rem)] items-center py-12">
      <div className="mx-auto grid w-full max-w-4xl items-center gap-10 lg:grid-cols-2">
        <div className="hidden lg:block">
          <IconTile icon="sparkle" tone="coral" size="lg" />
          <h1 className="h-section mt-5 max-w-[14ch] text-balance">
            Reserve your seat for Build With AI.
          </h1>
          <p className="lede mt-4 max-w-sm">
            One account keeps your seat, your registration, and your dashboard in
            one place.
          </p>
          <ul className="mt-6 space-y-2 text-sm font-semibold text-ink">
            <li className="flex items-center gap-2">
              <Icon name="check" className="size-4 text-green-ink" strokeWidth={3} />
              No password to remember
            </li>
            <li className="flex items-center gap-2">
              <Icon name="check" className="size-4 text-green-ink" strokeWidth={3} />
              Sign in with GitHub or Google
            </li>
          </ul>
        </div>

        <Card className="p-7 sm:p-9">
          <h2 className="h-section">Sign in</h2>
          <p className="mt-2 text-ink-soft">Continue to reserve your seat.</p>

          {error && (
            <p
              role="alert"
              className="mt-5 border-2 border-ink bg-danger-soft px-3 py-2.5 text-sm font-semibold text-danger"
              style={{ borderRadius: "12px" }}
            >
              We couldn&rsquo;t sign you in. Please try again.
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: target });
              }}
            >
              <button type="submit" className="btn btn-white w-full">
                <GoogleMark />
                Continue with Google
              </button>
            </form>
            <form
              action={async () => {
                "use server";
                await signIn("github", { redirectTo: target });
              }}
            >
              <button type="submit" className="btn btn-white w-full">
                <GitHubMark />
                Continue with GitHub
              </button>
            </form>
          </div>

          <p className="mt-5 text-xs text-ink-faint">
            We use GitHub or Google only to confirm who you are.
          </p>
          <p className="mt-4 text-sm lg:hidden">
            <Link href="/" className="font-bold text-green-ink underline-offset-2 hover:underline">
              ← Back to the workshop
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
