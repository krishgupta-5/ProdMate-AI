import { useId, useState } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { SiteLink } from '@/components/ui/site-link';
import { cn } from '@/lib/cn';
import { FAQ } from '@/lib/content';
import { links } from '@/lib/site';

/** FAQ: a centred heading, then one rounded card per question that opens in place. */
export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 sm:px-6 sm:pb-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium tracking-[0.18em] text-pm-muted uppercase">FAQ</p>
        <h2 className="mt-4 text-[30px] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[40px]">
          Questions, answered.
        </h2>
      </Reveal>
      <Reveal className="mx-auto mt-12 max-w-3xl">
        <ul className="flex flex-col gap-2.5">
          {FAQ.map((item, i) => (
            <FaqItem key={item.q} {...item} defaultOpen={i === 0} />
          ))}
        </ul>
        <p className="mt-8 text-center text-sm text-pm-muted">
          Something else?{' '}
          <SiteLink
            href={links.contact}
            className="font-medium text-pm-fg underline decoration-pm-line underline-offset-4 hover:decoration-current"
          >
            Get in touch
          </SiteLink>
        </p>
      </Reveal>
    </section>
  );
}

/** One question that opens in place: the answer's row grows from 0fr to 1fr while it fades in. */
function FaqItem({
  q,
  a,
  link,
  defaultOpen,
}: {
  q: string;
  a: string;
  link?: { label: string; href: string };
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const id = useId();
  const ease = 'duration-[220ms] ease-(--ease-pm) motion-reduce:transition-none';
  return (
    <li
      className={cn(
        'rounded-2xl border bg-white transition-[border-color,box-shadow]',
        ease,
        open ? 'border-pm-line shadow-[0_8px_24px_-16px_rgba(0,0,0,0.15)]' : 'border-pm-line/70',
      )}
    >
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left text-[15.5px] font-medium outline-none focus-visible:text-pm-accent"
        >
          {q}
          <span
            className={cn(
              'grid size-7 shrink-0 place-items-center rounded-full border border-pm-line transition-[transform,background-color]',
              ease,
              open && 'rotate-45 bg-pm-shell',
            )}
          >
            <Plus aria-hidden className="size-3.5 text-pm-muted" />
          </span>
        </button>
      </h3>
      <div
        id={id}
        role="region"
        inert={!open}
        className={cn(
          'grid transition-[grid-template-rows]',
          ease,
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={cn(
              'px-6 pb-6 transition-[opacity,translate]',
              ease,
              open ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0',
            )}
          >
            <p className="max-w-2xl text-[14.5px] leading-relaxed text-pretty text-pm-muted">{a}</p>
            {link && (
              <SiteLink
                href={link.href}
                className="group mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-pm-accent outline-none focus-visible:underline"
              >
                {link.label}
                <ArrowRight
                  aria-hidden
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                />
              </SiteLink>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
