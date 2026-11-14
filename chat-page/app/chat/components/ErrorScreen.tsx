"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Compass, LockKeyhole, LogIn, Plus } from "lucide-react";
import { LogoMark } from "./Logo";
import { buttonClass } from "./ui";
import { LANDING_URL } from "@/lib/site";

type Code = "401" | "404";

/** Full-page error screen in the app's style: 401 (sign in needed) and 404 (no such page). */
export default function ErrorScreen({ code }: { code: Code }) {
  const pathname = usePathname();
  // 401: send people back to the page they asked for once they've signed in.
  const loginHref = pathname && pathname !== "/login" ? `/login?redirect_url=${encodeURIComponent(pathname)}` : "/login";
  const is401 = code === "401";
  const Icon = is401 ? LockKeyhole : Compass;

  return (
    <div className="flex min-h-dvh w-full flex-col overflow-y-auto bg-pm-shell text-pm-fg">
      <header className="flex h-16 shrink-0 items-center px-6 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2.5 text-lg font-semibold tracking-tight">
          <LogoMark className="size-7" />
          Prodmate
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="fade-up w-full max-w-md rounded-2xl border border-pm-line bg-pm-card px-6 py-10 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_48px_-24px_rgba(0,0,0,0.12)] sm:px-10">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-pm-primary/12 text-pm-accent">
            <Icon className="size-5" />
          </span>

          <div className="mt-6 font-mono text-sm font-semibold tracking-[0.3em] text-pm-accent">{code}</div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-balance">
            {is401 ? "Sign in to see this page" : "This page doesn’t exist"}
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-pm-muted text-pretty">
            {is401
              ? "This part of ProdMate belongs to your account. Log in and we'll bring you straight back here."
              : "The link may be old, or the address mistyped. Your projects are safe in the sidebar."}
          </p>

          {!is401 && pathname && (
            <code className="mx-auto mt-4 block max-w-full truncate rounded-lg border border-pm-line bg-pm-shell px-3 py-1.5 font-mono text-xs text-pm-fg/70">
              {pathname}
            </code>
          )}

          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
            {is401 ? (
              <Link href={loginHref} className={buttonClass("primary", "md")}>
                <LogIn />
                Log in
              </Link>
            ) : (
              <Link href="/" className={buttonClass("primary", "md")}>
                <Plus />
                Start a new project
              </Link>
            )}
            <Link href="/" className={buttonClass("outline", "md")}>
              <ArrowLeft />
              Back to ProdMate
            </Link>
          </div>

          {is401 && (
            <p className="mt-6 text-[13px] text-pm-muted">
              New here?{" "}
              <Link href="/signup" className="font-medium text-pm-accent underline-offset-2 hover:underline">
                Create a free account
              </Link>
            </p>
          )}
        </div>
      </main>

      <footer className="flex shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-2 px-6 py-5 text-xs text-pm-muted">
        <span>Error {code}</span>
        <a href={`${LANDING_URL}/docs`} className="transition-colors hover:text-pm-fg">Help center</a>
        <a href={`${LANDING_URL}/contact`} className="transition-colors hover:text-pm-fg">Contact</a>
      </footer>
    </div>
  );
}
