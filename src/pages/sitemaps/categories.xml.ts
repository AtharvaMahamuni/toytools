import type { APIRoute } from 'astro';
import { contentByType } from '@lib/content/manifest';
import { renderUrlset } from '@lib/sitemap/render';

const SITE_FALLBACK = 'https://toytoolsapp.com';

// Categories bucket also carries the homepage.
export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL(SITE_FALLBACK)).href;
  const entries = [...contentByType('home'), ...contentByType('category')];
  return new Response(renderUrlset(entries, base), {
    headers: { 'Content-Type': 'application/xml' },
  });
};
