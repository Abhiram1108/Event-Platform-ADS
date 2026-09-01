import { z } from "zod";

/**
 * Registration form input. Used server-side as the security boundary and
 * re-used client-side for inline validation.
 */
export const registrationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(120, "That name is too long."),
  email: z
    .email("Enter a valid email address.")
    .trim()
    .toLowerCase()
    .max(254, "That email is too long."),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number.")
    .max(20, "That phone number is too long.")
    .regex(/^[0-9+()\-\s]+$/, "Use only digits and + ( ) - spaces."),
  organization: z
    .string()
    .trim()
    .min(2, "Enter your organization or institution.")
    .max(160, "That is too long."),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
