import type { APIRoute } from 'astro';
import { llmsTxtForSite } from '@lib/llms/render';
import { siteUrl } from '@config/site';

export const GET: APIRoute = ({ site }) => {
  return new Response(llmsTxtForSite(siteUrl(site).href), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
