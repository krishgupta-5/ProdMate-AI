import {
  ArrowRight,
  BookOpen,
  Boxes,
  Braces,
  CircleCheck,
  Database,
  FileCode2,
  FileText,
  FolderTree,
  KeyRound,
  ListChecks,
  Map as MapIcon,
  MessageSquareText,
  Network,
  Plug,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { DocSection, TocLayout, type TocGroup } from '@/components/layout/toc-layout';
import { BrandMark } from '@/components/ui/brand-mark';
import { SiteLink } from '@/components/ui/site-link';
import type { Brand } from '@/lib/brands';
import { links } from '@/lib/site';

/** One picture per section, shown in the sidebar and beside the section's heading. The tool
 * sections use the tool's own logo in its colour. */
const ICONS: Record<string, ReactNode> = {
  introduction: <BookOpen />,
  'who-is-it-for': <Users />,
  'architecture-security': <ShieldCheck />,
  'core-capabilities': <FileText />,
  'ai-project-assistant': <Sparkles />,
  'how-it-works': <Workflow />,
  'example-output': <Braces />,
  'quick-start-connect': <Plug />,
  'github-integration': <BrandMark brand="github" color />,
  'notion-integration': <BrandMark brand="notion" color />,
  'jira-integration': <BrandMark brand="jira" color />,
  'gmail-integration': <BrandMark brand="gmail" color />,
  'calendar-integration': <BrandMark brand="calendar" color />,
  'token-quotas': <KeyRound />,
  'getting-started': <Rocket />,
  'current-status': <CircleCheck />,
};

const TOC: TocGroup[] = [
  {
    title: 'Overview',
    items: [
      { id: 'introduction', label: 'Introduction', icon: ICONS['introduction'] },
      { id: 'who-is-it-for', label: 'Who it’s for', icon: ICONS['who-is-it-for'] },
      { id: 'architecture-security', label: 'Architecture & security', icon: ICONS['architecture-security'] },
    ],
  },
  {
    title: 'Planning',
    items: [
      { id: 'core-capabilities', label: 'What it writes', icon: ICONS['core-capabilities'] },
      { id: 'ai-project-assistant', label: 'AI project assistant', icon: ICONS['ai-project-assistant'] },
      { id: 'how-it-works', label: 'How it works', icon: ICONS['how-it-works'] },
      { id: 'example-output', label: 'Example output', icon: ICONS['example-output'] },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { id: 'quick-start-connect', label: 'Connect any app', icon: ICONS['quick-start-connect'] },
      { id: 'github-integration', label: 'GitHub', icon: ICONS['github-integration'] },
      { id: 'notion-integration', label: 'Notion', icon: ICONS['notion-integration'] },
      { id: 'jira-integration', label: 'Jira', icon: ICONS['jira-integration'] },
      { id: 'gmail-integration', label: 'Gmail', icon: ICONS['gmail-integration'] },
      { id: 'calendar-integration', label: 'Google Calendar', icon: ICONS['calendar-integration'] },
    ],
  },
  {
    title: 'Setup',
    items: [
      { id: 'token-quotas', label: 'Token quotas & API keys', icon: ICONS['token-quotas'] },
      { id: 'getting-started', label: 'Getting started', icon: ICONS['getting-started'] },
      { id: 'current-status', label: 'Current status', icon: ICONS['current-status'] },
    ],
  },
];

const AUDIENCE = [
  { title: 'Founders', body: 'Validate and structure a product idea before hiring a team.' },
  { title: 'Developers', body: 'Spend less time planning and start building with clear requirements.' },
  { title: 'Product managers', body: 'Produce documentation and planning artifacts much faster.' },
  { title: 'Startups', body: 'Run a consistent planning process without a large product team.' },
];

const ARTIFACTS: { title: string; icon: LucideIcon; items: string[] }[] = [
  {
    title: 'Product requirements (PRD)',
    icon: FileText,
    items: [
      'Product overview and problem statement',
      'Goals and objectives',
      'Functional and non-functional requirements',
      'Success metrics, assumptions and constraints',
    ],
  },
  {
    title: 'Roadmap',
    icon: MapIcon,
    items: [
      'Milestones and release planning',
      'Feature prioritization',
      'Development phases',
      'Estimated timelines',
    ],
  },
  {
    title: 'API design',
    icon: Network,
    items: [
      'Endpoints and request structures',
      'Response formats',
      'Authentication requirements',
      'Error handling',
    ],
  },
  {
    title: 'Database schema',
    icon: Database,
    items: ['Entities and relationships', 'Tables and collections', 'Data models'],
  },
  {
    title: 'Architecture',
    icon: Boxes,
    items: [
      'Frontend and backend architecture',
      'Service interactions',
      'Infrastructure recommendations',
      'Architecture decision records (ADRs)',
    ],
  },
  {
    title: 'User stories & testing',
    icon: ListChecks,
    items: [
      'Story descriptions and acceptance criteria',
      'Priority levels and dependencies',
      'Unit, integration and end-to-end test plans',
      'Performance and security considerations',
    ],
  },
  {
    title: 'Folder structure',
    icon: FolderTree,
    items: [
      'Directory trees for your framework',
      'Component and service layout',
      'Config and asset hierarchy',
    ],
  },
  {
    title: 'DevOps & CI/CD',
    icon: FileCode2,
    items: ['Multi-stage Dockerfile', 'Multi-service docker-compose.yml', 'GitHub Actions workflows'],
  },
];

const INTEGRATION_STEPS: { brand: Brand; body: string }[] = [
  {
    brand: 'github',
    body: 'Type a repository name and choose public or private. Your folder structure, Docker files and README are pushed in seconds.',
  },
  {
    brand: 'notion',
    body: 'Pick a page in your workspace and sync. Your PRD, roadmap and architecture tables become organized Notion pages.',
  },
  {
    brand: 'jira',
    body: 'Choose a Jira project and generate tickets. Prodmate creates an epic and fills your board with estimated user stories.',
  },
  {
    brand: 'gmail',
    body: 'Add recipients and send. An executive summary with the blueprint arrives right away.',
  },
  {
    brand: 'calendar',
    body: 'Pick a start date and schedule. Sprint reviews and milestone deadlines are added to your calendar.',
  },
];

export function DocsPage() {
  return (
    <>
      <PageHeader eyebrow="Documentation" title="Prodmate docs">
        Everything Prodmate writes, how the assistant works, and how to send your plan to GitHub, Notion,
        Jira, Gmail and Google Calendar.
      </PageHeader>
      <TocLayout groups={TOC}>
        <DocSection id="introduction" icon={ICONS['introduction']} title="Introduction">
          <p>
            Prodmate is an AI planning workspace that helps founders, developers and product teams turn an
            idea into a structured development plan.
          </p>
          <p>
            Building software takes a lot of planning before the first line of code: requirement documents,
            feature definitions, API and database design, and getting everyone to agree. Instead of starting
            from a blank page, you describe what you want to build and Prodmate writes the documents you need
            to go from concept to execution: product requirements, roadmaps, user stories, API designs,
            database schemas, architecture plans, testing strategies and deployment plans.
          </p>
          <FlowDiagram />
        </DocSection>

        <DocSection id="who-is-it-for" icon={ICONS['who-is-it-for']} title="Who it’s for">
          <Cards items={AUDIENCE.map((a) => ({ title: a.title, children: a.body }))} />
        </DocSection>

        <DocSection
          id="architecture-security"
          icon={ICONS['architecture-security']}
          title="Architecture & security"
        >
          <p>
            Rather than asking one model to produce everything at once, which tends to time out or invent
            details, Prodmate runs <strong>nine separate generation pipelines</strong>. Each document is
            written on its own by a dedicated backend controller, so one can be regenerated without touching
            the others.
          </p>
          <Cards
            items={[
              {
                title: 'Sign-in with Clerk',
                children: 'Sign-up, sessions and role-based access, with Google and GitHub sign-in.',
              },
              {
                title: 'Storage on Firebase',
                children:
                  'Your projects are saved in Firebase Firestore and stay in sync across your devices.',
              },
            ]}
          />
        </DocSection>

        <DocSection id="core-capabilities" icon={ICONS['core-capabilities']} title="What it writes">
          <div className="grid gap-3 sm:grid-cols-2">
            {ARTIFACTS.map(({ icon: Icon, ...a }) => (
              <div key={a.title} className="rounded-2xl border border-pm-line p-5">
                <span className="grid size-9 place-items-center rounded-xl bg-pm-primary/10 text-pm-accent">
                  <Icon aria-hidden className="size-[18px]" />
                </span>
                <h3 className="!mt-4">{a.title}</h3>
                <ul className="mt-3 text-sm">
                  {a.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="rounded-2xl border border-pm-line bg-pm-shell/60 p-5 sm:col-span-2">
              <h3 className="!mt-0">Unified blueprint</h3>
              <p className="mt-2 text-sm">
                One Markdown document that combines all of the above. Download it, or export it as the README
                of your GitHub repository.
              </p>
            </div>
          </div>
        </DocSection>

        <DocSection
          id="ai-project-assistant"
          icon={ICONS['ai-project-assistant']}
          title="AI project assistant"
        >
          <p>
            The assistant in your workspace knows your whole plan. When requirements change a little, ask it
            for the change instead of regenerating the project. For example:
          </p>
          <ul>
            <li>“Add an is_favorite boolean column and a tags array to the bookmarks table.”</li>
            <li>“Why did you choose PostgreSQL over MongoDB for this architecture?”</li>
            <li>“Write a Jest test suite for the sign-in API endpoint.”</li>
          </ul>
        </DocSection>

        <DocSection id="how-it-works" icon={ICONS['how-it-works']} title="How it works">
          <ol>
            <li>
              <strong>Describe your idea</strong> in plain language, for example: “A clinic management
              platform where patients book appointments, doctors manage schedules and administrators oversee
              operations.”
            </li>
            <li>
              <strong>Generate the plan.</strong> Prodmate writes product requirements, a roadmap, user
              stories, API specifications, a database schema, an architecture plan and a testing plan.
            </li>
            <li>
              <strong>Review and refine</strong> each document to fit your business and technical needs.
            </li>
            <li>
              <strong>Build</strong> on the plan, and send it to your team’s tools.
            </li>
          </ol>
        </DocSection>

        <DocSection id="example-output" icon={ICONS['example-output']} title="Example output">
          <p>For the idea “Create a clinic appointment management platform”, Prodmate returns:</p>
          <pre>
            <code>{`{
  "status": "success",
  "generated_outputs": [
    "Product Requirement Document",
    "User Stories",
    "Roadmap",
    "API Design",
    "Database Schema",
    "Architecture Plan",
    "Testing Strategy",
    "Deployment Plan"
  ]
}`}</code>
          </pre>
        </DocSection>

        <DocSection
          id="quick-start-connect"
          icon={ICONS['quick-start-connect']}
          title="Connect any app in three steps"
        >
          <p>Connecting a tool takes under a minute. There’s no code to write and no API key to paste.</p>
          <ol>
            <li>
              <strong>Open your project.</strong> Once your plan is ready, the export toolbar at the top shows
              Export to GitHub, Sync to Notion, Export to Jira, Notify via Gmail and Schedule Sprints.
            </li>
            <li>
              <strong>Click to connect.</strong> Pick a tool and sign in to it in the window that opens, then
              click Allow. Prodmate is now linked to that account.
            </li>
            <li>
              <strong>Choose your options and export.</strong>
            </li>
          </ol>
          <ul className="!list-none !pl-0">
            {INTEGRATION_STEPS.map(({ brand, body }) => (
              <li key={brand} className="flex gap-3 rounded-xl border border-pm-line p-4 text-sm">
                <BrandMark brand={brand} color className="mt-0.5" />
                <span>{body}</span>
              </li>
            ))}
          </ul>
        </DocSection>

        <DocSection id="github-integration" icon={ICONS['github-integration']} title="GitHub">
          <p>Turns your plan into a live GitHub repository, using GitHub sign-in.</p>
          <ol>
            <li>
              Click <strong>Export to GitHub</strong> in your workspace toolbar.
            </li>
            <li>Authorize the Prodmate app, then enter a repository name and choose public or private.</li>
            <li>
              Prodmate creates the repository, builds the folder tree, and pushes <code>Dockerfile</code>,{' '}
              <code>docker-compose.yml</code> and <code>README.md</code> to the main branch.
            </li>
          </ol>
        </DocSection>

        <DocSection id="notion-integration" icon={ICONS['notion-integration']} title="Notion">
          <p>
            Exports your requirements and roadmap into formatted Notion pages. Markdown tables become native
            Notion tables, Mermaid architecture diagrams become code blocks, and user stories become toggle
            lists.
          </p>
        </DocSection>

        <DocSection id="jira-integration" icon={ICONS['jira-integration']} title="Jira">
          <p>
            Connects to Jira Cloud so you don’t write tickets by hand. Prodmate reads your user stories and
            acceptance criteria, creates a parent <strong>epic</strong> for the project, and adds each{' '}
            <strong>story</strong> and <strong>task</strong> to your active sprint board with estimated story
            points.
          </p>
        </DocSection>

        <DocSection id="gmail-integration" icon={ICONS['gmail-integration']} title="Gmail">
          <p>
            Keeps your team, founders and stakeholders up to date. Prodmate writes an executive summary and
            sends it, with the full blueprint, from your own Google account to anyone you choose.
          </p>
        </DocSection>

        <DocSection id="calendar-integration" icon={ICONS['calendar-integration']} title="Google Calendar">
          <p>
            Turns your timeline into calendar events. Prodmate reads your roadmap milestones and books sprint
            kickoffs, mid-sprint check-ins, code freezes and final demo reviews on your primary calendar.
          </p>
        </DocSection>

        <DocSection id="token-quotas" icon={ICONS['token-quotas']} title="Token quotas & API keys">
          <p>
            If you run Prodmate yourself, you can give each of the nine pipelines its own Groq API key, so
            they can all run at once without hitting rate limits:
          </p>
          <pre>
            <code>{`GROQ_API_KEY_MARKDOWN=gsk_...
GROQ_API_KEY_APIDESIGN=gsk_...
GROQ_API_KEY_FOLDERSTRUCTURE=gsk_...
GROQ_API_KEY_DOCKER=gsk_...`}</code>
          </pre>
        </DocSection>

        <DocSection id="getting-started" icon={ICONS['getting-started']} title="Getting started">
          <ol>
            <li>
              <strong>Create a project</strong> in your workspace.
            </li>
            <li>
              <strong>Describe your product idea</strong> in plain language.
            </li>
            <li>
              <strong>Generate the nine documents</strong> with one click.
            </li>
            <li>
              <strong>Refine them</strong> with the AI project assistant.
            </li>
            <li>
              <strong>Export</strong> to GitHub, Notion, Jira, Gmail and Google Calendar.
            </li>
          </ol>
          <p>
            <SiteLink href={links.getStarted}>Follow the step-by-step guide</SiteLink>, or{' '}
            <a href={links.app}>open Prodmate</a> and start.
          </p>
        </DocSection>

        <DocSection id="current-status" icon={ICONS['current-status']} title="Current status">
          <div className="rounded-2xl border border-pm-primary/25 bg-pm-primary/5 p-5 text-sm">
            All nine generation pipelines, the AI project assistant and the exports to GitHub, Notion, Jira,
            Gmail and Google Calendar are live. Prodmate is free while it’s in beta.
          </div>
          <SiteLink
            href={links.getStarted}
            className="group inline-flex items-center gap-1.5 text-sm font-medium !text-pm-accent !no-underline"
          >
            Create your first project
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </SiteLink>
        </DocSection>
      </TocLayout>
    </>
  );
}

const FLOW_DOCS: LucideIcon[] = [FileText, MapIcon, Network, Database, Boxes, ListChecks];
const FLOW_TOOLS: Brand[] = ['github', 'notion', 'jira', 'gmail', 'calendar'];

/** The whole product in one picture: an idea goes in, nine documents come out, and they go to
 * your tools. */
function FlowDiagram() {
  return (
    <figure className="rounded-2xl border border-pm-line bg-pm-shell/60 p-2">
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
        <div className="rounded-xl bg-pm-card p-4 ring-1 ring-pm-line">
          <p className="flex items-center gap-2 text-xs font-medium text-pm-muted">
            <MessageSquareText aria-hidden className="size-3.5" /> 1 · Your idea
          </p>
          <p className="mt-3 rounded-lg bg-pm-shell px-3 py-2 text-[12.5px] leading-snug">
            “A clinic app where patients book appointments…”
          </p>
        </div>
        <FlowArrow />
        <div className="rounded-xl bg-pm-card p-4 ring-1 ring-pm-line">
          <p className="flex items-center gap-2 text-xs font-medium text-pm-muted">
            <Sparkles aria-hidden className="size-3.5" /> 2 · Nine documents
          </p>
          <div className="mt-3 grid grid-cols-6 gap-1.5 sm:grid-cols-3">
            {FLOW_DOCS.map((Icon, i) => (
              <span
                key={i}
                className="grid aspect-square place-items-center rounded-lg bg-pm-primary/10 text-pm-accent"
              >
                <Icon aria-hidden className="size-4" />
              </span>
            ))}
          </div>
        </div>
        <FlowArrow />
        <div className="rounded-xl bg-pm-card p-4 ring-1 ring-pm-line">
          <p className="flex items-center gap-2 text-xs font-medium text-pm-muted">
            <Plug aria-hidden className="size-3.5" /> 3 · Your tools
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {FLOW_TOOLS.map((brand) => (
              <span
                key={brand}
                className="grid size-9 place-items-center rounded-lg bg-pm-shell ring-1 ring-pm-line"
              >
                <BrandMark brand={brand} color />
              </span>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

function FlowArrow() {
  return (
    <span aria-hidden className="grid place-items-center text-pm-muted">
      <ArrowRight className="size-4 rotate-90 sm:rotate-0" />
    </span>
  );
}

function Cards({ items }: { items: { title: string; children: string }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="rounded-2xl border border-pm-line p-5">
          <h3 className="!mt-0">{item.title}</h3>
          <p className="mt-1.5 text-sm text-pm-muted">{item.children}</p>
        </div>
      ))}
    </div>
  );
}
