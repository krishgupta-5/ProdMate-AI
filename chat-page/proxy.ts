import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import type { NextFetchEvent } from "next/server";

// Runs Clerk on every request so auth() works in pages and API routes. Protected pages check
// sign-in themselves and call unauthorized(), which renders app/unauthorized.tsx with a 401
// (see app/settings/layout.tsx), instead of redirecting here.
const clerkProxy = clerkMiddleware();

export function proxy(request: NextRequest, event: NextFetchEvent) {
  return clerkProxy(request, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|webm|mp3|wav|ogg)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
