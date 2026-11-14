import { m } from 'motion/react';
import {
  BookOpen,
  Box,
  Braces,
  Check,
  Cpu,
  Database,
  FileText,
  FlaskConical,
  FolderTree,
  LoaderCircle,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { EASE } from '@/lib/motion';
import { useSteps } from '@/lib/use-steps';

const ARTIFACTS: { name: string; icon: LucideIcon }[] = [
  { name: 'Product requirements', icon: FileText },
  { name: 'Tech stack', icon: Cpu },
  { name: 'Database schema', icon: Database },
  { name: 'API design', icon: Braces },
  { name: 'Folder structure', icon: FolderTree },
  { name: 'Docker Compose', icon: Box },
  { name: 'CI/CD pipeline', icon: Workflow },
  { name: 'Testing plan', icon: FlaskConical },
  { name: 'Blueprint', icon: BookOpen },
];

// 0: all done; 1: the prompt is sent and every pipeline starts; 2..10: they finish one by one.
const DURATIONS = [2600, 700, 280, 320, 260, 340, 280, 300, 260, 360, 500];

/** One prompt starts nine pipelines at once, and each document finishes on its own. */
export function GenerateDemo() {
  const { ref, step } = useSteps(DURATIONS);
  const done = (i: number) => step === 0 || step >= 2 + i;
  const finished = ARTIFACTS.filter((_, i) => done(i)).length;

  return (
    <div ref={ref} className="w-full max-w-md text-sm">
      <p className="rounded-lg border border-pm-line px-3 py-2 text-[13px]">
        <span className="text-pm-muted">Idea · </span>A bookmark manager that tags links with AI
      </p>
      <div className="mt-3 flex items-center justify-between text-xs text-pm-muted">
        <span>{finished === ARTIFACTS.length ? 'Plan ready' : 'Writing your plan…'}</span>
        <span className="tabular-nums">
          {finished}/{ARTIFACTS.length}
        </span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-pm-shell">
        <m.div
          className="h-full rounded-full bg-pm-primary"
          animate={{ width: `${(finished / ARTIFACTS.length) * 100}%` }}
          transition={{ duration: 0.3, ease: EASE }}
        />
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {ARTIFACTS.map(({ name, icon: Icon }, i) => (
          <li
            key={name}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12.5px] transition-colors duration-300',
              done(i) ? 'border-pm-line' : 'border-dashed border-pm-line text-pm-muted',
            )}
          >
            <Icon aria-hidden className="size-3.5 shrink-0 text-pm-muted" />
            <span className="min-w-0 flex-1 truncate">{name}</span>
            {done(i) ? (
              <m.span
                key={`done-${step === 0}`}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <Check aria-hidden className="size-3.5 text-pm-accent" />
              </m.span>
            ) : (
              <LoaderCircle aria-hidden className="size-3.5 animate-spin text-pm-muted" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
