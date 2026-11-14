import {
  ArrowRight,
  ArrowUp,
  ChevronsUpDown,
  CircleQuestionMark,
  Code,
  Copy,
  CreditCard,
  Download,
  Eye,
  FileText,
  FolderKanban,
  Maximize2,
  MessageSquare,
  Mic,
  Plug,
  Plus,
  Search,
  Settings,
  Sparkles,
} from 'lucide-react';
import { LogoMark } from '@/components/landing/logo';
import { cn } from '@/lib/cn';

/** A still of the Prodmate chat app for the hero, drawn in code (like Tracwell's dashboard shot)
 * so it stays sharp at any size and matches the real app's layout: sidebar, a conversation with a
 * generated artifact, and the input. Decorative; the label describes it for screen readers. */
export function ChatPreview({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="The Prodmate workspace: a project chat where Prodmate has written the product requirements, with next steps and the message box"
      className={cn(
        'flex h-[460px] overflow-hidden rounded-xl border border-pm-line bg-pm-shell text-left select-none sm:h-[560px] lg:h-[620px]',
        className,
      )}
    >
      <div aria-hidden className="flex min-w-0 flex-1">
        <Sidebar />
        <div className="flex min-w-0 flex-1 p-1.5 md:pl-0">
          <Conversation />
        </div>
      </div>
    </div>
  );
}

const RECENT = [
  'PrepPilot AI Career Assistant',
  'Home Cooks Marketplace',
  'Clinic Appointment System',
  'Team Retro Board',
  'Fleet Tracking Dashboard',
];

function Sidebar() {
  return (
    <div className="hidden w-[208px] shrink-0 flex-col p-2.5 text-[12px] md:flex">
      <div className="flex h-9 items-center gap-2 px-1.5">
        <LogoMark className="size-5" />
        <span className="text-[14px] font-semibold tracking-tight">Prodmate</span>
      </div>

      <div className="mt-2 flex h-7 items-center gap-1.5 rounded-md border border-pm-line bg-pm-card px-2 text-[11px] text-pm-muted">
        <Search className="size-3" />
        <span className="flex-1">Search projects…</span>
        <span className="rounded border border-pm-line px-1 text-[9px]">Ctrl K</span>
      </div>

      <p className="mt-4 px-2 text-[9.5px] font-medium tracking-wide text-pm-muted uppercase">Main</p>
      <div className="mt-1 flex flex-col gap-0.5">
        <NavRow icon={<Plus />} label="New project" />
        <NavRow icon={<Plug />} label="Integrations" />
        <NavRow icon={<CreditCard />} label="Plans" />
      </div>

      <p className="mt-4 px-2 text-[9.5px] font-medium tracking-wide text-pm-muted uppercase">Recent</p>
      <div className="mt-1 flex flex-col gap-0.5">
        {RECENT.map((title, i) => (
          <div
            key={title}
            className={cn(
              'flex h-7 items-center gap-2 rounded-md px-2',
              i === 0 ? 'bg-pm-card font-medium shadow-[0_0_0_1px_var(--pm-line)]' : 'text-pm-fg/70',
            )}
          >
            <MessageSquare className={cn('size-3 shrink-0', i === 0 ? 'text-pm-accent' : 'text-pm-muted')} />
            <span className="truncate">{title}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-0.5">
        <NavRow icon={<Settings />} label="Settings" />
        <NavRow icon={<CircleQuestionMark />} label="Help center" />
        <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-pm-line bg-pm-card p-1.5">
          <span className="grid size-6 place-items-center rounded-md bg-pm-primary/12 text-[10px] font-semibold text-pm-accent">
            AK
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-[11.5px] font-medium">Alex Kim</span>
            <span className="block truncate text-[9.5px] text-pm-muted">alex@acme.dev</span>
          </span>
          <ChevronsUpDown className="size-3 text-pm-muted" />
        </div>
      </div>
    </div>
  );
}

function NavRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex h-7 items-center gap-2 rounded-md px-2 font-medium text-pm-fg/75 [&>svg]:size-3.5">
      {icon}
      {label}
    </div>
  );
}

function Conversation() {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-pm-line bg-pm-card">
      {/* Top bar */}
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 px-3">
        <span className="inline-flex h-6 min-w-0 items-center gap-1.5 rounded-md border border-pm-line px-2 text-[11px] font-medium text-pm-fg/80">
          <FolderKanban className="size-3 shrink-0 text-pm-muted" />
          <span className="truncate">PrepPilot AI Career Assistant</span>
        </span>
        <span className="inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border border-pm-line pr-2 pl-1.5 text-[11px]">
          <svg viewBox="0 0 18 18" className="size-3.5 -rotate-90">
            <circle cx="9" cy="9" r="7" fill="none" strokeWidth="2.5" className="stroke-pm-line" />
            <circle
              cx="9"
              cy="9"
              r="7"
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="44"
              strokeDashoffset="10"
              className="stroke-pm-primary"
            />
          </svg>
          <span className="font-medium tabular-nums">38.2K</span>
          <span className="text-pm-muted max-sm:hidden">tokens left</span>
        </span>
      </div>

      {/* Messages */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-4 pt-2 sm:px-8 lg:px-14">
        <div className="flex justify-end gap-2">
          <p className="max-w-[78%] rounded-2xl rounded-br-md bg-pm-shell px-3 py-2 text-[12px] leading-relaxed">
            Build a career platform for students: resume analysis, job tracking, interview prep and a skill
            gap analyzer.
          </p>
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-pm-primary/12 text-[9px] font-semibold text-pm-accent">
            AK
          </span>
        </div>

        <div className="flex gap-2.5">
          <span className="grid size-6 shrink-0 place-items-center rounded-lg border border-pm-line text-pm-fg">
            <LogoMark className="size-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex h-6 items-center gap-1.5 text-[11px]">
              <span className="font-semibold">ProdMate</span>
              <span className="text-pm-muted">10:42 AM</span>
            </div>
            <p className="text-[12px] leading-relaxed text-pm-fg/85">
              Here&apos;s the plan for <strong className="font-semibold">PrepPilot</strong>. I wrote the
              product requirements first; the API, database and roadmap are next.
            </p>

            <Artifact />

            <p className="mt-3 text-[9.5px] font-medium tracking-wide text-pm-muted uppercase">Next steps</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {['System config', 'Show API design', 'View DB schema'].map((label, i) => (
                <span
                  key={label}
                  className={cn(
                    'inline-flex h-6 items-center gap-1 rounded-full border px-2.5 text-[11px] font-medium',
                    i === 0
                      ? 'border-pm-primary/40 bg-pm-primary/[0.06] text-pm-accent'
                      : 'border-pm-line text-pm-fg/80',
                  )}
                >
                  <ArrowRight className="size-3" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input dock */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-pm-card via-pm-card/90 to-transparent" />
      <div className="relative shrink-0 px-4 pb-3 sm:px-8 lg:px-14">
        <div className="rounded-xl border border-pm-line bg-pm-card p-2 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.15)]">
          <p className="px-1 text-[11.5px] text-pm-muted">
            Ask about your project, write an email, schedule a meeting…
          </p>
          <div className="mt-2 flex items-center justify-between">
            <Mic className="size-3.5 text-pm-muted" />
            <span className="grid size-6 place-items-center rounded-lg bg-pm-primary text-white">
              <ArrowUp className="size-3.5" strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Artifact() {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-pm-line">
      <div className="flex items-center gap-2 border-b border-pm-line px-2.5 py-2">
        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-pm-primary/12 text-pm-accent">
          <FileText className="size-3.5" />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-[12px] font-semibold">Product requirements</div>
          <div className="truncate text-[10px] text-pm-muted">prd.md · 182 lines · 1,240 words</div>
        </div>
        <div className="hidden items-center gap-1.5 sm:flex">
          <span className="flex rounded-md border border-pm-line bg-pm-shell p-0.5 text-[9.5px] font-medium">
            <span className="flex items-center gap-1 rounded bg-pm-card px-1.5 py-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
              <Eye className="size-2.5" />
              Preview
            </span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 text-pm-muted">
              <Code className="size-2.5" />
              Source
            </span>
          </span>
          <Copy className="size-3 text-pm-muted" />
          <Download className="size-3 text-pm-muted" />
          <Maximize2 className="size-3 text-pm-muted" />
        </div>
      </div>

      <div className="relative px-3.5 pt-3 pb-1 text-[11px] leading-relaxed text-pm-fg/75">
        <p className="text-[13px] font-semibold text-pm-fg">PrepPilot — Product Requirements</p>
        <p className="mt-2 text-[11.5px] font-semibold text-pm-fg">Executive summary</p>
        <p className="mt-1">
          A SaaS platform that helps students and new graduates manage their job search: AI resume analysis,
          an application tracker, interview practice and a skill gap report.
        </p>
        <p className="mt-2.5 text-[11.5px] font-semibold text-pm-fg">Core features</p>
        <ul className="mt-1 flex flex-col gap-1">
          {[
            ['Resume analyzer', 'ATS score and fixes for each job'],
            ['Job tracker', 'every application from saved to offer'],
            ['Interview prep', 'role-specific questions with feedback'],
          ].map(([name, desc]) => (
            <li key={name} className="flex items-start gap-2">
              <span className="mt-[6px] size-1 shrink-0 rounded-full bg-pm-primary/70" />
              <span>
                <strong className="font-semibold text-pm-fg">{name}</strong>: {desc}
              </span>
            </li>
          ))}
        </ul>
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-pm-card to-transparent" />
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-pm-line bg-pm-shell/50 px-2.5 py-1.5">
        <span className="truncate text-[10px] text-pm-muted">
          Want changes? Only this artifact regenerates.
        </span>
        <span className="inline-flex h-5 shrink-0 items-center gap-1 rounded-full border border-pm-line bg-pm-card px-2 text-[10px] font-medium">
          <Sparkles className="size-2.5" />
          Edit with AI
        </span>
      </div>
    </div>
  );
}
