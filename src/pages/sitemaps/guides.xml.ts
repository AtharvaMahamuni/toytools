import type { APIRoute } from 'astro';
import { contentByType } from '@lib/content/manifest';
import { renderUrlset } from '@lib/sitemap/render';
import { siteUrl } from '@config/site';

export const GET: APIRoute = ({ site }) => {
  const base = siteUrl(site).href;
  return new Response(renderUrlset(contentByType('guide'), base), {
    headers: { 'Content-Type': 'application/xml' },
  });
};
