"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { useId, useState } from "react";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { faqs } from "@/content/landing";
import { cn } from "@/lib/utils";

/** FAQPage structured data for search and answer engines. */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

/** Plus that turns into a minus: the vertical bar rotates flat. */
function PlusMinus({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative mt-1.5 size-3.5 shrink-0 text-ember-600">
      <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 rounded-full bg-current" />
      <span
        className={cn(
          "absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 rounded-full bg-current transition-transform duration-500 ease-(--ease-out-soft)",
          open && "rotate-90",
        )}
      />
    </span>
  );
}

export function Faq() {
  const [open, setOpen] = useState(0);
  const baseId = useId();

  return (
    <section id="faq" className="py-24 md:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-5 text-5xl font-medium tracking-tight text-ink md:text-6xl">
            Questions,
            <br />
            <span className="text-fade">answered.</span>
          </h2>
          <p className="mt-5 max-w-xs text-base text-muted">
            The short version of how ProdMate works today, during the beta.
          </p>
        </Reveal>

        <Reveal>
          <ul className="border-t border-line-strong">
            {faqs.map((item, i) => {
              const expanded = open === i;
              const panelId = `${baseId}-panel-${i}`;
              const buttonId = `${baseId}-button-${i}`;
              return (
                <li key={item.q} className="border-b border-line-strong">
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => setOpen(expanded ? -1 : i)}
                      className="group flex w-full items-start gap-4 py-6 text-left"
                    >
                      <PlusMinus open={expanded} />
                      <span
                        className={cn(
                          "text-lg font-medium tracking-tight transition-colors duration-300 md:text-xl",
                          expanded ? "text-ink" : "text-ink-2 group-hover:text-ink",
                        )}
                      >
                        {item.q}
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    inert={!expanded}
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-(--ease-out-soft)",
                      expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-xl pb-6 pl-[30px] text-base leading-7 text-muted">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="group mt-8 inline-flex items-center gap-2 text-base font-medium text-ember-600 transition-colors duration-300 hover:text-ember-700"
          >
            Something else? Email the team
            <ArrowRight
              weight="bold"
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </Reveal>
      </Container>
    </section>
  );
}
