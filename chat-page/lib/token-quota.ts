import { db } from "@/lib/firebase-admin";

const DAILY_TOKEN_LIMIT = 50_000;
// Usage resets 24 hours after the window started (app/api/token-quota reports the same resetAt).
// This was 0, which reset usage on every read, so the count never went up.
const QUOTA_TTL_MS = 24 * 60 * 60 * 1000;
// How many days of usage history to keep for the usage bars.
const HISTORY_DAYS = 90;

/** One UTC day of usage: tokens spent, and whether the limit stopped a request that day. */
export interface DailyUsage {
  used: number;
  limitHit?: boolean;
}

export interface TokenQuota {
  userId: string;
  tokensUsed: number;
  tokensLimit: number;
  windowStart: number;
  exhausted: boolean;
  /** Keyed by ISO date ("2026-11-14"). Kept across window resets. */
  daily?: Record<string, DailyUsage>;
}

const isoDay = (time: number) => new Date(time).toISOString().slice(0, 10);

/** Drops history older than HISTORY_DAYS. */
function trimHistory(daily: Record<string, DailyUsage> = {}, now: number) {
  const oldest = isoDay(now - (HISTORY_DAYS - 1) * 86_400_000);
  return Object.fromEntries(Object.entries(daily).filter(([date]) => date >= oldest));
}

/** A new 24h window that keeps the user's usage history. */
function freshQuota(userId: string, now: number, daily?: Record<string, DailyUsage>): TokenQuota {
  return {
    userId,
    tokensUsed: 0,
    tokensLimit: DAILY_TOKEN_LIMIT,
    windowStart: now,
    exhausted: false,
    daily: trimHistory(daily, now),
  };
}

export async function getOrCreateQuota(userId: string): Promise<TokenQuota> {
  const ref = db.collection("token_quotas").doc(userId);
  const snap = await ref.get();
  const now = Date.now();

  if (!snap.exists) {
    const quota = freshQuota(userId, now);
    await ref.set(quota);
    return quota;
  }

  const data = snap.data() as TokenQuota;

  // Reset if 24h window has passed
  if (now - data.windowStart > QUOTA_TTL_MS) {
    const fresh = freshQuota(userId, now, data.daily);
    await ref.set(fresh);
    return fresh;
  }

  return data;
}

export async function deductTokens(
  userId: string,
  tokens: number,
): Promise<{ ok: boolean; quota: TokenQuota }> {
  const ref = db.collection("token_quotas").doc(userId);
  const now = Date.now();
  const today = isoDay(now);

  // FIX 2: Wrap in a Firestore transaction so read-check-write is atomic.
  // Two concurrent requests can no longer both pass the limit check.
  return db.runTransaction(async (txn) => {
    const snap = await txn.get(ref);

    let quota: TokenQuota;
    if (!snap.exists) {
      quota = freshQuota(userId, now);
    } else {
      quota = snap.data() as TokenQuota;
      // Auto-reset inside transaction if window expired
      if (now - quota.windowStart > QUOTA_TTL_MS) {
        quota = freshQuota(userId, now, quota.daily);
      }
    }

    const daily = trimHistory(quota.daily, now);
    const day = daily[today] ?? { used: 0 };

    if (quota.exhausted || quota.tokensUsed + tokens > quota.tokensLimit) {
      daily[today] = { ...day, limitHit: true };
      const blocked = { ...quota, exhausted: true, daily };
      txn.set(ref, blocked, { merge: true });
      return { ok: false, quota: blocked };
    }

    const newUsed = quota.tokensUsed + tokens;
    const exhausted = newUsed >= quota.tokensLimit;
    daily[today] = { ...day, used: day.used + tokens, ...(exhausted ? { limitHit: true } : {}) };
    const updated: TokenQuota = { ...quota, tokensUsed: newUsed, exhausted, daily };
    txn.set(ref, updated);

    return { ok: true, quota: updated };
  });
}
