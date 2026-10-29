"use client";

import { useEffect, useRef, useState, type ComponentProps, type CSSProperties } from "react";

import { cn } from "@/lib/utils";

type RevealProps = {
  /** Stagger in seconds. */
  delay?: number;
} & (({ as?: "div" } & ComponentProps<"div">) | ({ as: "li" } & ComponentProps<"li">));

/* One shared IntersectionObserver for every Reveal on the page. */
const callbacks = new WeakMap<Element, () => void>();
let shared: IntersectionObserver | null = null;
function observe(el: Element, onIn: () => void) {
  shared ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callbacks.get(entry.target)?.();
        callbacks.delete(entry.target);
        shared?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  callbacks.set(el, onIn);
  shared.observe(el);
  return () => {
    callbacks.delete(el);
    shared?.unobserve(el);
  };
}

/**
 * Rises 32px and fades in once when scrolled into view. The `is-in` class is React state, so the
 * server HTML and the first client render always match (no hydration mismatch). Visible by
 * default when JavaScript is off (see `.js .reveal` in globals.css).
 */
export function Reveal({ delay = 0, className, style, ...props }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observe(el, () => setShown(true));
  }, []);

  const vars = { "--reveal-delay": `${Math.round(delay * 1000)}ms`, ...style } as CSSProperties;
  const classes = cn("reveal", shown && "is-in", className);

  if (props.as === "li") {
    const { as: _as, ...rest } = props;
    return (
      <li ref={ref as React.RefObject<HTMLLIElement>} className={classes} style={vars} {...rest} />
    );
  }
  const { as: _as, ...rest } = props;
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={classes} style={vars} {...rest} />
  );
}
