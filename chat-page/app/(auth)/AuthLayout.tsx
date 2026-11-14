"use client";

import React from "react";
import Link from "next/link";
import { LogoMark } from "@/app/chat/components/Logo";
import { buttonClass } from "@/app/chat/components/ui";
import { LANDING_URL } from "@/lib/site";

const border = "1px solid var(--pm-line)";

/** Clerk styling built from the app's CSS variables, so it follows the light/dark theme. */
export const clerkAppearance = {
  variables: {
    colorPrimary: "var(--pm-primary)",
    colorPrimaryForeground: "var(--pm-primary-fg)",
    colorDanger: "var(--pm-danger)",
    colorBackground: "var(--pm-card)",
    colorForeground: "var(--pm-fg)",
    colorMutedForeground: "var(--pm-muted)",
    colorMuted: "var(--pm-shell)",
    colorInput: "var(--pm-card)",
    colorInputForeground: "var(--pm-fg)",
    colorBorder: "var(--pm-line)",
    colorRing: "var(--pm-primary)",
    colorNeutral: "var(--pm-fg)",
    fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: { width: "100%" },
    cardBox: { width: "100%", boxShadow: "none", border: "none" },
    card: { boxShadow: "none", border: "none", background: "transparent", padding: "0" },
    header: { alignItems: "center", textAlign: "center" },
    headerTitle: { fontSize: "24px", fontWeight: 600, letterSpacing: "-0.02em" },
    headerSubtitle: { fontSize: "14px" },
    logoBox: { display: "none" },
    footer: { background: "transparent", padding: "0", marginTop: "8px" },
    formButtonPrimary: { height: "40px", borderRadius: "9999px", fontWeight: 500, boxShadow: "none" },
    socialButtonsBlockButton: {
      height: "40px",
      borderRadius: "9999px",
      border,
      backgroundColor: "var(--pm-card)",
      boxShadow: "none",
      "&:hover": { backgroundColor: "var(--pm-shell)" },
    },
    formFieldInput: { height: "40px", border, backgroundColor: "var(--pm-card)", boxShadow: "none" },
    dividerLine: { backgroundColor: "var(--pm-line)" },
  },
};

/** A centred sign-in / sign-up card on the app's grey shell. */
export default function AuthLayout({
  children,
  switchHref,
  switchPrompt,
  switchLabel,
}: {
  children: React.ReactNode;
  switchHref: string;
  switchPrompt: string;
  switchLabel: string;
}) {
  return (
    <div className="flex min-h-dvh w-full flex-col overflow-y-auto bg-pm-shell text-pm-fg">
      <header className="flex h-16 shrink-0 items-center justify-between px-6 sm:px-8">
        <a href={LANDING_URL} className="inline-flex items-center gap-2.5 text-lg font-semibold tracking-tight">
          <LogoMark className="size-7" />
          Prodmate
        </a>
        <div className="flex items-center gap-2 text-[13px] text-pm-muted">
          <span className="max-sm:hidden">{switchPrompt}</span>
          <Link href={switchHref} className={buttonClass("outline", "sm")}>
            {switchLabel}
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="fade-up w-full max-w-[420px] rounded-2xl border border-pm-line bg-pm-card px-6 py-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_48px_-24px_rgba(0,0,0,0.12)] sm:px-8">
          {children}
        </div>
      </main>

      <footer className="flex shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-2 px-6 py-5 text-xs text-pm-muted">
        <span>© {new Date().getFullYear()} Prodmate</span>
        <a href={`${LANDING_URL}/terms`} className="transition-colors hover:text-pm-fg">Terms</a>
        <a href={`${LANDING_URL}/privacy`} className="transition-colors hover:text-pm-fg">Privacy</a>
        <a href={`${LANDING_URL}/docs`} className="transition-colors hover:text-pm-fg">Docs</a>
      </footer>
    </div>
  );
}
