import type { APIRoute } from 'astro';
import { AI_CRAWLERS } from '@lib/identity/facts';

export const GET: APIRoute = ({ url }) => {
  const base = url.pathname.replace('robots.txt', '');
  const sitemap = new URL(`${base}sitemap-index.xml`, url.origin).href;
  // `User-agent: *` already allows these crawlers. The named groups state that policy
  // in the file itself. Public pages only. There is no private directory in the build.
  const body = [
    '# Public ToyTools pages are available to search and AI crawlers.',
    'User-agent: *',
    'Allow: /',
    '',
    ...AI_CRAWLERS.flatMap(bot => [`User-agent: ${bot}`, 'Allow: /', '']),
    `Sitemap: ${sitemap}`,
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
