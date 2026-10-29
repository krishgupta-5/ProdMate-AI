"use client";

import {
  ArrowUp,
  CaretDown,
  ChatCircleText,
  Check,
  CheckCircle,
  CircleNotch,
  Copy,
  FileText,
  FolderSimple,
  GearSix,
  Microphone,
  Plugs,
  Plus,
  ShareNetwork,
  SidebarSimple,
  Sparkle,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { SiGithub, SiGmail, SiGooglecalendar, SiJira, SiNotion } from "react-icons/si";

import { LogoMark } from "@/components/ui/logo";
import {
  aiPhrases,
  artifactById,
  workspaceRecents,
  workspaceUser,
  type Artifact,
} from "@/content/landing";
import { cn } from "@/lib/utils";

import { batchFiles, sceneAt, useCycle, useSessionDemo, type Scene } from "./use-blueprint-demo";

/* ------------------------------------------------------------------------- *
 * Pieces. Exported so the chat page can reuse them as real UI later.
 * ------------------------------------------------------------------------- */

type IconType = ComponentType<{ className?: string; weight?: "regular" | "bold" | "fill" }>;

function NavItem({
  icon: Icon,
  label,
  active,
}: {
  icon: IconType;
  label: string;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "flex h-8 items-center gap-2.5 rounded-lg px-2 text-[13px]",
        active ? "bg-white font-medium text-ink shadow-card" : "text-ink-2",
      )}
    >
      <Icon className="size-4 text-muted" />
      {label}
    </span>
  );
}

export function WorkspaceSidebar({ activeProject }: { activeProject?: string }) {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-line bg-paper/70 px-3 py-3 md:flex">
      <span className="flex h-9 items-center justify-center gap-2 rounded-xl bg-ink text-[13px] font-semibold text-white shadow-ink">
        <Plus weight="bold" className="size-3.5" /> New project
      </span>
      <div className="mt-4 flex flex-col gap-0.5">
        <NavItem icon={ChatCircleText} label="Chats" active />
        <NavItem icon={FolderSimple} label="Projects" />
        <NavItem icon={Plugs} label="Integrations" />
        <NavItem icon={GearSix} label="Settings" />
      </div>
      <p className="mt-5 px-2 text-[11px] font-medium text-ghost">Recents</p>
      <ul className="mt-1.5 flex flex-col gap-0.5">
        {workspaceRecents.map((item) => (
          <li
            key={item.title}
            className={cn(
              "rounded-lg px-2 py-1.5",
              item.title === activeProject && "bg-paper-3/60",
            )}
          >
            <p className="truncate text-[13px] font-medium text-ink">{item.title}</p>
            <p className="truncate text-[11px] text-ghost">{item.detail}</p>
          </li>
        ))}
      </ul>
      <div className="mt-auto rounded-xl bg-white p-2.5 shadow-card">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-full bg-ember-500 text-[11px] font-semibold text-white">
            {workspaceUser.name[0]}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-ink">
              {workspaceUser.name}
            </span>
            <span className="block truncate text-[11px] text-ghost">
              {workspaceUser.plan} · Free during beta
            </span>
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted">
          <span>Daily tokens</span>
          <span className="font-mono">28%</span>
        </div>
        <div className="mt-1 h-1 overflow-hidden rounded-full bg-paper-2">
          <div className="h-full w-[28%] rounded-full bg-ember-500" />
        </div>
      </div>
    </aside>
  );
}

/** "Generating System Configuration · Synthesizing context", as the chat panel shows it. */
export function GeneratingStatus({ name, active = true }: { name: string; active?: boolean }) {
  const i = useCycle(aiPhrases.length, 1100, active);
  return (
    <div className="flex animate-[fade-in_400ms_var(--ease-out-soft)_both] items-center gap-2.5">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-ink text-white">
        <LogoMark className="size-3.5 animate-pulse" tone="light" />
      </span>
      <span className="text-shimmer text-[13px] font-semibold">Generating {name}</span>
      <span
        key={i}
        className="animate-[fade-in_400ms_var(--ease-out-soft)_both] text-[13px] text-ghost"
      >
        {aiPhrases[i]}…
      </span>
    </div>
  );
}

export function UserBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex animate-[fade-in_400ms_var(--ease-out-soft)_both] justify-end">
      <p className="max-w-[80%] rounded-2xl rounded-br-md bg-paper-2 px-3.5 py-2 text-[13px] text-ink">
        {children}
      </p>
    </div>
  );
}

function AssistantRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex animate-[fade-in_500ms_var(--ease-out-soft)_both] gap-2.5">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-ink text-white">
        <LogoMark className="size-3.5" tone="light" />
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

const badgeTone: Record<Artifact["lang"], string> = {
  MD: "bg-st-progress/10 text-st-progress",
  YAML: "bg-st-submitted/10 text-st-submitted",
  TXT: "bg-st-expired/10 text-st-expired",
  ER: "bg-st-success/10 text-st-success",
};

export function LangBadge({ lang, className }: { lang: Artifact["lang"]; className?: string }) {
  return (
    <span
      className={cn(
        "rounded px-1.5 py-px font-mono text-[10px] font-semibold",
        badgeTone[lang],
        className,
      )}
    >
      {lang}
    </span>
  );
}

/** File card with the chat panel's header: name, language badge, code/preview toggle, copy. */
export function FileCard({ artifact, children }: { artifact: Artifact; children: ReactNode }) {
  const markdown = artifact.lang === "MD";
  return (
    <div className="mt-2.5 overflow-hidden rounded-xl bg-white shadow-card">
      <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-2">
        <span className="flex min-w-0 items-center gap-2">
          <span className="size-1.5 rounded-full bg-ghost" />
          <span className="truncate font-mono text-[12px] font-medium text-ink">
            {artifact.file}
          </span>
          <LangBadge lang={artifact.lang} />
        </span>
        <span className="flex items-center gap-1.5">
          {markdown ? (
            <span className="hidden rounded-md bg-paper p-0.5 font-mono text-[9px] sm:flex">
              <span className="px-1.5 py-0.5 text-ghost">CODE</span>
              <span className="rounded bg-white px-1.5 py-0.5 text-ink shadow-card">PREVIEW</span>
            </span>
          ) : null}
          <Copy className="size-3.5 text-ghost" />
        </span>
      </div>
      <div className="animate-[stream_1.6s_var(--ease-out-soft)_both] px-3 py-2.5">{children}</div>
      <div className="flex items-center justify-between border-t border-line bg-paper/50 px-3 py-1.5 font-mono text-[10px] text-ghost">
        <span className="text-st-success">+{artifact.lines} lines</span>
        <span>v1 · saved</span>
      </div>
    </div>
  );
}

export function OptionChips({ options, pressed }: { options: string[]; pressed?: string }) {
  return (
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      {options.map((option) => (
        <span
          key={option}
          className={cn(
            "inline-flex h-7 items-center gap-1 rounded-full px-3 text-[12px] font-medium ring-1 transition-[background-color,color,transform] duration-300",
            pressed === option
              ? "scale-95 bg-ink text-white ring-ink"
              : "bg-white text-ink-2 ring-line-strong",
          )}
        >
          <Sparkle weight="fill" className="size-3 text-ember-500" />
          {option}
        </span>
      ))}
    </div>
  );
}

export function Composer({
  text,
  typing,
  busy,
  placeholder,
}: {
  text: string;
  typing: boolean;
  busy: boolean;
  placeholder: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-float">
      <p className={cn("min-h-10 px-1 text-[13px] leading-5", text ? "text-ink" : "text-ghost")}>
        {text || placeholder}
        {typing ? (
          <span className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 animate-caret bg-ember-500" />
        ) : null}
      </p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1 text-muted">
          <span className="flex size-7 items-center justify-center rounded-lg">
            <Microphone className="size-4" />
          </span>
          <span className="hidden size-7 items-center justify-center rounded-lg sm:flex">
            <Plus className="size-4" />
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className="hidden items-center gap-1 rounded-lg bg-paper px-2 py-1 text-[11px] font-medium text-muted sm:inline-flex">
            Groq · Llama 3.1 <CaretDown className="size-3" />
          </span>
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-xl transition-colors duration-300",
              busy
                ? "bg-ember-500 text-white"
                : text
                  ? "bg-ink text-white"
                  : "bg-paper-2 text-ghost",
            )}
          >
            {busy ? (
              <CircleNotch weight="bold" className="size-4 animate-spin" />
            ) : (
              <ArrowUp weight="bold" className="size-4" />
            )}
          </span>
        </span>
      </div>
    </div>
  );
}

/* Small previews streamed inside the hero file cards. */

function ReadmePreview() {
  return (
    <div className="text-[12px] leading-5">
      <p className="text-sm font-semibold text-ink">Bookmark AI</p>
      <p className="text-muted">
        Save any page in one click and find it again by meaning, not keywords.
      </p>
      <p className="mt-1.5 font-semibold text-ink-2">Core features</p>
      <ul className="text-ink-2">
        <li>· Browser extension with one click save</li>
        <li>· Semantic search over titles, notes and page text</li>
        <li className="hidden sm:list-item">· Shared collections with Notion export</li>
      </ul>
    </div>
  );
}

function ConfigPreview() {
  const lines: [string, string?][] = [
    ["project: bookmark-ai", "text-st-submitted"],
    ["stack:", "text-st-submitted"],
    ["  frontend: next.js 16"],
    ["  backend: node · express"],
    ["  database: postgres + pgvector", "text-ember-600"],
    ["  auth: clerk"],
  ];
  return (
    <pre className="font-mono text-[11.5px] leading-5">
      {lines.map(([line, tone], i) => (
        <div key={i} className="flex">
          <span className="w-6 shrink-0 text-ghost/70 select-none">{i + 1}</span>
          <span className={cn("whitespace-pre", tone ?? "text-ink-2")}>{line}</span>
        </div>
      ))}
    </pre>
  );
}

/** Like an "edited files" summary: the remaining generators tick in one by one. */
function BatchCard({ done }: { done: number }) {
  const total = batchFiles.length;
  const lines = batchFiles.slice(0, done).reduce((sum, a) => sum + a.lines, 0);
  const visible = batchFiles.slice(0, 5);
  const complete = done >= total;
  return (
    <div className="mt-2.5 overflow-hidden rounded-xl bg-white shadow-card">
      <div className="flex items-center gap-3 border-b border-line px-3 py-2.5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-paper text-ink-2">
          <FileText className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block text-[13px] font-semibold",
              complete ? "text-ink" : "text-shimmer",
            )}
          >
            {complete ? `Generated ${total} files` : `Generating ${done + 1} of ${total}`}
          </span>
          <span className="block font-mono text-[11px] text-st-success">
            +{lines.toLocaleString("en-US")} lines
          </span>
        </span>
        <span className="hidden rounded-lg px-2.5 py-1 text-[11px] font-medium text-ink-2 ring-1 ring-line-strong sm:inline">
          Open blueprint
        </span>
      </div>
      <ul className="px-3 py-1.5">
        {visible.map((file, i) => (
          <li key={file.id} className="flex items-center justify-between gap-3 py-1">
            <span className="flex min-w-0 items-center gap-2">
              {i < done ? (
                <CheckCircle weight="fill" className="size-3.5 shrink-0 text-st-success" />
              ) : i === done ? (
                <CircleNotch
                  weight="bold"
                  className="size-3.5 shrink-0 animate-spin text-st-progress"
                />
              ) : (
                <span className="size-3.5 shrink-0 rounded-full ring-1 ring-line-strong ring-inset" />
              )}
              <span
                className={cn(
                  "truncate font-mono text-[11.5px]",
                  i <= done ? "text-ink-2" : "text-ghost",
                )}
              >
                docs/{file.file}
              </span>
            </span>
            <span
              className={cn(
                "font-mono text-[11px]",
                i < done ? "text-st-success" : "text-ghost/60",
              )}
            >
              +{file.lines}
            </span>
          </li>
        ))}
        <li className="flex items-center gap-1 py-1 text-[11px] font-medium text-st-progress">
          Show {total - visible.length} more files <CaretDown className="size-3" />
        </li>
      </ul>
    </div>
  );
}

const exportTargets = [
  { name: "GitHub", icon: SiGithub, color: "#16130f" },
  { name: "Notion", icon: SiNotion, color: "#16130f" },
  { name: "Jira", icon: SiJira, color: "#2684ff" },
  { name: "Calendar", icon: SiGooglecalendar, color: "#4285f4" },
  { name: "Gmail", icon: SiGmail, color: "#ea4335" },
];

function FinalCard({ scene }: { scene: Scene }) {
  const exporting = scene === "export";
  const exported = scene === "done";
  return (
    <div className="mt-2.5 overflow-hidden rounded-xl bg-white shadow-card">
      <div className="flex items-center gap-3 px-3 py-2.5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-st-progress/10 font-mono text-[10px] font-bold text-st-progress">
          MD
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-mono text-[12.5px] font-semibold text-ink">
            final-spec.md
          </span>
          <span className="block text-[11px] text-ghost">
            Consolidated from 12 files · {artifactById.finalMarkdown.lines} lines
          </span>
        </span>
      </div>
      <div className="border-t border-line bg-paper/50 px-3 py-2.5">
        <p className="text-[11px] font-medium text-muted">Export project</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {exportTargets.map(({ name, icon: Icon, color }, i) => {
            const github = i === 0;
            return (
              <span
                key={name}
                className={cn(
                  "inline-flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-[11.5px] font-medium ring-1 transition-colors duration-300",
                  github && exported
                    ? "bg-st-success/10 text-st-success ring-st-success/25"
                    : github && exporting
                      ? "bg-ink text-white ring-ink"
                      : "bg-white text-ink-2 ring-line-strong",
                  i > 2 && "hidden sm:inline-flex",
                )}
              >
                {github && exporting ? (
                  <CircleNotch weight="bold" className="size-3.5 animate-spin" />
                ) : github && exported ? (
                  <Check weight="bold" className="size-3.5" />
                ) : (
                  <Icon className="size-3.5" style={{ color }} aria-hidden="true" />
                )}
                {github && exported ? "Exported" : name}
              </span>
            );
          })}
        </div>
        {exported ? (
          <p className="mt-2 animate-[fade-in_400ms_var(--ease-out-soft)_both] font-mono text-[11px] text-ink-2">
            github.com/krish/bookmark-ai · README.md and docs/ pushed
          </p>
        ) : null}
      </div>
    </div>
  );
}

function WindowBar({ title }: { title: string }) {
  return (
    <div className="flex h-11 shrink-0 items-center gap-3 border-b border-line bg-card px-4">
      <div className="flex gap-1.5">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
      </div>
      <SidebarSimple className="ml-2 hidden size-4 text-ghost md:block" />
      <p className="flex-1 truncate text-center text-[13px] font-medium text-ink-2 md:ml-40 md:text-left">
        {title} <span className="text-ghost">···</span>
      </p>
      <span className="hidden items-center gap-1.5 rounded-lg px-2 py-1 text-[12px] text-muted ring-1 ring-line-strong sm:inline-flex">
        <ShareNetwork className="size-3.5" /> Share
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------------- *
 * The hero session: a scripted, looping chat that behaves like the real panel.
 * ------------------------------------------------------------------------- */

export function ChatWorkspace({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const { idea, scene, at, sub } = useSessionDemo(visible);
  const reached = (s: Scene) => at >= sceneAt(s);
  const typing = scene === "typing";
  const busy =
    !typing && scene !== "send" && scene !== "done" && scene !== "docs" && scene !== "config";
  const title = reached("think-docs") ? "Bookmark AI" : "New project";
  const docs = artifactById.markdown;
  const config = artifactById.config;
  const fileCount = reached("final")
    ? 14
    : reached("batch")
      ? 2 + (scene === "batch" ? sub : batchFiles.length)
      : reached("config")
        ? 2
        : reached("docs")
          ? 1
          : 0;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("overflow-hidden rounded-2xl bg-card text-left shadow-window", className)}
    >
      <WindowBar title={title} />

      <div className="flex h-[540px] md:h-[600px]">
        <WorkspaceSidebar activeProject={reached("think-docs") ? "Bookmark AI" : undefined} />

        <main className="relative flex min-w-0 flex-1 flex-col bg-[radial-gradient(110%_80%_at_100%_100%,#fbe4d0_0%,#fbf5ef_40%,#f8f6f2_75%)]">
          {/* Messages: anchored to the bottom so older ones slide up and out, like a live chat */}
          <div className="relative min-h-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_64px)]">
            <div className="absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-[640px] flex-col gap-4 px-4 pb-4 sm:px-6">
              {!reached("think-docs") ? (
                <div className="pb-6 text-center">
                  <p className="text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                    <span className="text-fade">What are we</span> building?
                  </p>
                  <p className="mt-3 text-[13px] text-muted">
                    Describe the product. ProdMate writes the blueprint.
                  </p>
                </div>
              ) : null}

              {reached("think-docs") ? <UserBubble>{idea}</UserBubble> : null}
              {scene === "think-docs" ? <GeneratingStatus name={docs.name} /> : null}

              {reached("docs") ? (
                <AssistantRow>
                  <p className="text-[13px] text-ink-2">{docs.message}</p>
                  <FileCard artifact={docs}>
                    <ReadmePreview />
                  </FileCard>
                  <OptionChips
                    options={[config.option]}
                    pressed={scene === "chip" ? config.option : undefined}
                  />
                </AssistantRow>
              ) : null}

              {reached("think-config") ? <UserBubble>{config.option}</UserBubble> : null}
              {scene === "think-config" ? <GeneratingStatus name={config.name} /> : null}

              {reached("config") ? (
                <AssistantRow>
                  <p className="text-[13px] text-ink-2">{config.message}</p>
                  <FileCard artifact={config}>
                    <ConfigPreview />
                  </FileCard>
                </AssistantRow>
              ) : null}

              {reached("batch") ? (
                <AssistantRow>
                  <p className="text-[13px] text-ink-2">
                    Generating the rest of the blueprint from your config.
                  </p>
                  <BatchCard done={scene === "batch" ? sub : batchFiles.length} />
                </AssistantRow>
              ) : null}

              {reached("final") ? (
                <AssistantRow>
                  <p className="text-[13px] text-ink-2">{artifactById.finalMarkdown.message}</p>
                  <FinalCard scene={scene} />
                </AssistantRow>
              ) : null}
            </div>
          </div>

          {/* Composer and status line */}
          <div className="mx-auto w-full max-w-[640px] px-4 pb-3 sm:px-6">
            <Composer
              text={typing ? idea.slice(0, sub) : scene === "send" ? idea : ""}
              typing={typing}
              busy={busy}
              placeholder={
                reached("think-docs")
                  ? "Ask anything about your project... (e.g., Write an email, Schedule a meeting)"
                  : "Describe the software product you want to build..."
              }
            />
            <div className="mt-2 flex items-center justify-between px-1 font-mono text-[10.5px] text-ghost">
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <FolderSimple className="size-3" /> bookmark-ai
                </span>
                <span className="hidden sm:inline">Saved to Firestore</span>
              </span>
              <span>{fileCount}/14 files</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
