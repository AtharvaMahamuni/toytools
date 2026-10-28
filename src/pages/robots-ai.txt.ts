import type { APIRoute } from 'astro';
import { renderRobotsAiTxt } from '@lib/identity/render';
import { siteUrl } from '@config/site';

export const GET: APIRoute = ({ site }) => {
  return new Response(renderRobotsAiTxt(siteUrl(site).href), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
