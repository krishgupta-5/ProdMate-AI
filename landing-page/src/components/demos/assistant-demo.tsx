import { AnimatePresence, m } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { appear, EASE } from '@/lib/motion';
import { useSteps } from '@/lib/use-steps';

const COLUMNS = [
  { name: 'id', type: 'uuid' },
  { name: 'user_id', type: 'uuid' },
  { name: 'url', type: 'text' },
  { name: 'title', type: 'text' },
];

// 0: done; 1: the table as it was; 2: the request; 3: the assistant thinks; 4: the column arrives.
const DURATIONS = [2800, 900, 1000, 1100, 600];

/** Ask for a change in plain words and the schema updates in place. */
export function AssistantDemo() {
  const { ref, step } = useSteps(DURATIONS);
  const asked = step === 0 || step >= 2;
  const thinking = step === 3;
  const answered = step === 0 || step >= 4;

  return (
    <div ref={ref} className="w-full max-w-md text-sm">
      <div className="overflow-hidden rounded-xl border border-pm-line">
        <p className="border-b border-pm-line bg-pm-shell/60 px-3.5 py-2 font-mono text-[12px] font-medium">
          bookmarks
        </p>
        <ul className="font-mono text-[12px]">
          {COLUMNS.map((c) => (
            <li
              key={c.name}
              className="flex justify-between border-b border-pm-line px-3.5 py-1.5 last:border-0"
            >
              <span>{c.name}</span>
              <span className="text-pm-muted">{c.type}</span>
            </li>
          ))}
          <AnimatePresence initial={false}>
            {answered && (
              <m.li
                key="new"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="overflow-hidden border-t border-pm-line bg-pm-primary/10"
              >
                <span className="flex justify-between px-3.5 py-1.5 text-pm-accent">
                  <span>is_favorite</span>
                  <span>boolean</span>
                </span>
              </m.li>
            )}
          </AnimatePresence>
        </ul>
      </div>

      <div className="mt-4 flex min-h-[92px] flex-col gap-2">
        <AnimatePresence initial={false}>
          {asked && (
            <m.p
              key="ask"
              {...appear}
              className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-pm-primary px-3 py-2 text-[13px] text-pm-primary-fg"
            >
              Add an is_favorite flag to bookmarks.
            </m.p>
          )}
          {thinking && (
            <m.span key="dots" {...appear} className="flex gap-1 px-1 py-2" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 animate-pulse rounded-full bg-pm-muted"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </m.span>
          )}
          {answered && (
            <m.p key="reply" {...appear} className="flex max-w-[90%] gap-2 text-[13px] text-pm-muted">
              <Sparkles aria-hidden className="mt-0.5 size-3.5 shrink-0 text-pm-accent" />
              <span>
                Added. <span className="font-mono text-[12px] text-pm-fg">GET /bookmarks</span> now returns it
                too.
              </span>
            </m.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
