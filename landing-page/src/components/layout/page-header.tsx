import type { CSSProperties, ReactNode } from 'react';

/** The top of an inner page: a label, the page's title, and a grey line under it. Fades up on load
 * like the home page's hero. */
export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 sm:pt-28">
      <p className="fade-up text-sm text-pm-muted">{eyebrow}</p>
      <h1 className="mt-3 max-w-2xl text-[28px] leading-[1.2] font-medium tracking-[-0.02em] text-balance sm:text-[36px]">
        {title}
      </h1>
      {children && (
        <p
          className="fade-up mt-4 max-w-xl text-[15px] text-pretty text-pm-muted"
          style={{ '--delay': '0.08s' } as CSSProperties}
        >
          {children}
        </p>
      )}
    </header>
  );
}
