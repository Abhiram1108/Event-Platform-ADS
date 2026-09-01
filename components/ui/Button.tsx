import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "green" | "sky" | "white";
type Size = "sm" | "md" | "lg";

function cls(variant: Variant, size: Size, extra?: string) {
  return [
    "btn",
    variant === "green" && "btn-green",
    variant === "sky" && "btn-sky",
    variant === "white" && "btn-white",
    size === "sm" && "btn-sm",
    size === "lg" && "btn-lg",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<"button">, "className">;

export function Button({
  variant = "green",
  size = "md",
  loading = false,
  children,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cls(variant, size, className)}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}

type ButtonLinkProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  href: string;
} & Omit<ComponentProps<"a">, "href" | "className">;

export function ButtonLink({
  variant = "green",
  size = "md",
  children,
  className,
  href,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link href={href} className={cls(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}
