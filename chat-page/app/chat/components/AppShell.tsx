"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, PanelLeft } from "lucide-react";
import Sidebar from "./Sidebar";
import LoginModal from "./LoginModal";
import TokenUsage from "./TokenUsage";
import { cn } from "@/lib/cn";

export interface ShellContext {
  showLoginModal: boolean;
  onShowLoginModal: (show: boolean) => void;
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SIDEBAR_MIN = 220;
const SIDEBAR_MAX = 420;
const SIDEBAR_DEFAULT = 264;
/** Dragging the edge left of this x (px) collapses the sidebar to its icon rail. */
const SIDEBAR_COLLAPSE_AT = 150;
/** TopBar's menu button fires this on phones, where the closed sidebar is hidden entirely. */
const OPEN_SIDEBAR_EVENT = "pm-open-sidebar";

/**
 * The app frame used by every signed-in page: the sidebar on the grey shell, and the page
 * content on a white rounded card beside it (the layout of the reference design).
 */
export default function AppShell({
  activeSessionId,
  children,
}: {
  activeSessionId?: string;
  children: React.ReactNode | ((ctx: ShellContext) => React.ReactNode);
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT);
  const [isResizing, setIsResizing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Restore the saved width (and collapse on small screens) before the first paint, with the width
  // animation off, so opening a chat doesn't show the sidebar sliding from its default width.
  const [ready, setReady] = useState(false);
  useIsomorphicLayoutEffect(() => {
    const saved = Number(localStorage.getItem("pm-sidebar-width"));
    if (saved >= SIDEBAR_MIN && saved <= SIDEBAR_MAX) setSidebarWidth(saved);
    if (window.matchMedia("(max-width: 767px)").matches) setIsSidebarOpen(false);
    else if (localStorage.getItem("pm-sidebar-collapsed") === "1") setIsSidebarOpen(false);
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const open = () => setIsSidebarOpen(true);
    window.addEventListener(OPEN_SIDEBAR_EVENT, open);
    return () => window.removeEventListener(OPEN_SIDEBAR_EVENT, open);
  }, []);

  // On phones the open sidebar covers the page, so close it once a link in it is followed.
  // Adjusted during render when the path changes (React's pattern for state that follows a value).
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (window.matchMedia("(max-width: 767px)").matches) setIsSidebarOpen(false);
  }

  // Remember open/collapsed on desktop too.
  useEffect(() => {
    if (!ready || window.matchMedia("(max-width: 767px)").matches) return;
    localStorage.setItem("pm-sidebar-collapsed", isSidebarOpen ? "0" : "1");
  }, [isSidebarOpen, ready]);

  // Drag the edge to resize. Dragging past the collapse point folds it to the icon rail;
  // dragging back out from the rail opens it again. Pointer events, so it works with touch too.
  const handleResizeStart = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX;
    let moved = false;
    let lastWidth = sidebarWidth;
    let rafId = 0;
    setIsResizing(true);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    const onMove = (ev: PointerEvent) => {
      if (!moved && Math.abs(ev.clientX - startX) < 3) return;
      moved = true;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const x = ev.clientX;
        if (x < SIDEBAR_COLLAPSE_AT) {
          setIsSidebarOpen(false);
        } else {
          lastWidth = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, x));
          setIsSidebarOpen(true);
          setSidebarWidth(lastWidth);
        }
      });
    };
    const onUp = () => {
      cancelAnimationFrame(rafId);
      setIsResizing(false);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      if (moved) localStorage.setItem("pm-sidebar-width", String(lastWidth));
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const ctx: ShellContext = { showLoginModal, onShowLoginModal: setShowLoginModal };

  return (
    <>
      <div className="relative flex h-dvh w-full overflow-hidden bg-pm-shell text-pm-fg">
        <Sidebar
          activeSessionId={activeSessionId}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((o) => !o)}
          width={sidebarWidth}
          isResizing={isResizing || !ready}
          onResizeStart={handleResizeStart}
          onShowLoginModal={setShowLoginModal}
        />

        {/* Tap-away backdrop for the overlaid sidebar on small screens */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-pm-fg/10 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden
          />
        )}

        <main className="flex min-w-0 flex-1 flex-col py-2 pr-2 max-md:pl-2">
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-pm-line bg-pm-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            {typeof children === "function" ? children(ctx) : children}
          </div>
        </main>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={() => (window.location.href = "/login")}
      />
    </>
  );
}

export { useNewProject } from "./useNewProject";

/** The bar across the top of the content card: a breadcrumb on the left, actions on the right. */
export function TopBar({
  left,
  right,
  className,
}: {
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex h-14 shrink-0 items-center justify-between gap-2 px-3 sm:gap-3 sm:px-4", className)}>
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(OPEN_SIDEBAR_EVENT))}
          title="Open menu"
          aria-label="Open menu"
          className="grid size-8 shrink-0 place-items-center rounded-lg border border-pm-line bg-pm-card text-pm-muted transition-colors hover:text-pm-fg md:hidden"
        >
          <PanelLeft className="size-4" />
        </button>
        {left}
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {right}
        <TokenUsage />
      </div>
    </div>
  );
}

/** Goes back to the previous page, or home when there's no history (e.g. opened in a new tab). */
export function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}
      title="Back"
      aria-label="Back"
      className="grid size-8 shrink-0 place-items-center rounded-lg border border-pm-line bg-pm-card text-pm-muted transition-colors hover:border-pm-line-strong hover:text-pm-fg"
    >
      <ChevronLeft className="size-4" />
    </button>
  );
}

/** A small rounded chip for the top-left breadcrumb, e.g. "Settings". */
export function Crumb({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-pm-line bg-pm-card px-2.5 text-[13px] font-medium text-pm-fg/80 [&_svg]:size-3.5 [&_svg]:text-pm-muted">
      {icon}
      {children}
    </span>
  );
}

/** Title block at the top of a page body. */
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 fade-up">
      <div className="max-w-2xl">
        {eyebrow && <div className="mb-2 text-xs font-medium tracking-wide text-pm-accent uppercase">{eyebrow}</div>}
        <h1 className="text-[28px] leading-tight font-semibold tracking-tight text-pm-fg">{title}</h1>
        {description && <p className="mt-2 text-[15px] leading-relaxed text-pm-muted text-pretty">{description}</p>}
      </div>
      {action}
    </div>
  );
}
