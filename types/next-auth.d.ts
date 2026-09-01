import type { DefaultSession } from "next-auth";
import type { Role } from "@prisma/client";

/**
 * Make the DB `role` (and `id`) available on the session and adapter user.
 * The role is always read from the database — never from anything the client
 * sends.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    role: Role;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: Role;
  }
}
