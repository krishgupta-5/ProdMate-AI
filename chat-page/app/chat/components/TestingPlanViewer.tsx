"use client";

import React from "react";
import { CircleCheck, Layers, Monitor, Target, Workflow, Zap, type LucideIcon } from "lucide-react";
import MarkdownRenderer from "@/app/chat/components/MarkdownRenderer";

interface TestingPlanViewerProps {
  content: string;
}

const LAYERS: Record<string, { label: string; desc: string; icon: LucideIcon; color: string }> = {
  unit: { label: "Unit tests", desc: "Functions and components in isolation", icon: Zap, color: "var(--pm-violet)" },
  integration: { label: "Integration tests", desc: "Modules, APIs and the database together", icon: Layers, color: "var(--pm-blue)" },
  e2e: { label: "End-to-end tests", desc: "Real user flows in a browser", icon: Monitor, color: "var(--pm-green)" },
  ci: { label: "Continuous integration", desc: "What runs on every push", icon: Workflow, color: "var(--pm-amber)" },
};

export default function TestingPlanViewer({ content }: TestingPlanViewerProps) {
  const lines = (content ?? "").split("\n");
  const sections: Array<{ key: string; items: string[] }> = [];
  let currentSection = "";
  let currentItems: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const secMatch = trimmed.match(/^(unit|integration|e2e|ci):/i);
    if (secMatch) {
      if (currentSection && currentItems.length > 0) sections.push({ key: currentSection, items: currentItems });
      currentSection = secMatch[1].toLowerCase();
      currentItems = [];
    } else if (currentSection && trimmed.startsWith("-")) {
      let cleanItem = trimmed.replace(/^-\s*/, "");
      cleanItem = cleanItem.replace(/^(focus|scenarios|tools|environment):\s*/i, "");
      if (cleanItem) currentItems.push(cleanItem);
    }
  }
  if (currentSection && currentItems.length > 0) sections.push({ key: currentSection, items: currentItems });

  const strategy = content.match(/strategy:\s*(.+)/i)?.[1].trim() ?? "";
  const coverage = content.match(/coverage_target:\s*(.+)/i)?.[1].trim() ?? "";
  const coveragePct = Number(coverage.match(/\d+/)?.[0] ?? NaN);
  const totalChecks = sections.reduce((n, s) => n + s.items.length, 0);

  // Not in the structured format: show it as a document.
  if (sections.length === 0) return <MarkdownRenderer content={content} />;

  return (
    <div className="flex flex-col gap-5">
      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        {strategy && (
          <div className="rounded-xl border border-pm-line bg-pm-shell/50 p-3.5 sm:col-span-1">
            <div className="text-[11px] font-medium tracking-wide text-pm-muted uppercase">Strategy</div>
            <div className="mt-1 text-sm font-medium text-pm-fg">{strategy}</div>
          </div>
        )}
        {coverage && (
          <div className="rounded-xl border border-pm-line bg-pm-shell/50 p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-pm-muted uppercase">
              <Target className="size-3" />
              Coverage target
            </div>
            <div className="mt-1 text-sm font-semibold text-pm-fg tabular-nums">{coverage}</div>
            {!Number.isNaN(coveragePct) && (
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-pm-line">
                <div className="h-full rounded-full bg-pm-green" style={{ width: `${Math.min(100, coveragePct)}%` }} />
              </div>
            )}
          </div>
        )}
        <div className="rounded-xl border border-pm-line bg-pm-shell/50 p-3.5">
          <div className="text-[11px] font-medium tracking-wide text-pm-muted uppercase">Scope</div>
          <div className="mt-1 text-sm font-semibold text-pm-fg tabular-nums">
            {sections.length} layers · {totalChecks} checks
          </div>
        </div>
      </div>

      {/* Layers */}
      <div className="grid gap-3 md:grid-cols-2">
        {sections.map((sec) => {
          const layer = LAYERS[sec.key] ?? { label: sec.key, desc: "", icon: Layers, color: "var(--pm-muted)" };
          const Icon = layer.icon;
          return (
            <div key={sec.key} className="rounded-xl border border-pm-line bg-pm-card p-4">
              <div className="flex items-start gap-3">
                <span
                  className="grid size-8 shrink-0 place-items-center rounded-lg"
                  style={{ color: layer.color, background: `color-mix(in oklch, ${layer.color} 12%, transparent)` }}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-pm-fg">{layer.label}</span>
                    <span className="rounded-full bg-pm-shell px-2 py-0.5 text-[11px] font-medium text-pm-muted tabular-nums">
                      {sec.items.length}
                    </span>
                  </div>
                  {layer.desc && <div className="text-xs text-pm-muted">{layer.desc}</div>}
                </div>
              </div>
              <ul className="mt-3 flex flex-col gap-2">
                {sec.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-[13px] leading-relaxed text-pm-fg/80">
                    <CircleCheck className="mt-0.5 size-3.5 shrink-0" style={{ color: layer.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
