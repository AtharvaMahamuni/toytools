// Rasterizes each tool's install icon to committed PNGs.
//
// Why committed (not build-time): the CI build job has no browser, and an SVG
// rasterizer without fonts can't render our typographic glyphs (case
// converters, %, ¶). Chromium (already a Playwright dev-dependency) renders
// everything faithfully, so we generate here and commit the PNGs as static
// assets under public/icons/tool/. The build then just serves them — no new
// dependency and no rasterization on the CI/deploy path.
//
// The source of truth stays the SVG (src/lib/icons/tool-icon.ts). Re-run with
// `npm run icons:generate` after changing a glyph/colour or adding a tool;
// validate-architecture fails the build if a tool is missing its PNGs.

import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { tools } from '../src/data/registry';
import { toolIconSvg } from '../src/lib/icons/tool-icon';
import { ICON_PNG_SIZES } from '../src/lib/icons/sizes';

const OUT = path.resolve(process.cwd(), 'public/icons/tool');
// Render once at the largest size (Chromium renders the text glyphs faithfully),
// then downscale + quantize each target size with sharp so the committed files
// stay small.
const RENDER = Math.max(...ICON_PNG_SIZES);

async function main() {
  mkdirSync(OUT, { recursive: true });

  const exe = process.env.PW_CHROMIUM_PATH;
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const page = await browser.newPage({ viewport: { width: RENDER, height: RENDER } });

  let count = 0;
  for (const tool of tools) {
    const svg = toolIconSvg(tool, RENDER);
    await page.setContent(
      `<!doctype html><html><head><meta charset="utf-8"></head>` +
        `<body style="margin:0;padding:0">` +
        `<div style="width:${RENDER}px;height:${RENDER}px;line-height:0">${svg}</div>` +
        `</body></html>`,
      { waitUntil: 'load' },
    );
    const raw = await page.screenshot({ clip: { x: 0, y: 0, width: RENDER, height: RENDER } });
    for (const size of ICON_PNG_SIZES) {
      await sharp(raw)
        .resize(size, size)
        .png({ palette: true, quality: 92, compressionLevel: 9, effort: 9 })
        .toFile(path.join(OUT, `${tool.slug}-${size}.png`));
      count++;
    }
  }

  await browser.close();
  console.log(`[icons] generated ${count} optimized PNG(s) for ${tools.length} tools → public/icons/tool/`);
}

main().catch(err => {
  console.error('[icons] generation failed:', err);
  process.exit(1);
});
