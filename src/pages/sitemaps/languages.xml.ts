import type { APIRoute } from 'astro';
import { contentByType } from '@lib/content/manifest';
import { renderUrlset } from '@lib/sitemap/render';

const SITE_FALLBACK = 'https://toytoolsapp.com';

export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL(SITE_FALLBACK)).href;
  return new Response(renderUrlset(contentByType('language'), base), {
    headers: { 'Content-Type': 'application/xml' },
  });
};
