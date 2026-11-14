"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Code2,
  Copy,
  Download,
  Eye,
  Maximize2,
  Sparkles,
  X,
} from "lucide-react";
import FileContentRenderer from "./FileContentRenderer";
import { artifactMeta, MARKDOWN_LANGS } from "./artifacts";
import { IconButton } from "./ui";
import { cn } from "@/lib/cn";

interface ArtifactMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  file?: {
    name: string;
    language: string;
    content: string;
    dbSchema?: { mermaid: string; diagram: string };
  };
}

/** The coloured square icon used for an artifact type. */
export function ArtifactIcon({ language, className }: { language: string; className?: string }) {
  const meta = artifactMeta(language);
  const Icon = meta.icon;
  return (
    <span
      className={cn("grid size-9 shrink-0 place-items-center rounded-xl", className)}
      style={{ color: meta.color, background: `color-mix(in oklch, ${meta.color} 12%, transparent)` }}
    >
      <Icon className="size-4" strokeWidth={2} />
    </span>
  );
}

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return { copied, copy };
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const COLLAPSED_MAX = 520;

export default function ArtifactCard({
  msg,
  markdownMode,
  setMarkdownMode,
  onModify,
}: {
  msg: ArtifactMessage;
  markdownMode: Record<string, "code" | "preview">;
  setMarkdownMode: React.Dispatch<React.SetStateAction<Record<string, "code" | "preview">>>;
  /** Shown as "Edit with AI" when set (assistant artifacts, not in shared view). */
  onModify?: () => void;
}) {
  const file = msg.file!;
  const meta = artifactMeta(file.language);
  const isMarkdown = MARKDOWN_LANGS.includes(file.language);
  const mode = markdownMode[msg.id] ?? "preview";
  const exportText = file.language === "dbschema" ? file.dbSchema?.mermaid || file.content : file.content;
  const canExport = file.language !== "image" && !!exportText;

  const { copied, copy } = useCopy();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Long artifacts start clamped with a "Show all" fade; measure after each render of the body.
  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const check = () => setOverflows(el.scrollHeight > COLLAPSED_MAX + 40);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mode, file.content]);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFullscreen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  // Collapsing a long artifact shrinks the page above the viewport, which used to throw the reader
  // further down the chat. Keep the card's header where it was on screen instead.
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleExpanded = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      return;
    }
    const card = rootRef.current;
    let scroller: HTMLElement | null = card?.parentElement ?? null;
    while (scroller && !/(auto|scroll)/.test(getComputedStyle(scroller).overflowY)) scroller = scroller.parentElement;
    setIsExpanded(false);
    requestAnimationFrame(() => {
      if (!card || !scroller) return;
      const top = card.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
      if (top < 0) scroller.scrollTop += top - 16;
    });
  };
  const lines = (exportText || "").split("\n").length;
  const words = (exportText || "").trim().split(/\s+/).filter(Boolean).length;
  const filename = /\.\w+$/.test(file.name) ? file.name : `${file.name || file.language}.${meta.ext}`;
  const clamp = overflows && !isExpanded;

  const modeSwitch = isMarkdown && (
    <div className="flex rounded-lg border border-pm-line bg-pm-shell p-0.5" role="tablist" aria-label="View">
      {(["preview", "code"] as const).map((m) => (
        <button
          key={m}
          type="button"
          role="tab"
          aria-selected={mode === m}
          onClick={() => setMarkdownMode((prev) => ({ ...prev, [msg.id]: m }))}
          className={cn(
            "flex h-6 items-center gap-1 rounded-md px-2 text-[11px] font-medium transition-colors [&_svg]:size-3",
            mode === m ? "bg-pm-card text-pm-fg shadow-[0_1px_2px_rgba(0,0,0,0.06)]" : "text-pm-muted hover:text-pm-fg",
          )}
        >
          {m === "preview" ? <Eye /> : <Code2 />}
          {m === "preview" ? "Preview" : "Source"}
        </button>
      ))}
    </div>
  );

  const actions = (
    <>
      {modeSwitch}
      {canExport && (
        <>
          <IconButton title={copied ? "Copied" : "Copy"} onClick={() => copy(exportText)} className="size-7">
            {copied ? <Check className="text-pm-green" /> : <Copy />}
          </IconButton>
          <IconButton title={`Download ${filename}`} onClick={() => downloadText(filename, exportText)} className="size-7">
            <Download />
          </IconButton>
        </>
      )}
    </>
  );

  return (
    <>
      <div ref={rootRef} className="mt-4 overflow-hidden rounded-2xl border border-pm-line bg-pm-card shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-pm-line px-3.5 py-2.5">
          <ArtifactIcon language={file.language} />
          <button
            type="button"
            onClick={() => setIsCollapsed((c) => !c)}
            className="min-w-0 flex-1 text-left"
            aria-expanded={!isCollapsed}
          >
            <div className="truncate text-sm font-semibold tracking-tight text-pm-fg">{meta.label}</div>
            <div className="truncate text-xs text-pm-muted">
              {filename}
              {canExport && file.language !== "dbschema" && (
                <span className="max-sm:hidden">
                  {" "}
                  · {lines.toLocaleString()} lines · {words.toLocaleString()} words
                </span>
              )}
            </div>
          </button>
          <div className="flex shrink-0 items-center gap-0.5">
            <span className="mr-1 flex items-center gap-0.5 max-sm:hidden">{actions}</span>
            <IconButton title="Open full screen" onClick={() => setFullscreen(true)} className="size-7">
              <Maximize2 />
            </IconButton>
            <IconButton title={isCollapsed ? "Expand" : "Collapse"} onClick={() => setIsCollapsed((c) => !c)} className="size-7">
              <ChevronDown className={cn("transition-transform", isCollapsed && "-rotate-90")} />
            </IconButton>
          </div>
        </div>

        {/* Body */}
        {!isCollapsed && (
          <div className="relative">
            <div
              ref={bodyRef}
              className={cn("overflow-x-auto", clamp && "overflow-y-hidden")}
              style={clamp ? { maxHeight: COLLAPSED_MAX } : undefined}
            >
              <FileContentRenderer msg={msg} markdownMode={markdownMode} />
            </div>
            {overflows && (
              <div
                className={cn(
                  "flex justify-center pb-3",
                  clamp && "absolute inset-x-0 bottom-0 items-end bg-gradient-to-t from-pm-card via-pm-card/90 to-transparent pt-16",
                )}
              >
                <button
                  type="button"
                  onClick={toggleExpanded}
                  className="flex h-8 items-center gap-1.5 rounded-full border border-pm-line bg-pm-card px-3.5 text-xs font-medium text-pm-fg/80 shadow-sm transition-colors hover:text-pm-fg"
                >
                  <ChevronDown className={cn("size-3.5 transition-transform", isExpanded && "rotate-180")} />
                  {isExpanded ? "Show less" : "Show all"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {onModify && !isCollapsed && (
          <div className="flex items-center justify-between gap-3 border-t border-pm-line bg-pm-shell/50 px-3.5 py-2">
            <span className="truncate text-xs text-pm-muted">Want changes? Only this artifact regenerates.</span>
            <button
              type="button"
              onClick={onModify}
              className="flex h-7 shrink-0 items-center gap-1.5 rounded-full border border-pm-line bg-pm-card px-3 text-xs font-medium text-pm-fg/85 transition-colors hover:border-pm-primary/40 hover:text-pm-accent"
            >
              <Sparkles className="size-3.5" />
              Edit with AI
            </button>
          </div>
        )}
      </div>

      {/* Full-screen view */}
      {fullscreen && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/40 p-3 backdrop-blur-[2px] animate-in fade-in duration-150 sm:p-6"
          onMouseDown={() => setFullscreen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={meta.label}
            className="flex h-full max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-pm-line bg-pm-card shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-pm-line px-4 py-3">
              <ArtifactIcon language={file.language} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-semibold tracking-tight">{meta.label}</div>
                <div className="truncate text-xs text-pm-muted">{filename}</div>
              </div>
              <div className="flex items-center gap-0.5">
                {actions}
                <IconButton title="Close" onClick={() => setFullscreen(false)} className="ml-1 size-7">
                  <X />
                </IconButton>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
              <FileContentRenderer msg={msg} markdownMode={markdownMode} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
