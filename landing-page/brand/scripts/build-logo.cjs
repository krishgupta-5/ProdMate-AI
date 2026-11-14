// Usage: node brand/scripts/build-logo.cjs   (needs sharp: npm i --no-save sharp@0.34.5)
// Builds every logo asset from the mark: eight notched "U" shapes in a ring (a redraw of the
// original Prodmate mark).
//
//   brand/logo-mark.svg             source artwork, black, for light backgrounds
//   brand/logo-mark-light.svg       source artwork, off-white, for dark backgrounds
//   public/favicon.svg              transparent; switches black/white with the browser's theme
//   public/favicon-{16,32,48}x*.png transparent, light-theme colours
//   public/favicon-dark-{16,32,48}x*.png transparent, dark-theme colours
//   public/apple-touch-icon.png, android-chrome-*.png  opaque tiles (home screens need a fill)
//
// Afterwards copy public/favicon* , apple-touch-icon.png and android-chrome-*.png to chat-page/public.
const fs = require('fs');
const sharp = require(require.resolve('sharp', { paths: [process.cwd()] }));

const LIGHT = '#111111'; // on light backgrounds
const DARK = '#F4F4F0'; // on dark backgrounds
// The top U is Prodmate violet; lifted a little on dark so it stays visible.
const ACCENT_LIGHT = '#6C5CE7';
const ACCENT_DARK = '#8B7CF6';

// One "U" pointing up on a 100-unit grid centred at (50, 50); the mark is eight of them at 45° steps.
// Keep in sync with src/components/landing/logo.tsx and chat-page/app/chat/components/Logo.tsx.
const MODULE = 'M40 8.5 43.5 5 47 8.5V20H53V8.5L56.5 5 60 8.5V24L55 29H45L40 24Z';
const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const VIEWBOX = '2 2 96 96';

// `attrs` for the seven plain U's, `accentAttrs` for the top one.
const body = (attrs, accentAttrs) =>
  ANGLES.map(
    (a) => `<path d="${MODULE}"${a ? ` transform="rotate(${a} 50 50)"` : ''} ${a === 0 ? accentAttrs : attrs}/>`,
  ).join('\n  ');

const markSvg = (color, accent) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}">\n  ${body(`fill="${color}"`, `fill="${accent}"`)}\n</svg>\n`;

// One SVG for both themes: browsers that render SVG favicons apply prefers-color-scheme inside it.
const adaptiveIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}">
  <style>
    .m { fill: ${LIGHT} } .a { fill: ${ACCENT_LIGHT} }
    @media (prefers-color-scheme: dark) { .m { fill: ${DARK} } .a { fill: ${ACCENT_DARK} } }
  </style>
  ${body('class="m"', 'class="a"')}
</svg>\n`;

const raster = (svg, size) => sharp(Buffer.from(svg), { density: 72 * Math.max(1, size / 24) * 2 }).resize(size, size);

// Home-screen icons can't be transparent, so the mark sits large (about 68%) on a dark rounded tile.
const tile = (rounded) => {
  const inset = rounded ? 1 : 0;
  const radius = rounded ? 9 : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect x="${inset}" y="${inset}" width="${32 - 2 * inset}" height="${32 - 2 * inset}" rx="${radius}" fill="#111111"/>
  <svg x="5" y="5" width="22" height="22" viewBox="${VIEWBOX}">${body(`fill="${DARK}"`, `fill="${ACCENT_DARK}"`)}</svg>
</svg>`;
};

(async () => {
  fs.writeFileSync('brand/logo-mark.svg', markSvg(LIGHT, ACCENT_LIGHT));
  fs.writeFileSync('brand/logo-mark-light.svg', markSvg(DARK, ACCENT_DARK));
  fs.writeFileSync('public/favicon.svg', adaptiveIcon);

  for (const size of [16, 32, 48]) {
    await raster(markSvg(LIGHT, ACCENT_LIGHT), size).png().toFile(`public/favicon-${size}x${size}.png`);
    await raster(markSvg(DARK, ACCENT_DARK), size).png().toFile(`public/favicon-dark-${size}x${size}.png`);
  }
  for (const [file, size, rounded] of [
    ['android-chrome-192x192.png', 192, true],
    ['android-chrome-512x512.png', 512, true],
    ['apple-touch-icon.png', 180, false], // iOS rounds the corners itself
  ]) {
    await sharp(Buffer.from(tile(rounded)), { density: 72 * (size / 32) * 2 })
      .resize(size, size)
      .png()
      .toFile(`public/${file}`);
  }
  console.log('logo assets written to brand/ and public/');
})();
