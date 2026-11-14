import { m, useMotionValue, type MotionValue } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type TocGroup = { title?: string; items: { id: string; label: string; icon?: ReactNode }[] };

/** A page of long text with its sections listed in a sticky sidebar, like most product docs. The
 * section you're reading is marked by a violet bar on the sidebar's rail that slides between
 * entries. On phones the sidebar becomes a glass bar under the nav that opens into the list. */
export function TocLayout({ groups, children }: { groups: TocGroup[]; children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 pt-8 pb-24 sm:px-6 sm:pt-10 lg:grid-cols-[232px_1fr] lg:gap-16">
      <TocNav groups={groups} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function TocNav({ groups }: { groups: TocGroup[] }) {
  const items = groups.flatMap((g) => g.items);
  const { active, overall } = useReadingProgress(items.map((i) => i.id));
  const [open, setOpen] = useState(false);
  const current = items.find((i) => i.id === active) ?? items[0];

  return (
    <nav aria-label="On this page" className="sticky top-20 z-30 self-start sm:top-[5.25rem] lg:top-28">
      {/* Phones and tablets: one glass bar with the current section, which opens the list. */}
      <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-[0_10px_30px_-14px_rgb(30_27_75/0.25)] ring-1 ring-black/[0.04] backdrop-blur-xl lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-sm"
        >
          <span className="shrink-0 text-pm-muted">On this page</span>
          <span aria-hidden className="text-pm-line">
            /
          </span>
          <span className="min-w-0 flex-1 truncate font-medium">{current?.label}</span>
          <ChevronDown
            aria-hidden
            className={cn('size-4 text-pm-muted transition-transform duration-200', open && 'rotate-180')}
          />
        </button>
        <ProgressBar value={overall} />
        {open && (
          <div className="max-h-[60vh] overflow-y-auto border-t border-pm-line/70 px-4 py-3">
            <TocList groups={groups} active={active} onPick={() => setOpen(false)} />
          </div>
        )}
      </div>

      {/* Desktop: the list in a sticky column. */}
      <div className="hidden max-h-[calc(100vh-9rem)] overflow-y-auto overscroll-contain pb-4 lg:block">
        <TocList groups={groups} active={active} />
      </div>
    </nav>
  );
}

/** The entries, grouped under small headings, on a rail with a marker that slides to the active one. */
function TocList({ groups, active, onPick }: { groups: TocGroup[]; active: string; onPick?: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null);

  // Moves the marker beside the active entry; a CSS transition does the sliding.
  useLayoutEffect(() => {
    const el = root.current?.querySelector<HTMLElement>(`[data-toc="${active}"]`);
    const bar = marker.current;
    if (!el || !bar || !root.current) return;
    const top = el.getBoundingClientRect().top - root.current.getBoundingClientRect().top;
    bar.style.transform = `translateY(${top + 6}px)`;
    bar.style.height = `${el.offsetHeight - 12}px`;
    bar.style.opacity = '1';
  }, [active]);

  return (
    <div ref={root} className="relative flex flex-col gap-6">
      <span
        ref={marker}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-10 w-0.5 rounded-full bg-pm-primary opacity-0 transition-[transform,height] duration-300 ease-(--ease-pm) motion-reduce:transition-none"
      />
      {groups.map((group, gi) => (
        <div key={group.title ?? gi}>
          {group.title && <p className="mb-2 pl-4 text-[13px] font-semibold text-pm-fg">{group.title}</p>}
          <ul className="flex flex-col border-l border-pm-line">
            {group.items.map((item) => {
              const on = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    data-toc={item.id}
                    onClick={onPick}
                    aria-current={on ? 'location' : undefined}
                    className={cn(
                      'group/toc flex items-center gap-2.5 py-1.5 pl-4 text-[13.5px] leading-snug transition-colors duration-150 outline-none focus-visible:text-pm-fg focus-visible:underline',
                      on ? 'font-medium text-pm-accent' : 'text-pm-muted hover:text-pm-fg',
                    )}
                  >
                    {item.icon && (
                      <span
                        aria-hidden
                        className={cn(
                          'grid size-6 shrink-0 place-items-center rounded-md border transition-colors duration-150 [&_svg]:size-3.5',
                          on
                            ? 'border-pm-primary/25 bg-pm-primary/10 text-pm-accent'
                            : 'border-pm-line bg-pm-card text-pm-muted group-hover/toc:text-pm-fg',
                        )}
                      >
                        {item.icon}
                      </span>
                    )}
                    <span className="truncate">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** A hairline along the bottom of the phone bar that fills as you read the page. */
function ProgressBar({ value }: { value: MotionValue<number> }) {
  return (
    <div aria-hidden className="h-0.5 bg-pm-line/60">
      <m.div style={{ scaleX: value }} className="h-full origin-left bg-pm-primary" />
    </div>
  );
}

/** The section being read (the last one whose top has passed a line a quarter down the screen),
 * and how far through the whole page that line is, from 0 to 1. At the bottom of the page the
 * last section counts as read. */
function useReadingProgress(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  const overall = useMotionValue(0);
  // A string, so the listener is only rebuilt when the list of sections really changes.
  const key = ids.join(',');

  useEffect(() => {
    const list = key.split(',');
    let frame = 0;

    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.25;
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      let current = 0;
      let read = 0;
      list.forEach((id, i) => {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        if (!rect || rect.top > line) return;
        current = i;
        read = Math.min(1, Math.max(0, (line - rect.top) / Math.max(rect.height, 1)));
      });
      if (atBottom) {
        current = list.length - 1;
        read = 1;
      }
      setActive(list[current]);
      overall.set((current + read) / list.length);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [key, overall]);

  return { active, overall };
}

/** One titled section of a long page, offset so the floating nav doesn't cover its heading. */
export function DocSection({
  id,
  title,
  icon,
  children,
}: {
  id: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-pm-line pt-10 pb-10 first:border-t-0 first:pt-0">
      <h2 className="group flex items-center gap-3 text-[22px] leading-[1.3] font-medium tracking-[-0.015em]">
        {icon && (
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-pm-line bg-pm-shell/70 text-pm-accent [&_svg]:size-[18px]">
            {icon}
          </span>
        )}
        {title}
        <a
          href={`#${id}`}
          aria-label={`Link to ${title}`}
          className="text-pm-muted opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:text-pm-accent focus-visible:opacity-100"
        >
          #
        </a>
      </h2>
      <div className="prose-pm mt-4">{children}</div>
    </section>
  );
}
