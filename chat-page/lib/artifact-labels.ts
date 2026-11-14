/** Human names for pipeline artifact types (camelCase ids like "userStories"). */
export const ARTIFACT_LABELS: Record<string, string> = {
  initial: "Project brief and configuration",
  config: "System configuration",
  docker: "Docker environment",
  markdown: "Product requirements",
  folderStructure: "Folder structure",
  apiDesign: "API design",
  db: "Database schema",
  dbSchema: "Database schema",
  testingPlan: "Testing plan",
  userStories: "User stories",
  roadmap: "Product roadmap",
  deploymentGuide: "Deployment guide",
  costEstimation: "Cost estimation",
  projectTimeline: "Project timeline",
  riskAnalysis: "Risk analysis",
  finalMarkdown: "Final specification",
};

/** "userStories" → "User stories"; falls back to splitting camelCase. */
export function artifactLabel(type: string): string {
  if (ARTIFACT_LABELS[type]) return ARTIFACT_LABELS[type];
  const words = type.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * Rewrites the pipeline's status lines ("userStories generated.", "Modified apiDesign") into
 * readable sentences. Other text is returned unchanged.
 */
export function humanizeStatus(content: string): string {
  const gen = content.match(/^\s*([a-zA-Z]+) generated\.?\s*$/);
  if (gen) return `${artifactLabel(gen[1])} is ready.`;
  const mod = content.match(/^\s*Modified ([a-zA-Z]+)\.?\s*$/);
  if (mod) return `Updated the ${artifactLabel(mod[1]).toLowerCase()}.`;
  return content.replace(/^- ([a-z][a-zA-Z]+)$/gm, (_m, t: string) => (ARTIFACT_LABELS[t] ? `- ${ARTIFACT_LABELS[t]}` : `- ${t}`));
}
