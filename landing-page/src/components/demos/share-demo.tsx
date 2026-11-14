import { AnimatePresence, m } from 'motion/react';
import { Check, Copy, Eye, GitFork, Link2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { appear, EASE } from '@/lib/motion';
import { useSteps } from '@/lib/use-steps';

// 0: done; 1: the link alone; 2: Copy pressed; 3: someone opens it; 4: they fork it.
const DURATIONS = [2600, 900, 900, 1000, 700];

/** Share a plan as a link: anyone can read it, and fork it into their own workspace. */
export function ShareDemo() {
  const { ref, step } = useSteps(DURATIONS);
  const copied = step === 0 || step >= 2;
  const opened = step === 0 || step >= 3;
  const forked = step === 0 || step >= 4;

  return (
    <div ref={ref} className="w-full max-w-md text-sm">
      <p className="font-medium">Share “AI Bookmark Manager”</p>
      <p className="mt-0.5 text-xs text-pm-muted">Anyone with the link can read the full plan.</p>
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-pm-line p-1.5 pl-3">
        <Link2 aria-hidden className="size-4 shrink-0 text-pm-muted" />
        <span className="min-w-0 flex-1 truncate font-mono text-[12.5px]">
          chat.prodmate.dev/share/k3x9q2
        </span>
        <m.span
          animate={{ scale: step === 2 ? 0.95 : 1 }}
          transition={{ duration: 0.15, ease: EASE }}
          className={cn(
            'inline-flex h-8 w-[84px] items-center justify-center gap-1.5 rounded-full text-xs font-medium transition-colors',
            copied ? 'bg-pm-primary text-pm-primary-fg' : 'border border-pm-line',
          )}
        >
          {copied ? <Check aria-hidden className="size-3.5" /> : <Copy aria-hidden className="size-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </m.span>
      </div>
      <ul className="mt-4 flex min-h-[76px] flex-col gap-2">
        <AnimatePresence initial={false}>
          {opened && (
            <m.li key="open" {...appear} className="flex items-center gap-2.5">
              <Avatar letter="R" />
              <span className="min-w-0 flex-1 truncate">
                <span className="font-medium">Riya</span>{' '}
                <span className="text-pm-muted">opened the plan</span>
              </span>
              <Eye aria-hidden className="size-4 text-pm-muted" />
            </m.li>
          )}
          {forked && (
            <m.li key="fork" {...appear} className="flex items-center gap-2.5">
              <Avatar letter="R" />
              <span className="min-w-0 flex-1 truncate">
                <span className="font-medium">Riya</span>{' '}
                <span className="text-pm-muted">forked it into her workspace</span>
              </span>
              <GitFork aria-hidden className="size-4 text-pm-accent" />
            </m.li>
          )}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function Avatar({ letter }: { letter: string }) {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-pm-primary/15 text-xs font-medium text-pm-accent">
      {letter}
    </span>
  );
}
