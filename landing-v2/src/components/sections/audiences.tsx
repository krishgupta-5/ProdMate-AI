import type { Icon } from "@phosphor-icons/react";
import { Code, Lightning, Rocket, Trophy } from "@phosphor-icons/react/dist/ssr";
import type { CSSProperties, ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { LogoMark } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { audiences } from "@/content/landing";
import { cn } from "@/lib/utils";

/* Each card has a small looping scene. Pure CSS keyframes (globals.css), so they cost nothing. */

const delay = (s: number) => ({ animationDelay: `${s}s` }) as CSSProperties;

/** Founders: one pitch fans out into the files a first engineer needs. */
function PitchScene() {
  const files = ["README.md", "roadmap.md", "cost-estimation.md"];
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-5">
      <p className="w-fit max-w-[90%] rounded-2xl rounded-bl-md bg-white px-3 py-2 text-[13px] text-ink shadow-card">
        “Booking app for dog walkers, paid by the walk”
      </p>
      <div className="flex items-center gap-2 pl-2">
        <span className="flex size-6 items-center justify-center rounded-md bg-ink">
          <LogoMark className="size-3" tone="light" />
        </span>
        <span className="h-px flex-1 bg-line-strong" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {files.map((file, i) => (
          <span
            key={file}
            style={delay(i * 0.5)}
            className="animate-[chip-in_6s_var(--ease-out-soft)_infinite] rounded-lg bg-ink px-2.5 py-1 font-mono text-[11px] text-white"
          >
            {file}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Engineers: config lines write themselves. */
function CodeScene() {
  const lines: [string, string][] = [
    ["services:", "text-st-submitted"],
    ["  api:", "text-st-submitted"],
    ['    ports: ["3000:3000"]', "text-st-success"],
    ["    depends_on: [db]", "text-ink-2"],
    ["  db:", "text-st-submitted"],
    ["    image: postgres:16", "text-st-success"],
  ];
  return (
    <div className="flex h-full items-center px-5">
      <div className="w-full rounded-xl bg-white p-3 shadow-card">
        <p className="mb-2 flex items-center justify-between font-mono text-[10px] text-ghost">
          docker-compose.yaml{" "}
          <span className="rounded bg-st-submitted/10 px-1 text-st-submitted">YAML</span>
        </p>
        <pre className="font-mono text-[11.5px] leading-5">
          {lines.map(([line, tone], i) => (
            <div key={i} className="flex">
              <span className="w-5 shrink-0 text-ghost/70">{i + 1}</span>
              <span
                style={delay(i * 0.35)}
                className={cn(
                  "inline-block animate-[type-line_6s_steps(24)_infinite] overflow-hidden whitespace-pre",
                  tone,
                )}
              >
                {line}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

/** Indie hackers: a deck of side projects that keeps cycling. */
function DeckScene() {
  const projects = [
    ["Fleet tracker", "Live GPS map, driver shifts"],
    ["Retro board", "Anonymous voting, Jira sync"],
    ["Bookmark AI", "Semantic search, Notion export"],
  ];
  return (
    <div className="relative flex h-full items-center justify-center px-5">
      {projects.map(([name, detail], i) => (
        <div
          key={name}
          style={delay(-i * 2)}
          className="absolute inset-x-6 animate-[deck_6s_var(--ease-out-soft)_infinite] rounded-xl bg-white p-3 shadow-card"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-semibold text-ink">{name}</span>
              <span className="block truncate text-[11px] text-muted">{detail}</span>
            </span>
            <span className="shrink-0 rounded-md bg-st-success/10 px-1.5 py-0.5 text-[10px] font-semibold text-st-success">
              14 files
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Hackathon teams: 24 hours, the first slice planning, the rest building. */
function ClockScene() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-5">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-2xl font-medium tracking-tight text-ink">23:50</span>
        <span className="text-[11px] text-muted">hours left to build</span>
      </div>
      <div className="grid grid-cols-12 gap-1">
        {Array.from({ length: 24 }, (_, i) => (
          <span
            key={i}
            style={i === 0 ? undefined : delay(i * 0.18)}
            className={cn(
              "h-5 rounded-[5px]",
              i === 0
                ? "bg-ember-500"
                : "animate-[cell_6s_var(--ease-out-soft)_infinite] bg-paper-3",
            )}
          />
        ))}
      </div>
      <p className="flex items-center gap-2 text-[11px] text-muted">
        <span className="size-2 rounded-sm bg-ember-500" /> 10 min planning with ProdMate
        <span className="ml-2 size-2 rounded-sm bg-ink" /> building
      </p>
    </div>
  );
}

const cards: Record<(typeof audiences)[number]["id"], { icon: Icon; scene: ReactNode }> = {
  founders: { icon: Rocket, scene: <PitchScene /> },
  engineers: { icon: Code, scene: <CodeScene /> },
  indie: { icon: Lightning, scene: <DeckScene /> },
  hackathon: { icon: Trophy, scene: <ClockScene /> },
};

export function Audiences() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Who it is for"
          title={["Built for people who", "would rather be building."]}
          description="Four kinds of teams use ProdMate the same way: a short description in, a plan they can act on out."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {audiences.map((item, i) => {
            const { icon: Icon, scene } = cards[item.id];
            return (
              <Reveal
                key={item.id}
                delay={i * 0.06}
                className="group flex flex-col rounded-[32px] bg-card p-2 shadow-card transition-[transform,box-shadow] duration-500 ease-(--ease-out-soft) hover:-translate-y-1 hover:shadow-float"
              >
                <div
                  aria-hidden="true"
                  className="h-48 overflow-hidden rounded-[26px] bg-paper-2 bg-[radial-gradient(#16130f12_1px,transparent_1px)] bg-[size:16px_16px] ring-1 ring-line"
                >
                  {scene}
                </div>
                <div className="flex flex-1 flex-col gap-6 p-5 sm:flex-row sm:items-end sm:justify-between">
                  <div className="max-w-sm">
                    <span className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-xl bg-ember-50 text-ember-600 transition-colors duration-500 group-hover:bg-ember-500 group-hover:text-white">
                        <Icon weight="bold" className="size-[18px]" aria-hidden="true" />
                      </span>
                      <h3 className="text-xl font-medium tracking-tight text-ink">{item.title}</h3>
                    </span>
                    <p className="mt-3 text-[15px] text-muted">{item.body}</p>
                  </div>
                  <div className="shrink-0 sm:text-right">
                    <p className="text-3xl font-medium tracking-tight text-ink">{item.stat}</p>
                    <p className="text-sm text-muted">{item.statLabel}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
