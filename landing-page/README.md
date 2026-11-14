# Prodmate landing page

A rebuild of the Prodmate landing page in a lighter, minimal style modelled on
[dotsafe.dev](https://dotsafe.dev) ([source](https://github.com/starc007/dotsafe/tree/main/apps/web)).
So far it has the navbar and the hero section.

## Stack

- React 19 + TypeScript, built with Vite
- Tailwind CSS v4 (`@tailwindcss/vite`), design tokens in `src/styles/global.css`
- `motion` for reduced-motion handling, `lucide-react` icons, Inter (variable) font
- `@paper-design/shaders-react` for the animated gradient behind the product shot, lazy-loaded
- ESLint (flat config) + Prettier with `prettier-plugin-tailwindcss`

## Scripts

```sh
npm install
npm run dev           # http://localhost:3000
npm run build         # type-check + production build into dist/
npm run preview       # serve dist/
npm run lint
npm run typecheck
npm run format        # or format:check in CI
```

## Configuration

Copy `.env.example` to `.env.local` to override `VITE_CHAT_URL` (defaults to `https://chat.prodmate.dev/`).

## Logo

The mark is an idea (diamond) above the plan it becomes (three lines, the middle one violet). It's
hand-drawn SVG. The source artwork is `brand/logo-mark.svg` (light backgrounds) and
`brand/logo-mark-light.svg` (dark backgrounds).

- **Website:** black + violet, drawn inline in `src/components/landing/logo.tsx` in the current text
  colour, so it turns white if the site gets a dark mode.
- **Favicon:** `public/favicon.svg` is transparent and follows the browser theme: black + `#6C5CE7`
  on light, white + `#8B7CF6` on dark. The `favicon-*.png` / `favicon-dark-*.png` fallbacks are
  picked by `media` queries in `index.html`.
- **Home-screen icons** (`apple-touch-icon.png`, `android-chrome-*.png`) need an opaque background,
  so they put the white mark on a dark rounded tile.

To rebuild everything in `public/` after changing the shapes (needs `sharp`):

```sh
npm i --no-save sharp@0.34.5
node brand/scripts/build-logo.cjs
```

The favicon is a separate 16px-grid drawing of the same mark, so keep `logo.tsx` and
`build-logo.cjs` in sync.

## Pages

`/` (home), `/docs`, `/get-started`, `/contact`, `/privacy`, `/terms`, `/cookies`, routed with
`react-router`. The legal text lives in `src/lib/legal.ts`. These pages used to be in `chat-page/app`, which now links here.

It's a single-page app, so the host must serve `index.html` for every path (a "SPA fallback" /
rewrite rule). `npm run dev` and `npm run preview` already do.

## Layout

```
src/
  App.tsx                      page composition
  components/landing/          nav, nav-menu (mobile), hero, hero-badge, logo, wallpaper
  components/ui/button-link.tsx
  lib/                         site links, button/menu styles, hooks, scenes
  styles/global.css            tokens (pm-*), fade-up animation
```

Nav links to `#how-it-works`, `#features` and `#pricing` point at sections that don't exist yet.
