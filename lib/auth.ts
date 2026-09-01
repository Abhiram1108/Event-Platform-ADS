import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

import { prisma } from "@/lib/prisma";

/**
 * Emails allowed to hold the ADMIN role, from ADMIN_EMAILS (comma-separated).
 * This allowlist is the only way an account is promoted to ADMIN. It never
 * demotes — removing an admin is a deliberate database operation.
 */
function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // Server-side sessions: the session row lives in Postgres, the browser only
  // holds an opaque session token cookie.
  session: { strategy: "database" },
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: false,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: false,
    }),
  ],
  callbacks: {
    /**
     * Runs on every sign-in. Promotes the account to ADMIN if its verified
     * provider email is on the allowlist. Failure here must not block login.
     */
    async signIn({ user }) {
      try {
        if (user.email && adminEmails().includes(user.email.toLowerCase())) {
          await prisma.user.updateMany({
            where: { email: user.email, role: { not: "ADMIN" } },
            data: { role: "ADMIN" },
          });
        }
      } catch (error) {
        console.error("[auth] admin role sync failed:", error);
      }
      return true;
    },
    /**
     * Copy the authoritative DB fields onto the session object handed to the
     * app. `user` here is the adapter user loaded from Postgres.
     */
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
});
