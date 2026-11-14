import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, m, useInView, useReducedMotion } from 'motion/react';
import { CalendarDays, Check, FileText, Folder, Mail, Send } from 'lucide-react';
import { BrandMark } from '@/components/ui/brand-mark';
import { BRANDS, type Brand } from '@/lib/brands';
import { cn } from '@/lib/cn';
import { EASE } from '@/lib/motion';

type Tool = Exclude<Brand, 'markdown'>;

const TOOLS: { id: Tool; action: string; panel: () => ReactNode }[] = [
  { id: 'github', action: 'Repository created', panel: GitHubPanel },
  { id: 'jira', action: 'Epic and stories created', panel: JiraPanel },
  { id: 'notion', action: 'Docs synced', panel: NotionPanel },
  { id: 'gmail', action: 'Summary sent', panel: GmailPanel },
  { id: 'calendar', action: 'Sprints scheduled', panel: CalendarPanel },
];

const TAB_MS = 4200;

/** One plan sent to five tools. The tabs play through by themselves while on screen; picking one
 * stops the autoplay so it stays put. */
export function IntegrationsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-80px' });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!inView || reduce || !auto) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % TOOLS.length), TAB_MS);
    return () => clearTimeout(id);
  }, [inView, reduce, auto, active]);

  const tool = TOOLS[active];
  const Panel = tool.panel;

  return (
    <div ref={ref} className="w-full">
      <div role="tablist" aria-label="Integrations" className="flex flex-wrap justify-center gap-1.5">
        {TOOLS.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={i === active}
            aria-controls="integration-panel"
            onClick={() => {
              setActive(i);
              setAuto(false);
            }}
            className={cn(
              'relative inline-flex h-9 cursor-pointer items-center gap-2 rounded-full px-3.5 text-sm transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-pm-accent/50',
              i === active
                ? 'bg-white text-pm-fg shadow-sm'
                : 'text-pm-fg/70 hover:bg-white/50 hover:text-pm-fg',
            )}
          >
            <BrandMark brand={t.id} color={i === active} className="size-4" />
            {BRANDS[t.id].name}
            {auto && i === active && !reduce && (
              <m.span
                key={`bar-${active}`}
                aria-hidden
                className="absolute inset-x-3 bottom-1 h-px origin-left bg-pm-primary/60"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: inView ? 1 : 0 }}
                transition={{ duration: TAB_MS / 1000, ease: 'linear' }}
              />
            )}
          </button>
        ))}
      </div>

      <div
        id="integration-panel"
        role="tabpanel"
        aria-labelledby={`tab-${tool.id}`}
        className="mx-auto mt-6 w-full max-w-lg overflow-hidden rounded-xl bg-white"
      >
        <div className="flex items-center gap-2 border-b border-pm-line px-4 py-3 text-sm">
          <BrandMark brand={tool.id} color className="size-4" />
          <span className="font-medium">{BRANDS[tool.id].name}</span>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-pm-accent">
            <Check aria-hidden className="size-3.5" />
            {tool.action}
          </span>
        </div>
        <div className="h-[244px] p-4 text-sm">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={tool.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <Panel />
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** Rows that arrive one after another. */
function Stagger({ children, className }: { children: ReactNode[]; className?: string }) {
  return (
    <ul className={className}>
      {children.map((child, i) => (
        <m.li
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: EASE, delay: 0.15 + i * 0.12 }}
        >
          {child}
        </m.li>
      ))}
    </ul>
  );
}

function GitHubPanel() {
  const files = ['README.md', 'Dockerfile', 'docker-compose.yml', '.github/workflows/ci.yml', 'src/'];
  return (
    <>
      <p className="font-mono text-[13px]">
        <span className="text-pm-muted">you /</span> ai-bookmark-manager
      </p>
      <Stagger className="mt-3 divide-y divide-pm-line rounded-lg border border-pm-line font-mono text-[12.5px]">
        {files.map((f) => (
          <span key={f} className="flex items-center gap-2 px-3 py-1.5">
            {f.endsWith('/') ? (
              <Folder aria-hidden className="size-3.5 text-pm-muted" />
            ) : (
              <FileText aria-hidden className="size-3.5 text-pm-muted" />
            )}
            <span className="flex-1 truncate">{f}</span>
            <span className="text-[11px] text-pm-muted">Initial plan</span>
          </span>
        ))}
      </Stagger>
    </>
  );
}

function JiraPanel() {
  const stories = [
    { key: 'ENG-2', title: 'Save a bookmark from any page', points: 3 },
    { key: 'ENG-3', title: 'Tag bookmarks with AI', points: 5 },
    { key: 'ENG-4', title: 'Search by tag or title', points: 3 },
    { key: 'ENG-5', title: 'Sign in with Google', points: 2 },
  ];
  return (
    <>
      <p className="flex items-center gap-2">
        <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[11px] font-medium text-violet-800">
          Epic
        </span>
        <span className="font-mono text-xs text-pm-muted">ENG-1</span>
        <span className="truncate font-medium">AI Bookmark Manager MVP</span>
      </p>
      <Stagger className="mt-3 flex flex-col gap-1.5">
        {stories.map((s) => (
          <span
            key={s.key}
            className="flex items-center gap-2 rounded-lg border border-pm-line px-3 py-1.5 text-[13px]"
          >
            <span className="size-2 rounded-sm bg-emerald-500" aria-hidden />
            <span className="font-mono text-xs text-pm-muted">{s.key}</span>
            <span className="min-w-0 flex-1 truncate">{s.title}</span>
            <span className="rounded-full bg-pm-shell px-1.5 text-[11px] text-pm-muted tabular-nums">
              {s.points}
            </span>
          </span>
        ))}
      </Stagger>
    </>
  );
}

function NotionPanel() {
  const pages = ['Product requirements', 'Database schema', 'API design', 'Roadmap', 'User stories'];
  return (
    <>
      <p className="text-[15px] font-medium">📁 Blueprint: AI Bookmark Manager</p>
      <Stagger className="mt-3 flex flex-col">
        {pages.map((p) => (
          <span
            key={p}
            className="flex items-center gap-2 rounded-md px-1.5 py-1.5 text-[13px] hover:bg-pm-shell"
          >
            <FileText aria-hidden className="size-3.5 text-pm-muted" />
            <span className="underline decoration-pm-line underline-offset-4">{p}</span>
          </span>
        ))}
      </Stagger>
    </>
  );
}

function GmailPanel() {
  return (
    <div className="text-[13px]">
      <Stagger className="flex flex-col divide-y divide-pm-line">
        {[
          <span key="to" className="flex gap-2 py-1.5">
            <span className="w-14 text-pm-muted">To</span>team@acme.dev, founders@acme.dev
          </span>,
          <span key="subject" className="flex gap-2 py-1.5">
            <span className="w-14 text-pm-muted">Subject</span>
            <span className="truncate">Blueprint ready: AI Bookmark Manager</span>
          </span>,
          <span key="body" className="block py-2 leading-relaxed text-pm-muted">
            Milestones, tech stack and core APIs are summarised below, with the full blueprint attached.
          </span>,
          <span key="sent" className="flex items-center gap-2 py-2 text-pm-accent">
            <Send aria-hidden className="size-3.5" />
            Sent from your Google account
            <Mail aria-hidden className="ml-auto size-3.5 text-pm-muted" />
          </span>,
        ]}
      </Stagger>
    </div>
  );
}

function CalendarPanel() {
  const events = [
    { day: 'Mon 3', title: 'Sprint 1 kickoff', tone: 'bg-blue-500' },
    { day: 'Thu 6', title: 'Mid-sprint check-in', tone: 'bg-violet-500' },
    { day: 'Fri 14', title: 'Code freeze', tone: 'bg-amber-500' },
    { day: 'Mon 17', title: 'MVP review demo', tone: 'bg-emerald-500' },
  ];
  return (
    <>
      <p className="flex items-center gap-2 text-[13px] text-pm-muted">
        <CalendarDays aria-hidden className="size-4" />
        From your roadmap · 2-week sprints
      </p>
      <Stagger className="mt-3 flex flex-col gap-1.5">
        {events.map((e) => (
          <span
            key={e.title}
            className="flex items-center gap-3 rounded-lg border border-pm-line px-3 py-2 text-[13px]"
          >
            <span className="w-12 text-xs text-pm-muted tabular-nums">{e.day}</span>
            <span className={cn('h-4 w-1 rounded-full', e.tone)} aria-hidden />
            <span className="truncate">{e.title}</span>
          </span>
        ))}
      </Stagger>
    </>
  );
}
