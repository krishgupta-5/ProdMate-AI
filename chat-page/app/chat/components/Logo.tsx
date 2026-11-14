import { cn } from "@/lib/cn";

/** One notched "U" of the mark, pointing up, on a 100-unit grid centred at (50, 50). The mark is
 * eight of these turned in 45° steps around the centre; the top one is violet. Same geometry as the landing page
 * (landing-page/src/components/landing/logo.tsx) and landing-page/brand/scripts/build-logo.cjs. */
const LOGO_MODULE = "M40 8.5 43.5 5 47 8.5V20H53V8.5L56.5 5 60 8.5V24L55 29H45L40 24Z";
const LOGO_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

/** The Prodmate mark, drawn in the current text colour. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="2 2 96 96" aria-hidden className={cn("size-6 shrink-0 fill-current", className)}>
      {LOGO_ANGLES.map((a) => (
        <path
          key={a}
          d={LOGO_MODULE}
          transform={a ? `rotate(${a} 50 50)` : undefined}
          className={a === 0 ? "fill-pm-primary" : undefined}
        />
      ))}
    </svg>
  );
}

/** The mark with the name beside it. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-lg leading-none font-semibold tracking-tight text-pm-fg", className)}>
      <LogoMark className="size-7" />
      Prodmate
    </span>
  );
}
