import type { APIRoute } from 'astro';
import { sitemapRedirects, sitemapStubHtml } from '@data/sitemap-redirects';

const entry = sitemapRedirects.find(redirect => redirect.oldPath === '/sitemap-0.xml');
if (!entry) throw new Error('sitemap stub missing entry for /sitemap-0.xml');

export const GET: APIRoute = ({ site }) => {
  return new Response(sitemapStubHtml(entry, site), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
