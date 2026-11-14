import {
  Boxes,
  Calculator,
  CalendarRange,
  Container,
  Database,
  FileText,
  FlaskConical,
  FolderTree,
  Image as ImageIcon,
  Map as MapIcon,
  Rocket,
  ScrollText,
  Settings2,
  ShieldAlert,
  Users,
  Webhook,
  type LucideIcon,
} from "lucide-react";

export type Meta = { label: string; icon: LucideIcon; color: string; ext: string };

/** How each artifact type is named and drawn. Colours are the status tokens from globals.css. */
export const ARTIFACTS: Record<string, Meta> = {
  yaml: { label: "System configuration", icon: Settings2, color: "var(--pm-blue)", ext: "yaml" },
  docker: { label: "Docker environment", icon: Container, color: "var(--pm-blue)", ext: "yaml" },
  markdown: { label: "Product requirements", icon: FileText, color: "var(--pm-violet)", ext: "md" },
  folder: { label: "Folder structure", icon: FolderTree, color: "var(--pm-amber)", ext: "txt" },
  apidesign: { label: "API design", icon: Webhook, color: "var(--pm-green)", ext: "md" },
  dbschema: { label: "Database schema", icon: Database, color: "var(--pm-blue)", ext: "mmd" },
  testingplan: { label: "Testing plan", icon: FlaskConical, color: "var(--pm-green)", ext: "md" },
  userstories: { label: "User stories", icon: Users, color: "var(--pm-violet)", ext: "md" },
  roadmap: { label: "Product roadmap", icon: MapIcon, color: "var(--pm-amber)", ext: "md" },
  deploymentguide: { label: "Deployment guide", icon: Rocket, color: "var(--pm-blue)", ext: "md" },
  costestimation: { label: "Cost estimation", icon: Calculator, color: "var(--pm-green)", ext: "md" },
  projecttimeline: { label: "Project timeline", icon: CalendarRange, color: "var(--pm-amber)", ext: "md" },
  riskanalysis: { label: "Risk analysis", icon: ShieldAlert, color: "var(--pm-red)", ext: "md" },
  finalmarkdown: { label: "Final specification", icon: ScrollText, color: "var(--pm-violet)", ext: "md" },
  image: { label: "Image", icon: ImageIcon, color: "var(--pm-muted)", ext: "png" },
};

export const MARKDOWN_LANGS = [
  "markdown",
  "userstories",
  "roadmap",
  "deploymentguide",
  "costestimation",
  "projecttimeline",
  "riskanalysis",
  "finalmarkdown",
];

export function artifactMeta(language: string): Meta {
  return ARTIFACTS[language] ?? { label: language.toUpperCase(), icon: Boxes, color: "var(--pm-muted)", ext: "txt" };
}
