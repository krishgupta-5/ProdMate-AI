// app/api/token-quota/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateQuota } from "@/lib/token-quota";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const quota = await getOrCreateQuota(userId);

  // Calculate reset time
  const resetAt = quota.windowStart + 24 * 60 * 60 * 1000;

  // Tokens per UTC day, oldest first, for the usage bars.
  const history = Object.entries(quota.daily ?? {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, day]) => ({ date, used: day.used, limitHit: !!day.limitHit }));

  return NextResponse.json({
    tokensUsed: quota.tokensUsed,
    tokensLimit: quota.tokensLimit,
    tokensRemaining: Math.max(0, quota.tokensLimit - quota.tokensUsed),
    exhausted: quota.exhausted,
    resetAt, // epoch ms — frontend can show countdown
    history,
  });
}
