import { Sparkles } from 'lucide-react';
import { Wallpaper } from '@/components/landing/wallpaper';
import { ButtonLink } from '@/components/ui/button-link';
import { Reveal } from '@/components/ui/reveal';
import { links } from '@/lib/site';

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <Reveal>
        <Wallpaper scene="aurora" className="flex flex-col items-center px-6 py-20 text-center sm:py-28">
          {/* A soft dark pool behind the copy, so white text holds wherever the paint turns pale. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_55%_65%_at_center,rgb(30_27_75/0.75),transparent)]"
          />
          <h2 className="relative max-w-md text-[26px] leading-[1.2] font-medium tracking-[-0.015em] text-balance text-white sm:text-[32px]">
            Start with one idea.
          </h2>
          <p className="relative mt-3 max-w-sm text-[15px] text-pretty text-white/80">
            Describe it in a sentence and get the whole plan, free during the beta.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-2.5">
            <ButtonLink href={links.app} variant="primary" className="bg-white text-pm-fg hover:bg-white/90">
              Start planning
              <Sparkles aria-hidden />
            </ButtonLink>
            <ButtonLink
              href={links.docs}
              className="border-white/30 bg-white/10 text-white hover:border-white/60"
            >
              Read the docs
            </ButtonLink>
          </div>
        </Wallpaper>
      </Reveal>
    </section>
  );
}
