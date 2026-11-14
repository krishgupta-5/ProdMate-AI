import { useLocation } from 'react-router';
import { Logo } from '@/components/landing/logo';
import { NavMenu } from '@/components/landing/nav-menu';
import { ButtonLink } from '@/components/ui/button-link';
import { SiteLink } from '@/components/ui/site-link';
import { cn } from '@/lib/cn';
import { links, navItems } from '@/lib/site';

/** A floating glass pill near the top of the screen: logo, links, and the main action. */
export function Nav() {
  const { pathname } = useLocation();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-40 px-3 sm:top-4 sm:px-6">
      <nav
        aria-label="Main"
        className="pointer-events-auto relative mx-auto flex h-14 max-w-5xl items-center gap-3 rounded-full border border-white/60 bg-white/55 pr-1.5 pl-4 shadow-[0_1px_0_rgb(255_255_255/0.8)_inset,0_10px_30px_-12px_rgb(30_27_75/0.18),0_2px_6px_-2px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.04] backdrop-blur-xl backdrop-saturate-150"
      >
        <SiteLink
          href="/"
          aria-label="Prodmate home"
          className="flex shrink-0 items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-pm-accent/50"
        >
          <Logo />
        </SiteLink>
        <div className="mx-auto hidden items-center gap-0.5 text-sm lg:flex">
          {navItems.map((item) => {
            const current = !item.href.includes('#') && pathname === item.href;
            return (
              <SiteLink
                key={item.href}
                href={item.href}
                aria-current={current ? 'page' : undefined}
                className={cn(
                  'rounded-full px-3.5 py-1.5 transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-pm-accent/50',
                  current
                    ? 'bg-white text-pm-fg shadow-[0_1px_2px_rgb(0_0_0/0.08)] ring-1 ring-black/5'
                    : 'text-pm-muted hover:bg-black/[0.04] hover:text-pm-fg',
                )}
              >
                {item.label}
              </SiteLink>
            );
          })}
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5 lg:ml-0">
          <ButtonLink
            href={links.login}
            variant="ghost"
            className="hidden h-10 rounded-full px-4 lg:inline-flex"
          >
            Log in
          </ButtonLink>
          <ButtonLink
            href={links.app}
            variant="primary"
            className="h-10 rounded-full px-4 max-[359px]:h-9 max-[359px]:px-3 max-[359px]:text-[13px] sm:px-5"
          >
            Start for free
          </ButtonLink>
          <NavMenu items={[...navItems, { label: 'Log in', href: links.login }]} />
        </div>
      </nav>
    </header>
  );
}
