import React from "react";
import { cn } from "@/lib/cn";

/** Shared look for buttons and surfaces, matching the landing page (landing-page/src/lib/button.ts). */

export type ButtonVariant = "primary" | "dark" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

export function buttonClass(variant: ButtonVariant = "outline", size: ButtonSize = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,color,border-color,transform,opacity] duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-pm-accent/40 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    size === "sm" ? "h-8 px-3.5 text-[13px] [&_svg]:size-3.5" : "h-10 px-5 text-sm [&_svg]:size-4",
    variant === "primary" && "bg-pm-primary text-pm-primary-fg hover:bg-pm-primary/85",
    variant === "dark" && "bg-pm-fg text-pm-bg hover:bg-pm-fg/85",
    variant === "outline" && "border border-pm-line bg-pm-card text-pm-fg hover:border-pm-fg/20 hover:bg-pm-shell/60",
    variant === "ghost" && "text-pm-muted hover:bg-pm-shell hover:text-pm-fg",
    variant === "danger" && "border border-pm-danger/30 bg-pm-card text-pm-danger hover:border-pm-danger/50 hover:bg-pm-danger/10",
    className,
  );
}

export function Button({
  variant = "outline",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button type="button" className={buttonClass(variant, size, className)} {...props} />;
}

/** A square icon-only button. */
export function IconButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-lg text-pm-muted transition-colors hover:bg-pm-shell hover:text-pm-fg focus-visible:ring-2 focus-visible:ring-pm-accent/40 outline-none [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

/** White card with a hairline border, the main surface inside the app shell. */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-pm-line bg-pm-card", className)} {...props} />;
}

/** Small uppercase label above a group, like "Main" or "Today" in the sidebar. */
export function Eyebrow({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-[11px] font-medium tracking-wide text-pm-muted uppercase", className)} {...props} />;
}

/** Centered dialog on a dimmed backdrop. Clicking the backdrop or pressing Escape calls onClose. */
export function Modal({
  onClose,
  className,
  children,
  labelledBy,
}: {
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  labelledBy?: string;
}) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/30 p-4 backdrop-blur-[2px] animate-in fade-in duration-150"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={cn(
          "relative w-full max-w-md rounded-2xl border border-pm-line bg-pm-card p-6 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.25)] animate-in fade-in zoom-in-95 duration-150",
          className,
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/** Keyboard shortcut hint, e.g. <Kbd>⌘K</Kbd>. */
export function Kbd({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 items-center rounded-md border border-pm-line bg-pm-card px-1.5 font-sans text-[10px] font-medium text-pm-muted",
        className,
      )}
      {...props}
    />
  );
}
