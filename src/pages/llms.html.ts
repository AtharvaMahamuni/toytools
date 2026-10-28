import type { APIRoute } from 'astro';
import { renderLlmsHtml } from '@lib/identity/render';
import { siteUrl } from '@config/site';

export const GET: APIRoute = ({ site }) => {
  return new Response(renderLlmsHtml(siteUrl(site).href), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
