import { useRef, type CSSProperties, type ReactNode } from 'react';
import { useInView } from 'motion/react';
import { cn } from '@/lib/cn';

/** Fades its content up the first time it scrolls into view. The CSS is `[data-reveal]` in
 * global.css; without JavaScript nothing is hidden. `delay` (seconds) staggers a row. */
export function Reveal({
  children,
  className,
  delay,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'li';
}) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  const shown = useInView(ref, { once: true, margin: '-80px' });
  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-shown={shown ? '' : undefined}
      className={cn(className)}
      style={delay ? ({ '--reveal-delay': `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
