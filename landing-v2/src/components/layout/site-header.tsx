"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { scrollToId, setScrollLocked } from "@/components/ui/smooth-scroll";
import { appLinks, mainNav } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Returns the id of the section crossing a band 40 to 45% down the viewport, or "" when none is
 * (for example over the hero). Tracks every section so the value also clears, not only sets.
 */
function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const state = new Map<string, boolean>();
    const elements = mainNav
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) state.set(entry.target.id, entry.isIntersecting);
        setActive(mainNav.find((item) => state.get(item.id))?.id ?? "");
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return active;
}

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;top:0;height:24px;width:1px;pointer-events:none";
    document.body.prepend(sentinel);
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, []);
  return scrolled;
}

/** Two lines that rotate into an X. */
function MenuGlyph({ open }: { open: boolean }) {
  const line =
    "absolute left-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-500 ease-(--ease-out-soft)";
  return (
    <span aria-hidden="true" className="relative block h-3 w-5">
      <span className={cn(line, "top-0", open && "translate-y-[5px] rotate-45")} />
      <span className={cn(line, "bottom-0", open && "-translate-y-[5px] -rotate-45")} />
    </span>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const active = useActiveSection();
  const scrolled = useScrolled();
  const menuId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const target = hover ?? active;

  // Position the sliding pill under the hovered link, or the current section's link.
  const measure = useCallback(() => {
    const el = target ? linkRefs.current[target] : null;
    const list = listRef.current;
    if (!el || !list) return setPill(null);
    const a = el.getBoundingClientRect();
    const b = list.getBoundingClientRect();
    setPill({ x: a.left - b.left, w: a.width });
  }, [target]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    if (!open) return;
    setScrollLocked(true);
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      setScrollLocked(false);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-5">
      <div
        className={cn(
          "relative z-10 flex h-14 w-full max-w-4xl items-center justify-between gap-3 rounded-full glass pr-2 pl-5 transition-[background-color,box-shadow] duration-500",
          scrolled && "bg-white/85",
        )}
      >
        <Link href="/" aria-label="ProdMate home" className="rounded-full text-ink">
          <Logo className="[&_svg]:size-6 [&>span]:text-lg" />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul
            ref={listRef}
            className="relative flex items-center"
            onMouseLeave={() => setHover(null)}
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-0 left-0 h-9 rounded-full bg-ink/[0.07] transition-[transform,width,opacity] duration-500 ease-(--ease-out-soft)",
                pill ? "opacity-100" : "opacity-0",
              )}
              style={pill ? { transform: `translateX(${pill.x}px)`, width: pill.w } : undefined}
            />
            {mainNav.map((item) => {
              const current = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    ref={(el) => {
                      linkRefs.current[item.id] = el;
                    }}
                    href={`#${item.id}`}
                    aria-current={current ? "location" : undefined}
                    onMouseEnter={() => setHover(item.id)}
                    onFocus={() => setHover(item.id)}
                    onBlur={() => setHover(null)}
                    className={cn(
                      "relative inline-flex h-9 items-center rounded-full px-3 text-sm font-medium transition-colors duration-300",
                      current || hover === item.id ? "text-ink" : "text-muted",
                    )}
                  >
                    {item.label}
                    {current ? (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-ember-500"
                      />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <ButtonLink href={appLinks.start} size="sm" className="hidden h-10 sm:inline-flex">
            Start planning
          </ButtonLink>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors duration-300 hover:bg-ink/5 md:hidden"
          >
            <MenuGlyph open={open} />
          </button>
        </div>
      </div>

      {/* Full height mobile panel */}
      <div
        id={menuId}
        inert={!open}
        className={cn(
          "fixed inset-0 bg-paper/95 px-6 pt-28 pb-8 backdrop-blur-2xl transition-opacity duration-500 ease-(--ease-out-soft) md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <nav aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {mainNav.map((item, i) => (
              <li
                key={item.id}
                className={cn(
                  "transition-[opacity,transform] duration-500 ease-(--ease-out-soft)",
                  open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                )}
                style={{ transitionDelay: open ? `${Math.min(i * 60, 340)}ms` : "0ms" }}
              >
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "location" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    setOpen(false);
                    scrollToId(item.id);
                  }}
                  className={cn(
                    "flex h-14 items-center justify-between rounded-2xl px-3 text-3xl font-medium tracking-tight hover:bg-ink/5",
                    active === item.id ? "text-ink" : "text-ink-2",
                  )}
                >
                  {item.label}
                  {active === item.id ? (
                    <span className="size-2 rounded-full bg-ember-500" />
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ButtonLink href={appLinks.start} className="mt-8 w-full justify-between">
          Start planning free
        </ButtonLink>
      </div>
    </header>
  );
}
