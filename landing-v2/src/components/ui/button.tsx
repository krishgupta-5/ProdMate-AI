import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,box-shadow,transform,color] duration-300 ease-(--ease-out-soft) select-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        ink: "bg-ink text-white shadow-ink hover:bg-ink-2",
        white: "bg-white text-ink shadow-card hover:bg-card",
        glass: "glass text-ink hover:bg-white/90",
        ghost: "text-muted hover:bg-line hover:text-ink",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "ink", size: "md" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

function Arrow() {
  return (
    <ArrowUpRight
      weight="bold"
      aria-hidden="true"
      className="size-4 transition-transform duration-300 ease-(--ease-out-soft) group-hover/button:rotate-45"
    />
  );
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "href"> &
  Variants & { href: string; arrow?: boolean; children: ReactNode };

export function ButtonLink({
  className,
  variant,
  size,
  href,
  arrow = true,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
      {arrow ? <Arrow /> : null}
    </Link>
  );
}

export function Button({
  className,
  variant,
  size,
  arrow = false,
  type = "button",
  children,
  ...props
}: ComponentProps<"button"> & Variants & { arrow?: boolean }) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
      {arrow ? <Arrow /> : null}
    </button>
  );
}
