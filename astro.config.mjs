// @ts-check
import { defineConfig } from 'astro/config';

const base = process.env.ASTRO_BASE_PATH;

export default defineConfig({
  site: process.env.ASTRO_SITE ?? 'https://toytools.app',
  base,
  output: 'static',
  trailingSlash: base ? 'always' : 'never',
  compressHTML: true,
  build: {
    assets: '_assets',
    inlineStylesheets: 'auto',
  },
});
