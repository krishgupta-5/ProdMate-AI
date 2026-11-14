// Usage: node brand/scripts/preview-logo.cjs  → brand/preview-<name>.png for each variant below.
// Renders logo variants side by side (large, and at 32/16px) so they can be compared by eye.
const sharp = require(require.resolve('sharp', { paths: [process.cwd()] }));

const U = 'M39.4 7.5 43 3.9 46.6 7.5V22.5H53.4V7.5L57 3.9 60.6 7.5V22.5L53 30.2H47L39.4 22.5Z';
// Thicker, simpler U for the new mark: wider arms, a flat chamfered base, square-cut tips.
const U2 = 'M38 5H47V19H53V5H62V24L56 31H44L38 24Z';

const ring = (d, { twist = 0, accent = null, mark = '#111111' } = {}) =>
  [0, 45, 90, 135, 180, 225, 270, 315]
    .map((a, i) => {
      const fill = accent && i === 0 ? accent : mark;
      const t = `rotate(${a} 50 50)${twist ? ` rotate(${twist} 50 17)` : ''}`;
      return `<path d="${d}" transform="${t}" fill="${fill}"/>`;
    })
    .join('');

// Refined: narrower than U2 so the ring breathes like the original, with the original's pointed tips.
const U3 = 'M40 8.5 43.5 5 47 8.5V20H53V8.5L56.5 5 60 8.5V24L55 29H45L40 24Z';

const variants = {
  refined: ring(U3, { accent: '#6C5CE7' }),
  original: ring(U),
  straight: ring(U2, { accent: '#6C5CE7' }),
  twist: ring(U2, { twist: 14, accent: '#6C5CE7' }),
};

(async () => {
  for (const [name, body] of Object.entries(variants)) {
    const svg = (size, x) => `<svg x="${x}" y="${(240 - size) / 2}" width="${size}" height="${size}" viewBox="2 2 96 96">${body}</svg>`;
    const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="240" viewBox="0 0 420 240">
      <rect width="420" height="240" fill="#ffffff"/>${svg(200, 20)}${svg(32, 260)}${svg(16, 330)}</svg>`;
    await sharp(Buffer.from(sheet), { density: 144 }).resize(420, 240).png().toFile(`brand/preview-${name}.png`);
  }
  console.log('previews written');
})();
