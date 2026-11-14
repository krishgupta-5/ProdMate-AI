"use client";

import { useMemo } from "react";
import { StatusBars, fillStatusDays, toIsoDate, useStatusToday, type StatusDay } from "@/components/block/status-bars";

export interface TokenDay {
  date: string;
  used: number;
  limitHit: boolean;
}

const DAY_MS = 86_400_000;

/** Share of the daily allowance at which a day turns amber. */
const NEAR_LIMIT = 0.8;

/** Daily token usage as a strip of bars (ObsidianUI status bars): one bar per day, green within
 * the limit, amber near it, red when the limit stopped a request, grey with no usage. */
export default function TokenBars({
  history,
  limit,
  days = 30,
  label = `Last ${days} days`,
  className,
}: {
  history: TokenDay[];
  limit: number;
  days?: number;
  label?: string;
  className?: string;
}) {
  const today = useStatusToday();

  const shown = useMemo<StatusDay[]>(() => {
    if (!today) return [];
    const from = toIsoDate(Date.parse(today) - (days - 1) * DAY_MS);
    const byDate = new Map(history.map((d) => [d.date, d]));
    return fillStatusDays(from, today).map(({ date }) => {
      const day = byDate.get(date);
      if (!day || (day.used <= 0 && !day.limitHit)) return { date, status: "none" };
      const share = limit > 0 ? day.used / limit : 0;
      return {
        date,
        status: day.limitHit ? "down" : share >= NEAR_LIMIT ? "degraded" : "up",
        // The bars' percentage is the share of the day's allowance that was used.
        uptime: Math.min(100, share * 100),
        incidents: [{ title: `${day.used.toLocaleString()} tokens used` }],
      };
    });
  }, [history, limit, days, today]);

  return (
    <StatusBars
      days={shown}
      label={label}
      maxDays={days}
      loading={!today}
      metricLabel="avg. used"
      words={{ up: "Within limit", degraded: "Near the limit", down: "Limit reached", none: "No usage" }}
      currentWords={{ up: "Plenty left", degraded: "Running low", down: "Limit reached", none: "No usage today" }}
      className={className}
    />
  );
}
