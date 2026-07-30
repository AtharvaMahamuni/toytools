import type { APIRoute } from 'astro';
import { contentByType } from '@lib/content/manifest';
import { renderUrlset } from '@lib/sitemap/render';

// Standalone indexable pages (currently /feedback/). Same manifest-derived shape as the
// tool/guide/category buckets, so adding a page to STANDALONE_PAGES is the only edit needed.
const SITE_FALLBACK = 'https://toytoolsapp.com';

export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL(SITE_FALLBACK)).href;
  return new Response(renderUrlset(contentByType('page'), base), {
    headers: { 'Content-Type': 'application/xml' },
  });
};
