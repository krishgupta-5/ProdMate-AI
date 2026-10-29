/**
 * Landing page copy. Product facts come from the chat app (chat-page/): file names and messages
 * from ChatPanel.buildAssistantMessage, dependencies from lib/pipeline/DependencyResolver.ts,
 * export targets from ARTIFACT_DEPENDENCY_MAP in lib/pipeline/types.ts.
 * Copy avoids hyphens inside sentences by design.
 */

export const heroIdeas = [
  "An AI bookmark manager with semantic search, Clerk auth and Notion export",
  "A clinic booking platform with doctor schedules, SMS reminders and payments",
  "A marketplace for local makers with Stripe checkout and order tracking",
] as const;

export type ArtifactId =
  | "markdown"
  | "config"
  | "docker"
  | "apiDesign"
  | "db"
  | "folderStructure"
  | "testingPlan"
  | "userStories"
  | "roadmap"
  | "deploymentGuide"
  | "costEstimation"
  | "projectTimeline"
  | "riskAnalysis"
  | "finalMarkdown";

export type ExportTarget = "github" | "notion" | "jira";
export type ArtifactGroup = "Foundation" | "Engineering" | "Planning" | "Delivery" | "Spec";

export type Artifact = {
  id: ArtifactId;
  /** Exact file name shown in the chat panel. */
  file: string;
  /** Name used in the chat panel's "Generating ..." status. */
  name: string;
  /** Language badge in the chat panel file header. */
  lang: "MD" | "YAML" | "TXT" | "ER";
  group: ArtifactGroup;
  /** The assistant message that comes with the file. */
  message: string;
  /** Option chip that opens this file in chat. */
  option: string;
  readsFrom: ArtifactId[];
  exportsTo: ExportTarget[];
  lines: number;
};

export const artifacts: Artifact[] = [
  {
    id: "markdown",
    file: "README.md",
    name: "Project Documentation",
    lang: "MD",
    group: "Foundation",
    message: "Project documentation generated.",
    option: "Generate Docs",
    readsFrom: [],
    exportsTo: ["github", "notion"],
    lines: 142,
  },
  {
    id: "config",
    file: "system-config.yaml",
    name: "System Configuration",
    lang: "YAML",
    group: "Foundation",
    message: "System config generated. Stack, services and environments are fixed here.",
    option: "System Config",
    readsFrom: ["markdown"],
    exportsTo: ["github"],
    lines: 96,
  },
  {
    id: "db",
    file: "schema.er",
    name: "Database Schema",
    lang: "ER",
    group: "Foundation",
    message: "Database schema rendered as an entity relationship diagram.",
    option: "View DB Schema",
    readsFrom: ["config"],
    exportsTo: ["github", "notion"],
    lines: 58,
  },
  {
    id: "apiDesign",
    file: "api-design.yaml",
    name: "API Specifications",
    lang: "YAML",
    group: "Engineering",
    message: "API design specification generated.",
    option: "Show API Design",
    readsFrom: ["config", "markdown", "db"],
    exportsTo: ["github", "notion"],
    lines: 214,
  },
  {
    id: "folderStructure",
    file: "project-structure.txt",
    name: "Directory Structure",
    lang: "TXT",
    group: "Engineering",
    message: "Project folder structure generated.",
    option: "Show Folder Structure",
    readsFrom: ["config"],
    exportsTo: ["github"],
    lines: 64,
  },
  {
    id: "docker",
    file: "docker-compose.yaml",
    name: "Docker Environment",
    lang: "YAML",
    group: "Engineering",
    message:
      "Docker Compose configuration generated. Services, volumes and health checks are bound.",
    option: "Show Docker",
    readsFrom: ["config"],
    exportsTo: ["github"],
    lines: 48,
  },
  {
    id: "testingPlan",
    file: "testing-plan.yaml",
    name: "Testing Strategy",
    lang: "YAML",
    group: "Engineering",
    message: "Testing plan generated. Unit, integration and E2E strategy defined.",
    option: "Show Testing Plan",
    readsFrom: ["config", "apiDesign", "folderStructure"],
    exportsTo: ["github", "notion"],
    lines: 120,
  },
  {
    id: "userStories",
    file: "user-stories.md",
    name: "User Stories",
    lang: "MD",
    group: "Planning",
    message: "User stories generated. All modules covered.",
    option: "Show User Stories",
    readsFrom: ["config", "markdown", "apiDesign"],
    exportsTo: ["jira", "notion"],
    lines: 176,
  },
  {
    id: "roadmap",
    file: "roadmap.md",
    name: "Product Roadmap",
    lang: "MD",
    group: "Planning",
    message: "Product roadmap generated. Phases, milestones and dependencies mapped.",
    option: "Show Roadmap",
    readsFrom: ["config", "markdown", "userStories"],
    exportsTo: ["jira", "notion"],
    lines: 88,
  },
  {
    id: "projectTimeline",
    file: "project-timeline.md",
    name: "Project Timeline",
    lang: "MD",
    group: "Planning",
    message: "Project timeline generated. Sprints, critical path and delivery estimates mapped.",
    option: "Show Project Timeline",
    readsFrom: ["config", "roadmap"],
    exportsTo: ["jira", "notion"],
    lines: 72,
  },
  {
    id: "deploymentGuide",
    file: "deployment-guide.md",
    name: "Deployment Infrastructure",
    lang: "MD",
    group: "Delivery",
    message: "Deployment guide generated. Infrastructure, CI/CD, rollback and monitoring covered.",
    option: "Show Deployment Guide",
    readsFrom: ["config", "docker", "folderStructure"],
    exportsTo: ["github", "notion"],
    lines: 134,
  },
  {
    id: "costEstimation",
    file: "cost-estimation.md",
    name: "Cost Analysis",
    lang: "MD",
    group: "Delivery",
    message: "Cost estimation generated. Development, infrastructure and scaling costs mapped.",
    option: "Show Cost Estimation",
    readsFrom: ["config", "deploymentGuide"],
    exportsTo: ["jira", "notion"],
    lines: 66,
  },
  {
    id: "riskAnalysis",
    file: "risk-analysis.md",
    name: "Risk Assessment",
    lang: "MD",
    group: "Delivery",
    message:
      "Risk analysis generated. Technical, security, infrastructure and operational risks mapped.",
    option: "Show Risk Analysis",
    readsFrom: ["config", "deploymentGuide", "costEstimation"],
    exportsTo: ["jira", "notion"],
    lines: 82,
  },
  {
    id: "finalMarkdown",
    file: "final-spec.md",
    name: "Final Specification",
    lang: "MD",
    group: "Spec",
    message:
      "Final specification generated. All artifacts consolidated into a single specification.",
    option: "Generate Final Doc",
    readsFrom: [
      "config",
      "markdown",
      "apiDesign",
      "docker",
      "folderStructure",
      "testingPlan",
      "userStories",
      "roadmap",
      "deploymentGuide",
      "costEstimation",
      "projectTimeline",
      "riskAnalysis",
    ],
    exportsTo: ["github", "notion"],
    lines: 412,
  },
];

export const artifactById = Object.fromEntries(artifacts.map((a) => [a.id, a])) as Record<
  ArtifactId,
  Artifact
>;

export const artifactGroups: ArtifactGroup[] = [
  "Foundation",
  "Engineering",
  "Planning",
  "Delivery",
  "Spec",
];

/** The fragmented toolchain ProdMate replaces (from the README). */
export const oldToolchain = [
  { tool: "Notion", job: "Documentation", pain: "Siloed from the code" },
  { tool: "Jira", job: "Sprint planning", pain: "Tickets typed by hand" },
  { tool: "Excalidraw", job: "Architecture", pain: "Out of date by Friday" },
  { tool: "dbdiagram", job: "Database design", pain: "Separate from the API" },
  { tool: "Swagger", job: "API docs", pain: "Manual schema sync" },
  { tool: "Docker docs", job: "Deployment", pain: "Boilerplate every time" },
  { tool: "GitHub", job: "Version control", pain: "Starts from an empty repo" },
] as const;

export const taglineWords =
  "You bring the idea. ProdMate writes the plan, keeps every file consistent and ships it to the tools your team already uses.";

export const steps = [
  {
    id: "describe",
    title: "Describe the product",
    body: "Write the idea in plain English, from 5 to 2,000 characters, or start from a template. Say what you are building, who it is for and what it must do.",
    points: ["Templates for SaaS, ecommerce, social and healthcare", "No PRD experience needed"],
  },
  {
    id: "generate",
    title: "Generators write the files",
    body: "README.md comes first, then system-config.yaml fixes the stack. Every other generator reads only the summaries it depends on, so the files agree with each other.",
    points: [
      "14 files, each with its own generator",
      "Context is built from summaries, not raw text",
    ],
  },
  {
    id: "explore",
    title: "Open any file from the chat",
    body: "Each answer ends with option chips such as Show Docker or View DB Schema. Click one to open the next file, switch between code and preview, or copy it.",
    points: ["Code and preview modes for Markdown", "One click copy on every file"],
  },
  {
    id: "refine",
    title: "Ask for changes",
    body: "Ask the project assistant in plain words. It decides whether you need an answer or a change, finds the files your request affects and updates only those.",
    points: ["Impact analysis picks the affected files", "Every change is saved as a new version"],
  },
  {
    id: "ship",
    title: "Export and share",
    body: "Consolidate everything into final-spec.md, then push it to GitHub, Notion and Jira, add milestones to Google Calendar or email a summary with Gmail.",
    points: ["Share a read only link others can fork", "Projects are saved to your account"],
  },
] as const;

export type StepId = (typeof steps)[number]["id"];

export const audiences = [
  {
    id: "founders",
    title: "Startup founders",
    body: "Go from an elevator pitch to a spec, a roadmap and a cost estimate your first engineer can start on the same day.",
    stat: "1 prompt",
    statLabel: "to a full spec",
  },
  {
    id: "engineers",
    title: "Software engineers",
    body: "Skip the boilerplate. Get the compose file, API design and folder structure, then start on the code that matters.",
    stat: "14",
    statLabel: "files per project",
  },
  {
    id: "indie",
    title: "Indie hackers",
    body: "Test several product ideas in an evening. Keep every project in your sidebar and come back to the one that sticks.",
    stat: "5",
    statLabel: "export targets",
  },
  {
    id: "hackathon",
    title: "Hackathon teams",
    body: "Spend the 24 hours building. ProdMate covers the planning in the first ten minutes and puts the tickets in Jira.",
    stat: "10 min",
    statLabel: "to a shared plan",
  },
] as const;

export const faqs = [
  {
    q: "What exactly does ProdMate generate?",
    a: "Fourteen connected files: README.md, system-config.yaml, schema.er, api-design.yaml, project-structure.txt, docker-compose.yaml, testing-plan.yaml, user-stories.md, roadmap.md, project-timeline.md, deployment-guide.md, cost-estimation.md, risk-analysis.md and a consolidated final-spec.md.",
  },
  {
    q: "Can I change one part without regenerating everything?",
    a: "Yes. Ask the assistant for the change. It works out which files your request affects, regenerates only those and saves the previous version in the file history.",
  },
  {
    q: "Where can I export my blueprint?",
    a: "GitHub gets a repository with the README, compose file and docs. Notion gets pages, Jira gets the stories and roadmap as issues, Google Calendar gets milestones and Gmail sends a summary to your team.",
  },
  {
    q: "Is it really free?",
    a: "The Starter plan is free while ProdMate is in beta, with no credit card required. Usage has a daily token quota that resets on its own.",
  },
  {
    q: "Is my work saved and can I share it?",
    a: "Yes. Projects are saved to your account so you can return and keep iterating, and you can share a read only link that others can fork into their own workspace.",
  },
] as const;

/* Workspace (chat panel) content, shared by the hero mockup and the future chat page. */

export const workspaceUser = {
  name: "Krish",
  email: "krish@prodmate.dev",
  plan: "Starter",
} as const;

export const workspaceRecents = [
  { title: "Bookmark AI", detail: "Semantic search, Clerk auth" },
  { title: "Clinic booking", detail: "Doctor schedules, SMS reminders" },
  { title: "Makers marketplace", detail: "Stripe checkout" },
  { title: "Retro board", detail: "Anonymous voting, Jira sync" },
] as const;

export const quickStart = [
  {
    id: "saas",
    title: "AI SaaS platform",
    description: "Complete planning for an AI powered SaaS application.",
  },
  {
    id: "shop",
    title: "Ecommerce marketplace",
    description: "Products, orders and payments that scale with demand.",
  },
  {
    id: "social",
    title: "Social media platform",
    description: "Feeds, profiles and realtime messaging.",
  },
  {
    id: "health",
    title: "Hospital management",
    description: "Patients, staff and appointment scheduling.",
  },
] as const;

/** Status phrases the chat panel cycles through while a generator runs. */
export const aiPhrases = [
  "Synthesizing context",
  "Applying architectural patterns",
  "Optimizing structure",
  "Finalizing output",
] as const;
