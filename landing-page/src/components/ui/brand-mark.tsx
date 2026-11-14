import { BRANDS, type Brand } from '@/lib/brands';
import { cn } from '@/lib/cn';

/** A tool's logo. Grey by default so a row of them reads as one; `color` paints it in its brand
 * colour. Decorative: the tool's name is always beside it. */
export function BrandMark({
  brand,
  color,
  className,
}: {
  brand: Brand;
  color?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn('size-[18px] shrink-0 fill-current', className)}
      style={color ? { color: BRANDS[brand].color } : undefined}
    >
      <path d={BRANDS[brand].path} />
    </svg>
  );
}
