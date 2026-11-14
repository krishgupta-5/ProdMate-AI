import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';

/** The pill button look, shared by links and real buttons. `primary` is for the one main action. */
export function buttonClass(variant: ButtonVariant, className?: string) {
  return cn(
    'inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium whitespace-nowrap transition-[background-color,color,border-color,transform] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-pm-accent/50 active:scale-[0.98] disabled:pointer-events-none [&_svg]:size-4',
    variant === 'primary' && 'bg-pm-primary text-pm-primary-fg hover:bg-pm-primary/85',
    variant === 'outline' &&
      'border border-pm-line bg-white/70 text-pm-fg backdrop-blur-sm hover:border-pm-fg/20',
    variant === 'ghost' && 'text-pm-muted hover:text-pm-fg',
    className,
  );
}
