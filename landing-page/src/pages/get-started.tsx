import { ArrowRight, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { BrandMark } from '@/components/ui/brand-mark';
import { ButtonLink } from '@/components/ui/button-link';
import { Reveal } from '@/components/ui/reveal';
import type { Brand } from '@/lib/brands';
import { links } from '@/lib/site';

const EXAMPLE =
  'A clinic management platform where patients book appointments, doctors manage their schedules and administrators oversee operations.';

const TOOLS: Brand[] = ['github', 'notion', 'jira', 'gmail', 'calendar'];

const STEPS = [
  {
    title: 'Create your account',
    body: 'Sign up with your Google or GitHub account. Prodmate is free while it’s in beta.',
  },
  {
    title: 'Describe your product',
    body: 'Start a project and explain what you’re building, who it’s for and the problem it solves. Plain language is enough.',
    example: EXAMPLE,
  },
  {
    title: 'Generate the plan',
    body: 'One click writes the nine documents: requirements, tech stack, database schema, API design, folder structure, Docker, CI/CD, testing plan and the combined blueprint.',
  },
  {
    title: 'Refine it with the assistant',
    body: 'Ask for changes in the chat, like a new column or a different database, or regenerate a single document and keep the rest.',
  },
  {
    title: 'Send it to your tools',
    body: 'Connect a tool with its normal sign-in and export from the toolbar.',
    tools: true,
  },
];

export function GetStartedPage() {
  return (
    <>
      <PageHeader eyebrow="Get started" title="Your first plan in five steps.">
        From an empty workspace to a plan in your team’s tools. It takes a few minutes.
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-24 sm:px-6 sm:pt-10">
        <ol className="flex flex-col gap-4">
          {STEPS.map((step, i) => (
            <Reveal
              as="li"
              key={step.title}
              delay={i * 0.04}
              className="grid gap-4 rounded-3xl border border-pm-line p-6 sm:grid-cols-[64px_1fr] sm:p-8"
            >
              <span className="font-mono text-xs text-pm-muted tabular-nums">0{i + 1}</span>
              <div>
                <p className="text-[17px] font-medium">{step.title}</p>
                <p className="mt-1.5 max-w-2xl text-sm text-pretty text-pm-muted">{step.body}</p>
                {step.example && (
                  <p className="mt-4 max-w-2xl rounded-xl border border-pm-line bg-pm-shell/60 px-4 py-3 text-[13px]">
                    <span className="text-pm-muted">Example · </span>
                    {step.example}
                  </p>
                )}
                {step.tools && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {TOOLS.map((t) => (
                      <li key={t} className="flex h-9 items-center rounded-full border border-pm-line px-3">
                        <BrandMark brand={t} color className="size-4" />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap items-center gap-2.5">
          <ButtonLink href={links.app} variant="primary">
            Start planning
            <Sparkles aria-hidden />
          </ButtonLink>
          <ButtonLink href={links.docs}>
            Read the docs
            <ArrowRight aria-hidden />
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
