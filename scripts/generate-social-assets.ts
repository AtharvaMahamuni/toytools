// Renders the X (Twitter) account assets: the profile mark and the header banner.
//
// The profile image is not a new drawing. It is siteIconSvg() -- the same source the
// favicon, the apple-touch icon and every install icon come from -- rasterized larger, so
// the account picture and the tab strip can never drift apart. X displays the profile
// picture as a circle, which the site mark already survives: everything that carries
// meaning lives inside the 24..72 safe zone of its 96-unit board (see site-icon.ts).
//
// The banner is the homepage hero rather than a composition about it: the site's own paper
// field, its h1, its tagline and its gold-dot trust line, quoted from src/pages/index.astro
// so the account and the landing page cannot say two different things.
//
// Rendered through Chromium + sharp, the same path as npm run icons:generate.
// Output lands in brand/social/x/ and is NOT part of the site bundle. See brand/README.md.

import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { siteIconSvg } from '../src/lib/icons/site-icon';

// One directory per platform under brand/social/, because the platforms disagree about
// everything that matters -- aspect ratio, safe area, how the picture is cropped -- so an
// asset built for one is never the asset another one wants. See brand/README.md.
const OUT = path.resolve(process.cwd(), 'brand/social/x');

// The banner's palette, copied from src/styles/tokens.css. The mark's own ink-green field
// colours are NOT repeated here: site-icon.ts owns those, and a second copy would be a second
// thing to keep in step.
const PAPER = '#FAF9F7';          // --color-bg
const INK = '#1F1D1A';            // --color-text
const INK_MUTED = '#6E6961';      // --color-text-muted
const INK_SUBTLE = '#736E66';     // --color-text-subtle
const ACCENT = '#2F6B4F';         // --color-accent
const GOLD_UI = '#906620';        // --color-gold
const GOLD_HIGHLIGHT = '#E6C15A'; // --color-gold-highlight

const fontData = (file: string): string =>
  readFileSync(path.resolve(process.cwd(), file)).toString('base64');

const GEIST = fontData('node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2');
const GEIST_MONO = fontData('node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2');

/**
 * The banner, at 1500x500 -- X's header ratio.
 *
 * This is the homepage hero, not a poster about it. Same warm-paper field, same h1, same
 * tagline, same gold-dot trust line the site puts under its search box; the words are lifted
 * from src/pages/index.astro rather than written for the banner, so the account and the
 * landing page cannot say two different things. The tool count the hero also carries is
 * deliberately left out: on a header nobody re-uploads it goes stale the next time a tool
 * ships.
 *
 * Written as HTML with the real token values rather than as hand-placed SVG text. The site's
 * own layout is flexbox with a gap; reproducing that in SVG meant guessing an x for every
 * run, and the first attempt duly printed the gold dots hard against the words in front of
 * them. Here the browser does the measuring, so the trust line is spaced by the same rule the
 * homepage uses.
 *
 * Nothing decorative sits on it, because nothing decorative sits on the homepage either --
 * the hero is type on paper and a lot of air. The layout is set by what covers it: X overlays
 * the avatar on the bottom-left (about x 40..372, y 334..500 at this size), so that corner
 * stays empty paper and the dark mark lands in clear space with the paper behind it.
 */
function bannerHtml(): string {
  return `<div class="banner">
  <div class="col">
    <h1>Convert, calculate, encode.<br/>In your browser.</h1>
    <p class="tagline">The internet's little toolbox. Open it, take out the one thing<br/>that does the job, and close the tab.</p>
    <p class="sub">
      <span>Nothing uploaded</span>
      <span class="gold-dot"></span>
      <span>Works offline once opened</span>
      <span class="gold-dot"></span>
      <span>No account</span>
    </p>
  </div>
  <span class="domain">toytoolsapp.com</span>
</div>`;
}

/** The banner's CSS, values copied from src/styles/tokens.css and src/pages/index.astro. */
function bannerCss(): string {
  return `
  .banner {
    position: relative;
    width: 1500px; height: 500px;
    background: ${PAPER};
    font-family: 'Geist', system-ui, sans-serif;
    display: flex; align-items: center;
    /* The avatar lands in the bottom-left. Everything readable starts to the right of it. */
    padding-left: 404px;
    box-sizing: border-box;
    line-height: normal;
  }
  .col { display: flex; flex-direction: column; gap: 26px; }
  h1 {
    margin: 0;
    font-size: 68px;
    font-weight: 700;            /* --font-weight-bold */
    line-height: 1.25;           /* --leading-tight */
    letter-spacing: -0.028em;
    color: ${INK};               /* --color-text */
  }
  .tagline {
    margin: 0;
    font-size: 29px;
    line-height: 1.6;            /* --leading-relaxed */
    color: ${INK_MUTED};         /* --color-text-muted */
  }
  .sub {
    margin: 4px 0 0;
    display: flex; align-items: center; gap: 14px;
    font-size: 24px;
    color: ${INK_SUBTLE};        /* --color-text-subtle */
  }
  /* .gold-dot, from global.css -- the site's brand motif, at banner scale. */
  .gold-dot {
    width: 9px; height: 9px; border-radius: 50%;
    background: radial-gradient(circle, ${GOLD_HIGHLIGHT} 0%, ${GOLD_UI} 100%);
    flex-shrink: 0;
  }
  .domain {
    position: absolute; right: 56px; bottom: 44px;
    font-family: 'Geist Mono', ui-monospace, monospace;
    font-size: 25px; font-weight: 500; letter-spacing: 0.02em;
    color: ${ACCENT};            /* --color-accent */
  }
`;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const exe = process.env.PW_CHROMIUM_PATH;
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});

  const fontCss =
    `@font-face{font-family:'Geist';src:url(data:font/woff2;base64,${GEIST}) format('woff2');font-weight:100 900;}` +
    `@font-face{font-family:'Geist Mono';src:url(data:font/woff2;base64,${GEIST_MONO}) format('woff2');font-weight:100 900;}`;

  /** Rasterize an SVG string at its natural size. */
  async function renderSvg(svg: string, w: number, h: number): Promise<Buffer> {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await page.setContent(
      `<!doctype html><html><head><meta charset="utf-8"><style>${fontCss}html,body{margin:0;padding:0;line-height:0}</style></head>` +
        `<body><div style="width:${w}px;height:${h}px;line-height:0">${svg}</div></body></html>`,
      { waitUntil: 'load' },
    );
    await page.evaluate(() => (document as any).fonts.ready);
    const buf = await page.screenshot({ clip: { x: 0, y: 0, width: w, height: h } });
    await page.close();
    return buf;
  }

  /**
   * Rasterize the banner's HTML at 1500x500 and again at 2x.
   *
   * deviceScaleFactor rather than a bigger CSS box: the layout must stay identical between the
   * two files, and scaling the device is the only way to get that. Re-laying it out at 3000px
   * would re-wrap the text and give the two sizes different line breaks.
   */
  async function renderBanner(scale: number): Promise<Buffer> {
    const page = await browser.newPage({ viewport: { width: 1500, height: 500 }, deviceScaleFactor: scale });
    await page.setContent(
      `<!doctype html><html><head><meta charset="utf-8"><style>${fontCss}` +
        `html,body{margin:0;padding:0}${bannerCss()}</style></head><body>${bannerHtml()}</body></html>`,
      { waitUntil: 'load' },
    );
    await page.evaluate(() => (document as any).fonts.ready);
    const buf = await page.screenshot({ clip: { x: 0, y: 0, width: 1500, height: 500 } });
    await page.close();
    return buf;
  }

  // ── profile picture ──────────────────────────────────────────────────────
  // Rendered at 2048 and downscaled, so the rounded corners and the gradient stay clean at
  // every size X serves it back at (400, 200, 48, 24).
  const iconRaw = await renderSvg(siteIconSvg(2048), 2048, 2048);
  for (const size of [1024, 400]) {
    await sharp(iconRaw).resize(size, size)
      .png({ compressionLevel: 9, effort: 9 })
      .toFile(path.join(OUT, `toytools-x-profile-${size}.png`));
  }
  writeFileSync(path.join(OUT, 'toytools-x-profile.svg'), siteIconSvg(1024));

  // ── header banner ────────────────────────────────────────────────────────
  await sharp(await renderBanner(2)).png({ compressionLevel: 9, effort: 9 })
    .toFile(path.join(OUT, 'toytools-x-banner-3000x1000.png'));
  await sharp(await renderBanner(1)).png({ compressionLevel: 9, effort: 9 })
    .toFile(path.join(OUT, 'toytools-x-banner-1500x500.png'));

  await browser.close();
  console.log('[social-assets] wrote brand/social/x/ — profile 1024 + 400 + svg, banner 3000x1000 + 1500x500');
}

main();
