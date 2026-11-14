import { useRef, type ReactNode } from 'react';
import { GrainGradient, MeshGradient, Warp } from '@paper-design/shaders-react';
import { useInView, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/cn';
import type { Scene } from '@/lib/scenes';
import { useSettled } from '@/lib/use-settled';

const SCENES: Record<Scene, (speed: number) => ReactNode> = {
  dusk: (speed) => (
    <MeshGradient
      colors={['#f5f3ff', '#c4b5fd', '#8678f9', '#93c5fd', '#4f3fc4']}
      distortion={0.9}
      swirl={0.7}
      grainMixer={0.3}
      grainOverlay={0.3}
      speed={speed * 0.6}
    />
  ),
  aurora: (speed) => (
    <Warp
      colors={['#1e1b4b', '#4f3fc4', '#8678f9', '#ede9fe']}
      proportion={0.42}
      softness={1}
      distortion={0.22}
      swirl={0.85}
      swirlIterations={10}
      shape="edge"
      shapeScale={0.12}
      scale={1.6}
      speed={speed}
    />
  ),
  haze: (speed) => (
    <GrainGradient
      colorBack="#faf5ff"
      colors={['#ddd6fe', '#a78bfa', '#c4b5fd', '#f5d0fe']}
      softness={0.7}
      intensity={0.25}
      noise={0.3}
      shape="blob"
      speed={speed}
    />
  ),
  tide: (speed) => (
    <MeshGradient
      colors={['#eef2ff', '#a5b4fc', '#8678f9', '#67e8f9']}
      distortion={0.8}
      swirl={0.5}
      grainMixer={0.25}
      grainOverlay={0.3}
      speed={speed * 0.6}
    />
  ),
  bloom: (speed) => (
    <Warp
      colors={['#fdf4ff', '#f0abfc', '#8b5cf6', '#4f3fc4']}
      proportion={0.5}
      softness={1}
      distortion={0.15}
      swirl={0.6}
      swirlIterations={8}
      shape="stripes"
      shapeScale={0.2}
      rotation={-30}
      speed={speed}
    />
  ),
};

/** The moving paint inside a Wallpaper. Starting a shader is heavy, so it waits until the page has
 * loaded and gone idle and the frame is near the screen, then fades in over the CSS gradient. It
 * only animates while on screen, and holds still for reduced motion. */
export default function WallpaperPaint({ scene }: { scene: Scene }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '200px' });
  const seen = useInView(ref, { margin: '200px', once: true });
  const reduce = useReducedMotion();
  const settled = useSettled();
  const started = settled && seen;

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 transition-opacity duration-700 ease-(--ease-pm) motion-reduce:transition-none [&>*]:size-full',
        !started && 'opacity-0',
      )}
    >
      {started && SCENES[scene](inView && !reduce ? 0.35 : 0)}
    </div>
  );
}
