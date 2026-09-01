import type { ComponentProps, ReactNode } from "react";

export function Card({
  children,
  soft = false,
  className = "",
  ...rest
}: {
  children: ReactNode;
  soft?: boolean;
  className?: string;
} & ComponentProps<"div">) {
  return (
    <div
      className={`${soft ? "panel-soft" : "panel"} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}
