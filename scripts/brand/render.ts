// The shared rendering path for every off-site image this repo produces: the account assets
// (scripts/generate-social-assets.ts) and the X post cards (scripts/generate-x-cards.ts).
//
// The palette lives here rather than in each generator because the alternative was already
// happening: generate-social-assets.ts carried its own copy of seven token values, and a second
// generator would have made a third. The mark's own ink-green field colours are still NOT here --
// src/lib/icons/site-icon.ts owns those, and this file must not become a second place to look.
//
// Values copied from src/styles/tokens.css. Nothing validates the copy, which is the same silent
// drift brand/README.md warns about; re-read tokens.css after any palette change.

import { chromium, type Browser } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

export const PAPER = '#FAF9F7';          // --color-bg
export const SURFACE = '#F2F0EC';        // --color-surface
export const INK = '#1F1D1A';            // --color-text
export const INK_MUTED = '#6E6961';      // --color-text-muted
export const INK_SUBTLE = '#736E66';     // --color-text-subtle
export const ACCENT = '#2F6B4F';         // --color-accent
export const GOLD_UI = '#906620';        // --color-gold
export const GOLD_HIGHLIGHT = '#E6C15A'; // --color-gold-highlight

const fontData = (file: string): string =>
  readFileSync(path.resolve(process.cwd(), file)).toString('base64');

/**
 * Geist and Geist Mono, inlined as base64 @font-face rules.
 *
 * Inlined rather than linked because the page is rendered from a string with no server behind it,
 * so a relative font URL has nothing to resolve against and the render silently falls back to a
 * system face -- which looks close enough in a thumbnail to ship by accident.
 */
export function fontCss(): string {
  const geist = fontData('node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2');
  const mono = fontData('node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2');
  return (
    `@font-face{font-family:'Geist';src:url(data:font/woff2;base64,${geist}) format('woff2');font-weight:100 900;}` +
    `@font-face{font-family:'Geist Mono';src:url(data:font/woff2;base64,${mono}) format('woff2');font-weight:100 900;}`
  );
}

/**
 * The image the environment's Chromium lives at, when it is not where Playwright expects.
 * The container ships a browser build that the pinned @playwright/test does not match, so both
 * generators accept an override rather than failing on a version number.
 */
export function launch(): Promise<Browser> {
  const exe = process.env.PW_CHROMIUM_PATH;
  return chromium.launch(exe ? { executablePath: exe } : {});
}

/** The gold dot, the site's brand motif, at any scale. Rule copied from global.css. */
export const goldDotCss = (size: number): string => `
  .gold-dot {
    width: ${size}px; height: ${size}px; border-radius: 50%;
    background: radial-gradient(circle, ${GOLD_HIGHLIGHT} 0%, ${GOLD_UI} 100%);
    flex-shrink: 0;
  }`;

/**
 * Rasterize an HTML body at a fixed box.
 *
 * deviceScaleFactor rather than a bigger CSS box, for the reason the banner generator found the
 * hard way: re-laying out at 2x re-wraps every line, so the two sizes get different line breaks
 * and stop being the same image. Scaling the device keeps the layout and multiplies the pixels.
 */
export async function renderHtml(
  browser: Browser,
  html: string,
  css: string,
  width: number,
  height: number,
  scale = 1,
): Promise<Buffer> {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8"><style>${fontCss()}` +
      `html,body{margin:0;padding:0}${css}</style></head><body>${html}</body></html>`,
    { waitUntil: 'load' },
  );
  await page.evaluate(() => (document as any).fonts.ready);
  const buf = await page.screenshot({ clip: { x: 0, y: 0, width, height } });
  await page.close();
  return buf;
}
