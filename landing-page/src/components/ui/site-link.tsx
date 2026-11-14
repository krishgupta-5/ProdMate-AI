import type { AnchorHTMLAttributes } from 'react';
import { Link } from 'react-router';

/** Links within this site (`/docs`, `/#pricing`) change page without a reload; anything else
 * (another domain, mailto:) is a plain link. */
export function SiteLink({ href = '', ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith('/') && !href.startsWith('//')) return <Link to={href} {...rest} />;
  return <a href={href} {...rest} />;
}
