import { AnimatePresence, m } from 'motion/react';
import { Check, LoaderCircle, RotateCw } from 'lucide-react';
import { cn } from '@/lib/cn';
import { EASE } from '@/lib/motion';
import { useSteps } from '@/lib/use-steps';

const ROWS = ['Product requirements', 'Database schema', 'API design', 'Testing plan'];
const TARGET = 1;

// 0: done; 1: Regenerate pressed; 2: only the schema rewrites; 3: its new version lands.
const DURATIONS = [2200, 600, 1400, 700];

/** Rewrite one document and keep the rest: only the database schema runs again. */
export function RegenerateDemo() {
  const { ref, step, round } = useSteps(DURATIONS);
  const running = step === 2;
  // Each round bumps the schema once, when its new version lands in step 3.
  const version = 2 + round + (step >= 3 ? 1 : 0);

  return (
    <div ref={ref} className="w-full max-w-md text-sm">
      <ul className="divide-y divide-pm-line rounded-xl border border-pm-line">
        {ROWS.map((name, i) => {
          const target = i === TARGET;
          return (
            <li key={name} className="flex items-center gap-3 px-3.5 py-2.5">
              <span className="min-w-0 flex-1 truncate">{name}</span>
              <span className="w-8 text-right font-mono text-xs text-pm-muted tabular-nums">
                {target ? <Swap value={`v${version}`} /> : 'v1'}
              </span>
              {target ? (
                <m.span
                  animate={{ scale: step === 1 ? 0.94 : 1 }}
                  transition={{ duration: 0.15, ease: EASE }}
                  className={cn(
                    'inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-colors',
                    step === 1 ? 'border-pm-primary bg-pm-primary text-pm-primary-fg' : 'border-pm-line',
                  )}
                >
                  <RotateCw aria-hidden className={cn('size-3', running && 'animate-spin')} />
                  Regenerate
                </m.span>
              ) : (
                <span className="text-xs text-pm-muted">kept</span>
              )}
              <span className="flex size-4 items-center justify-center">
                {target && running ? (
                  <LoaderCircle aria-hidden className="size-4 animate-spin text-pm-muted" />
                ) : (
                  <Check aria-hidden className="size-4 text-pm-accent" />
                )}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-pm-muted">The other documents stay as they are.</p>
    </div>
  );
}

/** Text that slides up when it changes. */
function Swap({ value }: { value: string }) {
  return (
    <span className="relative inline-flex overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={value}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {value}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
