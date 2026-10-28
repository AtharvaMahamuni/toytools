import type { APIRoute } from 'astro';
import { renderLlmTxt } from '@lib/identity/render';
import { siteUrl } from '@config/site';

export const GET: APIRoute = ({ site }) => {
  return new Response(renderLlmTxt(siteUrl(site).href), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
