/**
 * Titles that are really button labels ("Generate Final Doc", "Show Roadmap"), saved by an older bug
 * that renamed chats after a follow-up click. Treated as "no title" so they get replaced.
 */
export function isPlaceholderTitle(title?: string | null): boolean {
  if (!title) return true;
  return /^(generate|show|view|system config|untitled)\b/i.test(title.trim());
}

/** A short readable fallback from the project description, used until a real title exists. */
export function titleFromDescription(desc?: string | null): string | undefined {
  if (!desc) return undefined;
  const firstLine = desc.replace(/[*_`#>]/g, "").split(/\n|\. /)[0].replace(/\s+/g, " ").trim();
  if (!firstLine) return undefined;
  return firstLine.length > 60 ? `${firstLine.slice(0, 57).trimEnd()}…` : firstLine;
}

/** Tidies an AI-generated title: no markdown, quotes or trailing punctuation, at most 60 chars. */
export function cleanTitle(raw?: string): string | undefined {
  if (!raw) return undefined;
  const t = raw
    .replace(/[*_`#>"']/g, '')
    .replace(/^title:\s*/i, '')
    .replace(/\s+/g, ' ')
    .replace(/[.,;:!\s]+$/, '')
    .trim();
  if (!t) return undefined;
  return t.length > 60 ? `${t.slice(0, 57).trimEnd()}…` : t;
}

