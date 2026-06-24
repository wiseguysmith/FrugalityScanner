import Link from "next/link";
import type { ReactNode } from "react";

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "cta";
}) {
  const styles =
    variant === "cta"
      ? "bg-[var(--tangerine)] text-white hover:bg-[var(--accent-strong)]"
      : "bg-[var(--petrol)] text-white hover:bg-[#286878]";

  return (
    <Link
      href={href}
      className={`inline-flex h-12 items-center justify-center rounded-md px-5 text-sm font-bold transition ${styles}`}
    >
      {children}
    </Link>
  );
}
