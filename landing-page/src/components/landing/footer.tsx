import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/landing/logo';
import { ButtonLink } from '@/components/ui/button-link';
import { SiteLink } from '@/components/ui/site-link';
import { FOOTER_COLUMNS } from '@/lib/content';
import { links } from '@/lib/site';

/** Brand and main action on the left, link columns on the right, and the name set large
 * underneath, fading into the page. */
export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-pm-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-16 sm:px-6 md:grid-cols-[1fr_auto]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-sm text-pretty text-pm-muted">
            Turn your software idea into a development plan, and send it to the tools your team uses.
          </p>
          <ButtonLink href={links.app} variant="primary" className="mt-6 h-9 px-4">
            Start for free
            <ArrowRight aria-hidden />
          </ButtonLink>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-16 gap-y-10 sm:grid-cols-3">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-medium">{col.title}</p>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm text-pm-muted">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <SiteLink href={item.href} className="transition-colors hover:text-pm-fg">
                      {item.label}
                    </SiteLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <p className="mx-auto max-w-6xl px-4 pt-14 text-xs text-pm-muted sm:px-6">
        © {new Date().getFullYear()} Prodmate
      </p>
      <p
        aria-hidden
        className="mx-auto -mb-[0.22em] max-w-6xl bg-gradient-to-b from-pm-fg/[0.09] to-pm-fg/0 bg-clip-text px-4 pt-6 text-center text-[clamp(4.5rem,19vw,15rem)] leading-none font-medium tracking-[-0.06em] text-transparent select-none sm:px-6"
      >
        prodmate
      </p>
    </footer>
  );
}
