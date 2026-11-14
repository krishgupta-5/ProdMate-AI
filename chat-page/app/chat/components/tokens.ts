/**
 * Design tokens for the inline-styled chat and artifact components. Every value is a CSS variable
 * from globals.css, so the components follow the light/dark theme without re-rendering.
 */
export const T = {
  bg: "var(--pm-card)",
  card: "var(--pm-card)",
  surface: "var(--pm-shell)",
  surfaceHover: "var(--pm-hover)",
  border: "var(--pm-line)",
  borderHover: "var(--pm-line-strong)",
  text: "var(--pm-fg)",
  textMuted: "var(--pm-fg-soft)",
  textHint: "var(--pm-muted)",
  accent: "var(--pm-primary)",
  accentText: "var(--pm-accent)",
  danger: "var(--pm-danger)",
  codeBg: "var(--pm-code-bg)",
  font: "var(--font-inter), ui-sans-serif, system-ui, -apple-system, sans-serif",
  mono: '"Geist Mono", var(--font-mono-face), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
} as const;

/** Syntax colours for CodeRenderer. */
export const CODE = {
  keyword: "var(--pm-code-keyword)",
  function: "var(--pm-code-function)",
  string: "var(--pm-code-string)",
  number: "var(--pm-code-number)",
  punctuation: "var(--pm-code-punct)",
  text: "var(--pm-code-text)",
  comment: "var(--pm-code-comment)",
  lineNumber: "var(--pm-code-line)",
} as const;

/** A tinted badge colour: text in the colour, background a faint wash of it. */
export const tint = (color: string, alpha = 12) => ({
  color,
  background: `color-mix(in oklch, ${color} ${alpha}%, transparent)`,
  border: `1px solid color-mix(in oklch, ${color} ${alpha + 10}%, transparent)`,
});

export const STATUS = {
  green: "var(--pm-green)",
  blue: "var(--pm-blue)",
  amber: "var(--pm-amber)",
  red: "var(--pm-red)",
  violet: "var(--pm-violet)",
} as const;
