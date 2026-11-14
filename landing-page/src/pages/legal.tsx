import { Cookie, FileText, Mail, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { DocSection, TocLayout } from '@/components/layout/toc-layout';
import { SiteLink } from '@/components/ui/site-link';
import { cn } from '@/lib/cn';
import { LEGAL_DOCS, type LegalDoc } from '@/lib/legal';

const LEGAL_ICONS: Record<string, ReactNode> = {
  terms: <FileText />,
  privacy: <ShieldCheck />,
  cookies: <Cookie />,
};

/** Privacy, Terms and Cookies share one layout: numbered sections with their contents beside them,
 * and tabs to switch between the three. */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <PageHeader eyebrow="Legal" title={doc.title}>
        Last updated {doc.updated}.
      </PageHeader>
      <div className="mx-auto mt-6 max-w-6xl px-4 sm:px-6">
        <nav
          aria-label="Legal"
          className="inline-flex gap-1 rounded-full border border-pm-line bg-pm-shell/70 p-1"
        >
          {LEGAL_DOCS.map((d) => {
            const on = d.slug === doc.slug;
            return (
              <SiteLink
                key={d.slug}
                href={`/${d.slug}`}
                aria-current={on ? 'page' : undefined}
                className={cn(
                  'inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-sm transition-colors duration-150',
                  on
                    ? 'bg-pm-card text-pm-fg shadow-[0_1px_2px_rgb(0_0_0/0.08)] ring-1 ring-pm-line'
                    : 'text-pm-muted hover:text-pm-fg',
                )}
              >
                <span aria-hidden className={cn('[&_svg]:size-3.5', on && 'text-pm-accent')}>
                  {LEGAL_ICONS[d.slug]}
                </span>
                {d.short}
              </SiteLink>
            );
          })}
        </nav>
      </div>
      <TocLayout groups={[{ items: doc.sections.map((s) => ({ id: s.id, label: s.title })) }]}>
        {doc.sections.map((s, i) => (
          <DocSection key={s.id} id={s.id} title={`${i + 1}. ${s.title}`}>
            {s.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {s.list && (
              <ul>
                {s.list.map(([label, text]) => (
                  <li key={label}>
                    <strong>{label}:</strong> {text}
                  </li>
                ))}
              </ul>
            )}
            {s.note && (
              <p className="rounded-2xl border border-pm-line bg-pm-shell/60 p-4 text-sm">{s.note}</p>
            )}
            {s.email && (
              <p>
                <a href={`mailto:${s.email}`} className="inline-flex items-center gap-2 font-mono text-sm">
                  <Mail aria-hidden className="size-4 text-pm-muted" />
                  {s.email}
                </a>
              </p>
            )}
          </DocSection>
        ))}
      </TocLayout>
    </>
  );
}
