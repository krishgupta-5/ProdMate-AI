import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, m, useInView, useReducedMotion } from 'motion/react';
import {
  ArrowUp,
  Braces,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Cpu,
  Database,
  FileText,
  Folder,
  FolderTree,
  GitBranch,
  GitCommitHorizontal,
  LoaderCircle,
  Lock,
  Mic,
  PanelLeft,
  PartyPopper,
  Plus,
  RotateCw,
  Share,
  Sparkles,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import { LogoMark } from '@/components/landing/logo';
import { BrandMark } from '@/components/ui/brand-mark';
import { cn } from '@/lib/cn';
import { EASE } from '@/lib/motion';

/** One example project, followed from the first prompt to every tool it lands in. */
const PROJECT = 'Home Cooks Marketplace';
const SLUG = 'home-cooks-marketplace';
const PROMPT = 'A marketplace where home cooks sell meals to neighbours, with orders, reviews and payouts';

/** The tour's chapters, in order. Each runs for `ms`, then the next; after the last it starts over. */
const SCENES = [
  { id: 'describe', ms: 4800, url: 'chat.prodmate.dev', label: 'Describe your product in plain words' },
  { id: 'generate', ms: 4400, url: `chat.prodmate.dev/${SLUG}`, label: 'Prodmate writes the whole plan' },
  { id: 'prd', ms: 4600, url: `chat.prodmate.dev/${SLUG}`, label: 'Every document is readable Markdown' },
  { id: 'api', ms: 4600, url: `chat.prodmate.dev/${SLUG}`, label: 'Change any document by asking' },
  { id: 'export', ms: 4200, url: `chat.prodmate.dev/${SLUG}`, label: 'Send it all with one click each' },
  {
    id: 'github',
    ms: 5000,
    url: `github.com/alexkim/${SLUG}`,
    label: 'GitHub: a repo with the docs and structure',
  },
  { id: 'jira', ms: 5000, url: 'alexkim.atlassian.net/jira/HCM', label: 'Jira: user stories become tickets' },
  {
    id: 'notion',
    ms: 5000,
    url: 'notion.so/Home-Cooks-Marketplace',
    label: 'Notion: each document as a page',
  },
] as const;
type SceneId = (typeof SCENES)[number]['id'];

const TICK = 50;

/**
 * Keeps time for the tour while it's on screen: which scene is showing and how far into it we are.
 * Pauses off screen. With reduced motion it holds one finished scene and never moves.
 */
function useTourClock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-80px' });
  const reduce = useReducedMotion();
  const [clock, setClock] = useState({ scene: 0, t: 0 });

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => {
      setClock(({ scene, t }) => {
        const next = t + TICK;
        if (next < SCENES[scene].ms) return { scene, t: next };
        return { scene: (scene + 1) % SCENES.length, t: 0 };
      });
    }, TICK);
    return () => clearInterval(id);
  }, [inView, reduce]);

  if (reduce) {
    const still = SCENES.findIndex((s) => s.id === 'github');
    return { ref, scene: still, t: SCENES[still].ms, still: true };
  }
  return { ref, ...clock, still: false };
}

/** A quick, always-playing tour of Prodmate in a Safari window, following one project from the
 * prompt to its GitHub repo, Jira board and Notion pages. No controls; it plays while in view and
 * loops. Decorative, so the chapters are also listed as text for screen readers. */
export function TourDemo() {
  const { ref, scene, t, still } = useTourClock();
  const current = SCENES[scene];

  return (
    <div ref={ref}>
      <SafariWindow url={current.url}>
        <div aria-hidden className="relative h-[420px] overflow-hidden bg-white sm:h-[500px] lg:h-[560px]">
          {/* Each scene fades in on its own (no waiting on the previous one's exit), so the window
              is never blank between scenes. */}
          <m.div
            key={current.id}
            className="absolute inset-0"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <Scene id={current.id} t={t} />
          </m.div>
          {/* One pointer over every scene, so the tour reads like a screen recording. */}
          {!still && <TourCursor id={current.id} t={t} />}
        </div>
      </SafariWindow>

      {/* Chapter caption and a timeline, like a video's progress bar (but not a control). */}
      <div className="mt-5 flex flex-col items-center gap-3">
        <p className="flex min-h-5 items-center gap-2 text-center font-mono text-[11px] tracking-wider text-pm-muted uppercase">
          <span className="shrink-0 text-pm-accent">
            {String(scene + 1).padStart(2, '0')}/{String(SCENES.length).padStart(2, '0')}
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={current.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="text-pm-fg"
            >
              {current.label}
            </m.span>
          </AnimatePresence>
        </p>
        <div aria-hidden className="flex w-full max-w-sm gap-1">
          {SCENES.map((s, i) => (
            <span key={s.id} className="h-1 flex-1 overflow-hidden rounded-full bg-pm-line">
              <span
                className="block h-full rounded-full bg-pm-primary"
                style={{ width: i < scene || still ? '100%' : i === scene ? `${(t / s.ms) * 100}%` : '0%' }}
              />
            </span>
          ))}
        </div>
      </div>
      <ol className="sr-only">
        {SCENES.map((s) => (
          <li key={s.id}>{s.label}</li>
        ))}
      </ol>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Safari window
// ─────────────────────────────────────────────────────────────────────────────

function SafariWindow({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_32px_80px_-28px_rgba(79,63,196,0.35),0_12px_32px_-12px_rgba(0,0,0,0.14)]">
      <div className="flex h-11 items-center gap-3 border-b border-black/[0.07] bg-[#f6f6f6] px-3.5">
        <div className="flex gap-2" aria-hidden>
          <span className="size-3 rounded-full bg-[#ff5f57] ring-1 ring-black/10 ring-inset" />
          <span className="size-3 rounded-full bg-[#febc2e] ring-1 ring-black/10 ring-inset" />
          <span className="size-3 rounded-full bg-[#28c840] ring-1 ring-black/10 ring-inset" />
        </div>
        <div aria-hidden className="hidden items-center gap-2.5 text-black/40 sm:flex [&_svg]:size-4">
          <PanelLeft />
          <ChevronLeft />
          <ChevronRight className="text-black/20" />
        </div>
        <div className="mx-auto flex h-7 w-full max-w-sm items-center justify-center gap-1.5 rounded-md bg-black/[0.05] px-3 text-[12px] text-black/70">
          <Lock aria-hidden className="size-3 shrink-0 text-black/45" />
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={url}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="truncate"
            >
              {url}
            </m.span>
          </AnimatePresence>
          <RotateCw aria-hidden className="ml-auto size-3 shrink-0 text-black/35" />
        </div>
        <div aria-hidden className="hidden items-center gap-3 text-black/40 sm:flex [&_svg]:size-4">
          <Share />
          <Plus />
        </div>
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scenes
// ─────────────────────────────────────────────────────────────────────────────

function Scene({ id, t }: { id: SceneId; t: number }) {
  switch (id) {
    case 'describe':
      return <DescribeScene t={t} />;
    case 'generate':
      return <GenerateScene t={t} />;
    case 'prd':
      return <PrdScene t={t} />;
    case 'api':
      return <ApiScene t={t} />;
    case 'export':
      return <ExportScene t={t} />;
    case 'github':
      return <GitHubScene t={t} />;
    case 'jira':
      return <JiraScene t={t} />;
    case 'notion':
      return <NotionScene t={t} />;
  }
}

/** How many of `count` items have appeared by time `t`, one every `each` ms after `start`. */
const reveal = (t: number, start: number, each: number, count: number) =>
  Math.max(0, Math.min(count, Math.floor((t - start) / each) + 1));

/** The app's top bar, so every Prodmate scene reads as the same product. */
function AppBar({ title }: { title: string }) {
  return (
    <div className="flex h-11 items-center justify-between border-b border-pm-line px-4">
      <span className="flex min-w-0 items-center gap-2 text-[13px] font-semibold tracking-tight">
        <LogoMark className="size-5 shrink-0" />
        <span className="hidden sm:inline">Prodmate</span>
        <span className="truncate font-normal text-pm-muted sm:ml-1">/ {title}</span>
      </span>
      <span className="flex h-6 shrink-0 items-center gap-1.5 rounded-full border border-pm-line px-2 text-[11px]">
        <span className="size-2 rounded-full bg-pm-primary" />
        <span className="font-medium tabular-nums">41.6K</span>
        <span className="text-pm-muted">tokens</span>
      </span>
    </div>
  );
}

/** 1: the home screen, the idea typed in, then sent. */
function DescribeScene({ t }: { t: number }) {
  const typeEnd = 3300;
  const chars = Math.min(PROMPT.length, Math.floor((t / typeEnd) * PROMPT.length));
  const typing = chars < PROMPT.length;
  const pressing = t > 4100;

  return (
    <div className="flex h-full flex-col">
      <AppBar title="New project" />
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <span
          className="size-11 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 32% 28%,#fff 0%,rgba(255,255,255,0) 32%),radial-gradient(circle at 70% 75%,#3b82f6 0%,rgba(59,130,246,0) 55%),radial-gradient(circle at 50% 50%,#8b7cf6 0%,#6c5ce7 55%,#4f3fc4 100%)',
          }}
        />
        <p className="mt-5 text-[22px] font-semibold tracking-tight sm:text-[26px]">Good morning, Alex</p>
        <p className="mt-1.5 text-center text-[13px] text-pm-muted">
          Describe a software idea. Prodmate writes the plan.
        </p>

        <div className="relative mt-6 w-full max-w-lg rounded-2xl border border-pm-primary/40 bg-white p-3 shadow-[0_0_0_4px_rgba(108,92,231,0.1),0_12px_32px_-12px_rgba(0,0,0,0.12)]">
          <p className="min-h-10 px-1 text-[14px] leading-relaxed">
            {PROMPT.slice(0, chars)}
            {typing && (
              <span className="ml-px inline-block h-4 w-px translate-y-0.5 animate-pulse bg-pm-fg" />
            )}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <Mic className="size-4 text-pm-muted" />
            <span
              className={cn(
                'grid size-8 place-items-center rounded-xl text-white transition-[background-color,transform] duration-200',
                typing ? 'bg-pm-primary/40' : 'bg-pm-primary',
                pressing && 'scale-90',
              )}
            >
              <ArrowUp className="size-4" strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const DOCS: { name: string; file: string; icon: LucideIcon }[] = [
  { name: 'Product requirements', file: 'prd.md', icon: FileText },
  { name: 'User stories', file: 'user-stories.md', icon: FileText },
  { name: 'Database schema', file: 'schema.mmd', icon: Database },
  { name: 'API design', file: 'api-design.md', icon: Braces },
  { name: 'Folder structure', file: 'structure.txt', icon: FolderTree },
  { name: 'Tech stack', file: 'config.yaml', icon: Cpu },
  { name: 'CI/CD pipeline', file: 'ci.yml', icon: Workflow },
  { name: 'Roadmap', file: 'roadmap.md', icon: FileText },
];

/** 2: the prompt in the chat, and the documents finishing one by one. */
function GenerateScene({ t }: { t: number }) {
  const done = reveal(t, 600, 420, DOCS.length);
  const finished = t > 600 + DOCS.length * 420;

  return (
    <div className="flex h-full flex-col">
      <AppBar title={PROJECT} />
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-5 pt-5">
        <div className="flex justify-end">
          <p className="max-w-[80%] rounded-2xl rounded-br-md bg-pm-shell px-3.5 py-2.5 text-[13px] leading-relaxed">
            {PROMPT}
          </p>
        </div>
        <div className="flex gap-3">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-pm-line">
            <LogoMark className={cn('size-4', !finished && 'animate-pulse')} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between text-[12.5px]">
              <span className="font-semibold">{finished ? 'Your plan is ready' : 'Writing your plan…'}</span>
              <span className="text-pm-muted tabular-nums">
                {done}/{DOCS.length} documents
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-pm-shell">
              <div
                className="h-full rounded-full bg-pm-primary transition-[width] duration-300"
                style={{ width: `${(done / DOCS.length) * 100}%` }}
              />
            </div>
            <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {DOCS.map(({ name, file, icon: Icon }, i) => {
                const ok = i < done;
                return (
                  <li
                    key={name}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12.5px] transition-colors duration-300',
                      ok ? 'border-pm-line bg-white' : 'border-dashed border-pm-line text-pm-muted',
                    )}
                  >
                    <Icon className="size-3.5 shrink-0 text-pm-muted" />
                    <span className="min-w-0 flex-1 truncate">{name}</span>
                    <span className="hidden font-mono text-[10px] text-pm-muted sm:inline">{file}</span>
                    {ok ? (
                      <m.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        <Check className="size-3.5 text-pm-accent" />
                      </m.span>
                    ) : (
                      <LoaderCircle className="size-3.5 animate-spin" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/** A generated document's card, as in the app. */
function DocCard({
  icon: Icon,
  color,
  title,
  meta,
  children,
  footer,
}: {
  icon: LucideIcon;
  color: string;
  title: string;
  meta: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-pm-line bg-white">
      <div className="flex items-center gap-2.5 border-b border-pm-line px-3 py-2.5">
        <span
          className="grid size-8 place-items-center rounded-lg"
          style={{ color, background: `${color}18` }}
        >
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-[13px] font-semibold">{title}</p>
          <p className="truncate text-[11px] text-pm-muted">{meta}</p>
        </div>
        <span className="hidden rounded-md border border-pm-line bg-pm-shell p-0.5 text-[10.5px] font-medium sm:flex">
          <span className="rounded bg-white px-1.5 py-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">Preview</span>
          <span className="px-1.5 py-0.5 text-pm-muted">Source</span>
        </span>
      </div>
      {children}
      {footer}
    </div>
  );
}

/** One section of the PRD, shown once `shown` reaches it. */
function Part({ i, shown, children }: { i: number; shown: number; children: ReactNode }) {
  if (i >= shown) return null;
  return (
    <m.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {children}
    </m.div>
  );
}

/** 3: the PRD rendered from Markdown, section by section. */
function PrdScene({ t }: { t: number }) {
  const parts = reveal(t, 200, 520, 5);

  return (
    <div className="flex h-full flex-col">
      <AppBar title={PROJECT} />
      <div className="mx-auto w-full max-w-2xl flex-1 px-5 pt-5">
        <DocCard
          icon={FileText}
          color="#6d28d9"
          title="Product requirements"
          meta="prd.md · 214 lines · 1,380 words"
        >
          <div className="px-4 py-3.5 text-[12.5px] leading-relaxed text-pm-fg/80">
            <Part i={0} shown={parts}>
              <p className="text-[16px] font-semibold tracking-tight text-pm-fg">
                {PROJECT}: Product Requirements
              </p>
            </Part>
            <Part i={1} shown={parts}>
              <p className="mt-3 text-[13px] font-semibold text-pm-fg">Problem</p>
              <p className="mt-1">
                Home cooks have no simple way to sell meals locally, and neighbours can&apos;t find home-made
                food nearby.
              </p>
            </Part>
            <Part i={2} shown={parts}>
              <p className="mt-3 text-[13px] font-semibold text-pm-fg">Users</p>
              <div className="mt-1.5 overflow-hidden rounded-lg border border-pm-line text-[11.5px]">
                {[
                  ['Cook', 'Lists meals, accepts orders, gets paid weekly'],
                  ['Buyer', 'Finds meals nearby, orders, leaves a review'],
                ].map(([role, need], r) => (
                  <div
                    key={role}
                    className={cn('flex gap-3 px-2.5 py-1.5', r === 0 && 'border-b border-pm-line')}
                  >
                    <span className="w-14 shrink-0 font-semibold text-pm-fg">{role}</span>
                    <span>{need}</span>
                  </div>
                ))}
              </div>
            </Part>
            <Part i={3} shown={parts}>
              <p className="mt-3 text-[13px] font-semibold text-pm-fg">MVP scope</p>
              <ul className="mt-1 flex flex-col gap-1">
                {[
                  'Meal listings with photos and pickup times',
                  'Orders and in-app payments',
                  'Ratings and reviews',
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-pm-primary/70" />
                    {x}
                  </li>
                ))}
              </ul>
            </Part>
            <Part i={4} shown={parts}>
              <p className="mt-3 flex items-center gap-1.5 rounded-lg border border-[#1d4ed8]/20 bg-[#1d4ed8]/[0.05] px-2.5 py-1.5 text-[11.5px]">
                <span className="font-semibold text-[#1d4ed8]">Success metric</span> 200 weekly orders in the
                first city
              </p>
            </Part>
          </div>
        </DocCard>
      </div>
    </div>
  );
}

const ENDPOINTS = [
  { method: 'GET', path: '/meals', desc: 'Browse meals near you' },
  { method: 'POST', path: '/orders', desc: 'Place an order' },
  { method: 'PATCH', path: '/orders/:id', desc: 'Update order status' },
  { method: 'GET', path: '/cooks/:id/payouts', desc: 'A cook’s earnings' },
];
const ADDED = { method: 'POST', path: '/meals/:id/reviews', desc: 'Rate a meal' };
const METHOD_COLOR: Record<string, string> = { GET: '#15803d', POST: '#1d4ed8', PATCH: '#6d28d9' };

/** 4: the API design, then an edit request, then the new endpoint appears. */
function ApiScene({ t }: { t: number }) {
  const shown = reveal(t, 0, 320, ENDPOINTS.length);
  const asking = t > 1700;
  const updated = t > 3300;
  const rows = updated ? [...ENDPOINTS, ADDED] : ENDPOINTS.slice(0, shown);

  return (
    <div className="flex h-full flex-col">
      <AppBar title={PROJECT} />
      <div className="mx-auto w-full max-w-2xl flex-1 px-5 pt-5">
        <DocCard
          icon={Braces}
          color="#15803d"
          title="API design"
          meta={`api-design.md · 4 resources · ${updated ? 19 : 18} endpoints`}
          footer={
            <div className="flex items-center justify-between gap-2 border-t border-pm-line bg-pm-shell/60 px-3 py-2">
              <span className="truncate text-[11px] text-pm-muted">
                {updated ? 'Updated. The other documents were kept.' : 'Only this document regenerates.'}
              </span>
              <span
                className={cn(
                  'flex h-6 shrink-0 items-center gap-1 rounded-full border px-2.5 text-[11px] font-medium transition-colors',
                  asking ? 'border-pm-primary/50 bg-pm-primary/10 text-pm-accent' : 'border-pm-line bg-white',
                )}
              >
                <Sparkles className="size-3" />
                Edit with AI
              </span>
            </div>
          }
        >
          <div className="flex flex-col gap-1.5 p-3">
            {rows.map((e) => (
              <m.div
                key={e.path + e.method}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg border px-2.5 py-1.5',
                  e === ADDED ? 'border-pm-primary/40 bg-pm-primary/[0.05]' : 'border-pm-line',
                )}
              >
                <span
                  className="w-12 rounded-md py-0.5 text-center font-mono text-[10px] font-semibold"
                  style={{ color: METHOD_COLOR[e.method], background: `${METHOD_COLOR[e.method]}18` }}
                >
                  {e.method}
                </span>
                <code className="font-mono text-[12px] font-medium">{e.path}</code>
                {e === ADDED && (
                  <span className="rounded bg-pm-primary px-1.5 text-[9.5px] font-semibold text-white">
                    NEW
                  </span>
                )}
                <span className="ml-auto hidden truncate text-[11px] text-pm-muted sm:block">{e.desc}</span>
              </m.div>
            ))}
          </div>
        </DocCard>

        <AnimatePresence>
          {asking && (
            <m.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="mt-3 rounded-xl border border-pm-primary/40 bg-white px-3 py-2.5 text-[13px] shadow-[0_0_0_4px_rgba(108,92,231,0.08)]"
            >
              <span className="text-pm-accent">Editing API design · </span>
              Let buyers rate each meal
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const TOOLS: { id: 'github' | 'jira' | 'notion'; name: string; what: string }[] = [
  { id: 'github', name: 'GitHub', what: 'Repo with docs' },
  { id: 'jira', name: 'Jira', what: 'Tickets from stories' },
  { id: 'notion', name: 'Notion', what: 'Every doc as a page' },
];

/** 5: the "plan is ready" panel; each tool exports in turn. */
function ExportScene({ t }: { t: number }) {
  const state = (i: number) => {
    const at = 900 + i * 900;
    return t >= at + 650 ? 'synced' : t >= at ? 'exporting' : 'ready';
  };

  return (
    <div className="flex h-full flex-col">
      <AppBar title={PROJECT} />
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5">
        <div className="rounded-2xl border border-pm-primary/25 bg-gradient-to-b from-pm-primary/[0.07] to-white p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-pm-primary text-white">
              <PartyPopper className="size-4" />
            </span>
            <div>
              <p className="text-[15px] font-semibold tracking-tight">Your plan is ready</p>
              <p className="text-[12px] text-pm-muted">Send it to the tools your team already uses.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
            {TOOLS.map((tool, i) => {
              const s = state(i);
              return (
                <div key={tool.id} className="relative rounded-xl border border-pm-line bg-white p-3">
                  <div className="flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-lg bg-pm-shell">
                      <BrandMark brand={tool.id} color className="size-4" />
                    </span>
                    <div className="leading-tight">
                      <p className="text-[13px] font-semibold">{tool.name}</p>
                      <p className="text-[11px] text-pm-muted">{tool.what}</p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'mt-3 flex h-7 items-center justify-center gap-1.5 rounded-full text-[11.5px] font-medium transition-colors duration-300',
                      s === 'synced' && 'bg-[#15803d]/10 text-[#15803d]',
                      s === 'exporting' && 'bg-pm-primary text-white',
                      s === 'ready' && 'bg-pm-fg text-white',
                    )}
                  >
                    {s === 'synced' ? (
                      <>
                        <CircleCheck className="size-3.5" /> Synced
                      </>
                    ) : s === 'exporting' ? (
                      <>
                        <LoaderCircle className="size-3.5 animate-spin" /> Exporting
                      </>
                    ) : (
                      'Export'
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const REPO_FILES: { name: string; dir?: boolean; msg: string }[] = [
  { name: '.github/workflows', dir: true, msg: 'CI pipeline from Prodmate' },
  { name: 'docs', dir: true, msg: 'Add planning documents' },
  { name: 'src', dir: true, msg: 'Scaffold folder structure' },
  { name: 'docker-compose.yml', msg: 'Local services: api, db, redis' },
  { name: 'README.md', msg: 'Project overview' },
];
const DOC_FILES = ['prd.md', 'user-stories.md', 'api-design.md', 'schema.mmd', 'roadmap.md'];

/** 6: the GitHub repo Prodmate created: first commit, files, and what's inside docs/. */
function GitHubScene({ t }: { t: number }) {
  const files = reveal(t, 300, 260, REPO_FILES.length);
  const docs = reveal(t, 2000, 240, DOC_FILES.length);

  return (
    <div className="flex h-full flex-col bg-white text-[#1f2328]">
      <div className="flex h-11 items-center gap-2.5 border-b border-[#d1d9e0] bg-[#f6f8fa] px-4 text-[13px]">
        <BrandMark brand="github" className="size-5 text-[#1f2328]" />
        <span className="text-[#59636e]">alexkim</span>
        <span className="text-[#59636e]">/</span>
        <span className="font-semibold">{SLUG}</span>
        <span className="rounded-full border border-[#d1d9e0] px-2 text-[10.5px] text-[#59636e]">
          Private
        </span>
      </div>
      <div className="mx-auto grid w-full max-w-3xl flex-1 gap-4 px-5 pt-4 md:grid-cols-[1fr_200px]">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[12px]">
            <span className="flex items-center gap-1 rounded-md border border-[#d1d9e0] bg-[#f6f8fa] px-2 py-1 font-medium">
              <GitBranch className="size-3.5" /> main
            </span>
            <span className="text-[#59636e]">1 commit</span>
          </div>
          <div className="mt-3 overflow-hidden rounded-md border border-[#d1d9e0] text-[12px]">
            <div className="flex items-center gap-2 border-b border-[#d1d9e0] bg-[#f6f8fa] px-3 py-2">
              <span className="grid size-5 place-items-center rounded-full bg-pm-primary text-white">
                <LogoMark className="size-3" />
              </span>
              <span className="font-semibold">prodmate-bot</span>
              <span className="truncate text-[#59636e]">Initial plan: {PROJECT}</span>
              <span className="ml-auto hidden items-center gap-1 font-mono text-[11px] text-[#59636e] sm:flex">
                <GitCommitHorizontal className="size-3.5" />
                a3f9c21
              </span>
            </div>
            {REPO_FILES.slice(0, files).map((f) => (
              <m.div
                key={f.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2.5 border-b border-[#d1d9e0] px-3 py-1.5 last:border-0"
              >
                {f.dir ? (
                  <Folder className="size-4 shrink-0 fill-[#54aeff] text-[#54aeff]" />
                ) : (
                  <FileText className="size-4 shrink-0 text-[#59636e]" />
                )}
                <span className="w-36 shrink-0 truncate">{f.name}</span>
                <span className="truncate text-[#59636e]">{f.msg}</span>
                <span className="ml-auto shrink-0 text-[11px] text-[#59636e]">now</span>
              </m.div>
            ))}
          </div>

          {docs > 0 && (
            <m.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="mt-3 rounded-md border border-[#d1d9e0] p-3 text-[12px]"
            >
              <p className="flex items-center gap-1.5 font-semibold">
                <Folder className="size-3.5 fill-[#54aeff] text-[#54aeff]" /> docs/
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {DOC_FILES.slice(0, docs).map((d) => (
                  <m.span
                    key={d}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-md border border-[#d1d9e0] bg-[#f6f8fa] px-2 py-0.5 font-mono text-[11px]"
                  >
                    {d}
                  </m.span>
                ))}
              </div>
            </m.div>
          )}
        </div>
        <div className="hidden text-[12px] md:block">
          <p className="font-semibold">About</p>
          <p className="mt-1.5 text-[#59636e]">{PROMPT}.</p>
          <div className="mt-3 flex flex-wrap gap-1">
            {['nextjs', 'postgres', 'stripe'].map((x) => (
              <span
                key={x}
                className="rounded-full bg-[#ddf4ff] px-2 py-0.5 text-[10.5px] font-medium text-[#0969da]"
              >
                {x}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const TICKETS = [
  { key: 'HCM-1', title: 'Cook lists a meal with photos', type: 'Story', pts: 5, col: 0 },
  { key: 'HCM-2', title: 'Buyer finds meals within 5 km', type: 'Story', pts: 8, col: 0 },
  { key: 'HCM-3', title: 'Checkout and card payment', type: 'Story', pts: 8, col: 1 },
  { key: 'HCM-4', title: 'Rate and review a meal', type: 'Story', pts: 3, col: 0 },
  { key: 'HCM-5', title: 'Weekly cook payouts', type: 'Task', pts: 5, col: 1 },
  { key: 'HCM-6', title: 'Set up CI pipeline', type: 'Task', pts: 2, col: 2 },
];

/** 7: the Jira board Prodmate filled from the user stories. */
function JiraScene({ t }: { t: number }) {
  const shown = reveal(t, 300, 330, TICKETS.length);
  const cols = ['To do', 'In progress', 'Done'];

  return (
    <div className="flex h-full flex-col bg-white text-[#172b4d]">
      <div className="flex h-11 items-center gap-2.5 border-b border-[#dfe1e6] px-4 text-[13px]">
        <BrandMark brand="jira" color className="size-4" />
        <span className="font-semibold">{PROJECT}</span>
        <span className="text-[#6b778c]">/ Sprint 1 board</span>
        <span className="ml-auto hidden rounded bg-[#e9f2ff] px-2 py-0.5 text-[11px] font-medium text-[#0c66e4] sm:block">
          Imported from Prodmate
        </span>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2.5 p-4">
        {cols.map((col, c) => (
          <div key={col} className="flex flex-col gap-2 rounded-md bg-[#f4f5f7] p-2">
            <p className="px-1 text-[10.5px] font-semibold tracking-wide text-[#6b778c] uppercase">
              {col} {TICKETS.filter((x) => x.col === c).length}
            </p>
            {TICKETS.map((tk, i) =>
              tk.col === c && i < shown ? (
                <m.div
                  key={tk.key}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="rounded border border-[#dfe1e6] bg-white p-2 text-[12px] shadow-[0_1px_1px_rgba(9,30,66,0.12)]"
                >
                  <p className="leading-snug">{tk.title}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-[10.5px] text-[#6b778c]">
                    <span
                      className={cn(
                        'size-3 rounded-sm',
                        tk.type === 'Story' ? 'bg-[#63ba3c]' : 'bg-[#4bade8]',
                      )}
                    />
                    <span className="font-medium">{tk.key}</span>
                    <span className="ml-auto rounded-full bg-[#dfe1e6] px-1.5 font-semibold">{tk.pts}</span>
                  </div>
                </m.div>
              ) : null,
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const NOTION_PAGES = [
  'Product requirements',
  'User stories',
  'API design',
  'Database schema',
  'Roadmap',
  'Deployment guide',
];

/** 8: the Notion workspace: one page per document, and the PRD open. */
function NotionScene({ t }: { t: number }) {
  const pages = reveal(t, 300, 260, NOTION_PAGES.length);
  const body = reveal(t, 1900, 450, 4);

  return (
    <div className="flex h-full bg-white text-[#37352f]">
      <div className="hidden w-[210px] shrink-0 flex-col bg-[#f7f7f5] px-2 py-3 text-[12.5px] sm:flex">
        <p className="flex items-center gap-2 px-2 font-semibold">
          <BrandMark brand="notion" className="size-4 text-[#37352f]" /> Alex&apos;s workspace
        </p>
        <p className="mt-4 px-2 text-[11px] font-medium text-[#91918e]">Projects</p>
        <p className="mt-1 flex items-center gap-1.5 rounded px-2 py-1 font-medium">
          <ChevronRight className="size-3 rotate-90 text-[#91918e]" />
          {PROJECT}
        </p>
        <div className="ml-4 flex flex-col">
          {NOTION_PAGES.slice(0, pages).map((p, i) => (
            <m.p
              key={p}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                'flex items-center gap-1.5 truncate rounded px-2 py-1',
                i === 0 && 'bg-black/[0.05] font-medium',
              )}
            >
              <FileText className="size-3.5 shrink-0 text-[#91918e]" />
              {p}
            </m.p>
          ))}
        </div>
      </div>
      <div className="min-w-0 flex-1 px-8 pt-8 sm:px-12">
        <p className="text-[11px] text-[#91918e]">{PROJECT} / Product requirements</p>
        <p className="mt-3 text-[24px] font-bold tracking-tight">Product requirements</p>
        <p className="mt-1 flex items-center gap-1.5 text-[11.5px] text-[#91918e]">
          <LogoMark className="size-3" /> Synced from Prodmate · just now
        </p>
        <div className="mt-4 flex flex-col gap-2.5 text-[13px] leading-relaxed">
          {body > 0 && (
            <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[15px] font-semibold">
              Problem
            </m.p>
          )}
          {body > 1 && (
            <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Home cooks have no simple way to sell meals locally, and neighbours can&apos;t find home-made
              food nearby.
            </m.p>
          )}
          {body > 2 && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-2 rounded bg-[#f1f1ef] p-2.5"
            >
              <span>💡</span>
              <span>MVP: listings, orders and payments, ratings and reviews.</span>
            </m.div>
          )}
          {body > 3 && (
            <m.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-1">
              {['Cook lists a meal with photos', 'Buyer finds meals within 5 km'].map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <span className="size-3.5 rounded-sm border border-[#91918e]" />
                  {x}
                </li>
              ))}
            </m.ul>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// The cursor: one pointer that runs through the whole tour, like a screen recording
// ─────────────────────────────────────────────────────────────────────────────

/** A point on the cursor's path: where it is (percent of the window body) at `at` ms into the
 * scene. `click` presses the button there. Between points it eases from one to the next. */
type Waypoint = { at: number; x: number; y: number; click?: boolean };

/** The path for each scene. The last point of a scene is close to the first of the next, so the
 * pointer never jumps across the screen. Targets are placed for the desktop layout. */
const CURSOR_PATH: Record<SceneId, Waypoint[]> = {
  // Move into the box and click it, wait while the idea is typed, then press send.
  describe: [
    { at: 0, x: 82, y: 88 },
    { at: 700, x: 46, y: 58 },
    { at: 800, x: 46, y: 58, click: true },
    { at: 1400, x: 58, y: 72 },
    { at: 3400, x: 60, y: 73 },
    { at: 4000, x: 75.5, y: 67 },
    { at: 4100, x: 75.5, y: 67, click: true },
    { at: 4800, x: 74, y: 62 },
  ],
  // Watch the documents finish, drifting over the list.
  generate: [
    { at: 0, x: 74, y: 30 },
    { at: 1400, x: 58, y: 42 },
    { at: 2800, x: 42, y: 52 },
    { at: 4400, x: 50, y: 60 },
  ],
  // Read down the PRD, then hover the Preview / Source switch.
  prd: [
    { at: 0, x: 50, y: 58 },
    { at: 1600, x: 34, y: 40 },
    { at: 3000, x: 40, y: 68 },
    { at: 3900, x: 79, y: 19 },
    { at: 4600, x: 80, y: 21 },
  ],
  // Click "Edit with AI", then watch the new endpoint appear.
  api: [
    { at: 0, x: 78, y: 24 },
    { at: 1300, x: 81.5, y: 59 },
    { at: 1500, x: 81.5, y: 59, click: true },
    { at: 2300, x: 52, y: 73 },
    { at: 3600, x: 46, y: 50 },
    { at: 4600, x: 52, y: 56 },
  ],
  // Export to GitHub, Jira and Notion, one click each.
  export: [
    { at: 0, x: 52, y: 58 },
    { at: 750, x: 26, y: 65 },
    { at: 850, x: 26, y: 65, click: true },
    { at: 1650, x: 50, y: 65 },
    { at: 1750, x: 50, y: 65, click: true },
    { at: 2550, x: 74, y: 65 },
    { at: 2650, x: 74, y: 65, click: true },
    { at: 4200, x: 70, y: 52 },
  ],
  // Look over the new repo, then open docs/.
  github: [
    { at: 0, x: 66, y: 46 },
    { at: 1200, x: 30, y: 34 },
    { at: 1800, x: 26, y: 31 },
    { at: 1900, x: 26, y: 31, click: true },
    { at: 3200, x: 36, y: 72 },
    { at: 5000, x: 48, y: 74 },
  ],
  // Glance across the board's columns.
  jira: [
    { at: 0, x: 46, y: 70 },
    { at: 1500, x: 20, y: 28 },
    { at: 3000, x: 52, y: 26 },
    { at: 4300, x: 84, y: 24 },
    { at: 5000, x: 84, y: 30 },
  ],
  // Open the PRD page in the sidebar, then read it.
  notion: [
    { at: 0, x: 78, y: 34 },
    { at: 1100, x: 14, y: 33 },
    { at: 1250, x: 14, y: 33, click: true },
    { at: 2600, x: 52, y: 48 },
    { at: 5000, x: 82, y: 88 },
  ],
};

const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2);

/** Where the cursor is at time `t` in a scene, and whether it was just clicked. */
function cursorAt(id: SceneId, t: number) {
  const path = CURSOR_PATH[id];
  let a = path[0];
  let b = path[path.length - 1];
  for (let i = 0; i < path.length - 1; i++) {
    if (t >= path[i].at && t <= path[i + 1].at) {
      a = path[i];
      b = path[i + 1];
      break;
    }
  }
  const span = b.at - a.at;
  const p = span > 0 ? easeInOut(Math.min(1, Math.max(0, (t - a.at) / span))) : 1;
  const lastClick = path.filter((w) => w.click && w.at <= t).pop();
  return {
    x: a.x + (b.x - a.x) * p,
    y: a.y + (b.y - a.y) * p,
    // Pressed for a moment after each click; the ripple runs a little longer.
    pressed: !!lastClick && t - lastClick.at < 180,
    clickKey: lastClick ? `${id}-${lastClick.at}` : null,
    rippling: !!lastClick && t - lastClick.at < 450,
  };
}

/** The macOS arrow pointer, with a ripple when it clicks. */
function TourCursor({ id, t }: { id: SceneId; t: number }) {
  const { x, y, pressed, clickKey, rippling } = cursorAt(id, t);
  return (
    <span
      className="pointer-events-none absolute z-20 transition-[left,top] duration-75 ease-linear"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {rippling && clickKey && (
        <m.span
          key={clickKey}
          className="absolute -top-4 -left-4 size-8 rounded-full bg-pm-primary/30"
          initial={{ scale: 0.3, opacity: 0.9 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />
      )}
      <svg
        viewBox="0 0 24 24"
        className={cn(
          'relative size-6 -translate-x-[3px] -translate-y-[2px] drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)] transition-transform duration-100',
          pressed && 'scale-[0.86]',
        )}
      >
        <path
          d="M5 2.5 V19.6 L9.3 15.6 L12.1 21.6 L15 20.3 L12.2 14.4 H18 Z"
          fill="#000"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
