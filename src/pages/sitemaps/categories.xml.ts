import type { APIRoute } from 'astro';
import { contentByType } from '@lib/content/manifest';
import { renderUrlset } from '@lib/sitemap/render';
import { siteUrl } from '@config/site';

// Categories bucket also carries the homepage.
export const GET: APIRoute = ({ site }) => {
  const base = siteUrl(site).href;
  const entries = [...contentByType('home'), ...contentByType('category')];
  return new Response(renderUrlset(entries, base), {
    headers: { 'Content-Type': 'application/xml' },
  });
};
