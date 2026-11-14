import type { ReactNode } from 'react';
import { Reveal } from '@/components/ui/reveal';
import { cn } from '@/lib/cn';

/** A section's label, then its claim: a dark title and a grey continuation at the same size, read
 * as one sentence. */
export function SectionHeading({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={cn('max-w-2xl', className)}>
      <p className="text-sm text-pm-muted">{eyebrow}</p>
      <h2 className="mt-3 text-[22px] leading-[1.3] font-medium tracking-[-0.005em] text-balance sm:text-2xl">
        {title} {children && <span className="text-pm-muted">{children}</span>}
      </h2>
    </Reveal>
  );
}
