import {
  Ban,
  BadgeCheck,
  Check,
  Cookie,
  CreditCard,
  FileText,
  Gauge,
  Info,
  Lock,
  Mail,
  PenLine,
  Power,
  Scale,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tags,
  UserRound,
  Database,
  type LucideIcon,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { DocSection, TocLayout } from '@/components/layout/toc-layout';
import { SiteLink } from '@/components/ui/site-link';
import { cn } from '@/lib/cn';
import { LEGAL_DOCS, type LegalDoc } from '@/lib/legal';

const DOC_ICONS: Record<string, LucideIcon> = { terms: FileText, privacy: ShieldCheck, cookies: Cookie };

/** A plain-words version of each document, shown above it. The full text below is what counts. */
const IN_SHORT: Record<string, { lead: string; points: string[] }> = {
  privacy: {
    lead: 'We collect only what Prodmate needs to work, and your plans stay yours.',
    points: [
      'Your account, usage and projects, nothing more',
      'Never used to train AI models without your consent',
      'Encrypted in transit and stored securely',
    ],
  },
  terms: {
    lead: 'The rules for using Prodmate, written to be fair to both sides.',
    points: [
      'You own the plans and code you create',
      'Keep your account secure and use it lawfully',
      'Changes apply once they are posted here',
    ],
  },
  cookies: {
    lead: 'Small files that keep you signed in, remember your settings and keep Prodmate reliable.',
    points: [
      'Essential cookies for sign-in and security',
      'Others remember your settings and track performance',
      'Manage them in your browser; sign-in needs the essential ones',
    ],
  },
};

/** One picture per section, keyed by section id. Ids repeat across documents (introduction,
 * contact), and those mean the same thing in each. */
const SECTION_ICONS: Record<string, LucideIcon> = {
  introduction: Info,
  information: Database,
  security: Lock,
  contact: Mail,
  acceptance: BadgeCheck,
  description: Sparkles,
  accounts: UserRound,
  payment: CreditCard,
  ip: Scale,
  prohibited: Ban,
  availability: Server,
  liability: ShieldCheck,
  termination: Power,
  changes: PenLine,
  usage: Gauge,
  types: Tags,
  managing: SlidersHorizontal,
};

const sectionIcon = (id: string) => {
  const Icon = SECTION_ICONS[id] ?? FileText;
  return <Icon />;
};

/** Privacy, Terms and Cookies share one layout: a switcher between the three, a short summary,
 * then the numbered sections with a sidebar beside them. */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  const DocIcon = DOC_ICONS[doc.slug] ?? FileText;
  const short = IN_SHORT[doc.slug];

  return (
    <>
      <PageHeader eyebrow="Legal" title={doc.title}>
        Last updated {doc.updated}.
      </PageHeader>

      <div className="mx-auto mt-6 max-w-6xl px-4 sm:px-6">
        <nav
          aria-label="Legal"
          className="flex w-full gap-1 rounded-full border border-pm-line bg-pm-shell/70 p-1 sm:inline-flex sm:w-auto"
        >
          {LEGAL_DOCS.map((d) => {
            const on = d.slug === doc.slug;
            const Icon = DOC_ICONS[d.slug] ?? FileText;
            return (
              <SiteLink
                key={d.slug}
                href={`/${d.slug}`}
                aria-current={on ? 'page' : undefined}
                className={cn(
                  'inline-flex h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-2.5 text-sm transition-colors duration-150 sm:flex-none sm:px-4',
                  on
                    ? 'bg-pm-card text-pm-fg shadow-[0_1px_2px_rgb(0_0_0/0.08)] ring-1 ring-pm-line'
                    : 'text-pm-muted hover:text-pm-fg',
                )}
              >
                <Icon aria-hidden className={cn('size-3.5', on && 'text-pm-accent')} />
                {d.short}
              </SiteLink>
            );
          })}
        </nav>

        {short && (
          <div className="mt-6 flex flex-col gap-5 rounded-3xl border border-pm-line bg-[linear-gradient(135deg,rgb(108_92_231/0.08),transparent_55%)] p-5 sm:flex-row sm:items-center sm:gap-7 sm:p-7">
            {/* The document's picture: its icon on a violet tile with a soft glow. */}
            <div
              aria-hidden
              className="grid size-16 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(160deg,#8b7ff2,#5a4bd6)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_12px_28px_-10px_rgb(108_92_231/0.6)] sm:size-20"
            >
              <DocIcon className="size-8 sm:size-9" strokeWidth={1.6} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium tracking-[0.08em] text-pm-accent uppercase">In short</p>
              <p className="mt-1.5 text-[15px] font-medium text-pretty">{short.lead}</p>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-pm-muted sm:flex-row sm:flex-wrap sm:gap-x-5">
                {short.points.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-pm-accent" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <TocLayout
        groups={[{ items: doc.sections.map((s) => ({ id: s.id, label: s.title, icon: sectionIcon(s.id) })) }]}
      >
        {doc.sections.map((s, i) => (
          <DocSection key={s.id} id={s.id} icon={sectionIcon(s.id)} title={`${i + 1}. ${s.title}`}>
            {s.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {s.list && (
              <ul className="!list-none !pl-0">
                {s.list.map(([label, text]) => (
                  <li key={label} className="rounded-xl border border-pm-line p-4 text-sm">
                    <strong className="block">{label}</strong>
                    <span className="mt-1 block text-pm-muted">{text}</span>
                  </li>
                ))}
              </ul>
            )}
            {s.note && (
              <p className="flex gap-3 rounded-2xl border border-pm-primary/20 bg-pm-primary/5 p-4 text-sm">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-pm-accent" />
                <span>{s.note}</span>
              </p>
            )}
            {s.email && (
              <p>
                <a
                  href={`mailto:${s.email}`}
                  className="!inline-flex items-center gap-2.5 rounded-full border border-pm-line py-1.5 pr-4 pl-1.5 text-sm !no-underline transition-colors hover:border-pm-fg/25"
                >
                  <span className="grid size-7 place-items-center rounded-full bg-pm-primary/10 text-pm-accent">
                    <Mail aria-hidden className="size-3.5" />
                  </span>
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
