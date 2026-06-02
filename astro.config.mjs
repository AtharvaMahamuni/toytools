// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://toytools.app',
  output: 'static',
  trailingSlash: 'never',
  compressHTML: true,
  build: {
    assets: '_assets',
    inlineStylesheets: 'auto',
  },
});
