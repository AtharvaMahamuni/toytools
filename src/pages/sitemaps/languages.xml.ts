import type { APIRoute } from 'astro';
import { sitemapRedirects, sitemapStubHtml } from '@data/sitemap-redirects';

const entry = sitemapRedirects.find(redirect => redirect.oldPath === '/sitemaps/languages.xml');
if (!entry) throw new Error('sitemap stub missing entry for /sitemaps/languages.xml');

export const GET: APIRoute = ({ site }) => {
  return new Response(sitemapStubHtml(entry, site), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
