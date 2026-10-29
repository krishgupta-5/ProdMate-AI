import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { Painting } from "@/components/ui/painting";
import { Eyebrow } from "@/components/ui/section-heading";
import { appLinks } from "@/config/site";
import { legalDocs, type LegalDoc } from "@/content/legal";
import { cn } from "@/lib/utils";

import { SiteFooter } from "./site-footer";

/** Privacy, Terms and Cookies in the landing theme: framed painting header, contents, sections. */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <header className="p-2 sm:p-3">
        <div className="rounded-[32px] bg-white p-2 shadow-card sm:rounded-[42px] sm:p-3">
          <div className="relative isolate overflow-hidden rounded-[24px] sm:rounded-[32px]">
            {/* Albert Bierstadt, Lake Lucerne (1858), public domain */}
            <Painting name="lucerne" position="center 35%" priority />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#f6f3eef2_0%,#f6f3eecc_55%,#f6f3ee66_100%)]"
            />
            <Container className="pt-6 pb-16 md:pb-20">
              <nav className="flex h-14 items-center justify-between rounded-full glass pr-2 pl-5">
                <Link href="/" aria-label="ProdMate home" className="text-ink">
                  <Logo className="[&_svg]:size-6 [&>span]:text-lg" />
                </Link>
                <span className="flex items-center gap-1">
                  <Link
                    href="/"
                    className="hidden h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-muted transition-colors duration-300 hover:bg-ink/5 hover:text-ink sm:inline-flex"
                  >
                    <ArrowLeft weight="bold" className="size-4" /> Back to home
                  </Link>
                  <ButtonLink href={appLinks.start} size="sm">
                    Start planning
                  </ButtonLink>
                </span>
              </nav>

              <div className="mt-16 max-w-2xl md:mt-24">
                <Eyebrow>Legal</Eyebrow>
                <h1 className="mt-5 text-5xl font-medium tracking-tight text-ink md:text-7xl">
                  {doc.title[0]} <span className="text-fade">{doc.title[1]}</span>
                </h1>
                <p className="mt-5 text-lg text-ink-2">{doc.description}</p>
                <p className="mt-2 font-mono text-xs text-muted">Last updated {doc.updated}</p>
              </div>
            </Container>
          </div>
        </div>
      </header>

      <main id="main">
        <Container className="grid gap-12 py-16 md:py-24 lg:grid-cols-[240px_1fr] lg:gap-20">
          <aside className="lg:sticky lg:top-10 lg:self-start">
            <p className="font-mono text-[11px] tracking-widest text-ghost uppercase">Contents</p>
            <ol className="mt-4 flex flex-col gap-1">
              {doc.sections.map((section, i) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex gap-3 rounded-lg px-2 py-1.5 text-sm text-muted transition-colors duration-300 hover:bg-card hover:text-ink"
                  >
                    <span className="w-5 font-mono text-xs text-ember-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
            <p className="mt-8 font-mono text-[11px] tracking-widest text-ghost uppercase">
              Other policies
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {legalDocs
                .filter((d) => d.slug !== doc.slug)
                .map((d) => (
                  <li key={d.slug}>
                    <Link
                      href={`/${d.slug}`}
                      className="inline-flex rounded-full bg-card px-3 py-1.5 text-xs font-medium text-ink-2 shadow-card transition-colors duration-300 hover:text-ember-600"
                    >
                      {d.title.join(" ")}
                    </Link>
                  </li>
                ))}
            </ul>
          </aside>

          <article className="flex max-w-3xl flex-col gap-4">
            {doc.sections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-10 rounded-[28px] bg-card p-6 shadow-card md:p-8"
              >
                <h2 className="flex items-baseline gap-4 text-2xl font-medium tracking-tight text-ink">
                  <span className="font-mono text-sm text-ember-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </h2>
                <div className="mt-4 flex flex-col gap-3 text-base leading-7 text-muted">
                  {section.body.map((block, j) =>
                    typeof block === "string" ? (
                      <p key={j}>{block}</p>
                    ) : (
                      <div key={j} className="rounded-2xl bg-paper px-4 py-3">
                        <p className="text-sm font-semibold text-ink">{block.term}</p>
                        <p className="mt-1 text-[15px]">{block.text}</p>
                      </div>
                    ),
                  )}
                  {section.email ? (
                    <a
                      href={`mailto:${section.email}`}
                      className={cn(
                        "mt-1 inline-flex w-fit items-center rounded-full bg-ink px-4 py-2 font-mono text-sm text-white shadow-ink",
                        "transition-colors duration-300 hover:bg-ink-2",
                      )}
                    >
                      {section.email}
                    </a>
                  ) : null}
                </div>
              </section>
            ))}
          </article>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
