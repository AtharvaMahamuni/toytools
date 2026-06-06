// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const base = process.env.ASTRO_BASE_PATH;

/** @type {import('astro/config').AstroIntegration} */
const seoValidator = {
  name: 'seo-validator',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const { existsSync } = await import('node:fs');
      const d = new URL(dir).pathname;
      const missing = ['robots.txt', 'sitemap-index.xml'].filter(f => !existsSync(d + f));
      if (missing.length) throw new Error(`SEO build validation failed — missing: ${missing.join(', ')}`);
    },
  },
};

export default defineConfig({
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        const { pathname } = new URL(item.url);
        if (pathname === '/' || pathname === '')
          return { ...item, changefreq: 'daily', priority: 1.0, lastmod: new Date() };
        if (pathname.startsWith('/categories/'))
          return { ...item, changefreq: 'weekly', priority: 0.8, lastmod: new Date() };
        if (pathname.startsWith('/tools/'))
          return { ...item, changefreq: 'monthly', priority: 0.9 };
        if (pathname.startsWith('/guide/'))
          return { ...item, changefreq: 'monthly', priority: 0.7 };
        if (pathname.startsWith('/faq/'))
          return { ...item, changefreq: 'monthly', priority: 0.6 };
        return { ...item, changefreq: 'monthly', priority: 0.5 };
      },
    }),
    seoValidator,
  ],
  site: process.env.ASTRO_SITE ?? 'https://toytoolsapp.com',
  base,
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  build: {
    assets: '_assets',
    inlineStylesheets: 'auto',
  },
});
