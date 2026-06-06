import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ url }) => {
  const base = url.pathname.replace('robots.txt', '');
  const sitemap = new URL(`${base}sitemap-index.xml`, url.origin).href;
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
