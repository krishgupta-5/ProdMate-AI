import type { ReactNode } from "react";

import type { ArtifactId } from "@/content/landing";
import { cn } from "@/lib/utils";

/* Light previews of each file the chat panel generates, for the blueprint explorer. */

const kw = "text-st-submitted";
const str = "text-st-success";
const cm = "text-ghost";
const ty = "text-ember-600";

function Code({ lines }: { lines: [string, string?][] }) {
  return (
    <pre className="overflow-x-auto font-mono text-[12.5px] leading-6">
      {lines.map(([text, tone], i) => (
        <div key={i} className="flex">
          <span className="w-8 shrink-0 pr-3 text-right text-ghost/70 select-none">{i + 1}</span>
          <span className={cn("whitespace-pre", tone ?? "text-ink-2")}>{text}</span>
        </div>
      ))}
    </pre>
  );
}

function Doc({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-2xl font-medium tracking-tight text-ink">{title}</p>
      {children}
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[11px] tracking-widest text-ghost uppercase">{children}</p>;
}

function Readme() {
  return (
    <Doc
      title={
        <>
          Bookmark AI <span className="text-fade">README</span>
        </>
      }
    >
      <p className="text-sm text-muted">
        Save any page in one click and find it again by meaning, not keywords. Built for researchers
        and heavy readers.
      </p>
      <dl className="grid gap-3 sm:grid-cols-3">
        {[
          ["Problem", "Saved links are impossible to find again"],
          ["Audience", "Researchers and heavy readers"],
          ["Goal", "Find any saved page in under 5 seconds"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-paper p-3">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="mt-1 text-sm text-ink">{value}</dd>
          </div>
        ))}
      </dl>
      <div>
        <Label>Core features</Label>
        <ol className="mt-2 flex flex-col divide-y divide-line">
          {[
            "One click save from the browser extension",
            "Semantic search across titles, notes and page text",
            "Shared collections with role based access",
            "Export a collection to a Notion page",
          ].map((r, i) => (
            <li key={r} className="flex gap-3 py-2 text-sm text-ink-2">
              <span className="font-mono text-xs text-ember-600">0{i + 1}</span>
              {r}
            </li>
          ))}
        </ol>
      </div>
    </Doc>
  );
}

function Config() {
  return (
    <Code
      lines={[
        ["project:", kw],
        ["  name: bookmark-ai", str],
        ["  type: web_app"],
        ["stack:", kw],
        ["  frontend: { framework: nextjs, version: 16 }"],
        ["  backend: { runtime: node, framework: express }"],
        ["  database: { engine: postgres, extensions: [pgvector] }", ty],
        ["  auth: clerk"],
        ["services:", kw],
        ["  - api"],
        ["  - embeddings_worker"],
        ["environments: [development, staging, production]", cm],
      ]}
    />
  );
}

function Entity({ name, fields }: { name: string; fields: [string, string, string?][] }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-card">
      <p className="border-b border-line bg-ink px-3 py-1.5 font-mono text-xs font-semibold text-white">
        {name}
      </p>
      <ul className="px-3 py-1.5">
        {fields.map(([field, type, key]) => (
          <li
            key={field}
            className="flex items-center justify-between gap-3 py-0.5 font-mono text-[11px]"
          >
            <span className="flex items-center gap-1.5 text-ink-2">
              {key ? <span className="text-[9px] font-bold text-ember-600">{key}</span> : null}
              {field}
            </span>
            <span className="text-ghost">{type}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Schema() {
  return (
    <div className="rounded-2xl bg-paper bg-[radial-gradient(#16130f14_1px,transparent_1px)] bg-[size:16px_16px] p-4">
      <div className="relative grid gap-6 sm:grid-cols-3">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden size-full sm:block"
          preserveAspectRatio="none"
          viewBox="0 0 300 100"
        >
          <path
            d="M 92 30 L 108 30"
            stroke="#16130f40"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 192 30 L 208 30"
            stroke="#16130f40"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <Entity
          name="users"
          fields={[
            ["id", "uuid", "PK"],
            ["email", "text"],
            ["created_at", "timestamptz"],
          ]}
        />
        <Entity
          name="bookmarks"
          fields={[
            ["id", "uuid", "PK"],
            ["user_id", "uuid", "FK"],
            ["url", "text"],
            ["embedding", "vector(768)"],
          ]}
        />
        <Entity
          name="collections"
          fields={[
            ["id", "uuid", "PK"],
            ["owner_id", "uuid", "FK"],
            ["name", "text"],
          ]}
        />
      </div>
      <p className="mt-4 text-center font-mono text-[11px] text-ghost">
        users 1 ── n bookmarks · users 1 ── n collections
      </p>
    </div>
  );
}

function Api() {
  const rows = [
    ["GET", "/api/bookmarks", "List bookmarks for the session user", "200"],
    ["POST", "/api/bookmarks", "Save a page", "201"],
    ["PATCH", "/api/bookmarks/:id", "Edit title, notes or collection", "200"],
    ["DELETE", "/api/bookmarks/:id", "Remove a bookmark", "204"],
    ["POST", "/api/search", "Semantic search with a text query", "200"],
    ["GET", "/api/collections", "Collections the user can see", "200"],
  ];
  const tone: Record<string, string> = {
    GET: "text-st-success bg-st-success/10",
    POST: "text-st-progress bg-st-progress/10",
    PATCH: "text-st-pending bg-st-pending/10",
    DELETE: "text-st-failed bg-st-failed/10",
  };
  return (
    <div>
      <p className="font-mono text-xs text-muted">
        openapi: 3.1 · base /api · auth: Clerk session token
      </p>
      <ul className="mt-2 flex flex-col divide-y divide-line">
        {rows.map(([m, path, desc, code]) => (
          <li key={m + path} className="flex items-center gap-3 py-2.5">
            <span
              className={cn(
                "w-16 shrink-0 rounded-md py-1 text-center font-mono text-[11px] font-semibold",
                tone[m],
              )}
            >
              {m}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-mono text-sm text-ink">{path}</span>
              <span className="block truncate text-xs text-muted">{desc}</span>
            </span>
            <span className="font-mono text-xs text-ghost">{code}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Tree() {
  return (
    <Code
      lines={[
        ["bookmark-ai/", kw],
        ["├── src/"],
        ["│   ├── app/"],
        ["│   │   ├── api/bookmarks/route.ts", str],
        ["│   │   └── api/search/route.ts", str],
        ["│   ├── controllers/auth.ts"],
        ["│   ├── lib/db.ts"],
        ["│   └── lib/embeddings.ts"],
        ["├── workers/embeddings.ts"],
        ["├── docker-compose.yaml"],
        ["├── package.json"],
        ["└── README.md"],
      ]}
    />
  );
}

function Docker() {
  return (
    <Code
      lines={[
        ["services:", kw],
        ["  api:", kw],
        ["    build: ."],
        ['    ports: ["3000:3000"]', str],
        ["    depends_on: [db]"],
        ["    healthcheck:", kw],
        ['      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]', str],
        ["  db:", kw],
        ["    image: pgvector/pgvector:pg16", str],
        ["    volumes: [pgdata:/var/lib/postgresql/data]"],
        ["volumes:", kw],
        ["  pgdata: {}"],
      ]}
    />
  );
}

function Testing() {
  const rows = [
    ["Unit", "Vitest", 42, 86, "bg-st-success"],
    ["Integration", "Supertest", 18, 64, "bg-st-progress"],
    ["End to end", "Playwright", 9, 40, "bg-st-submitted"],
  ] as const;
  return (
    <div className="flex flex-col gap-5">
      <Label>testing_strategy</Label>
      {rows.map(([name, tool, cases, pct, color]) => (
        <div key={name}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink">
              {name} <span className="font-mono text-xs text-ghost">· {tool}</span>
            </span>
            <span className="font-mono text-xs text-muted">{cases} cases</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper-2">
            <div
              className={cn(
                "h-full origin-left animate-[grow_900ms_var(--ease-out-soft)_both] rounded-full",
                color,
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      ))}
      <p className="text-xs text-muted">Coverage target 80% · runs on every pull request</p>
    </div>
  );
}

function Stories() {
  const stories = [
    ["US-01", "As a reader, I can save a page with one click", "Must", "3 pts"],
    ["US-02", "As a reader, I can search my bookmarks by meaning", "Must", "5 pts"],
    ["US-03", "As a team lead, I can share a collection by link", "Should", "3 pts"],
    ["US-04", "As a writer, I can export a collection to Notion", "Could", "2 pts"],
  ];
  const tone: Record<string, string> = {
    Must: "bg-st-failed/10 text-st-failed",
    Should: "bg-st-pending/10 text-st-pending",
    Could: "bg-st-progress/10 text-st-progress",
  };
  return (
    <div className="flex flex-col gap-2">
      <Label>Module · Bookmarks</Label>
      {stories.map(([id, text, pri, pts]) => (
        <div key={id} className="rounded-xl bg-white p-3 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[11px] text-ghost">{id}</span>
            <span className="flex items-center gap-2">
              <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-semibold", tone[pri])}>
                {pri}
              </span>
              <span className="font-mono text-[11px] text-ember-600">{pts}</span>
            </span>
          </div>
          <p className="mt-1 text-sm text-ink">{text}</p>
        </div>
      ))}
    </div>
  );
}

function Roadmap() {
  const phases = [
    ["Phase 1", "MVP", "Save, search, Clerk sign in", "Weeks 1 to 4"],
    ["Phase 2", "Collaboration", "Shared collections, roles", "Weeks 5 to 7"],
    ["Phase 3", "Integrations", "Notion export, browser sync", "Weeks 8 to 10"],
  ];
  return (
    <ol className="relative flex flex-col gap-4 pl-6">
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-line-strong" />
      {phases.map(([phase, name, scope, when], i) => (
        <li key={phase} className="relative">
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-1.5 -left-6 size-3.5 rounded-full ring-4 ring-card",
              i === 0 ? "bg-ember-500" : "bg-paper-3",
            )}
          />
          <p className="font-mono text-[11px] text-ghost">
            {phase} · {when}
          </p>
          <p className="mt-0.5 text-base font-medium text-ink">{name}</p>
          <p className="text-sm text-muted">{scope}</p>
        </li>
      ))}
    </ol>
  );
}

function Timeline() {
  const bars = [
    ["Sprint 1", "Auth and save", 0, 25, "bg-ember-500"],
    ["Sprint 2", "Search and embeddings", 20, 30, "bg-st-progress"],
    ["Sprint 3", "Collections", 45, 25, "bg-st-submitted"],
    ["Sprint 4", "Notion export and launch", 68, 32, "bg-st-success"],
  ] as const;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between font-mono text-[10px] text-ghost">
        <span>Week 1</span>
        <span>Week 5</span>
        <span>Week 10</span>
      </div>
      {bars.map(([sprint, label, start, width, color]) => (
        <div key={sprint}>
          <p className="text-xs text-muted">
            <span className="font-medium text-ink">{sprint}</span> · {label}
          </p>
          <div className="relative mt-1.5 h-2.5 rounded-full bg-paper-2">
            <div
              className={cn(
                "absolute inset-y-0 origin-left animate-[grow_900ms_var(--ease-out-soft)_both] rounded-full",
                color,
              )}
              style={{ left: `${start}%`, width: `${width}%` }}
            />
          </div>
        </div>
      ))}
      <p className="text-xs text-muted">Critical path: embeddings worker → search API → launch</p>
    </div>
  );
}

function Deployment() {
  const steps = [
    ["Build", "Docker image pushed on merge to main"],
    ["CI/CD", "GitHub Actions: lint, test, build, deploy"],
    ["Release", "Blue green deploy with health checks"],
    ["Rollback", "Previous image restored in one command"],
    ["Monitoring", "Uptime, error rate and p95 latency alerts"],
  ];
  return (
    <ol className="flex flex-col gap-2">
      {steps.map(([name, detail], i) => (
        <li key={name} className="flex items-center gap-3 rounded-xl bg-paper px-3 py-2.5">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-[10px] text-white">
            {i + 1}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium text-ink">{name}</span>
            <span className="block truncate text-xs text-muted">{detail}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

function Cost() {
  const rows = [
    ["Development", "2 engineers × 10 weeks", "$18,000"],
    ["Hosting", "API and worker containers", "$40 / mo"],
    ["Database", "Managed Postgres with pgvector", "$25 / mo"],
    ["Embeddings", "About 50k pages a month", "$12 / mo"],
  ];
  return (
    <div>
      <ul className="flex flex-col divide-y divide-line">
        {rows.map(([item, basis, cost]) => (
          <li key={item} className="flex items-center justify-between gap-4 py-2.5">
            <span className="min-w-0">
              <span className="block text-sm text-ink">{item}</span>
              <span className="block truncate text-xs text-muted">{basis}</span>
            </span>
            <span className="font-mono text-sm text-ink">{cost}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-ink px-3 py-2.5 text-white">
        <span className="text-sm">Monthly run cost at launch</span>
        <span className="font-mono text-sm">$77</span>
      </div>
    </div>
  );
}

function Risk() {
  const rows = [
    ["Embedding cost grows with users", "Technical", "Medium", "Batch and cache embeddings"],
    ["Leaked share links", "Security", "High", "Signed links that expire"],
    ["Single database region", "Infrastructure", "Medium", "Daily backups to a second region"],
    ["One person knows the worker", "Operational", "Low", "Runbook in deployment-guide.md"],
  ];
  const tone: Record<string, string> = {
    High: "bg-st-failed/10 text-st-failed",
    Medium: "bg-st-pending/10 text-st-pending",
    Low: "bg-st-success/10 text-st-success",
  };
  return (
    <ul className="flex flex-col gap-2">
      {rows.map(([risk, kind, level, fix]) => (
        <li key={risk} className="rounded-xl bg-paper px-3 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-ink">{risk}</span>
            <span
              className={cn(
                "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                tone[level],
              )}
            >
              {level}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            {kind} · {fix}
          </p>
        </li>
      ))}
    </ul>
  );
}

function Final() {
  const toc = [
    "Overview",
    "System configuration",
    "Database schema",
    "API design",
    "Folder structure",
    "Docker environment",
    "Testing strategy",
    "User stories",
    "Roadmap and timeline",
    "Deployment",
    "Costs",
    "Risks",
  ];
  return (
    <Doc
      title={
        <>
          Bookmark AI <span className="text-fade">specification</span>
        </>
      }
    >
      <p className="text-sm text-muted">
        One document that consolidates every file in the blueprint. This is what goes to GitHub and
        Notion.
      </p>
      <ol className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
        {toc.map((item, i) => (
          <li key={item} className="flex items-baseline gap-2 text-sm text-ink-2">
            <span className="w-5 font-mono text-[11px] text-ember-600">{i + 1}.</span>
            {item}
          </li>
        ))}
      </ol>
    </Doc>
  );
}

export const artifactPreviews: Record<ArtifactId, () => ReactNode> = {
  markdown: Readme,
  config: Config,
  db: Schema,
  apiDesign: Api,
  folderStructure: Tree,
  docker: Docker,
  testingPlan: Testing,
  userStories: Stories,
  roadmap: Roadmap,
  projectTimeline: Timeline,
  deploymentGuide: Deployment,
  costEstimation: Cost,
  riskAnalysis: Risk,
  finalMarkdown: Final,
};

/** What each file covers, shown in the explorer inspector. */
export const artifactCovers: Record<ArtifactId, string[]> = {
  markdown: ["Problem and audience", "Core features", "Success metrics"],
  config: ["Frontend and backend stack", "Database and auth", "Services and environments"],
  db: ["Tables and fields", "Primary and foreign keys", "Relationships"],
  apiDesign: ["Endpoints and methods", "Request and response shapes", "Auth and status codes"],
  folderStructure: ["Folders and files", "Where each module lives", "Config at the root"],
  docker: ["Services and ports", "Volumes", "Health checks"],
  testingPlan: ["Unit, integration and E2E", "Tools and coverage", "When tests run"],
  userStories: ["Stories per module", "Priority", "Story points"],
  roadmap: ["Phases", "Milestones", "Dependencies"],
  projectTimeline: ["Sprints", "Critical path", "Delivery estimates"],
  deploymentGuide: ["Infrastructure", "CI/CD", "Rollback and monitoring"],
  costEstimation: ["Development cost", "Infrastructure cost", "Scaling cost"],
  riskAnalysis: ["Technical and security risks", "Severity", "Mitigation"],
  finalMarkdown: ["Every file, consolidated", "One shareable spec", "Ready to export"],
};
