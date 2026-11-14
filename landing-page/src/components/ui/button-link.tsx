import type { AnchorHTMLAttributes } from 'react';
import { SiteLink } from '@/components/ui/site-link';
import { buttonClass, type ButtonVariant } from '@/lib/button';

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
}

/** A link styled as a pill button. */
export function ButtonLink({ variant = 'outline', className, ...rest }: ButtonLinkProps) {
  return <SiteLink className={buttonClass(variant, className)} {...rest} />;
}
