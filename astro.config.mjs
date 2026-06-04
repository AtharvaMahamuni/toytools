// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const base = process.env.ASTRO_BASE_PATH;

export default defineConfig({
  integrations: [sitemap()],
  site: process.env.ASTRO_SITE ?? 'https://toytools.app',
  base,
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  build: {
    assets: '_assets',
    inlineStylesheets: 'auto',
  },
});
