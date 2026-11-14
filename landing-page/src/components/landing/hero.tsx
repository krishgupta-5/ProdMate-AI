import type { CSSProperties } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button-link';
import { HeroBadge } from '@/components/landing/hero-badge';
import { Wallpaper } from '@/components/landing/wallpaper';
import { ChatPreview } from '@/components/landing/chat-preview';
import { links } from '@/lib/site';

/** Staggers the fade-up of the pieces around the headline. */
const step = (i: number) => ({ '--delay': `${i * 0.08}s` }) as CSSProperties;

/** A plain headline with the colour kept for the frame around the product below. The headline is
 * there from the first paint (it's the page's largest text); the badge, buttons and product window
 * fade up around it. */
export function Hero() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 pt-28 sm:px-6 sm:pt-32">
        <div className="fade-up mb-6" style={step(0)}>
          <HeroBadge />
        </div>
        <h1 className="max-w-2xl text-[28px] leading-[1.2] font-medium tracking-[-0.02em] text-balance sm:text-[36px]">
          Turn your software idea into a development plan.{' '}
          <span className="text-pm-muted">
            One workspace for product planning, technical documentation, GitHub, Jira, Notion and your team.
          </span>
        </h1>
        <div className="fade-up mt-9 flex flex-wrap items-center gap-3" style={step(1)}>
          <ButtonLink
            href={links.app}
            variant="primary"
            className="group h-12 bg-[linear-gradient(180deg,#7b6cf0,#6152e0)] pr-1.5 pl-6 text-[15px] shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_1px_2px_rgb(30_27_75/0.3),0_10px_24px_-8px_rgb(108_92_231/0.6)] ring-1 ring-[#4f3fc4]/40 hover:bg-[linear-gradient(180deg,#7466ee,#5a4bd6)] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_1px_2px_rgb(30_27_75/0.3),0_14px_30px_-8px_rgb(108_92_231/0.7)]"
          >
            Start planning for free
            <span className="grid size-9 place-items-center rounded-full bg-white/20 transition-transform duration-200 group-hover:translate-x-0.5">
              <ArrowRight aria-hidden />
            </span>
          </ButtonLink>
          <ButtonLink
            href={links.docs}
            variant="outline"
            className="group h-12 border-pm-line bg-white pr-6 pl-1.5 text-[15px] shadow-[0_1px_2px_rgb(0_0_0/0.05),0_6px_16px_-8px_rgb(0_0_0/0.12)] hover:border-pm-fg/25 hover:bg-white"
          >
            <span className="grid size-9 place-items-center rounded-full bg-pm-primary/10 text-pm-accent transition-colors duration-200 group-hover:bg-pm-primary/15">
              <BookOpen aria-hidden />
            </span>
            Read the docs
          </ButtonLink>
        </div>
      </div>

      {/* The app itself, floating over a painted band that bleeds past the content width and fades
          into the page at the top and bottom (the treatment Tracwell uses for its dashboard). */}
      <div
        className="fade-up relative mt-14 sm:mt-20"
        style={{ '--rise': '24px', '--duration': '0.9s', '--delay': '0.25s' } as CSSProperties}
      >
        <Wallpaper
          scene="dusk"
          className="absolute inset-x-0 top-16 bottom-0 rounded-none [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_70%,transparent)]"
        >
          <span />
        </Wallpaper>
        <div className="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
          <div className="rounded-2xl bg-white/50 p-1.5 shadow-[0_32px_80px_-24px_rgba(79,63,196,0.35),0_12px_32px_-12px_rgba(0,0,0,0.12)] ring-1 ring-black/5 backdrop-blur-md sm:p-2">
            <ChatPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
