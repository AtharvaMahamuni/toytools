// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

const base = process.env.ASTRO_BASE_PATH;

/** @type {import('astro/config').AstroIntegration} */
const routeManifest = {
  name: 'route-manifest',
  hooks: {
    'astro:build:done': async ({ dir, pages }) => {
      const { writeFileSync } = await import('node:fs');
      const routes = pages.map(p => {
        // 404 page is generated as 404.html, not 404/index.html
        if (p.pathname === '404' || p.pathname === '404/') return '/404.html';
        return `/${p.pathname}`.replace(/\/{2,}/g, '/');
      });
      const manifest = { generated: new Date().toISOString(), routes };
      writeFileSync(new URL('route-manifest.json', dir), JSON.stringify(manifest, null, 2));
    },
  },
};

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
    routeManifest,
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
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
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
