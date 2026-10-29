"use client";

import Lenis from "lenis";
import { useEffect } from "react";

let instance: Lenis | null = null;

/** Pause or resume smooth scrolling, for example while a full screen menu is open. */
export function setScrollLocked(locked: boolean) {
  if (!instance) {
    document.body.style.overflow = locked ? "hidden" : "";
    return;
  }
  if (locked) instance.stop();
  else instance.start();
}

/** Glide to a section by id. Unlocks scrolling first, so it also works from the open mobile menu. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  history.replaceState(null, "", `#${id}`);
  if (instance) {
    instance.start();
    instance.scrollTo(el, { offset: -96, duration: 1.2 });
  } else {
    document.body.style.overflow = "";
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * Inertial smooth scrolling (Lenis), mounted once in the root layout. In-page anchor links glide
 * to their section with an offset for the fixed header. Skipped for reduced motion users, who
 * keep native scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      anchors: { offset: -96, duration: 1.2 },
      stopInertiaOnNavigate: true,
    });
    instance = lenis;
    return () => {
      lenis.destroy();
      instance = null;
    };
  }, []);
  return null;
}
