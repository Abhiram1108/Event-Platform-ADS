import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export type SessionUser = {
  id: string;
  role: "USER" | "ADMIN";
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

/**
 * The current user from the server-side session, or null. Safe to call
 * anywhere on the server (Server Components, Route Handlers, Server Actions).
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  return (session?.user as SessionUser | undefined) ?? null;
}

/**
 * For pages and server actions: require an authenticated user or send them to
 * the login page. Returns a non-null user.
 */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * For admin pages and server actions: require an ADMIN. A signed-in non-admin
 * gets a 404 (the admin surface does not acknowledge its own existence);
 * an anonymous visitor is sent to login.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    notFound();
  }
  return user;
}
