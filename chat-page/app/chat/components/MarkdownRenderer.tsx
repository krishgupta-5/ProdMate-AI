"use client";

import React, { useEffect, useState } from "react";
import { Check, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";
import FolderStructureViewer from "./FolderStructureViewer";

/** Watches the `.dark` class on <html> so diagrams can re-render in the right theme. */
function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setDark(el.classList.contains("dark"));
    update();
    const mo = new MutationObserver(update);
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  return dark;
}

const MermaidRenderer = ({ source }: { source: string }) => {
  const [svgHtml, setSvgHtml] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const dark = useIsDark();

  useEffect(() => {
    let isMounted = true;
    const id = `mermaid-md-${Math.random().toString(36).substring(2, 11)}`;
    import("mermaid").then((mermaidModule) => {
      const mermaid = mermaidModule.default;
      mermaid.initialize({
        startOnLoad: false,
        theme: dark ? "dark" : "neutral",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      });
      mermaid
        .render(id, source)
        .then(({ svg }) => {
          if (isMounted) {
            setSvgHtml(svg);
            setError(null);
          }
        })
        .catch((err) => {
          if (isMounted) setError(String(err));
          // Clean up leaked error elements
          const el = document.getElementById("d" + id);
          if (el) el.remove();
        });
    });
    return () => {
      isMounted = false;
    };
  }, [source, dark]);

  if (error) {
    return (
      <div className="my-4 overflow-x-auto rounded-xl border border-pm-danger/30 bg-pm-danger/5 p-3 font-mono text-xs text-pm-danger">
        Couldn&apos;t draw this diagram: {error}
        <pre className="mt-2 text-pm-fg/70">{source}</pre>
      </div>
    );
  }

  return (
    <div
      className="my-5 flex justify-center overflow-x-auto rounded-xl border border-pm-line bg-pm-shell/50 p-4 [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
};

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  /** Inline parser for **bold**, *italic*, `code` and [links](url). */
  const renderInlineText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|(?<![*\w])\*[^*\s][^*]*\*(?!\*))/g);

    return parts.map((part, index) => {
      if (!part) return null;
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return (
          <strong key={index} className="font-semibold text-pm-fg">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={index} className="rounded-md border border-pm-line bg-pm-shell px-1.5 py-0.5 font-mono text-[12px] text-pm-fg">
            {part.slice(1, -1)}
          </code>
        );
      }
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const safe = /^(https?:|mailto:|\/|#)/i.test(link[2]) ? link[2] : "#";
        return (
          <a
            key={index}
            href={safe}
            target={safe.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="font-medium text-pm-accent underline decoration-pm-accent/30 underline-offset-2 hover:decoration-pm-accent"
          >
            {link[1]}
          </a>
        );
      }
      if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={index} className="italic">
            {part.slice(1, -1)}
          </em>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // 1. Split content into lines (normalize all line endings first)
  const normalized = (content ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\\([-*_#>`|.()[\]!+])/g, "$1")
    .replace(/^(\s*)\+\s+/gm, "$1- ")
    .replace(/^(\s*)(\d+)\)\s+/gm, "$1$2. ")
    .replace(/[ \t]+$/gm, "");
  const rawLines = normalized.split("\n");

  // 2. Find first non-empty line to kill top whitespace
  let firstNonEmptyIndex = rawLines.findIndex((line) => line.trim() !== "");
  if (firstNonEmptyIndex === -1) firstNonEmptyIndex = 0;

  const lines = rawLines.slice(firstNonEmptyIndex);

  // 3. Pre-process blocks to group tables, code blocks, and raw mermaid diagrams
  const blocks: { type: string; content?: string; lines?: string[]; language?: string; isFirst?: boolean; originalIndex?: number; indent?: number }[] = [];
  // Nesting level of a list line, from its leading spaces (2 per level, tabs count as 2).
  const indentOf = (raw: string) => Math.min(4, Math.floor((raw.match(/^[ \t]*/)?.[0].replace(/\t/g, "  ").length ?? 0) / 2));
  let currentTable: string[] | null = null;
  let currentCode: { language: string; lines: string[]; startIdx: number } | null = null;
  let currentMermaid: string[] | null = null;
  let firstElementSet = false;

  // Helper: check if a trimmed line is a real code fence (``` optionally followed by a language tag, nothing else)
  const isCodeFence = (trimmed: string) => /^```\s*[a-zA-Z0-9]*\s*$/.test(trimmed);

  // Helper: check if a trimmed line is a table row (starts and ends with |)
  const isTableRow = (trimmed: string) => {
    const t = trimmed.replace(/\s+$/g, ''); // extra safety: strip trailing whitespace
    return t.length > 2 && t.charAt(0) === '|' && t.charAt(t.length - 1) === '|';
  };

  // Helper: check if a line looks like raw mermaid flowchart/sequence syntax
  const isMermaidStart = (trimmed: string) => /^(flowchart|sequenceDiagram|graph)\b/i.test(trimmed);
  const isMermaidContinuation = (trimmed: string) => /^(-->|---|\||subgraph|end\b|A\[|B\[|C\[|D\[|E\[|F\[|G\[|H\[|[A-Z]\[|[a-z]\[)/.test(trimmed) || /^\w+\s*-->/.test(trimmed) || /^\w+\s*---/.test(trimmed);

  lines.forEach((line, i) => {
    const tLine = line.trim();

    // Inside a code block — look for closing fence
    if (currentCode) {
      if (tLine === "```") {
        blocks.push({ type: "code", language: currentCode.language, lines: currentCode.lines, isFirst: !firstElementSet });
        firstElementSet = true;
        currentCode = null;
      } else {
        currentCode.lines.push(line);
      }
      return;
    }

    // Inside a raw mermaid block
    if (currentMermaid) {
      if (tLine === "" || (!isMermaidContinuation(tLine) && !tLine.startsWith("-->") && !/^\w+\[/.test(tLine))) {
        // End of mermaid block
        blocks.push({ type: "code", language: "mermaid", lines: currentMermaid, isFirst: !firstElementSet });
        firstElementSet = true;
        currentMermaid = null;
        // Process current line normally (don't skip it)
        if (tLine) {
          blocks.push({ type: "line", content: tLine, isFirst: !firstElementSet, originalIndex: i, indent: indentOf(line) });
          firstElementSet = true;
        } else {
          blocks.push({ type: "empty" });
        }
      } else {
        currentMermaid.push(line);
      }
      return;
    }

    // Opening fence: must be a standalone ``` line (possibly with language tag)
    if (isCodeFence(tLine)) {
      if (currentTable) {
        blocks.push({ type: "table", lines: currentTable, isFirst: !firstElementSet });
        firstElementSet = true;
        currentTable = null;
      }
      currentCode = { language: tLine.slice(3).trim(), lines: [], startIdx: i };
      return;
    }

    // Detect raw mermaid flowchart/graph/sequence lines (not inside code fences)
    if (isMermaidStart(tLine)) {
      if (currentTable) {
        blocks.push({ type: "table", lines: currentTable, isFirst: !firstElementSet });
        firstElementSet = true;
        currentTable = null;
      }
      currentMermaid = [line];
      return;
    }

    if (isTableRow(tLine)) {
      if (!currentTable) currentTable = [];
      currentTable.push(tLine);
    } else {
      if (currentTable) {
        blocks.push({ type: "table", lines: currentTable, isFirst: !firstElementSet });
        firstElementSet = true;
        currentTable = null;
      }

      if (tLine) {
        blocks.push({ type: "line", content: tLine, isFirst: !firstElementSet, originalIndex: i, indent: indentOf(line) });
        firstElementSet = true;
      } else {
        blocks.push({ type: "empty" });
      }
    }
  });

  if (currentTable) {
    blocks.push({ type: "table", lines: currentTable, isFirst: !firstElementSet });
  }
  if (currentMermaid) {
    blocks.push({ type: "code", language: "mermaid", lines: currentMermaid, isFirst: !firstElementSet });
  }
  // If a code block was never closed, flush its lines back as regular text (don't try to render as code/mermaid)
  if (currentCode) {
    const code = currentCode as { language: string; lines: string[]; startIdx: number };
    // Push the opening fence line as regular text
    blocks.push({ type: "line", content: "```" + code.language, isFirst: !firstElementSet, originalIndex: code.startIdx });
    firstElementSet = true;
    for (const cl of code.lines) {
      const t = cl.trim();
      if (t) {
        blocks.push({ type: "line", content: t, isFirst: false });
      } else {
        blocks.push({ type: "empty" });
      }
    }
  }

  // 4. Helper to determine if a table row is just the structural markdown separator (e.g. |---|---|)
  const isTableSeparator = (line: string) => {
    const chars = line.replace(/[\s\|]/g, "");
    return chars.length > 0 && chars.split("").every((c) => c === "-" || c === ":");
  };

  const cells = (row: string) => row.split("|").filter((_, idx, arr) => idx !== 0 && idx !== arr.length - 1);

  return (
    <div className="w-full text-[14px] leading-[1.7] text-pm-fg/80">
      {blocks.map((block, i) => {
        const first = !!block.isFirst;

        // ─── EMPTY LINES ───────────────────
        if (block.type === "empty") {
          return <div key={i} className="h-2" />;
        }

        // ─── CODE BLOCKS ───────────────────
        if (block.type === "code") {
          const source = (block.lines || []).join("\n");
          if (block.language === "mermaid") {
            return <MermaidRenderer key={`mermaid-${i}`} source={source} />;
          }
          // A file tree (├── / └──) reads better in the folder viewer than as raw text.
          if ((block.language === "" || /^(text|txt|bash|sh|plaintext|tree|folder)$/i.test(block.language || "")) && /^[\s│|]*[├└][─-]/m.test(source)) {
            return (
              <div key={`tree-${i}`} className={first ? "mb-4" : "my-4"}>
                <FolderStructureViewer content={source} />
              </div>
            );
          }
          if (block.language === "json" && source.includes("erDiagram")) {
            return null;
          }
          return (
            <div key={`code-${i}`} className={cn("overflow-hidden rounded-xl border border-pm-line bg-pm-code", first ? "mb-4" : "my-4")}>
              {block.language && (
                <div className="border-b border-pm-line px-4 py-1.5 font-mono text-[11px] text-pm-muted">{block.language}</div>
              )}
              <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-pm-fg">
                <code>{source}</code>
              </pre>
            </div>
          );
        }

        // ─── TABLES ────────────────────────
        if (block.type === "table" && block.lines) {
          const rows = block.lines.filter((l) => !isTableSeparator(l));
          if (rows.length === 0) return null;

          return (
            <div key={`table-${i}`} className={cn("overflow-x-auto rounded-xl border border-pm-line", first ? "mb-4" : "my-4")}>
              <table className="w-full border-collapse text-left text-[13px]">
                <thead>
                  <tr className="bg-pm-shell">
                    {cells(rows[0]).map((cell, idx) => (
                      <th key={idx} className="border-b border-pm-line px-4 py-2.5 text-xs font-semibold whitespace-nowrap text-pm-fg">
                        {renderInlineText(cell.trim())}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(1).map((row, rIdx) => (
                    <tr key={rIdx} className="border-b border-pm-line transition-colors last:border-0 hover:bg-pm-shell/50">
                      {cells(row).map((cell, cIdx) => (
                        <td key={cIdx} className={cn("px-4 py-2.5 align-top text-pm-fg/75", cIdx === 0 && "font-medium text-pm-fg")}>
                          {renderInlineText(cell.trim())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        const tLine = block.content!;
        // Nested list items step in by 1.25rem per level.
        const pad = block.indent ? { marginLeft: `${block.indent * 1.25}rem` } : undefined;

        // ─── HORIZONTAL RULES ──────────────
        if (tLine === "---" || tLine === "***" || tLine === "___") {
          return <hr key={i} className="my-6 border-pm-line" />;
        }

        // ─── HEADINGS ──────────────────────
        if (tLine.startsWith("# ")) {
          return (
            <h1 key={i} className={cn("text-[22px] leading-tight font-semibold tracking-tight text-pm-fg", first ? "mb-4" : "mt-8 mb-4")}>
              {renderInlineText(tLine.substring(2))}
            </h1>
          );
        }
        if (tLine.startsWith("## ")) {
          return (
            <h2
              key={i}
              className={cn(
                "text-[17px] font-semibold tracking-tight text-pm-fg",
                first ? "mb-3" : "mt-7 mb-3 border-t border-pm-line pt-5",
              )}
            >
              {renderInlineText(tLine.substring(3))}
            </h2>
          );
        }
        if (tLine.startsWith("### ")) {
          return (
            <h3 key={i} className={cn("text-[14.5px] font-semibold text-pm-fg", first ? "mb-2" : "mt-5 mb-2")}>
              {renderInlineText(tLine.substring(4))}
            </h3>
          );
        }
        if (tLine.startsWith("#### ")) {
          return (
            <h4 key={i} className={cn("text-[11px] font-semibold tracking-wider text-pm-muted uppercase", first ? "mb-1.5" : "mt-4 mb-1.5")}>
              {renderInlineText(tLine.substring(5))}
            </h4>
          );
        }

        if (/^#{5,6}\s/.test(tLine)) {
          return (
            <h5 key={i} className={cn("text-[13px] font-semibold text-pm-fg/90", first ? "mb-1.5" : "mt-3 mb-1.5")}>
              {renderInlineText(tLine.replace(/^#{5,6}\s+/, ""))}
            </h5>
          );
        }
        // A line that is only bold text ("**Goals**" or "**Goals:**") reads as a small heading.
        const boldOnly = tLine.match(/^\*\*([^*]+?)\*\*:?$/);
        if (boldOnly) {
          return (
            <h4 key={i} className={cn("text-[14px] font-semibold text-pm-fg", first ? "mb-1.5" : "mt-4 mb-1.5")}>
              {boldOnly[1].replace(/:$/, "")}
            </h4>
          );
        }

        // ─── BLOCKQUOTES & CALLOUTS ────────
        if (tLine.startsWith("> ") || tLine === ">") {
          const text = tLine.substring(2);
          const warn = /^\*{0,2}(warning|caution|risk|important)\b/i.test(text);
          const note = /^\*{0,2}(note|tip|info)\b/i.test(text);
          const Icon = warn ? TriangleAlert : Info;
          return (
            <div
              key={i}
              className={cn(
                "my-3 flex gap-2.5 rounded-xl border px-3.5 py-2.5 text-[13px]",
                warn ? "border-pm-amber/30 bg-pm-amber/[0.07]" : note ? "border-pm-blue/25 bg-pm-blue/[0.06]" : "border-pm-line bg-pm-shell/60",
              )}
            >
              {(warn || note) && <Icon className={cn("mt-0.5 size-4 shrink-0", warn ? "text-pm-amber" : "text-pm-blue")} />}
              <div className="text-pm-fg/80">{renderInlineText(text)}</div>
            </div>
          );
        }

        // ─── CHECKLISTS ────────────────────
        const task = tLine.match(/^[-*]\s+\[( |x|X)\]\s+(.*)$/);
        if (task) {
          const done = task[1].toLowerCase() === "x";
          return (
            <div key={i} className="mb-1.5 flex items-start gap-2.5" style={pad}>
              <span
                className={cn(
                  "mt-[3px] grid size-4 shrink-0 place-items-center rounded-[5px] border",
                  done ? "border-pm-primary bg-pm-primary text-white" : "border-pm-line-strong",
                )}
              >
                {done && <Check className="size-3" strokeWidth={3} />}
              </span>
              <span className={cn(done && "text-pm-muted line-through")}>{renderInlineText(task[2])}</span>
            </div>
          );
        }

        // ─── BULLET LIST ───────────────────
        if (tLine.startsWith("- ") || tLine.startsWith("* ") || tLine.startsWith("• ")) {
          return (
            <div key={i} className="mb-1.5 flex items-start gap-3 pl-1" style={pad}>
              <span className={cn("mt-[9px] size-1.5 shrink-0 rounded-full", block.indent ? "border border-pm-primary/70" : "bg-pm-primary/70")} />
              <div>{renderInlineText(tLine.substring(2))}</div>
            </div>
          );
        }

        // ─── NUMBERED LIST ─────────────────
        if (/^\d+\.\s/.test(tLine)) {
          const dotIdx = tLine.indexOf(".");
          return (
            <div key={i} className="mb-1.5 flex items-start gap-2.5" style={pad}>
              <span className="mt-0.5 grid h-5 min-w-5 shrink-0 place-items-center rounded-md bg-pm-shell px-1 text-[11px] font-semibold text-pm-fg/70 tabular-nums">
                {tLine.substring(0, dotIdx)}
              </span>
              <div>{renderInlineText(tLine.substring(dotIdx + 1).trim())}</div>
            </div>
          );
        }

        // ─── STRAY CODE FENCES ─────────────
        if (tLine.startsWith("```")) {
          return null;
        }

        // ─── "Label: value" LINES ──────────
        const kv = tLine.match(/^\*\*([^*]{1,40}?):?\*\*:?\s+(.+)$/);
        if (kv) {
          return (
            <div key={i} className="mb-2 flex flex-wrap gap-x-2" style={pad}>
              <span className="font-semibold text-pm-fg">{kv[1].replace(/:$/, "")}:</span>
              <span>{renderInlineText(kv[2])}</span>
            </div>
          );
        }

        // ─── PARAGRAPHS ────────────────────
        return (
          <p key={i} className="mb-3 text-pretty" style={pad}>
            {renderInlineText(tLine)}
          </p>
        );
      })}
    </div>
  );
}
