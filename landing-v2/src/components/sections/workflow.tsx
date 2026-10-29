"use client";

import { CheckCircle, Database, Warning } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { SiDocker, SiExcalidraw, SiGithub, SiJira, SiNotion, SiSwagger } from "react-icons/si";

import { Container } from "@/components/ui/container";
import { LogoMark } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusPill } from "@/components/ui/status-pill";
import { useInView } from "@/components/ui/use-in-view";
import { useReducedMotion } from "@/components/workspace/use-blueprint-demo";
import { artifacts, oldToolchain } from "@/content/landing";
import { cn } from "@/lib/utils";

const toolIcons: Record<string, IconType | typeof Database> = {
  Notion: SiNotion,
  Jira: SiJira,
  Excalidraw: SiExcalidraw,
  dbdiagram: Database,
  Swagger: SiSwagger,
  "Docker docs": SiDocker,
  GitHub: SiGithub,
};

/* Diagram geometry (viewBox units). Rows on the left, hub in the middle, one line out. */
const VB_W = 300;
const VB_H = 420;
const ROW_Y = oldToolchain.map((_, i) => 30 + (i * (VB_H - 60)) / (oldToolchain.length - 1));
const HUB = { x: 210, y: VB_H / 2 };

/**
 * Loops while on screen: the tool rows flash "copy and paste" one after another, the pulses
 * converge on ProdMate, and the blueprint ticks to Ready artifact by artifact.
 */
function useWorkflowLoop(active: boolean) {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!active || reduce) return;
    const id = setInterval(() => setTick((t) => (t + 1) % 24), 360);
    return () => clearInterval(id);
  }, [active, reduce]);
  if (reduce) return { flashing: -1, ready: artifacts.length, switches: 47 };
  return {
    flashing: tick < oldToolchain.length ? tick : -1,
    ready: Math.max(0, Math.min(artifacts.length, tick - 5)),
    switches: 31 + tick,
  };
}

export function Workflow() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const { flashing, ready, switches } = useWorkflowLoop(inView);

  return (
    <section id="workflow" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Manual chaos, AI clarity"
          title={["Seven tools before the first commit.", "Or one prompt."]}
          description="Planning usually means copying one idea across docs, boards, diagrams and config files. ProdMate writes all of it from a single prompt and keeps it in sync."
        />

        <Reveal className="mt-14">
          <div
            ref={ref}
            className="relative isolate overflow-hidden rounded-[32px] bg-paper-2 bg-[radial-gradient(#16130f14_1px,transparent_1px)] bg-[size:18px_18px] p-3 ring-1 ring-line sm:p-6 md:p-10"
          >
            <div className="grid items-center gap-4 lg:grid-cols-[1fr_300px_1fr] lg:gap-0">
              {/* Today */}
              <div className="rounded-3xl bg-card/95 p-4 shadow-float backdrop-blur sm:p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">Planning today</p>
                  <span className="font-mono text-xs text-st-failed">{switches} tab switches</span>
                </div>
                <ul className="mt-4 flex flex-col gap-1.5">
                  {oldToolchain.map((item, i) => {
                    const Icon = toolIcons[item.tool];
                    const hot = flashing === i;
                    return (
                      <li
                        key={item.tool}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2 transition-[background-color,transform] duration-300",
                          hot ? "translate-x-1 bg-st-failed/[0.07]" : "bg-paper/70",
                        )}
                      >
                        <Icon className="size-4 shrink-0 text-ink" aria-hidden="true" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-ink">{item.tool}</span>
                          <span className="block truncate text-xs text-muted">{item.job}</span>
                        </span>
                        <span
                          className={cn(
                            "hidden items-center gap-1 text-xs transition-colors duration-300 sm:inline-flex",
                            hot ? "text-st-failed" : "text-ghost",
                          )}
                        >
                          <Warning weight="bold" className="size-3.5" />
                          {item.pain}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Converging lines */}
              <div className="relative hidden h-full lg:block" aria-hidden="true">
                <svg
                  viewBox={`0 0 ${VB_W} ${VB_H}`}
                  preserveAspectRatio="none"
                  className="absolute inset-0 size-full"
                >
                  {ROW_Y.map((y, i) => {
                    const d = `M 0 ${y} C 110 ${y}, 110 ${HUB.y}, ${HUB.x - 34} ${HUB.y}`;
                    return (
                      <g key={i}>
                        <path
                          d={d}
                          fill="none"
                          stroke="#16130f"
                          strokeOpacity="0.14"
                          strokeWidth="1.2"
                          vectorEffect="non-scaling-stroke"
                        />
                        <path
                          d={d}
                          fill="none"
                          stroke="#e0793a"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                          className="flow-line"
                          style={{
                            animationDelay: `${i * 0.28}s`,
                            animationPlayState: inView ? "running" : "paused",
                          }}
                        />
                      </g>
                    );
                  })}
                  <path
                    d={`M ${HUB.x + 34} ${HUB.y} L ${VB_W} ${HUB.y}`}
                    fill="none"
                    stroke="#16130f"
                    strokeOpacity="0.18"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d={`M ${HUB.x + 34} ${HUB.y} L ${VB_W} ${HUB.y}`}
                    fill="none"
                    stroke="#16130f"
                    strokeWidth="2.4"
                    vectorEffect="non-scaling-stroke"
                    className="flow-line"
                    style={{ animationPlayState: inView ? "running" : "paused" }}
                  />
                </svg>
                <div
                  className="absolute flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-ink text-white shadow-float"
                  style={{ left: `${(HUB.x / VB_W) * 100}%`, top: "50%" }}
                >
                  <LogoMark className="size-8" />
                  <span className="absolute inset-0 animate-ping rounded-2xl ring-2 ring-ember-500/40 [animation-duration:2.4s]" />
                </div>
              </div>

              {/* With ProdMate */}
              <div className="rounded-3xl bg-card/95 p-4 shadow-float backdrop-blur sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink">With ProdMate</p>
                  <StatusPill
                    status={ready === artifacts.length ? "success" : "progress"}
                    label={ready === artifacts.length ? "In sync" : "Generating"}
                  />
                </div>
                <div className="mt-4 rounded-xl bg-paper/70 px-3 py-2 text-sm text-ink-2">
                  “An AI bookmark manager with semantic search and Notion export”
                </div>
                <ul className="mt-3 grid gap-x-3 sm:grid-cols-2">
                  {artifacts.map((artifact, i) => {
                    const ok = i < ready;
                    return (
                      <li key={artifact.id} className="flex items-center gap-2 px-1 py-1.5">
                        <CheckCircle
                          weight="fill"
                          className={cn(
                            "size-4 shrink-0 transition-colors duration-300",
                            ok ? "text-st-success" : "text-paper-3",
                          )}
                        />
                        <span
                          className={cn(
                            "truncate font-mono text-xs transition-colors duration-300",
                            ok ? "text-ink" : "text-ghost",
                          )}
                        >
                          {artifact.file}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
