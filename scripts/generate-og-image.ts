// Renders the social card every page shares: public/og.png, 1200x630, referenced as og:image and
// twitter:image by BaseLayout (SOCIAL_IMAGE_PATH in src/config/site.ts).
//
// One card for the whole site, on purpose: no per-tool images. It is made from what already
// exists and nothing new: the site mark (siteIconSvg(), the same drawing as the favicon and every
// install icon), the brand name, the homepage h1 and the domain, on the site's own paper field.
//
// Laid out on a centre axis so it survives both ways it gets shown: whole, at 1.91:1, by Facebook,
// LinkedIn and chat unfurls, and cropped to a centre square by X's `summary` card. The mark, the
// name and the two-line h1 all sit inside the central 630x630.
//
// Rendered through Chromium + sharp, the same path as npm run brand:generate and icons:generate.
// Re-run after changing the mark (src/lib/icons/site-icon.ts), the homepage h1, the brand name or
// any token read below:
//
//   npm run og:generate

import sharp from 'sharp';
import path from 'node:path';
import { siteIconSvg } from '../src/lib/icons/site-icon';
import { BRAND_NAME, SITE_ORIGIN, SOCIAL_IMAGE_PATH } from '../src/config/site';
import { launch, renderHtml, goldDotCss, PAPER, INK, INK_MUTED, ACCENT } from './brand/render';

const WIDTH = 1200;
const HEIGHT = 630;
const OUT = path.resolve(process.cwd(), 'public', SOCIAL_IMAGE_PATH.replace(/^\//, ''));

function cardHtml(): string {
  const domain = new URL(SITE_ORIGIN).host;
  return `<div class="card">
  <div class="mark">${siteIconSvg(152)}</div>
  <p class="name">${BRAND_NAME}</p>
  <h1>Convert, calculate, encode.<br/>In your browser.</h1>
  <p class="domain"><span class="gold-dot"></span><span>${domain}</span><span class="gold-dot"></span></p>
</div>`;
}

/** Values copied from src/styles/tokens.css via scripts/brand/render.ts. */
function cardCss(): string {
  return `
  .card {
    width: ${WIDTH}px; height: ${HEIGHT}px;
    box-sizing: border-box;
    background: ${PAPER};
    font-family: 'Geist', system-ui, sans-serif;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center;
    padding-bottom: 28px;
  }
  /* Rounded the way the nav shows it (.nav-mark: --radius-sm, 4px on a 20px mark, so 20%). */
  .mark { width: 152px; height: 152px; line-height: 0; border-radius: 30px; overflow: hidden; }
  .mark svg { display: block; }
  .name {
    margin: 22px 0 0;
    font-size: 64px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.1;
    color: ${INK};
  }
  h1 {
    margin: 18px 0 0;
    font-size: 34px; font-weight: 500; letter-spacing: -0.015em; line-height: 1.3;
    color: ${INK_MUTED};
  }
  .domain {
    position: absolute; left: 0; right: 0; bottom: 34px; margin: 0;
    display: flex; align-items: center; justify-content: center; gap: 14px;
    font-family: 'Geist Mono', ui-monospace, monospace;
    font-size: 22px; font-weight: 500; letter-spacing: 0.02em;
    color: ${ACCENT};
  }
${goldDotCss(8)}
`;
}

async function main() {
  const browser = await launch();
  const raw = await renderHtml(browser, cardHtml(), cardCss(), WIDTH, HEIGHT, 1);
  await browser.close();
  // A flat card compresses far better as a palette PNG than as truecolour, at no visible cost.
  const info = await sharp(raw)
    .png({ compressionLevel: 9, effort: 10, palette: true, quality: 90 })
    .toFile(OUT);
  console.log(`[og-image] wrote ${path.relative(process.cwd(), OUT)}, ${info.width}x${info.height}, ${info.size} bytes`);
}

main();
