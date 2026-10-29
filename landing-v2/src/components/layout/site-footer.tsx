import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo, LogoMark } from "@/components/ui/logo";
import { Painting, paintings } from "@/components/ui/painting";
import { Reveal } from "@/components/ui/reveal";
import { FadeTitle } from "@/components/ui/section-heading";
import { appLinks, mainNav, siteConfig } from "@/config/site";

/* Legal pages live on this site (src/app/privacy, terms, cookies) so they share its theme. */
const legal = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
];

/**
 * Closing call to action, then a full width footer: brand and links on top, legal row below and
 * an oversized wordmark that fades into a light landscape painting.
 */
export function SiteFooter() {
  return (
    <>
      <Container>
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center py-20 text-center md:py-28">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-ink shadow-ink">
            <LogoMark className="size-7" tone="light" />
          </span>
          <FadeTitle
            parts={["Spend less time planning.", "More time building."]}
            className="mt-8 text-4xl font-medium tracking-tight text-ink md:text-6xl"
          />
          <p className="mt-6 text-lg text-muted">
            Describe your next product and get the whole blueprint in minutes. Free during beta, no
            credit card.
          </p>
          <ButtonLink href={appLinks.start} className="mt-10">
            Start planning free
          </ButtonLink>
        </Reveal>
      </Container>

      <footer className="relative isolate overflow-hidden border-t border-line-strong">
        {/* Sanford Robinson Gifford, Wilderness (1860), public domain */}
        <Painting name="wilderness" position="center 72%" />
        {/* Paper wash: solid behind the links, opening up toward the lake at the bottom */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#f6f3ee_0%,#f6f3eef0_32%,#f6f3ee99_62%,#f6f3ee33_100%)]"
        />

        <Container className="max-w-[1280px]">
          <div className="flex flex-col justify-between gap-8 pt-14 md:flex-row md:items-start md:pt-16">
            <div>
              <Link href="/" aria-label="ProdMate home" className="inline-flex text-ink">
                <Logo />
              </Link>
              <p className="mt-4 max-w-xs text-base text-muted">{siteConfig.tagline}</p>
            </div>
            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {mainNav.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`/#${item.id}`}
                      className="text-base text-muted transition-colors duration-300 hover:text-ink"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={appLinks.start}
                    className="text-base font-medium text-ink transition-colors duration-300 hover:text-ember-600"
                  >
                    Open workspace
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="mt-14 flex flex-col justify-between gap-4 text-sm text-muted md:flex-row md:items-center">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors duration-300 hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="transition-colors duration-300 hover:text-ink"
                >
                  {siteConfig.contactEmail}
                </a>
              </li>
            </ul>
            <p>
              © {siteConfig.copyrightYear} {siteConfig.name}. Built by{" "}
              <span className="text-ink">Team Hustler&apos;s</span>.
            </p>
          </div>
        </Container>

        {/* Oversized wordmark, "Prod" solid and "Mate" faded, dissolving into the painting */}
        <p
          aria-hidden="true"
          className="pointer-events-none mt-10 -mb-[0.2em] bg-[linear-gradient(180deg,#16130f_10%,#16130f00_92%)] bg-clip-text text-center text-[21vw] leading-none font-semibold tracking-tighter text-transparent select-none"
        >
          Prod<span className="opacity-45">Mate</span>
        </p>
        <p className="absolute right-4 bottom-3 text-[11px] text-ink/60 sm:right-6">
          Backdrop: {paintings.wilderness.credit}
        </p>
      </footer>
    </>
  );
}
