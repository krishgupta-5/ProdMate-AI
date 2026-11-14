"use client";

import React, { useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import CodeRenderer from "@/app/chat/components/CodeRenderer";
import MarkdownRenderer from "@/app/chat/components/MarkdownRenderer";
import { cn } from "@/lib/cn";

// HTTP method colours (theme-aware status tokens from globals.css).
const methodColors: Record<string, string> = {
  GET: "var(--pm-green)",
  POST: "var(--pm-blue)",
  PUT: "var(--pm-amber)",
  PATCH: "var(--pm-violet)",
  DELETE: "var(--pm-red)",
};

interface ApiDesignViewerProps {
  content: string;
}

export default function ApiDesignViewer({ content }: ApiDesignViewerProps) {
  let overview = "";
  let groups: Array<{
    group: string;
    description?: string;
    routes: Array<{
      method: string;
      path: string;
      description: string;
      request_body?: string;
      response?: string;
    }>;
    groupRequestModels?: string;
    groupResponseModels?: string;
  }> = [];

  try {
    const isMarkdownFormat = content.includes("### ") && content.includes("#### Endpoints");

    if (isMarkdownFormat) {
      // ─── PARSE NEW MARKDOWN FORMAT ──────────────────────
      const sections = content.split(/^###\s+/m);
      overview = sections[0].trim();

      for (let i = 1; i < sections.length; i++) {
        const section = sections[i];

        // If it doesn't have endpoints, it's a standard markdown section (e.g. Entities, Relationships)
        if (!section.includes("#### Endpoints")) {
          const trimmed = section.trim();
          const sectionLines = trimmed.split("\n").map(l => l.trim()).filter(l => l.length > 0);
          const title = (sectionLines[0] || "").toLowerCase();
          // Skip category headers like "Resources" that just group the endpoint cards
          const skipHeaders = ["resources", "api resources", "api endpoints", "endpoints", "routes"];
          if (skipHeaders.includes(title)) continue;
          // Only include sections with real body content (more than just a title)
          if (sectionLines.length > 1) {
            overview += `\n\n### ${trimmed}`;
          }
          continue;
        }

        const lines = section.split("\n");
        const groupName = lines[0].trim();

        const routes: any[] = [];
        const endpointRegex = /^\|\s*(GET|POST|PUT|PATCH|DELETE)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|([^|]+)?\|/;

        for (const line of lines) {
          const match = line.match(endpointRegex);
          if (match) {
            routes.push({
              method: match[1].trim(),
              path: match[2].trim(),
              description: match[3].trim(),
            });
          }
        }

        let description = "";
        const descMatch = section.match(/#### Purpose([\s\S]*?)(?=####|$)/);
        if (descMatch) description = descMatch[1].trim();

        let groupRequestModels = "";
        const reqMatch = section.match(/#### Request Models([\s\S]*?)(?=####|$)/);
        if (reqMatch) {
          const text = reqMatch[1].trim();
          if (text && text.toLowerCase() !== "none" && text.toLowerCase() !== "n/a") {
            groupRequestModels = text;
          }
        }

        let groupResponseModels = "";
        const resMatch = section.match(/#### Response Models([\s\S]*?)(?=####|$)/);
        if (resMatch) {
          const text = resMatch[1].trim();
          if (text && text.toLowerCase() !== "none" && text.toLowerCase() !== "n/a") {
            groupResponseModels = text;
          }
        }

        groups.push({
          group: groupName,
          description,
          routes,
          groupRequestModels,
          groupResponseModels,
        });
      }
    } else {
      // ─── PARSE LEGACY YAML FORMAT ───────────────────────
      const lines = content.split("\n");
      let currentGroup: string | null = null;
      let currentRoutes: any[] = [];
      let currentRoute: any = {};
      let inRoutes = false;

      for (const line of lines) {
        const trimmed = line.trim();

        const groupMatch = trimmed.match(/^-\s*group:\s*(.+)$/);
        if (groupMatch) {
          if (currentGroup !== null) {
            if (currentRoute.method) {
              currentRoutes.push({
                method: currentRoute.method,
                path: currentRoute.path ?? "",
                description: currentRoute.description ?? "",
                request_body: currentRoute.request_body ?? "none",
                response: currentRoute.response ?? "",
              });
            }
            if (currentRoutes.length > 0) {
              groups.push({ group: currentGroup, routes: [...currentRoutes] });
            }
          }
          currentGroup = groupMatch[1].trim();
          currentRoutes = [];
          currentRoute = {};
          inRoutes = false;
          continue;
        }

        if (trimmed === "routes:") {
          inRoutes = true;
          continue;
        }

        if (!currentGroup) continue;

        const methodMatch = trimmed.match(/^-\s*method:\s*(.+)$/);
        if (methodMatch) {
          if (currentRoute.method) {
            currentRoutes.push({
              method: currentRoute.method,
              path: currentRoute.path ?? "",
              description: currentRoute.description ?? "",
              request_body: currentRoute.request_body ?? "none",
              response: currentRoute.response ?? "",
            });
          }
          currentRoute = { method: methodMatch[1].trim() };
          inRoutes = true;
          continue;
        }

        if (inRoutes && currentRoute.method !== undefined) {
          const pathMatch = trimmed.match(/^path:\s*(.+)$/);
          if (pathMatch) currentRoute.path = pathMatch[1].trim();

          const descMatch = trimmed.match(/^description:\s*(.+)$/);
          if (descMatch) currentRoute.description = descMatch[1].trim();

          const bodyMatch = trimmed.match(/^request_body:\s*(.+)$/);
          if (bodyMatch) currentRoute.request_body = bodyMatch[1].trim();

          const respMatch = trimmed.match(/^response:\s*(.+)$/);
          if (respMatch) currentRoute.response = respMatch[1].trim();
        }
      }

      if (currentRoute.method) {
        currentRoutes.push({
          method: currentRoute.method,
          path: currentRoute.path ?? "",
          description: currentRoute.description ?? "",
          request_body: currentRoute.request_body ?? "none",
          response: currentRoute.response ?? "",
        });
      }
      if (currentGroup !== null && currentRoutes.length > 0) {
        groups.push({ group: currentGroup, routes: [...currentRoutes] });
      }
    }
  } catch (e) {
    groups = [];
  }

  // Fallback if parsing completely fails or no groups were found
  if (groups.length === 0 && !overview) {
    // We still want to render whatever they generated as markdown, so tables and mermaid diagrams work!
    return (
      <MarkdownRenderer content={content} />
    );
  }

  // ── Extract erDiagram relationships from overview ──
  let relationships: Array<{ left: string; right: string; label: string; arrow: string }> = [];
  let cleanOverview = overview;

  // Find erDiagram block and parse it (greedy — grab everything until end or next major heading)
  const erMatch = overview.match(/erDiagram\s*\n([\s\S]*?)(?=\n#{2,3}\s|\s*$)/i);
  if (erMatch) {
    const relLines = erMatch[1].split("\n").map(l => l.trim()).filter(l => l.length > 0);
    for (const line of relLines) {
      // Parse: ENTITY1 ||--o{ ENTITY2 : label
      const relMatch = line.match(/^(\w+)\s+([\|{}o\-]+)\s+(\w+)\s*:\s*(.+)$/);
      if (relMatch) {
        relationships.push({
          left: relMatch[1],
          arrow: relMatch[2],
          right: relMatch[3],
          label: relMatch[4].replace(/"/g, "").trim(),
        });
      }
    }
    // Remove the entire erDiagram block from overview
    cleanOverview = cleanOverview.replace(/erDiagram[\s\S]*?(?=\n#{2,3}\s|\s*$)/i, "").trim();
  }

  // Strip "Relationships" and "Resources" headings at any level (##, ###, or plain bold)
  cleanOverview = cleanOverview
    .replace(/#{2,3}\s*Relationships\s*\n?/gi, "")
    .replace(/#{2,3}\s*Resources\s*\n?/gi, "")
    .replace(/\*\*Resources\*\*\s*\n?/gi, "")
    .replace(/\*\*Relationships\*\*\s*\n?/gi, "")
    .trim();

  // ── Relationship type decoder ──
  const decodeArrow = (arrow: string): string => {
    if (arrow.includes("||") && arrow.includes("o{")) return "one-to-many";
    if (arrow.includes("||") && arrow.includes("||")) return "one-to-one";
    if (arrow.includes("}o") && arrow.includes("o{")) return "many-to-many";
    return "relates-to";
  };

  const relTypeColors: Record<string, string> = {
    "one-to-many": "var(--pm-blue)",
    "one-to-one": "var(--pm-green)",
    "many-to-many": "var(--pm-amber)",
    "relates-to": "var(--pm-muted)",
  };

  return <ApiDesignBody overview={cleanOverview} relationships={relationships} groups={groups} relTypeColors={relTypeColors} decodeArrow={decodeArrow} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Presentation
// ─────────────────────────────────────────────────────────────────────────────

type Route = { method: string; path: string; description: string; request_body?: string; response?: string };
type Group = {
  group: string;
  description?: string;
  routes: Route[];
  groupRequestModels?: string;
  groupResponseModels?: string;
};

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

function MethodBadge({ method, className }: { method: string; className?: string }) {
  const m = method.toUpperCase();
  const color = methodColors[m] || "var(--pm-muted)";
  return (
    <span
      className={cn("inline-flex h-5 w-14 shrink-0 items-center justify-center rounded-md font-mono text-[10.5px] font-semibold tracking-wide", className)}
      style={{ color, background: `color-mix(in oklch, ${color} 13%, transparent)` }}
    >
      {m}
    </span>
  );
}

function hasModel(v?: string) {
  return !!v && v !== "none" && v !== '"none"';
}

function RouteRow({ r }: { r: Route }) {
  const expandable = hasModel(r.request_body) || hasModel(r.response);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-pm-line bg-pm-card transition-colors hover:border-pm-line-strong">
      <div
        className={cn("group flex items-center gap-3 px-3 py-2", expandable && "cursor-pointer")}
        onClick={() => expandable && setOpen((o) => !o)}
      >
        <MethodBadge method={r.method} />
        <code className="min-w-0 truncate font-mono text-[13px] font-medium text-pm-fg">{r.path}</code>
        <button
          type="button"
          title={copied ? "Copied" : "Copy path"}
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard?.writeText(r.path);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
          className="grid size-6 shrink-0 place-items-center rounded-md text-pm-muted opacity-0 transition-opacity group-hover:opacity-100 hover:bg-pm-shell hover:text-pm-fg"
        >
          {copied ? <Check className="size-3 text-pm-green" /> : <Copy className="size-3" />}
        </button>
        <span className="ml-auto hidden min-w-0 truncate text-xs text-pm-muted sm:block sm:max-w-[45%]">{r.description}</span>
        {expandable && <ChevronDown className={cn("size-3.5 shrink-0 text-pm-muted transition-transform", open && "rotate-180")} />}
      </div>
      {r.description && <div className="px-3 pb-2 text-xs text-pm-muted sm:hidden">{r.description}</div>}

      {expandable && open && (
        <div className="grid gap-3 border-t border-pm-line bg-pm-shell/40 p-3 lg:grid-cols-2">
          {hasModel(r.request_body) && (
            <div>
              <div className="mb-1.5 text-[10.5px] font-semibold tracking-wider text-pm-muted uppercase">Request body</div>
              <div className="overflow-x-auto rounded-lg border border-pm-line bg-pm-code py-1.5">
                <CodeRenderer content={r.request_body!} language="json" />
              </div>
            </div>
          )}
          {hasModel(r.response) && (
            <div>
              <div className="mb-1.5 text-[10.5px] font-semibold tracking-wider text-pm-muted uppercase">Response</div>
              <div className="overflow-x-auto rounded-lg border border-pm-line bg-pm-code py-1.5">
                <CodeRenderer content={r.response!} language="json" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ApiDesignBody({
  overview,
  relationships,
  groups,
  relTypeColors,
  decodeArrow,
}: {
  overview: string;
  relationships: Array<{ left: string; right: string; label: string; arrow: string }>;
  groups: Group[];
  relTypeColors: Record<string, string>;
  decodeArrow: (arrow: string) => string;
}) {
  const [filter, setFilter] = useState<string | null>(null);
  const allRoutes = groups.flatMap((g) => g.routes);
  const counts = METHODS.map((m) => [m, allRoutes.filter((r) => r.method.toUpperCase() === m).length] as const).filter(
    ([, n]) => n > 0,
  );

  return (
    <div className="flex flex-col gap-6">
      {overview && <MarkdownRenderer content={overview} />}

      {/* Summary + method filter */}
      {allRoutes.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-pm-line bg-pm-shell/50 p-2.5">
          <span className="px-1.5 text-sm text-pm-muted">
            <span className="font-semibold text-pm-fg tabular-nums">{allRoutes.length}</span> endpoints in{" "}
            <span className="font-semibold text-pm-fg tabular-nums">{groups.length}</span> resources
          </span>
          <div className="ml-auto flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setFilter(null)}
              className={cn(
                "h-7 rounded-lg px-2.5 text-xs font-medium transition-colors",
                !filter ? "bg-pm-card text-pm-fg shadow-[0_0_0_1px_var(--pm-line)]" : "text-pm-muted hover:text-pm-fg",
              )}
            >
              All
            </button>
            {counts.map(([m, n]) => (
              <button
                key={m}
                type="button"
                onClick={() => setFilter(filter === m ? null : m)}
                className={cn(
                  "flex h-7 items-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors",
                  filter === m ? "bg-pm-card text-pm-fg shadow-[0_0_0_1px_var(--pm-line)]" : "text-pm-muted hover:text-pm-fg",
                )}
              >
                <span className="font-mono text-[10.5px] font-semibold" style={{ color: methodColors[m] }}>
                  {m}
                </span>
                <span className="tabular-nums">{n}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Entity relationships */}
      {relationships.length > 0 && (
        <section>
          <h3 className="mb-2.5 text-[11px] font-semibold tracking-wider text-pm-muted uppercase">Entity relationships</h3>
          <div className="grid gap-2 md:grid-cols-2">
            {relationships.map((rel, i) => {
              const type = decodeArrow(rel.arrow);
              const color = relTypeColors[type] || "var(--pm-muted)";
              return (
                <div key={i} className="flex items-center gap-2.5 rounded-xl border border-pm-line bg-pm-card px-3 py-2">
                  <code className="truncate font-mono text-[12.5px] font-semibold text-pm-fg">{rel.left}</code>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase"
                    style={{ color, background: `color-mix(in oklch, ${color} 13%, transparent)` }}
                  >
                    {type}
                  </span>
                  <code className="truncate font-mono text-[12.5px] font-semibold text-pm-fg">{rel.right}</code>
                  <span className="ml-auto truncate text-xs text-pm-muted italic">{rel.label}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Resource groups */}
      {groups.map((g, gi) => {
        const routes = filter ? g.routes.filter((r) => r.method.toUpperCase() === filter) : g.routes;
        if (filter && routes.length === 0) return null;
        return (
          <section key={gi}>
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h3 className="text-[15px] font-semibold tracking-tight text-pm-fg capitalize">{g.group}</h3>
              <span className="text-xs text-pm-muted tabular-nums">
                {routes.length} {routes.length === 1 ? "endpoint" : "endpoints"}
              </span>
            </div>
            {g.description && <p className="-mt-1.5 mb-3 text-[13px] leading-relaxed text-pm-muted">{g.description}</p>}

            <div className="flex flex-col gap-1.5">
              {routes.map((r, ri) => (
                <RouteRow key={ri} r={r} />
              ))}
            </div>

            {(g.groupRequestModels || g.groupResponseModels) && (
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {g.groupRequestModels && (
                  <div className="rounded-xl border border-pm-line bg-pm-shell/40 p-3.5">
                    <div className="mb-2 text-[10.5px] font-semibold tracking-wider text-pm-muted uppercase">Request models</div>
                    <MarkdownRenderer content={g.groupRequestModels} />
                  </div>
                )}
                {g.groupResponseModels && (
                  <div className="rounded-xl border border-pm-line bg-pm-shell/40 p-3.5">
                    <div className="mb-2 text-[10.5px] font-semibold tracking-wider text-pm-muted uppercase">Response models</div>
                    <MarkdownRenderer content={g.groupResponseModels} />
                  </div>
                )}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
