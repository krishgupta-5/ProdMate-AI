import { lazy, Suspense, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { SCENE_FALLBACKS, type Scene } from '@/lib/scenes';

// The shader library is split into its own chunk so it never delays the first paint.
const WallpaperPaint = lazy(() => import('@/components/landing/wallpaper-paint'));

/** A framed, slowly moving painting for product shots to sit on, like a window on a desktop. */
export function Wallpaper({
  scene,
  className,
  children,
}: {
  scene: Scene;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn('relative isolate overflow-hidden rounded-2xl', className)}
      style={{ background: SCENE_FALLBACKS[scene] }}
    >
      <Suspense fallback={null}>
        <WallpaperPaint scene={scene} />
      </Suspense>
      {children}
    </div>
  );
}
