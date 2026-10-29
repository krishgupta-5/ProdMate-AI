import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

/**
 * ProdMate summit mark: a thick chevron peak (the plan) over an ember summit (the idea).
 * Same artwork as brand/logo/mark.svg and public/logo-mark.png. The chevron follows the text
 * color; `tone="light"` sets it to paper for dark surfaces. The summit is always ember.
 */
export function LogoMark({
  className,
  tone,
  ...props
}: SVGProps<SVGSVGElement> & { tone?: "dark" | "light" }) {
  return (
    <svg
      viewBox="4 8 56 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn(
        "size-6 shrink-0",
        tone === "light" && "text-paper",
        tone === "dark" && "text-ink",
        className,
      )}
      {...props}
    >
      <path fill="currentColor" d="M4 54 32 10 60 54H48L32 29 16 54Z" />
      <path fill="#E0793A" d="M22 54 32 38 42 54Z" />
    </svg>
  );
}

/** Mark + wordmark. "Mate" is faded back (the half fade used across the site). */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-7" />
      <span className="text-xl leading-none font-semibold tracking-tight">
        Prod<span className="text-fade">Mate</span>
      </span>
    </span>
  );
}
