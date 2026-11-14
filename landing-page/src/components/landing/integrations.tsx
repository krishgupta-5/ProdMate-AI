import { IntegrationsDemo } from '@/components/demos/integrations-demo';
import { Wallpaper } from '@/components/landing/wallpaper';
import { BrandMark } from '@/components/ui/brand-mark';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { BRANDS, type Brand } from '@/lib/brands';

const CARDS: { brand: Brand; body: string }[] = [
  { brand: 'github', body: 'A new repo with your folder tree, Docker files, CI workflow and README.' },
  { brand: 'jira', body: 'An epic for the project, with every user story as a pointed ticket.' },
  { brand: 'notion', body: 'Your plan as Notion pages, with real tables and toggle lists.' },
  { brand: 'gmail', body: 'A summary of milestones, stack and APIs, sent from your own address.' },
  { brand: 'calendar', body: 'Kickoffs, check-ins, code freezes and demos booked from your roadmap.' },
  { brand: 'markdown', body: 'The whole blueprint as one .md file, to keep or send anywhere.' },
];

export function Integrations() {
  return (
    <section id="integrations" className="mx-auto max-w-6xl scroll-mt-20 px-4 sm:px-6">
      <SectionHeading eyebrow="Integrations" title="Send the plan where the work happens.">
        Connect a tool with its normal sign-in, then export in one click. Nothing is sent until you choose to.
      </SectionHeading>
      <Reveal className="mt-10 rounded-3xl border border-pm-line p-2">
        <Wallpaper scene="dusk" className="px-3 py-10 sm:px-10 sm:py-14">
          <IntegrationsDemo />
        </Wallpaper>
      </Reveal>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map(({ brand, body }, i) => (
          <Reveal
            as="li"
            key={brand}
            delay={(i % 3) * 0.06}
            className="rounded-2xl border border-pm-line p-5"
          >
            <p className="flex items-center gap-2.5 text-[15px] font-medium">
              <BrandMark brand={brand} color className="size-5" />
              {BRANDS[brand].name}
            </p>
            <p className="mt-2 text-sm text-pretty text-pm-muted">{body}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
