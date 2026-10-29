import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Reveal } from "./reveal";

export function Eyebrow({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase",
        tone === "dark" ? "text-muted" : "text-white/70",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-ember-500" />
      {children}
    </span>
  );
}

/**
 * Two-part heading: the first part is solid, the second fades back (the "half fade").
 * Pass `title` as [solid, faded].
 */
export function FadeTitle({
  parts,
  className,
  as: Tag = "h2",
}: {
  parts: [ReactNode, ReactNode];
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag className={className}>
      {parts[0]} <span className="text-fade">{parts[1]}</span>
    </Tag>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: [ReactNode, ReactNode];
  description?: ReactNode;
  align?: "center" | "left";
  tone?: "dark" | "light";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "dark",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-2xl items-center text-center" : "max-w-xl items-start",
        className,
      )}
    >
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <FadeTitle
        parts={title}
        className={cn(
          "text-4xl font-medium tracking-tight md:text-5xl",
          tone === "dark" ? "text-ink" : "text-white",
        )}
      />
      {description ? (
        <p className={cn("text-lg", tone === "dark" ? "text-muted" : "text-white/70")}>
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
