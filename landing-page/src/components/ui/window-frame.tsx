import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** A plain app window: three dots and a title in the top bar, content below. */
export function WindowFrame({
  title,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-pm-line bg-white', className)}>
      <div className="flex items-center gap-1.5 border-b border-pm-line px-3.5 py-2.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2.5 rounded-full border border-pm-line" />
        ))}
        <span className="ml-2 truncate text-xs text-pm-muted">{title}</span>
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
