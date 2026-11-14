/** The painted backdrops behind product shots and demos, in Prodmate's violets. Each has a CSS
 * gradient of the same colours, shown before WebGL starts (and instead of it if WebGL never does).
 * The shaders are in src/components/landing/wallpaper-paint.tsx. */
export const SCENE_FALLBACKS = {
  dusk: 'linear-gradient(135deg,#f5f3ff,#c4b5fd 45%,#93c5fd)',
  aurora: 'linear-gradient(160deg,#1e1b4b,#4f3fc4 50%,#c4b5fd)',
  haze: 'linear-gradient(135deg,#faf5ff,#ddd6fe 50%,#a78bfa)',
  tide: 'linear-gradient(135deg,#eef2ff,#a5b4fc 45%,#67e8f9)',
  bloom: 'linear-gradient(135deg,#fdf4ff,#f0abfc 45%,#8b5cf6)',
};

export type Scene = keyof typeof SCENE_FALLBACKS;
