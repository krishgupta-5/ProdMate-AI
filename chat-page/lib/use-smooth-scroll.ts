"use client";

import { useEffect, type RefObject } from "react";
import Lenis from "lenis";

/**
 * Eased wheel scrolling inside a scroll container (the app scrolls inside cards, not the window).
 * The container must hold a single child that wraps all its content. Inner scroll areas and
 * dialogs opt out with `data-lenis-prevent`. Off when the user prefers reduced motion.
 */
export function useSmoothScroll(ref: RefObject<HTMLElement | null>, enabled = true) {
  useEffect(() => {
    const wrapper = ref.current;
    const content = wrapper?.firstElementChild as HTMLElement | null;
    if (!enabled || !wrapper || !content) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ wrapper, content, autoRaf: true, lerp: 0.14, wheelMultiplier: 1 });
    // Content grows while artifacts stream in and expand; keep the scroll limits current.
    const ro = new ResizeObserver(() => lenis.resize());
    ro.observe(content);
    return () => {
      ro.disconnect();
      lenis.destroy();
    };
  }, [ref, enabled]);
}
