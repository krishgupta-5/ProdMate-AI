import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenis: Lenis | null = null;

/** Smooth (eased) page scrolling for the whole site. Off when the user prefers reduced motion. */
export function startSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  lenis = new Lenis({ autoRaf: true, lerp: 0.12, anchors: { offset: -72 } });
}

/** Scrolls to an element or the top through Lenis when it's running, so jumps stay smooth. */
export function scrollToTarget(target: HTMLElement | null, immediate = false) {
  if (lenis) {
    lenis.scrollTo(target ?? 0, { immediate, offset: target ? -72 : 0 });
    return;
  }
  if (target) target.scrollIntoView();
  else window.scrollTo(0, 0);
}
