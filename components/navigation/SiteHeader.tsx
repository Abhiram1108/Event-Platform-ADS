import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { NavMobile } from "@/components/navigation/NavMobile";
import { auth, signOut } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/#workshop", label: "Workshop" },
  { href: "/#learn", label: "What you'll learn" },
  { href: "/#schedule", label: "Schedule" },
  { href: "/#club", label: "Community" },
];

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="tile size-9 bg-coral-soft">
        <span className="font-display text-sm font-bold text-ink">A</span>
      </span>
      <span className="font-display text-base font-bold text-ink">
        Alexa Developers <span className="text-green-ink">SRM</span>
      </span>
    </span>
  );
}

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="sticky top-0 z-40 px-[var(--gutter)] pt-4">
      <header className="panel mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-4 py-2.5">
        <Link href="/" aria-label="Alexa Developers SRM home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-bold text-ink transition-colors hover:text-green-ink"
              >
                Dashboard
              </Link>
              <form action={doSignOut}>
                <button
                  type="submit"
                  className="text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-bold text-ink transition-colors hover:text-green-ink"
            >
              Log in
            </Link>
          )}
          <ButtonLink href="/register" size="sm" variant="green">
            Reserve a seat
          </ButtonLink>
        </div>

        <NavMobile
          links={NAV_LINKS}
          isAuthed={Boolean(user)}
          signOutAction={doSignOut}
        />
      </header>
    </div>
  );
}
