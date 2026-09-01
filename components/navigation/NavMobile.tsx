"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { ButtonLink } from "@/components/ui/Button";

type Props = {
  links: { href: string; label: string }[];
  isAuthed: boolean;
  signOutAction: () => Promise<void>;
};

export function NavMobile({ links, isAuthed, signOutAction }: Props) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    firstLinkRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="tile size-10 bg-surface"
      >
        <span className="relative block h-3.5 w-5">
          <span
            className={
              "absolute left-0 h-0.5 w-5 bg-ink transition-transform " +
              (open ? "top-1.5 rotate-45" : "top-0")
            }
          />
          <span
            className={
              "absolute left-0 top-1.5 h-0.5 w-5 bg-ink transition-opacity " +
              (open ? "opacity-0" : "opacity-100")
            }
          />
          <span
            className={
              "absolute left-0 h-0.5 w-5 bg-ink transition-transform " +
              (open ? "top-1.5 -rotate-45" : "top-3")
            }
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-3 top-24 z-50 flex flex-col gap-1 border-2 border-ink bg-surface p-5 shadow-[6px_6px_0_0_var(--color-ink)]"
            style={{ borderRadius: "22px" }}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {links.map((l, i) => (
              <Link
                key={l.href}
                ref={i === 0 ? firstLinkRef : undefined}
                href={l.href}
                onClick={close}
                className="border-b-2 border-ink/10 py-3 font-display text-lg font-bold text-ink"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={isAuthed ? "/dashboard" : "/login"}
              onClick={close}
              className="border-b-2 border-ink/10 py-3 font-display text-lg font-bold text-ink"
            >
              {isAuthed ? "Dashboard" : "Log in"}
            </Link>
            <div className="mt-4 flex flex-col gap-3">
              <ButtonLink href="/register" className="w-full">
                Reserve a seat
              </ButtonLink>
              {isAuthed && (
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="text-sm font-semibold text-ink-soft"
                  >
                    Sign out
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
