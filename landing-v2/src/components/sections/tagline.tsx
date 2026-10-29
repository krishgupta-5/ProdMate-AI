"use client";

import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/ui/container";
import { taglineWords } from "@/content/landing";

const words = taglineWords.split(" ");

/**
 * Large type moment. As the paragraph moves from 85% to 35% of the viewport height, words light
 * up one at a time in reading order. The scroll handler is throttled through requestAnimationFrame
 * and only attached while the section is on screen.
 */
export function Tagline() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.35;
      const center = rect.top + rect.height / 2;
      const progress = Math.min(1, Math.max(0, (start - center) / (start - end)));
      setLit(Math.round(progress * words.length));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener("scroll", onScroll, { passive: true });
        update();
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section aria-label="Why ProdMate" className="py-24 md:py-36">
      <Container>
        <p
          ref={ref}
          aria-label={taglineWords}
          className="mx-auto max-w-4xl text-center text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl"
        >
          {words.map((word, i) => (
            <span key={i} aria-hidden="true">
              <span
                className={
                  "transition-colors duration-500 ease-(--ease-out-soft) " +
                  (i < lit ? "text-ink" : "text-ink/25")
                }
              >
                {word}
              </span>{" "}
            </span>
          ))}
        </p>
      </Container>
    </section>
  );
}
