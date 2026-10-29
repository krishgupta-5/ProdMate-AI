"use client";

import { ArrowsClockwise, ArrowRight, Copy, Cpu, Sparkle } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import { SiGithub, SiJira, SiNotion } from "react-icons/si";

import { Container } from "@/components/ui/container";
import { LogoMark } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusPill } from "@/components/ui/status-pill";
import { useInView } from "@/components/ui/use-in-view";
import { LangBadge } from "@/components/workspace/chat-workspace";
import { useReducedMotion } from "@/components/workspace/use-blueprint-demo";
import {
  artifactById,
  artifactGroups,
  artifacts,
  type ArtifactId,
  type ExportTarget,
} from "@/content/landing";
import { cn } from "@/lib/utils";

import { artifactCovers, artifactPreviews } from "./artifact-previews";

const AUTOPLAY_MS = 4200;
const totalLines = artifacts.reduce((sum, a) => sum + a.lines, 0);

const targets: Record<ExportTarget, { label: string; icon: IconType; color: string }> = {
  github: { label: "GitHub", icon: SiGithub, color: "#16130f" },
  notion: { label: "Notion", icon: SiNotion, color: "#16130f" },
  jira: { label: "Jira", icon: SiJira, color: "#2684ff" },
};

/** Files that read this one (reverse of readsFrom). */
const usedBy = Object.fromEntries(
  artifacts.map((a) => [
    a.id,
    artifacts.filter((b) => b.readsFrom.includes(a.id)).map((b) => b.id),
  ]),
) as Record<ArtifactId, ArtifactId[]>;

type Versions = Record<ArtifactId, number>;
const initial = Object.fromEntries(artifacts.map((a) => [a.id, 1])) as Versions;

function FileChip({ id, onSelect }: { id: ArtifactId; onSelect: (id: ArtifactId) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="rounded-md bg-white px-2 py-1 font-mono text-[11px] text-ink-2 shadow-card transition-colors duration-300 hover:text-ember-600"
    >
      {artifactById[id].file}
    </button>
  );
}

export function BlueprintExplorer() {
  const [frameRef, inView] = useInView<HTMLDivElement>();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<ArtifactId>("markdown");
  const [touched, setTouched] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [versions, setVersions] = useState<Versions>(initial);
  const [notice, setNotice] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Walk through the files on its own until the visitor clicks anything.
  useEffect(() => {
    if (touched || !inView || reduce) return;
    const id = setInterval(() => {
      setActive((current) => {
        const i = artifacts.findIndex((a) => a.id === current);
        return artifacts[(i + 1) % artifacts.length].id;
      });
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [touched, inView, reduce]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const current = artifactById[active];
  const Preview = artifactPreviews[active];
  const readers = usedBy[active];

  const select = (id: ArtifactId) => {
    setTouched(true);
    setActive(id);
    setNotice("");
  };

  const regenerate = () => {
    if (streaming) return;
    setTouched(true);
    setStreaming(true);
    setNotice("");
    setVersions((v) => ({ ...v, [active]: v[active] + 1 }));
    timer.current = setTimeout(() => {
      setStreaming(false);
      setNotice(
        `Only ${current.file} changed. The other ${artifacts.length - 1} files were not touched.`,
      );
    }, 1400);
  };

  return (
    <section id="blueprint" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="The blueprint"
          title={["14 files, one prompt.", "Each with its own generator."]}
          description="These are the files the chat panel writes for every project. Each generator reads only the files it depends on, so the plan stays consistent. Click a file to see what it covers, then regenerate it."
        />

        <Reveal className="mt-14">
          <div ref={frameRef} className="rounded-[32px] bg-paper-2 p-2 ring-1 ring-line sm:p-3">
            <div className="overflow-hidden rounded-[24px] bg-card shadow-window">
              {/* Title bar */}
              <div className="flex h-11 items-center gap-4 border-b border-line px-4">
                <div className="flex gap-1.5">
                  <span className="size-3 rounded-full bg-[#ff5f57]" />
                  <span className="size-3 rounded-full bg-[#febc2e]" />
                  <span className="size-3 rounded-full bg-[#28c840]" />
                </div>
                <p className="min-w-0 flex-1 truncate font-mono text-xs text-muted">
                  bookmark-ai <span className="text-ghost">/</span> blueprint{" "}
                  <span className="text-ghost">/</span>{" "}
                  <span className="text-ink">{current.file}</span>
                </p>
                <span className="hidden font-mono text-[11px] text-ghost sm:inline">
                  {artifacts.length} files · {totalLines.toLocaleString("en-US")} lines
                </span>
              </div>

              <div className="grid lg:grid-cols-[230px_1fr_280px]">
                {/* File tree */}
                <nav
                  aria-label="Blueprint files"
                  className="flex [scrollbar-width:none] gap-1 overflow-x-auto border-b border-line bg-paper/60 p-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-r lg:border-b-0 lg:p-3"
                >
                  {artifactGroups.map((group) => (
                    <div key={group} className="contents lg:block lg:pb-3">
                      <p className="hidden px-2 pb-1 font-mono text-[10px] tracking-widest text-ghost uppercase lg:block">
                        {group}
                      </p>
                      {artifacts
                        .filter((a) => a.group === group)
                        .map((artifact) => {
                          const selected = artifact.id === active;
                          return (
                            <button
                              key={artifact.id}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => select(artifact.id)}
                              className={cn(
                                "relative flex h-8 w-full shrink-0 items-center gap-2 rounded-lg px-2 text-left font-mono text-[12px] whitespace-nowrap transition-colors duration-300 max-lg:w-auto",
                                selected
                                  ? "bg-white text-ink shadow-card"
                                  : "text-muted hover:bg-white/60 hover:text-ink",
                              )}
                            >
                              <LangBadge lang={artifact.lang} className="w-9 text-center" />
                              <span className="truncate">{artifact.file}</span>
                              {selected && !touched && inView && !reduce ? (
                                <span
                                  key={active}
                                  aria-hidden="true"
                                  className="absolute inset-x-2 bottom-0.5 h-px origin-left bg-ember-500"
                                  style={{ animation: `grow ${AUTOPLAY_MS}ms linear forwards` }}
                                />
                              ) : null}
                            </button>
                          );
                        })}
                    </div>
                  ))}
                </nav>

                {/* Document */}
                <div className="relative flex min-h-[520px] min-w-0 flex-col">
                  {/* The assistant line that arrives with the file in chat */}
                  <div
                    key={`msg-${active}`}
                    className="flex animate-[fade-in_400ms_var(--ease-out-soft)_both] items-start gap-2.5 border-b border-line px-5 py-3 md:px-6"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-ink">
                      <LogoMark className="size-3" tone="light" />
                    </span>
                    <p className="text-sm text-ink-2">{current.message}</p>
                  </div>

                  {/* File header, as in the chat panel */}
                  <div className="flex items-center justify-between gap-3 px-5 pt-4 md:px-6">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="size-1.5 rounded-full bg-ghost" />
                      <span className="truncate font-mono text-xs font-medium text-ink">
                        {current.file}
                      </span>
                      <LangBadge lang={current.lang} />
                      <span className="font-mono text-[11px] text-ghost">v{versions[active]}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-ghost">
                      {current.lang === "MD" ? (
                        <span className="flex rounded-md bg-paper p-0.5 font-mono text-[9px]">
                          <span className="px-1.5 py-0.5">CODE</span>
                          <span className="rounded bg-white px-1.5 py-0.5 text-ink shadow-card">
                            PREVIEW
                          </span>
                        </span>
                      ) : null}
                      <Copy className="size-3.5" aria-hidden="true" />
                    </span>
                  </div>

                  <div className="relative flex-1 p-5 md:p-6">
                    <div
                      key={`${active}-${versions[active]}`}
                      className={cn(
                        streaming
                          ? "animate-[stream_1.4s_var(--ease-out-soft)_both]"
                          : "animate-[fade-in_400ms_var(--ease-out-soft)_both]",
                      )}
                    >
                      <Preview />
                    </div>
                    {streaming ? (
                      <p className="absolute right-5 bottom-4 text-shimmer text-xs font-medium md:right-6">
                        Generating {current.name}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Inspector */}
                <aside className="flex flex-col gap-5 border-t border-line bg-paper/50 p-5 lg:border-t-0 lg:border-l">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink">{current.name}</p>
                    <StatusPill status={streaming ? "progress" : "success"} />
                  </div>

                  <div>
                    <p className="text-xs text-muted">Covers</p>
                    <ul className="mt-2 flex flex-col gap-1">
                      {artifactCovers[active].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-[13px] text-ink-2">
                          <span className="size-1 rounded-full bg-ember-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs text-muted">Reads from</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {current.readsFrom.length ? (
                        current.readsFrom.length > 4 ? (
                          <span className="text-xs text-ink-2">
                            All {current.readsFrom.length} other generated files
                          </span>
                        ) : (
                          current.readsFrom.map((id) => (
                            <FileChip key={id} id={id} onSelect={select} />
                          ))
                        )
                      ) : (
                        <span className="text-xs text-ink-2">Your prompt only</span>
                      )}
                    </div>
                  </div>

                  {readers.length ? (
                    <div>
                      <p className="text-xs text-muted">Read by</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {readers.length > 4 ? (
                          <span className="text-xs text-ink-2">
                            {readers.length} files, including final-spec.md
                          </span>
                        ) : (
                          readers.map((id) => <FileChip key={id} id={id} onSelect={select} />)
                        )}
                      </div>
                    </div>
                  ) : null}

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-white p-3 shadow-card">
                      <p className="flex items-center gap-1.5 text-xs text-muted">
                        <Cpu className="size-3.5" aria-hidden="true" /> Generator
                      </p>
                      <p className="mt-1 text-[13px] font-medium text-ink">
                        {active === "db" ? "n8n workflow" : "Groq Llama 3.1"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white p-3 shadow-card">
                      <p className="text-xs text-muted">Exports to</p>
                      <p className="mt-1.5 flex items-center gap-2">
                        {current.exportsTo.map((t) => {
                          const { icon: Icon, color, label } = targets[t];
                          return (
                            <Icon key={t} className="size-4" style={{ color }} aria-label={label} />
                          );
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={regenerate}
                      disabled={streaming}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white shadow-ink transition-[background-color,transform] duration-300 hover:bg-ink-2 active:scale-[0.98] disabled:opacity-60"
                    >
                      <ArrowsClockwise
                        weight="bold"
                        className={cn("size-4", streaming && "animate-spin-slow")}
                      />
                      {streaming ? "Regenerating" : `Regenerate ${current.file}`}
                    </button>
                    <p className="inline-flex items-center justify-center gap-1.5 text-xs text-muted">
                      <Sparkle weight="fill" className="size-3 text-ember-500" />
                      In chat: <span className="font-medium text-ink-2">{current.option}</span>
                      <ArrowRight className="size-3" aria-hidden="true" />
                    </p>
                    <p aria-live="polite" className="min-h-8 text-center text-xs text-muted">
                      {notice}
                    </p>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
