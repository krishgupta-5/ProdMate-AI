"use client";

import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/cn";

export interface TokenQuota {
  tokensUsed: number;
  tokensLimit: number;
  tokensRemaining: number;
  exhausted: boolean;
  resetAt: number;
}

/** ChatPanel fires this with the fresh quota after each message, so the pill updates live. */
export const TOKEN_QUOTA_EVENT = "token-quota-updated";

const compact = (n: number) =>
  n >= 1_000_000 ? `${+(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${+(n / 1_000).toFixed(1)}K` : String(n);

function resetsIn(resetAt: number) {
  const ms = Math.max(0, resetAt - Date.now());
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** Ring that fills as tokens are used. */
function Ring({ pct, danger }: { pct: number; danger: boolean }) {
  const r = 7;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 18 18" className="size-[18px] -rotate-90" aria-hidden>
      <circle cx="9" cy="9" r={r} fill="none" strokeWidth="2.5" className="stroke-pm-line" />
      <circle
        cx="9"
        cy="9"
        r={r}
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
        className={cn("transition-[stroke-dashoffset] duration-700 ease-[var(--ease-pm)]", danger ? "stroke-pm-danger" : "stroke-pm-primary")}
      />
    </svg>
  );
}

/** Today's token usage (used and left) for the signed-in user, with details on click. */
export default function TokenUsage() {
  const { isSignedIn } = useUser();
  const [quota, setQuota] = useState<TokenQuota | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    const load = () =>
      fetch("/api/token-quota", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d && setQuota(d))
        .catch(() => {});
    load();
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<TokenQuota>).detail;
      if (detail) setQuota(detail);
      else load();
    };
    // ChatPanel fires "refresh-sessions" after every reply, including plain chat turns.
    window.addEventListener(TOKEN_QUOTA_EVENT, onUpdate);
    window.addEventListener("refresh-sessions", load);
    window.addEventListener("focus", load);
    return () => {
      window.removeEventListener(TOKEN_QUOTA_EVENT, onUpdate);
      window.removeEventListener("refresh-sessions", load);
      window.removeEventListener("focus", load);
    };
  }, [isSignedIn]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  if (!isSignedIn || !quota) return null;

  const pct = quota.tokensLimit > 0 ? Math.min(100, (quota.tokensUsed / quota.tokensLimit) * 100) : 0;
  const low = quota.exhausted || pct >= 90;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Token usage"
        className="flex h-8 items-center gap-2 rounded-full border border-pm-line bg-pm-card pr-3 pl-2 text-[13px] transition-colors hover:border-pm-line-strong"
      >
        <Ring pct={pct} danger={low} />
        <span className="font-medium tabular-nums">{compact(quota.tokensRemaining)}</span>
        <span className="text-pm-muted max-sm:hidden">tokens left</span>
      </button>

      {open && (
        <div className="absolute top-full right-0 z-[1000] mt-2 w-64 rounded-xl border border-pm-line bg-pm-card p-4 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)] animate-in fade-in zoom-in-95 duration-100">
          <div className="text-xs font-medium tracking-wide text-pm-muted uppercase">Today&apos;s tokens</div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-pm-shell">
            <div className={cn("h-full rounded-full", low ? "bg-pm-danger" : "bg-pm-primary")} style={{ width: `${pct}%` }} />
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-pm-muted">Used</dt>
              <dd className="mt-0.5 font-semibold tabular-nums">{quota.tokensUsed.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-xs text-pm-muted">Left</dt>
              <dd className={cn("mt-0.5 font-semibold tabular-nums", low && "text-pm-danger")}>
                {quota.tokensRemaining.toLocaleString()}
              </dd>
            </div>
          </dl>
          <div className="mt-3 border-t border-pm-line pt-3 text-xs text-pm-muted">
            {quota.tokensLimit.toLocaleString()} per day · resets in {resetsIn(quota.resetAt)}
          </div>
        </div>
      )}
    </div>
  );
}
