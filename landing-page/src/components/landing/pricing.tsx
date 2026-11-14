import { ArrowRight, Check, FlaskConical } from 'lucide-react';
import { Wallpaper } from '@/components/landing/wallpaper';
import { ButtonLink } from '@/components/ui/button-link';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { FREE_PLAN } from '@/lib/content';
import { links } from '@/lib/site';

/** Pricing: one plan. Everything is free while Prodmate is in beta. */
export function Pricing() {
  const plan = FREE_PLAN;
  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading eyebrow="Pricing" title="Free while we're in beta.">
        One plan with every feature. No card, no trial timer.
      </SectionHeading>

      <Reveal className="mt-10 grid overflow-hidden rounded-3xl border border-pm-line p-2 md:grid-cols-5">
        {/* The price on a painted wallpaper. */}
        <Wallpaper scene="aurora" className="p-6 sm:p-10 md:col-span-2">
          {/* Darkens the paint behind the copy so white text holds where it turns pale. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(110deg,rgb(30_27_75/0.72),rgb(30_27_75/0.25))]"
          />
          <div className="relative flex h-full flex-col">
            <p className="flex items-center gap-2 text-sm font-medium text-white">
              {plan.name}
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium text-white ring-1 ring-white/25 backdrop-blur-sm">
                <FlaskConical aria-hidden className="size-3" />
                Beta
              </span>
            </p>
            <p className="mt-5 flex items-baseline gap-2.5">
              <span className="text-6xl font-medium tracking-[-0.03em] text-white tabular-nums">
                {plan.price}
              </span>
              <span className="text-sm text-white/75">{plan.term}</span>
            </p>
            <p className="mt-4 max-w-xs text-sm text-pretty text-white/80">{plan.blurb}</p>
            <ButtonLink
              href={links.app}
              variant="primary"
              className="mt-8 w-full bg-white text-pm-fg hover:bg-white/90 md:mt-auto"
            >
              Start for free
              <ArrowRight aria-hidden />
            </ButtonLink>
          </div>
        </Wallpaper>

        {/* What's included, and the beta note. */}
        <div className="flex flex-col p-6 sm:p-10 md:col-span-3">
          <p className="text-sm font-medium">Everything included</p>
          <ul className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            {plan.perks.map((perk) => (
              <li key={perk} className="flex gap-2.5">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-pm-accent" />
                {perk}
              </li>
            ))}
          </ul>
          <p className="mt-8 rounded-2xl border border-pm-line bg-pm-shell/60 p-4 text-[13px] leading-relaxed text-pretty text-pm-muted md:mt-auto">
            <span className="font-medium text-pm-fg">Prodmate is in beta testing.</span> Things may change as
            we improve them, and we&apos;ll tell you well before any paid plan arrives. Your projects stay
            yours.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
