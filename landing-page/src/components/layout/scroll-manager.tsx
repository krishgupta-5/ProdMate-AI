import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { scrollToTarget } from '@/lib/smooth-scroll';

/** After each navigation: scroll to the `#section` in the address if there is one, else to the
 * top, the way separate pages would. Waits a frame so the new page has rendered. A new page jumps
 * to the top straight away; a section on the same page glides there. */
export function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      scrollToTarget(target, !target);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, hash]);

  return null;
}
