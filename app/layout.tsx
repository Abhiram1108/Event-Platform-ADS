import type { Metadata } from "next";
import { Fredoka, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { SiteHeader } from "@/components/navigation/SiteHeader";

const display = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alexa Developers SRM — Build With AI",
  description:
    "A hands-on workshop by Alexa Developers SRM. Go from prompt to product and leave with a working AI app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="min-h-dvh bg-cream text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:border-2 focus:border-ink focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteFooter() {
  const cols: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: "Workshop",
      links: [
        { label: "Overview", href: "/#workshop" },
        { label: "What you'll learn", href: "/#learn" },
        { label: "Schedule", href: "/#schedule" },
        { label: "Reserve a seat", href: "/register" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Sign in", href: "/login" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "About the club", href: "/#club" },
        { label: "SRMIST, Kattankulathur", href: "/#workshop" },
      ],
    },
  ];

  return (
    <footer className="border-t-2 border-ink bg-cream">
      <div className="wrap py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <span className="font-display text-lg font-bold text-ink">
              Alexa Developers SRM
            </span>
            <p className="mt-2 text-sm text-ink-soft">
              A student developer community at SRMIST. We run workshops,
              hackathons, and build nights.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="font-display text-sm font-bold text-ink">
                {c.title}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-ink-soft underline-offset-2 hover:text-ink hover:underline"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t-2 border-ink/15 pt-6 text-xs text-ink-faint">
          Built by Alexa Developers SRM — a student club project.
        </div>
      </div>
    </footer>
  );
}
