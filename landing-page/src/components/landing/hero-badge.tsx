/** The small pill above the headline: who Prodmate is for, and that it's free to start. */
export function HeroBadge() {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-pm-line py-1 pr-3 pl-1 text-[13px]">
      <span
        aria-hidden
        className="relative flex size-5 items-center justify-center rounded-full bg-pm-primary/15"
      >
        <span className="absolute size-2.5 animate-ping rounded-full bg-pm-primary/50 motion-reduce:hidden" />
        <span className="size-1.5 rounded-full bg-pm-primary" />
      </span>
      <span>Built for founders &amp; developers</span>
      <span className="text-pm-muted">Free to start</span>
    </p>
  );
}
