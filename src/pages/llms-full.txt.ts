import type { APIRoute } from 'astro';
import { renderLlmsFull } from '@lib/llms/render';
import { siteUrl } from '@config/site';

export const GET: APIRoute = ({ site }) => {
  const base = siteUrl(site).href;
  return new Response(renderLlmsFull(base), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
