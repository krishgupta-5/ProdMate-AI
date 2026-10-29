"use client";

import {
  ArrowsClockwise,
  Check,
  CheckCircle,
  CircleNotch,
  Lightning,
  LinkSimple,
  ShoppingBag,
  Stethoscope,
  UsersThree,
} from "@phosphor-icons/react";
import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import type { IconType } from "react-icons";
import { SiGithub, SiGmail, SiGooglecalendar, SiJira, SiNotion } from "react-icons/si";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { useInView } from "@/components/ui/use-in-view";
import {
  Composer,
  FileCard,
  GeneratingStatus,
  LangBadge,
  OptionChips,
  UserBubble,
} from "@/components/workspace/chat-workspace";
import { useReducedMotion } from "@/components/workspace/use-blueprint-demo";
import { artifactById, quickStart, steps, type ArtifactId, type StepId } from "@/content/landing";
import { cn } from "@/lib/utils";

const STEP_MS = 6500;

/** Counts from 0 to `count`, one every `ms`, then holds. Starts at `count` with reduced motion. */
function useTicks(count: number, ms: number) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduce || n >= count) return;
    const id = setTimeout(() => setN((v) => v + 1), ms);
    return () => clearTimeout(id);
  }, [n, count, ms, reduce]);
  return reduce ? count : n;
}

function Tick({ state }: { state: "wait" | "run" | "done" }) {
  if (state === "done")
    return <CheckCircle weight="fill" className="size-4 shrink-0 text-st-success" />;
  if (state === "run")
    return <CircleNotch weight="bold" className="size-4 shrink-0 animate-spin text-st-progress" />;
  return <span className="size-4 shrink-0 rounded-full ring-1 ring-line-strong ring-inset" />;
}

const tickState = (i: number, n: number) => (i < n ? "done" : i === n ? "run" : "wait");

/* 1. Describe ------------------------------------------------------------- */

const idea = "A clinic booking platform with doctor schedules, SMS reminders and payments";
const templateIcons: Record<string, ComponentType<{ className?: string; weight?: "bold" }>> = {
  saas: Lightning,
  shop: ShoppingBag,
  social: UsersThree,
  health: Stethoscope,
};

function DescribeVisual() {
  const typed = useTicks(idea.length, 30);
  return (
    <div className="flex flex-col gap-4">
      <Composer
        text={idea.slice(0, typed)}
        typing={typed < idea.length}
        busy={false}
        placeholder="Describe the software product you want to build..."
      />
      <p className="-mt-2 px-1 text-right font-mono text-[11px] text-ghost">
        {typed} / 2000 characters
      </p>
      <div>
        <p className="text-xs font-medium text-muted">Or start from a template</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {quickStart.map((item, i) => {
            const Icon = templateIcons[item.id];
            return (
              <div
                key={item.id}
                style={{ animationDelay: `${i * 90}ms` }}
                className={cn(
                  "flex animate-[fade-in_500ms_var(--ease-out-soft)_both] gap-3 rounded-xl p-3 shadow-card",
                  item.id === "health" ? "bg-white ring-1 ring-ember-300" : "bg-white/70",
                )}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ember-50 text-ember-600">
                  <Icon className="size-4" weight="bold" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-ink">{item.title}</span>
                  <span className="line-clamp-1 block text-xs text-muted">{item.description}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* 2. Generate ------------------------------------------------------------- */

const generateRows: ArtifactId[] = [
  "markdown",
  "config",
  "db",
  "apiDesign",
  "userStories",
  "finalMarkdown",
];

function GenerateVisual() {
  const n = useTicks(generateRows.length, 650);
  return (
    <div className="flex flex-col gap-3">
      <GeneratingStatus
        name={artifactById[generateRows[Math.min(n, generateRows.length - 1)]].name}
        active={n < generateRows.length}
      />
      <ul className="flex flex-col gap-1.5 rounded-2xl bg-white p-3 shadow-card">
        {generateRows.map((id, i) => {
          const a = artifactById[id];
          return (
            <li
              key={id}
              className={cn(
                "flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg px-2 py-2 transition-colors duration-300",
                i === n && "bg-st-progress/[0.06]",
              )}
            >
              <Tick state={tickState(i, n)} />
              <span className="w-40 truncate font-mono text-[12px] text-ink">{a.file}</span>
              <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1 text-[11px] text-ghost">
                reads
                {a.readsFrom.length === 0 ? (
                  <span className="rounded bg-paper px-1.5 py-0.5 text-ink-2">your prompt</span>
                ) : a.readsFrom.length > 3 ? (
                  <span className="rounded bg-paper px-1.5 py-0.5 text-ink-2">all 12 files</span>
                ) : (
                  a.readsFrom.map((d) => (
                    <span key={d} className="rounded bg-paper px-1.5 py-0.5 font-mono text-ink-2">
                      {artifactById[d].file}
                    </span>
                  ))
                )}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="px-1 text-xs text-muted">
        Each generator gets short summaries of the files it reads, so the API matches the schema and
        the stories match the API.
      </p>
    </div>
  );
}

/* 3. Explore -------------------------------------------------------------- */

function ExploreVisual() {
  const n = useTicks(3, 1100);
  const docker = artifactById.docker;
  return (
    <div className="flex flex-col gap-3">
      <OptionChips
        options={["Show Docker", "Show API Design"]}
        pressed={n === 0 ? "Show Docker" : undefined}
      />
      {n >= 1 ? <UserBubble>Show Docker</UserBubble> : null}
      {n >= 2 ? (
        <div className="animate-[fade-in_400ms_var(--ease-out-soft)_both]">
          <p className="text-[13px] text-ink-2">{docker.message}</p>
          <FileCard artifact={docker}>
            <pre className="font-mono text-[11.5px] leading-5 text-ink-2">
              {[
                "services:",
                "  api:",
                "    build: .",
                '    ports: ["3000:3000"]',
                "    healthcheck: { test: curl -f /health }",
                "  db:",
                "    image: postgres:16",
              ].map((line, i) => (
                <div key={i} className="flex">
                  <span className="w-6 shrink-0 text-ghost/70 select-none">{i + 1}</span>
                  <span className="whitespace-pre">{line}</span>
                </div>
              ))}
            </pre>
          </FileCard>
          <OptionChips
            options={["Show API Design"]}
            pressed={n === 3 ? "Show API Design" : undefined}
          />
        </div>
      ) : null}
    </div>
  );
}

/* 4. Refine --------------------------------------------------------------- */

const affected: ArtifactId[] = ["config", "db", "docker", "apiDesign"];

function RefineVisual() {
  const n = useTicks(affected.length + 2, 700);
  const scanned = n >= 1;
  const done = Math.max(0, n - 2);
  return (
    <div className="flex flex-col gap-3">
      <UserBubble>Switch the database from Postgres to MongoDB</UserBubble>
      {scanned ? (
        <div className="flex animate-[fade-in_400ms_var(--ease-out-soft)_both] flex-wrap gap-1.5">
          <span className="rounded-lg bg-st-submitted/10 px-2 py-1 text-[11px] font-medium text-st-submitted">
            Request: change files
          </span>
          <span className="rounded-lg bg-st-pending/10 px-2 py-1 text-[11px] font-medium text-st-pending">
            Impact analysis: 4 of 14 files
          </span>
        </div>
      ) : null}
      {n >= 2 ? (
        <div className="animate-[fade-in_400ms_var(--ease-out-soft)_both] overflow-hidden rounded-2xl bg-white shadow-card">
          <p className="flex items-center gap-2 border-b border-line px-3 py-2.5 text-[13px] font-semibold text-ink">
            <ArrowsClockwise weight="bold" className="size-4 text-ember-500" />
            Updating affected files
          </p>
          <ul className="px-3 py-2">
            {affected.map((id, i) => {
              const a = artifactById[id];
              const state = tickState(i, done);
              return (
                <li key={id} className="flex items-center justify-between gap-3 py-1.5">
                  <span className="flex min-w-0 items-center gap-2">
                    <Tick state={state} />
                    <span className="truncate font-mono text-[12px] text-ink-2">{a.file}</span>
                    <LangBadge lang={a.lang} />
                  </span>
                  <span className="font-mono text-[11px]">
                    <span className="text-ghost">v1</span>
                    <span className="text-ghost"> → </span>
                    <span className={state === "done" ? "text-st-success" : "text-ghost"}>v2</span>
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="border-t border-line bg-paper/50 px-3 py-2 text-[11px] text-muted">
            10 files unchanged · previous versions kept in history
          </p>
        </div>
      ) : null}
    </div>
  );
}

/* 5. Ship ----------------------------------------------------------------- */

const exportsList: { name: string; result: string; icon: IconType; color: string }[] = [
  {
    name: "GitHub",
    result: "Repository created with README.md and docs/",
    icon: SiGithub,
    color: "#16130f",
  },
  { name: "Notion", result: "Specification published as pages", icon: SiNotion, color: "#16130f" },
  {
    name: "Jira",
    result: "User stories and roadmap added as issues",
    icon: SiJira,
    color: "#2684ff",
  },
  {
    name: "Calendar",
    result: "Milestones booked as events",
    icon: SiGooglecalendar,
    color: "#4285f4",
  },
  { name: "Gmail", result: "Summary sent to team@clinic.dev", icon: SiGmail, color: "#ea4335" },
];

function ShipVisual() {
  const n = useTicks(exportsList.length + 1, 650);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-card">
        <span className="flex size-9 items-center justify-center rounded-lg bg-st-progress/10 font-mono text-[10px] font-bold text-st-progress">
          MD
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-[13px] font-semibold text-ink">final-spec.md</span>
          <span className="block text-[11px] text-ghost">Consolidated from 12 files</span>
        </span>
        <CheckCircle weight="fill" className="size-5 text-st-success" />
      </div>
      <ul className="flex flex-col gap-1 rounded-2xl bg-white p-2 shadow-card">
        {exportsList.map(({ name, result, icon: Icon, color }, i) => {
          const state = tickState(i, n);
          return (
            <li key={name} className="flex items-center gap-3 rounded-lg px-2 py-2">
              <Icon className="size-4 shrink-0" style={{ color }} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-medium text-ink">{name}</span>
                <span
                  className={cn(
                    "block truncate text-[11px] transition-colors duration-300",
                    state === "done" ? "text-muted" : "text-ghost",
                  )}
                >
                  {state === "wait" ? "Waiting" : state === "run" ? "Exporting…" : result}
                </span>
              </span>
              <Tick state={state} />
            </li>
          );
        })}
      </ul>
      <div
        className={cn(
          "flex items-center justify-between gap-3 rounded-2xl bg-ink px-4 py-3 text-white transition-opacity duration-500",
          n > exportsList.length ? "opacity-100" : "opacity-40",
        )}
      >
        <span className="flex min-w-0 items-center gap-2 text-[13px]">
          <LinkSimple weight="bold" className="size-4 shrink-0 text-ember-300" />
          <span className="truncate font-mono">prodmate.dev/share/clinic-booking</span>
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-white/70">
          <Check weight="bold" className="size-3" /> Anyone can fork
        </span>
      </div>
    </div>
  );
}

const visuals: Record<StepId, () => ReactNode> = {
  describe: DescribeVisual,
  generate: GenerateVisual,
  explore: ExploreVisual,
  refine: RefineVisual,
  ship: ShipVisual,
};

export function HowItWorks() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched || !inView || reduce) return;
    const id = setTimeout(() => setActive((i) => (i + 1) % steps.length), STEP_MS);
    return () => clearTimeout(id);
  }, [active, touched, inView, reduce]);

  const Visual = visuals[steps[active].id];
  const autoplay = !touched && inView && !reduce;

  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title={["Idea in.", "Blueprint out."]}
          description="Five steps from a sentence to a spec your team can build from, all inside one chat."
        />

        <Reveal className="mt-14">
          <div ref={ref} className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
            <ol className="flex flex-col gap-2">
              {steps.map((step, i) => {
                const selected = i === active;
                return (
                  <li key={step.id}>
                    <button
                      type="button"
                      aria-expanded={selected}
                      onClick={() => {
                        setTouched(true);
                        setActive(i);
                      }}
                      className={cn(
                        "relative w-full overflow-hidden rounded-3xl p-5 text-left transition-[background-color,box-shadow] duration-500 ease-(--ease-out-soft)",
                        selected ? "bg-card shadow-card" : "hover:bg-card/60",
                      )}
                    >
                      <span className="flex items-center gap-4">
                        <span
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-semibold transition-colors duration-500",
                            selected ? "bg-ink text-white" : "bg-paper-2 text-muted",
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "text-lg font-medium tracking-tight transition-colors duration-500 md:text-xl",
                            selected ? "text-ink" : "text-muted",
                          )}
                        >
                          {step.title}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "grid transition-[grid-template-rows,opacity] duration-500 ease-(--ease-out-soft)",
                          selected ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <span className="overflow-hidden">
                          <span className="block pt-3 pl-13 text-[15px] text-muted">
                            {step.body}
                          </span>
                          <span className="mt-3 flex flex-wrap gap-1.5 pl-13">
                            {step.points.map((point) => (
                              <span
                                key={point}
                                className="inline-flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-1 text-xs text-ink-2"
                              >
                                <Check weight="bold" className="size-3 text-ember-600" />
                                {point}
                              </span>
                            ))}
                          </span>
                        </span>
                      </span>
                      {selected && autoplay ? (
                        <span
                          key={`bar-${active}`}
                          aria-hidden="true"
                          className="absolute inset-x-5 bottom-0 h-0.5 origin-left rounded-full bg-ember-500"
                          style={{ animation: `grow ${STEP_MS}ms linear forwards` }}
                        />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ol>

            <div
              aria-hidden="true"
              className="rounded-[32px] bg-paper-2 p-2 ring-1 ring-line sm:p-3"
            >
              <div className="flex h-full min-h-[460px] flex-col overflow-hidden rounded-[24px] bg-[radial-gradient(110%_80%_at_100%_100%,#fbe4d0_0%,#fbf5ef_40%,#f8f6f2_75%)] shadow-window">
                <div className="flex h-10 shrink-0 items-center gap-3 border-b border-line bg-card px-4">
                  <span className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="size-2.5 rounded-full bg-[#febc2e]" />
                    <span className="size-2.5 rounded-full bg-[#28c840]" />
                  </span>
                  <span className="font-mono text-[11px] text-muted">
                    Step {active + 1} of {steps.length} · {steps[active].title}
                  </span>
                </div>
                <div
                  key={steps[active].id}
                  className="flex-1 animate-[fade-in_500ms_var(--ease-out-soft)_both] p-4 sm:p-6"
                >
                  <Visual />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
